/* Dev-only DOM integration tests. Runtime app remains dependency-free.
   NODE_PATH=/path/to/qa/node_modules node --test tests/test_lesson.cjs */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname,'..');
function editor(t,book){
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'http://localhost:4173/',runScripts:'outside-only',pretendToBeVisual:true});
  const win=dom.window;
  win.ResizeObserver=class{observe(){}};
  win.HTMLElement.prototype.scrollIntoView=function(){};
  win.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  win.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new win.Event('close'));};
  win.fetch=async()=>({ok:true,json:async()=>({})});
  if(!win.CSSStyleDeclaration.prototype[Symbol.iterator])win.CSSStyleDeclaration.prototype[Symbol.iterator]=function*(){for(let i=0;i<this.length;i++)yield this[i];};
  if(book)win.localStorage.setItem('web-workshop-projects-v1',JSON.stringify(book));
  const errors=[];win.addEventListener('error',event=>errors.push(event.error));
  const run=source=>vm.runInContext(source,dom.getInternalVMContext());
  run(fs.readFileSync(path.join(root,'lesson.js'),'utf8'));
  run(fs.readFileSync(path.join(root,'app.js'),'utf8'));
  t.after(()=>{assert.deepEqual(errors,[],'no UI event errors');win.close();});
  return {win,run,doc:win.document,click:selector=>{const element=win.document.querySelector(selector);assert.ok(element,selector);element.click();},percent:()=>win.document.querySelector('#task-percent').textContent};
}
function finishFirst(ui){
  ui.run(`state.lessonActions.push('page-selected');mutateHTML(doc=>{doc.querySelector('h1').textContent='Привет, я Миша.';doc.querySelector('header p').textContent='Люблю музыку.';});selectPath('0');applyStyles({background:'#e5ecf8'});`);
}
function buildHero(ui){
  ui.run(`mutateHTML(doc=>{const hero=doc.querySelector('header.hero'),item=doc.createElement('div');item.className='hero_item';item.append(...hero.children);const figure=doc.createElement('figure');figure.className='hero_img';hero.append(item,figure);return figure;});imageTargetPath=state.selectedPath;installImage('data:image/jpeg;base64,/9j/2Q==','Моя картинка с телефона','phone-test');`);
}
function finishSecond(ui){
  buildHero(ui);
  ui.run(`applyProperty('property-alt','Моё увлечение — музыка');applyStyles({'border-radius':'8px'});`);
}
function buildCards(ui){
  ui.run(`mutateHTML(doc=>{const article=doc.createElement('article');article.className='interesting';for(let i=0;i<4;i++){const card=doc.createElement('div');card.className='interesting_card';const title=doc.createElement('p');title.className='interesting_title';title.textContent='Интерес '+(i+1);const description=doc.createElement('p');description.className='interesting_description';description.textContent='Описание моего увлечения '+(i+1);const img=doc.createElement('img');img.src='assets/music.jpg';img.alt='Моё увлечение';card.append(title,description,img);article.append(card);}doc.querySelector('#interests').append(article);});`);
}
function finishThird(ui){
  ui.run(`selectPath('0.0');applyStyles({display:'flex','flex-direction':'row',gap:'24px'});selectPath('0.0.1.0');applyStyles({width:'220px'});`);
  buildCards(ui);
  ui.run(`for(const [name,text]of Object.entries({interesting_card:'background:#f0f3f7;padding:16px;width:240px',interesting_title:'font-size:20px;color:#334455',interesting_description:'font-size:14px;color:#667788'})){const rule=document.createElement('div').style;rule.cssText=text;putClassStyle(name,rule);}updateMissions();`);
}

test('fresh lesson opens theory; later tasks locked; every block is in the pool',t=>{
  const ui=editor(t);
  assert.equal(ui.doc.querySelector('#theory-dialog').open,true);
  assert.equal(ui.percent(),'0%');
  assert.equal(ui.doc.querySelector('[data-mission="1"]').disabled,true);
  assert.equal(ui.doc.querySelectorAll('.extra-blocks').length,0);
  assert.equal(ui.doc.querySelectorAll('#library-items > button').length,8);
  ui.click('#theory-start');
  assert.equal(ui.doc.querySelector('#theory-dialog').open,false);
  assert.equal(ui.percent(),'0%','automatic focus does not count as main click');
  ui.click('.block-row[data-path="0"]');
  assert.equal(ui.percent(),'25%');
  ui.run(`applyStyles({background:'#eef4fa'});`);
  assert.equal(ui.percent(),'50%');
  assert.match(ui.doc.querySelector('#next-step').textContent,/h1/);
});

test('100% congratulates; transition requires click and shows next theory',t=>{
  const ui=editor(t);ui.click('#theory-start');finishFirst(ui);
  assert.equal(ui.percent(),'100%');
  assert.equal(ui.doc.querySelector('#task-success').hidden,false);
  assert.match(ui.doc.querySelector('#toast').textContent,/Поздравляем/);
  assert.match(ui.doc.querySelector('#check-button').textContent,/Следующая задача/);
  assert.equal(ui.run('state.mission'),0,'no forced jump');
  ui.click('#check-button');
  assert.equal(ui.run('state.mission'),1);
  assert.equal(ui.doc.querySelector('#theory-dialog').open,true);
  assert.match(ui.doc.querySelector('#theory-content').textContent,/БЭМ/);
  assert.match(ui.doc.querySelector('#theory-content').textContent,/скринридер/);
});

test('second task validates siblings, QR origin, alt and photo settings',t=>{
  const ui=editor(t);ui.click('#theory-start');finishFirst(ui);ui.click('#check-button');ui.click('#theory-start');
  buildHero(ui);
  assert.equal(ui.percent(),'67%');
  ui.run(`applyProperty('property-alt','Моя гитара');`);
  assert.equal(ui.percent(),'83%');
  ui.run(`applyStyles({'border-radius':'8px'});`);
  assert.equal(ui.percent(),'100%');
  ui.run(`mutateHTML(doc=>doc.querySelector('.hero_img img').setAttribute('src','assets/music.jpg'));`);
  assert.notEqual(ui.percent(),'100%','library photo cannot masquerade as QR');
  ui.run(`mutateHTML(doc=>doc.querySelector('.hero_item').append(doc.querySelector('.hero_img')));`);
  const checks=ui.run('lessonChecks()[1]');
  assert.equal(checks.find(item=>item.id==='hero-img').done,false,'photo block must be a sibling');
});

test('direct img.hero_img completes the lesson without figure and step links select the image',t=>{
  const ui=editor(t);ui.click('#theory-start');finishFirst(ui);finishSecond(ui);
  ui.run(`mutateHTML(doc=>{const wrapper=doc.querySelector('figure.hero_img'),image=wrapper.querySelector('img');image.classList.add('hero_img');wrapper.replaceWith(image);return image;});state.mission=1;updateMissions();`);
  assert.equal(ui.percent(),'100%');
  assert.equal(ui.run(`parseHTML().querySelectorAll('figure').length`),0);
  ui.run(`applyProperty('property-alt','');missionAction();`);
  assert.equal(ui.run(`resolvePath(parseHTML(),state.selectedPath).tagName`),'IMG');
  ui.run(`applyProperty('property-alt','Моя гитара');openClassDialog();`);
  assert.equal(ui.doc.querySelector('#class-name').value,'hero_img');
  ui.doc.querySelector('#class-dialog').close();
  ui.run(`applyStyles({width:'220px'});state.mission=2;selectPath('0.0');applyStyles({display:'flex','flex-direction':'row'});`);
  buildCards(ui);
  ui.run(`for(const name of ['interesting_card','interesting_title','interesting_description']){const rule=document.createElement('div').style;rule.cssText='padding:4px';putClassStyle(name,rule);}updateMissions();`);
  assert.equal(ui.percent(),'100%');
});

test('QR errors distinguish missing nginx route, backend refusal and network failure; retry clears the error',async t=>{
  const ui=editor(t);ui.click('#theory-start');ui.run('openGallery()');
  for(const status of [404,405,501]){
    ui.win.fetch=async()=>({ok:false,status,json:async()=>{throw new SyntaxError('HTML error page');}});
    await ui.run('startPhoneUpload()');
    assert.match(ui.doc.querySelector('#image-upload-status').textContent,/Сервис передачи фото не подключён/);
    assert.ok(ui.doc.querySelector('#image-upload-status').textContent.includes(String(status)));
    assert.equal(ui.doc.querySelector('#phone-upload-button').disabled,false);
  }
  ui.win.fetch=async()=>({ok:false,status:429,json:async()=>({error:'Слишком много QR-кодов. Подожди немного.'})});
  await ui.run('startPhoneUpload()');
  assert.match(ui.doc.querySelector('#image-upload-status').textContent,/Слишком много/);
  ui.win.fetch=async()=>({ok:true,status:200,json:async()=>{throw new SyntaxError('SPA fallback');}});
  await ui.run('startPhoneUpload()');
  assert.match(ui.doc.querySelector('#image-upload-status').textContent,/обычная страница/);
  ui.win.fetch=async()=>{throw new ui.win.TypeError('Failed to fetch');};
  await ui.run('startPhoneUpload()');
  assert.match(ui.doc.querySelector('#image-upload-status').textContent,/Проверь подключение/);
  const transport=qrTransport();connectQR(ui,transport);
  await ui.run('startPhoneUpload()');
  assert.equal(ui.doc.querySelector('#image-upload-status').textContent,'');
  assert.equal(ui.doc.querySelector('#phone-qr').hidden,false);
  ui.run('stopPhoneUpload()');
});

test('pictures go into each selected card, replacement does not add duplicates',t=>{
  const ui=editor(t);ui.click('#theory-start');buildCards(ui);
  ui.run(`selectPath('0.1.1.0');imageTargetPath=state.selectedPath;installImage('assets/sport.jpg','Спорт','sport');`);
  assert.equal(ui.run(`parseHTML().querySelector('article > div img').getAttribute('src')`),'assets/sport.jpg');
  assert.equal(ui.run(`parseHTML().querySelectorAll('article > div:first-child img').length`),1);
  ui.run(`selectPath('0.1.1.1');imageTargetPath=state.selectedPath;installImage('assets/ocean.jpg','Океан','ocean');`);
  assert.equal(ui.run(`parseHTML().querySelector('article > div:nth-child(2) img').getAttribute('src')`),'assets/ocean.jpg');
});

test('four cards and both shared text classes required; deleting or divergent styles lowers progress',t=>{
  const ui=editor(t);ui.click('#theory-start');finishFirst(ui);finishSecond(ui);ui.run('state.mission=2;updateMissions();');
  finishThird(ui);
  assert.equal(ui.percent(),'100%');
  ui.run(`mutateHTML(doc=>doc.querySelector('article > div:last-child').remove());`);
  assert.notEqual(ui.percent(),'100%');
  ui.run(`mutateHTML(doc=>{const cards=doc.querySelector('article');cards.append(cards.firstElementChild.cloneNode(true));});`);
  assert.equal(ui.percent(),'100%');
  ui.run(`mutateHTML(doc=>doc.querySelector('article > div:last-child p').classList.remove('interesting_title'));`);
  assert.notEqual(ui.percent(),'100%');
  ui.run(`mutateHTML(doc=>{const p=doc.querySelector('article > div:last-child p');p.classList.add('interesting_title');p.classList.add('different');});const rule=document.createElement('div').style;rule.cssText='font-size:30px';putClassStyle('different',rule);updateMissions();`);
  assert.notEqual(ui.percent(),'100%','different effective typography rejected');
});

test('background belongs to page and named classes must have actual CSS rules',t=>{
  const ui=editor(t);ui.click('#theory-start');
  ui.run(`selectPath('0.0');applyStyles({background:'#eeeeee'});`);
  assert.equal(ui.run(`lessonChecks()[0].find(item=>item.id==='page-background').done`),false);
  finishFirst(ui);finishSecond(ui);ui.run('state.mission=2;updateMissions();');
  ui.run(`selectPath('0.0');applyStyles({display:'flex','flex-direction':'row'});selectPath('0.0.1.0');applyStyles({width:'220px'});`);
  buildCards(ui);
  assert.notEqual(ui.percent(),'100%','class names alone are not styles');
});

test('progress and theory acknowledgement survive save/load; legacy projects preserved',t=>{
  const ui=editor(t);ui.click('#theory-start');finishFirst(ui);finishSecond(ui);ui.run('state.mission=1;persistState();');
  const book=JSON.parse(ui.win.localStorage.getItem('web-workshop-projects-v1'));
  const restored=editor(t,book);
  assert.equal(restored.percent(),'100%');
  assert.equal(restored.doc.querySelector('#theory-dialog').open,true,'unstarted task still gets theory');
  restored.click('#theory-start');restored.run('persistState();');
  const again=editor(t,JSON.parse(restored.win.localStorage.getItem('web-workshop-projects-v1')));
  assert.equal(again.doc.querySelector('#theory-dialog').open,false,'resume active task without repeating theory');
  book.lessonVersion=2;
  const migrated=editor(t,book);
  assert.equal(migrated.run('Object.keys(library.projects).length'),2);
  assert.equal(migrated.percent(),'0%');
  assert.equal(migrated.doc.querySelector('#theory-dialog').open,true);
});

test('editing an assigned class does not create partial class names; final task cannot hide broken earlier work',t=>{
  const ui=editor(t);ui.click('#theory-start');finishFirst(ui);finishSecond(ui);
  ui.run(`state.mission=2;updateMissions();`);finishThird(ui);
  assert.equal(ui.percent(),'100%');
  ui.run(`mutateHTML(doc=>{doc.querySelector('header p').textContent='';});`);
  assert.equal(ui.doc.querySelector('#progress-count').textContent,'2 / 3');
  assert.match(ui.doc.querySelector('#next-step').textContent,/задаче 1/);
  assert.equal(ui.doc.querySelector('#check-button').textContent,'К задаче 1');
  ui.click('#check-button');
  assert.equal(ui.run('state.mission'),0);
  assert.equal(ui.doc.querySelector('#theory-dialog').open,true);
  ui.click('#theory-start');
  ui.run(`selectPath('0.0.0');`);
  const input=ui.doc.querySelector('#property-class');
  input.value='hero_item new_item';
  input.dispatchEvent(new ui.win.Event('input',{bubbles:true}));
  assert.equal(ui.run(`parseHTML().querySelector('.hero_item').classList.contains('new_item')`),false);
  input.dispatchEvent(new ui.win.Event('change',{bubbles:true}));
  assert.equal(ui.run(`parseHTML().querySelector('.hero_item').classList.contains('new_item')`),true);
  assert.ok(ui.doc.querySelector('[data-edit-class="new_item"]'));
});

// Transport-only test double: HTTP isolation itself is tested against the real
// Python server. Here we control delayed responses to exercise editor races.
function qrTransport(){
  let sequence=0;
  const sessions=new Map();
  const pendingCreates=[];
  let holdCreation=false;
  let delayedRead=null;
  const response=data=>({ok:true,json:async()=>data});
  return {
    sessions,pendingCreates,
    holdCreates(){holdCreation=true;},
    delayNextRead(){
      let resolve;
      const promise=new Promise(ready=>resolve=ready);
      delayedRead={promise,resolve};
      return resolve;
    },
    upload(url,image){const entry=[...sessions.values()].find(item=>item.upload_url===url);assert.ok(entry,'QR is active');entry.image=image;},
    async fetch(url,options={}){
      if(url==='/api/photo-sessions'&&options.method==='POST'){
        const id=++sequence;
        const session={upload_url:`http://localhost:4173/upload.html#token=upload-${id}`,poll_url:`/api/photo-sessions/${id}?key=read-${id}`,qr_url:`/api/photo-sessions/${id}/qr?key=read-${id}`,expires_in:600,image:null};
        sessions.set(session.poll_url,session);
        if(holdCreation)return new Promise(resolve=>pendingCreates.push(()=>resolve(response(session))));
        return response(session);
      }
      if(options.method==='DELETE'){sessions.delete(url);return response({ok:true});}
      const entry=sessions.get(url);
      assert.ok(entry,'reader can only use an active matching session');
      const snapshot={image:entry.image};
      if(delayedRead){const delayed=delayedRead;delayedRead=null;await delayed.promise;}
      return response(snapshot);
    }
  };
}
function connectQR(ui,transport){
  const polls=[];
  const native=ui.win.setTimeout.bind(ui.win);
  ui.win.setTimeout=(callback,delay,...args)=>delay===1200?(polls.push(callback),-polls.length):native(callback,delay,...args);
  ui.win.fetch=transport.fetch.bind(transport);
  return async()=>{const callback=polls.shift();assert.ok(callback,'scheduled QR poll exists');await callback();};
}
async function openQR(ui){
  ui.run(`selectPath('0.0');openGallery();`);
  await ui.run('startPhoneUpload()');
  return ui.doc.querySelector('#phone-upload-link').href;
}

test('two independent editors receive only the photo from their own QR',async t=>{
  const transport=qrTransport(),first=editor(t),second=editor(t);
  first.click('#theory-start');second.click('#theory-start');
  const pollFirst=connectQR(first,transport),pollSecond=connectQR(second,transport);
  const firstQR=await openQR(first),secondQR=await openQR(second);
  assert.notEqual(firstQR,secondQR);
  const photoA='data:image/jpeg;base64,/9j/AAA=/9k=',photoB='data:image/jpeg;base64,/9j/BBB=/9k=';
  transport.upload(secondQR,photoB);
  await pollFirst();
  assert.equal(first.run(`parseHTML().querySelectorAll('img').length`),0,'other pupil upload does not trigger this editor');
  await pollSecond();
  assert.equal(second.run(`parseHTML().querySelector('header img').getAttribute('src')`),photoB);
  transport.upload(firstQR,photoA);
  await pollFirst();
  assert.equal(first.run(`parseHTML().querySelector('header img').getAttribute('src')`),photoA);
  assert.equal(transport.sessions.size,0,'both successful receives revoke their own sessions');
});

test('switching projects discards an in-flight photo response',async t=>{
  const transport=qrTransport(),ui=editor(t);ui.click('#theory-start');
  const poll=connectQR(ui,transport),qr=await openQR(ui),oldId=ui.run('library.activeId');
  transport.upload(qr,'data:image/jpeg;base64,/9j/OLD=/9k=');
  const release=transport.delayNextRead(),pending=poll();
  ui.run('createProject()');
  assert.notEqual(ui.run('library.activeId'),oldId);
  release();await pending;
  assert.equal(ui.run(`parseHTML().querySelectorAll('img').length`),0,'late photo never lands in the new project');
  assert.equal(ui.run(`new DOMParser().parseFromString(library.projects[${JSON.stringify(oldId)}].state.files['index.html'],'text/html').querySelectorAll('img').length`),0,'late photo never edits a closed project either');
  assert.equal(transport.sessions.size,0);
});

test('closing QR discards an in-flight image and a delayed create cannot replace a newer QR',async t=>{
  const transport=qrTransport(),ui=editor(t);ui.click('#theory-start');
  const poll=connectQR(ui,transport),qr=await openQR(ui);
  transport.upload(qr,'data:image/jpeg;base64,/9j/CLOSED=/9k=');
  const release=transport.delayNextRead(),pending=poll();
  ui.run(`$('#gallery-dialog').close()`);
  release();await pending;
  assert.equal(ui.run(`parseHTML().querySelectorAll('img').length`),0);
  assert.equal(transport.sessions.size,0);
  ui.run('openGallery()');transport.holdCreates();
  const oldCreate=ui.run('startPhoneUpload()'),newCreate=ui.run('startPhoneUpload()');
  transport.pendingCreates[1]();await newCreate;
  const current=ui.doc.querySelector('#phone-upload-link').href;
  transport.pendingCreates[0]();await oldCreate;
  assert.equal(ui.doc.querySelector('#phone-upload-link').href,current,'delayed old creation cannot replace the new QR');
  assert.equal(transport.sessions.size,1,'abandoned create is revoked');
  ui.run('stopPhoneUpload()');assert.equal(transport.sessions.size,0);
});
