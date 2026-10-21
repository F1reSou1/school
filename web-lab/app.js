"use strict";
const $ = (selector) => document.querySelector(selector);
const BOOK_KEY = 'web-workshop-projects-v1';
const FILE_ORDER = ['index.html', 'style.css', 'script.js'];
const IMAGES = [
  {id:'mountains', title:'Горы', category:'Природа', file:'assets/mountains.jpg', alt:'Горные вершины в мягком вечернем свете'},
  {id:'ocean', title:'Океан', category:'Природа', file:'assets/ocean.jpg', alt:'Волны океана'},
  {id:'space', title:'Космос', category:'Космос', file:'assets/space.jpg', alt:'Звёзды и туманность в космосе'},
  {id:'earth', title:'Планета', category:'Космос', file:'assets/earth.jpg', alt:'Изображение Земли на тёмном фоне'},
  {id:'music', title:'Музыка', category:'Увлечения', file:'assets/music.jpg', alt:'Наушники на ярком фоне'},
  {id:'sport', title:'Спорт', category:'Увлечения', file:'assets/sport.jpg', alt:'Баскетбольный мяч у кольца'}
];
const THEMES = {
  fresh: {background:'#f8faf4',ink:'#263c30',muted:'#849379',accent:'#dbeab8',card:'#ecf2de'},
  cosmic: {background:'#f6f3fd',ink:'#352747',muted:'#9987ad',accent:'#cbbbe9',card:'#eae2f7'},
  warm: {background:'#fff8f0',ink:'#533b2c',muted:'#b19b88',accent:'#f7c9ae',card:'#fae7d6'}
};
const INITIAL_HTML = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Моя страница</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <main class="page">
      <header class="hero">
        <h1>Привет, я …</h1>
        <p class="intro">Напиши пару слов о себе или о придуманном герое.</p>
      </header>
      <div id="about" class="about"></div>
      <figure class="photo-zone"></figure>
      <footer class="site-footer">Моя первая страница · HTML + CSS</footer>
    </main>
  </body>
</html>`;
const INITIAL_CSS = `/* HTML отвечает за содержимое, CSS — за оформление. */
body {
  --page-bg: #f8faf4;
  --ink: #263c30;
  --muted: #65765c;
  --accent: #dbeab8;
  --card-bg: #ecf2de;
  margin: 0;
  background: var(--page-bg);
  color: var(--ink);
  font-family: Arial, sans-serif;
  line-height: 1.65;
}

* { box-sizing: border-box; }
.page { max-width: 760px; margin: 0 auto; padding: 40px 32px; }
.hero { margin-bottom: 28px; }
h1 { font-size: 46px; line-height: 1.15; letter-spacing: -1.5px; margin: 0 0 16px; }
h2 { font-size: 24px; margin: 0 0 12px; }
p { font-size: 16px; margin: 0 0 16px; }
.intro { color: var(--muted); }
.about { margin-bottom: 24px; }

/* Картинка будет ребёнком этого контейнера.
   Включи Flexbox и попробуй justify-content и align-items. */
.photo-zone {
  min-height: 320px;
  margin: 0 0 24px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 20px;
}
.photo-zone:empty::before { content: "Здесь будет твоя картинка"; color: var(--muted); font-size: 14px; }
.photo { display: block; width: 180px; max-width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 16px; }
.site-footer { border-top: 1px solid var(--accent); padding-top: 16px; color: var(--muted); font-size: 12px; }
a { color: var(--ink); }
ul { padding-left: 20px; }
.card { padding: 20px; background: var(--card-bg); border-radius: 16px; }
.action { background: var(--ink); color: var(--page-bg); padding: 12px 18px; border: 0; border-radius: 12px; cursor: pointer; }
body.night { --page-bg: #24382d; --ink: #e6f2d9; --muted: #b7cba9; --accent: #50683b; --card-bg: #344b3a; }
@media (max-width: 420px) {
  .page { padding: 28px 20px; }
  h1 { font-size: 34px; }
}`;
const INITIAL_JS = `// JavaScript задаёт поведение. Эта кнопка меняет тему.
const button = document.querySelector('#theme-button');
button?.addEventListener('click', () => {
  document.body.classList.toggle('night');
});`;
const BLOCKS = [
  {key:'h1',tag:'h1',name:'Заголовок',html:'<h1>Мой заголовок</h1>',hint:'h1 — главный заголовок страницы. Обычно он один.'},
  {key:'h2',tag:'h2',name:'Подзаголовок',html:'<h2>Мои интересы</h2>',hint:'h2 — заголовок отдельного раздела.'},
  {key:'p',tag:'p',name:'Текст',html:'<p>Несколько слов обо мне.</p>',hint:'p — абзац. Меняй содержимое в настройках справа.'},
  {key:'article',tag:'article',name:'Карточка',html:'<article class="card"><h3>Название карточки</h3><p>Напиши пару предложений о себе.</p></article>',hint:'Карточка объединяет заголовок и текст. Несколько карточек можно расположить через Flexbox.'},
  {key:'section',tag:'section',name:'Раздел',html:'<section></section>',hint:'section — смысловой раздел. Добавь внутрь заголовок и текст.'},
  {key:'div',tag:'div',name:'Контейнер',html:'<div></div>',hint:'div объединяет блоки. Включи Flexbox у контейнера, чтобы расположить его прямых детей.'},
  {key:'ul',tag:'ul',name:'Список',html:'<ul><li>Музыка</li><li>Игры</li><li>Прогулки</li></ul>',hint:'ul — список; li — один пункт. В настройках впиши каждый пункт на новой строке.'},
  {key:'img',tag:'img',name:'Картинка',html:'<img class="photo" src="assets/mountains.jpg" alt="Горные вершины">',hint:'img — картинка. Выбери готовую, загрузи с компьютера или отправь с телефона по QR.'},
  {key:'a',tag:'a',name:'Ссылка',html:'<a href="#about">Обо мне →</a>',hint:'a — ссылка. Адрес href может вести на раздел этой же страницы.'},
  {key:'button',tag:'button',name:'Кнопка',html:'<button type="button" class="action">Нажми меня</button>',hint:'button — кнопка. Её поведение задаёт JavaScript; готовый бонус есть через «+» в файлах.'}
];
const CONTAINERS = new Set(['main','section','div','header','footer','article','nav','aside','form','figure']);
const VOID_TAGS = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const SEMANTICS = {
  main:'main — главное содержимое страницы. Обычно он один.',
  header:'header — вступление: имя, заголовок и знакомство.',
  section:'section — смысловой раздел с собственным заголовком.',
  footer:'footer — завершение страницы, например подпись автора.',
  figure:'figure — изображение и, при желании, подпись к нему.',
  div:'div — нейтральная коробка. Если у блока есть смысл, выбери подходящий тег.',
  article:'article — самостоятельная история или карточка.',
  nav:'nav — блок навигационных ссылок.',aside:'aside — дополнительное содержимое.'
};
const MISSIONS = [
  {short:'О себе',category:'HTML · СОДЕРЖИМОЕ',title:'Познакомь страницу с собой',time:'≈ 5 минут',description:'HTML описывает, что есть на странице. Измени имя в h1 и напиши 1–2 предложения в абзаце p.',hint:'Выбери <code>&lt;h1&gt;</code>, затем абзац <code>&lt;p&gt;</code> внутри <code>header</code>. Справа измени «Содержимое». Можно придумать героя. Переключись на «Код»: заголовок записан как <code>&lt;h1&gt;Имя&lt;/h1&gt;</code>.',fail:'Измени и главный заголовок h1, и текст знакомства внутри header.'},
  {short:'Блоки',category:'ВЛОЖЕННОСТЬ · СЕМАНТИКА',title:'Собери раздел «Мои интересы»',time:'≈ 7 минут',description:'Выбери пустой div.about и замени его тег на section. Вложи внутрь подзаголовок h2 и абзац p о своём увлечении.',hint:'Нажми «К нужному блоку». В поле «Смысл блока · тег» выбери <code>section</code>. Перетащи «Подзаголовок» на этот контейнер: скобки <code>{ }</code> раскроются, показывая место внутри. Так же добавь «Текст» и измени его. Можно просто нажимать блоки в библиотеке: они добавляются внутрь выбранного контейнера. <code>header</code> — вступление, <code>main</code> — главное, <code>section</code> — раздел, <code>footer</code> — завершение.',fail:'Нужен section.about с заголовком h2 и своим текстом p внутри. В настройках div.about выбери тег section.'},
  {short:'Фото',category:'HTML · IMG + CSS',title:'Вставь и измени картинку',time:'≈ 6 минут',description:'Добавь картинку внутрь figure.photo-zone. Задай описание alt и попробуй изменить ширину картинки ползунком.',hint:'Выбери <code>figure.photo-zone</code> и нажми «Картинка». Доступны библиотека, загрузка с компьютера и QR для телефона. После вставки выбери <code>img</code>, напиши, что на фото, и измени «Ширина картинки». Это свойство <code>width</code> в CSS. Картинка должна оказаться внутри скобок figure.',fail:'Добавь img внутрь figure.photo-zone, заполни alt и измени ширину: начальное значение — 180 px.'},
  {short:'Flex',category:'CSS · FLEXBOX',title:'Найди место для своей картинки',time:'≈ 8 минут',description:'Включи Flexbox у figure. Попробуй центр, левый и нижний край. Меняй justify-content и align-items, затем оставь понравившийся вариант.',hint:'Выбери родителя картинки — <code>figure</code>. Для ряда <code>justify-content</code> двигает по горизонтали, <code>align-items</code> — по вертикали. Для колонки оси меняются местами. Центр: оба значения <code>center</code>. Слева по центру: <code>flex-start</code> и <code>center</code>. Снизу по центру: <code>center</code> и <code>flex-end</code>. Попробуй оба выпадающих списка; готовые позиции помогут сравнить результат.',fail:'Включи Flexbox у контейнера с картинкой и попробуй оба свойства: justify-content и align-items.'},
  {short:'Класс',category:'CSS · КЛАССЫ',title:'Создай собственный стиль',time:'≈ 6 минут',description:'CSS задаёт оформление. Выбери раздел о себе, создай класс my-style, задай фон и внутренний отступ padding. Найди class="my-style" в HTML и .my-style в CSS.',hint:'У <code>section.about</code> нажми «+» рядом с CSS-классами. Назови класс <code>my-style</code> без точки, выбери фон и отступ, оставь «Назначить выбранному блоку». В HTML получится <code>class="about my-style"</code>, в CSS — <code>.my-style { … }</code>. Выключи и включи CSS над предпросмотром: содержимое остаётся, оформление меняется.',fail:'Создай свой класс с фоном и отступом и назначь его хотя бы одному блоку страницы.'},
  {short:'Готово',category:'РЕЗУЛЬТАТ · 35 МИНУТ',title:'Сохрани свою первую страницу',time:'≈ 3 минуты',description:'Проверь страницу на телефоне, назови проект и нажми «Сохранить». Открой результат и забери код проекта.',hint:'В режиме «Телефон» проверь текст и картинку. Кнопка «Сохранить» создаёт контрольную версию. «Результат → Код проекта» позволяет перенести страницу, включая загруженное фото. Ты собрал HTML-структуру, выбрал смысловые теги, настроил CSS-класс и расположил картинку через Flexbox.',fail:'Добавь текст и картинку, затем сохрани текущую версию кнопкой «Сохранить».'}
];
function newId(){return crypto.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
function freshState(){return {name:'Мой первый сайт',files:{'index.html':INITIAL_HTML,'style.css':INITIAL_CSS},currentFile:'index.html',mode:'blocks',selectedPath:'0.0.0',selectedClass:null,createdClasses:[],flexTouched:[],imagesChosen:[],lastManualFingerprint:null,theme:'fresh',device:'desktop',mission:0};}
function clone(value){return JSON.parse(JSON.stringify(value));}
function hydrate(value){
  const clean=freshState(); if(!value || typeof value!=='object') return clean;
  if(value.files && typeof value.files['index.html']==='string' && typeof value.files['style.css']==='string') clean.files=Object.fromEntries(FILE_ORDER.filter(f=>typeof value.files[f]==='string').map(f=>[f,value.files[f]]));
  for(const field of ['name','currentFile','mode','selectedPath','selectedClass','lastManualFingerprint','theme','device']) if(typeof value[field]==='string') clean[field]=value[field];
  clean.name=clean.name.slice(0,60)||'Мой сайт';
  for(const field of ['createdClasses','flexTouched','imagesChosen']) if(Array.isArray(value[field])) clean[field]=value[field].filter(v=>typeof v==='string').slice(0,100);
  clean.mission=Math.max(0,Math.min(MISSIONS.length-1,Number(value.mission)||0));
  if(!(clean.currentFile in clean.files)) clean.currentFile='index.html';
  if(!THEMES[clean.theme]) clean.theme='fresh';
  if(!['desktop','phone'].includes(clean.device)) clean.device='desktop';
  if(!['blocks','code'].includes(clean.mode)) clean.mode='blocks';
  return clean;
}
function readLibrary(){
  try {const saved=JSON.parse(localStorage.getItem(BOOK_KEY)||'null'); if(saved?.projects && typeof saved.projects==='object') {
    const projects={}; for(const [id,entry] of Object.entries(saved.projects).slice(0,50)) if(/^[\w-]{6,70}$/.test(id)&&!['__proto__','constructor','prototype'].includes(id)&&entry?.state?.files) projects[id]={id,name:String(entry.name||'Мой сайт').slice(0,60),createdAt:Number(entry.createdAt)||Date.now(),updatedAt:Number(entry.updatedAt)||Date.now(),state:hydrate(entry.state),versions:Array.isArray(entry.versions)?entry.versions.slice(0,6).filter(v=>v?.state?.files).map(v=>({...v,state:hydrate(v.state)})):[]};
    const ids=Object.keys(projects); if(ids.length) {
      let activeId=projects[saved.activeId]?saved.activeId:ids[0];
      if(saved.lessonVersion!==2){const id=newId(),initial=freshState();initial.name='О себе · вводный урок';projects[id]={id,name:initial.name,createdAt:Date.now(),updatedAt:Date.now(),state:initial,versions:[]};activeId=id;}
      return {version:1,lessonVersion:2,activeId,projects};
    }
  }} catch(_) {}
  const id=newId(), book={version:1,lessonVersion:2,activeId:id,projects:{}}; let initial=freshState();
  try {const legacy=JSON.parse(localStorage.getItem('web-workshop-v2')||localStorage.getItem('web-workshop-v1')||'null'); if(legacy?.files){
    const untouched=legacy.files['index.html']?.includes('Привет, я Саша')&&!legacy.files['index.html']?.includes('<ul>')&&!legacy.files['style.css']?.includes('Мой CSS-класс');
    if(!untouched) {initial=hydrate(legacy);initial.name='Моя прежняя работа';initial.mission=0;}
  }} catch(_) {}
  book.projects[id]={id,name:initial.name,createdAt:Date.now(),updatedAt:Date.now(),state:initial,versions:[]}; return book;
}
let library=readLibrary();
let state=hydrate(library.projects[library.activeId].state);
let history=[];
let cssEnabled=true,inspectMode=false;
let sourceTimer,toastTimer,saveTimer,previewTimer;
let classEditingName=null;
let previewNonce=newId(),previewScroll=0;
let pendingPreviewFocus=null;
let dragPayload=null,pointerDrag=null,suppressClickUntil=0;
let lessonCompleteAnnounced=false;
let imageTargetPath=null,galleryFilter='Все';
let transferMode='export',transferBusy=false;
const collapsedNodes=new Set(),expandedEmptyNodes=new Set();
let photoSession=null,photoPollTimer=null,photoGeneration=0;
let uploadBusy=false;

function escapeHTML(text) { return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }
function parseHTML(html = state.files['index.html']) { return new DOMParser().parseFromString(html, 'text/html'); }
function resolvePath(doc, path) { if (!path && path !== '0') return null; return path.split('.').reduce((parent, index) => parent?.children[Number(index)] || null, doc.body); }
function nodePath(node, body) { const parts = []; while (node && node !== body) { if (!node.parentElement) return null; parts.unshift([...node.parentElement.children].indexOf(node)); node = node.parentElement; } return node === body ? parts.join('.') : null; }
function serializeHTML(doc) {
  function element(node, level) {
    const pad = '  '.repeat(level);
    if (node.nodeType === 8) return `${pad}<!--${node.textContent}-->`;
    if (node.nodeType === 3) return node.textContent.trim() ? pad + escapeHTML(node.textContent.trim()) : '';
    if (node.nodeType !== 1) return '';
    const tag = node.tagName.toLowerCase();
    const attrs = [...node.attributes].map((attr) => ` ${attr.name}="${escapeHTML(attr.value)}"`).join('');
    const start = `<${tag}${attrs}>`;
    if (VOID_TAGS.has(tag)) return pad + start;
    if (['script', 'style', 'pre', 'textarea'].includes(tag)) return `${pad}${start}${node.textContent}</${tag}>`;
    if (!node.children.length && ![...node.childNodes].some((child) => child.nodeType === 8)) return `${pad}${start}${escapeHTML(node.textContent)}</${tag}>`;
    // Preserve inline text and whitespace when a paragraph includes inline tags.
    if (['p', 'h1', 'h2', 'h3', 'a', 'span', 'button', 'li', 'label'].includes(tag)) return pad + node.outerHTML;
    const children = [...node.childNodes].map((child) => element(child, level + 1)).filter(Boolean).join('\n');
    return children ? `${pad}${start}\n${children}\n${pad}</${tag}>` : `${pad}${start}</${tag}>`;
  }
  return '<!DOCTYPE html>\n' + element(doc.documentElement, 0);
}
function checkpoint() { history.push(JSON.stringify(state)); if (history.length > 40) history.shift(); $('#undo-button').disabled = false; }
function persistState(){
  const project=library.projects[library.activeId];
  project.name=state.name;project.state=clone(state);project.updatedAt=Date.now();
  try{localStorage.setItem(BOOK_KEY,JSON.stringify(library));$('#save-status').textContent='Сохранено в браузере';$('#global-save').textContent='Автосохранено';return true;}
  catch(_){$('#save-status').textContent='Сохрани код проекта отдельно';$('#global-save').textContent='Память заполнена';return false;}
}
function saveDraft(){clearTimeout(saveTimer);$('#save-status').textContent='Сохраняем…';$('#global-save').textContent='Сохраняем…';saveTimer=setTimeout(persistState,250);}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4800);}
function ensureDraft(){}
function fingerprint(value=state){let hash=2166136261;const text=FILE_ORDER.map(f=>value.files[f]||'').join('\u0000');for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(36);}
function saveProject(){
  flushSource();state.lastManualFingerprint=fingerprint();
  const project=library.projects[library.activeId];
  if(project.versions[0]?.fingerprint!==state.lastManualFingerprint) project.versions.unshift({time:Date.now(),fingerprint:state.lastManualFingerprint,state:clone(state)});
  project.versions=project.versions.slice(0,6);
  clearTimeout(saveTimer);const saved=persistState();updateMissions();
  toast(saved?'Сохранено: «'+state.name+'». Можно закрыть страницу и вернуться позже.':'Память браузера заполнена. Скопируй переносимый код проекта.');
}
function renderProjectHeader(){$('#project-title').value=state.name;document.querySelectorAll('[data-theme]').forEach(el=>el.classList.toggle('active',el.dataset.theme===state.theme));document.querySelectorAll('[data-device]').forEach(el=>{const active=el.dataset.device===state.device;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});}
function resetView(){collapsedNodes.clear();expandedEmptyNodes.clear();stopPhoneUpload();history=[];cssEnabled=true;inspectMode=false;previewScroll=0;state.selectedClass=null;$('#css-toggle').checked=true;$('#inspect-toggle').checked=false;$('#css-toggle').nextElementSibling.textContent='CSS включён';lessonCompleteAnnounced=false;renderProjectHeader();renderEditor();updatePreview();updateMissions();}
function createProject(){flushSource();persistState();const id=newId();state=freshState();state.name=Object.keys(library.projects).length?'Мой сайт '+(Object.keys(library.projects).length+1):'Мой первый сайт';library.activeId=id;library.projects[id]={id,name:state.name,createdAt:Date.now(),updatedAt:Date.now(),state:clone(state),versions:[]};$('#projects-dialog').close();resetView();persistState();toast('Новый проект создан. Предыдущая работа осталась в «Мои проекты».');}
function openProject(id){if(!library.projects[id])return;flushSource();persistState();library.activeId=id;state=hydrate(library.projects[id].state);$('#projects-dialog').close();resetView();persistState();toast('Открыт проект «'+state.name+'».');}
function restoreVersion(id,index){const project=library.projects[id],version=project?.versions[index];if(!version)return;flushSource();persistState();if(fingerprint(project.state)!==version.fingerprint){project.versions.unshift({time:Date.now(),fingerprint:fingerprint(project.state),state:clone(project.state)});project.versions=project.versions.slice(0,6);}library.activeId=id;state=hydrate(version.state);$('#projects-dialog').close();resetView();persistState();toast('Контрольная версия восстановлена. Текущая работа также сохранена.');}
function dateLabel(time){return new Date(time).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Vladivostok'});}
function versionLabel(count){const n=count%100;if(n>=11&&n<=14)return 'контрольных версий';if(n%10===1)return 'контрольная версия';if(n%10>=2&&n%10<=4)return 'контрольные версии';return 'контрольных версий';}
function renderProjects(){
  flushSource();persistState();
  $('#project-list').innerHTML=Object.values(library.projects).sort((a,b)=>b.updatedAt-a.updatedAt).map(project=>`<div class="project-item ${project.id===library.activeId?'active':''}"><span class="project-item-mark">&lt;&gt;</span><div class="project-item-text"><b>${escapeHTML(project.name)}</b><small>${dateLabel(project.updatedAt)} · ${project.versions.length} ${versionLabel(project.versions.length)}</small></div><button data-open-project="${project.id}">${project.id===library.activeId?'Продолжить':'Открыть'}</button></div>${project.versions.length?`<details class="project-versions"><summary>Контрольные версии</summary>${project.versions.map((version,i)=>`<button data-version-project="${project.id}" data-version="${i}"><span>${dateLabel(version.time)}</span><span>Восстановить ↶</span></button>`).join('')}</details>`:''}`).join('');
  $('#projects-dialog').showModal();
}
function mutateHTML(mutator, { select = null, announce = null } = {}) {
  flushSource();
  checkpoint(); ensureDraft();
  const doc = parseHTML();
  const result = mutator(doc);
  state.files['index.html'] = serializeHTML(doc);
  if (result instanceof Element) {state.selectedPath=nodePath(result,doc.body);revealPath(state.selectedPath);}
  else if (select !== null) state.selectedPath = select;
  if(announce || result?.tagName==='IMG') pendingPreviewFocus=state.selectedPath;
  renderEditor(); updatePreview(); updateMissions(); saveDraft();
  if (announce) toast(announce);
}
function flushSource() { if (sourceTimer) { clearTimeout(sourceTimer); sourceTimer = null; commitSource(); } }
function fileType(file) { return file.endsWith('.html') ? 'html' : file.endsWith('.css') ? 'css' : 'js'; }
function fileIcon(file) { return ({ html: '&lt;&gt;', css: '#', js: 'JS' })[fileType(file)]; }
function selectFile(file) { flushSource(); state.currentFile = file; if (file !== 'index.html') state.mode = 'code'; renderEditor(); saveDraft(); }
function renderFiles() {
  const files = FILE_ORDER.filter((f) => f in state.files);
  $('#file-list').innerHTML = files.map((file) => `<button class="file-button ${file === state.currentFile ? 'active' : ''}" data-file="${file}" aria-current="${file === state.currentFile ? 'true' : 'false'}"><span class="file-icon ${fileType(file)}">${fileIcon(file)}</span>${file}</button>`).join('');
  $('#file-tabs').innerHTML = files.map((file) => `<button class="${file === state.currentFile ? 'active' : ''}" role="tab" aria-selected="${file === state.currentFile}" data-file="${file}"><span class="file-icon ${fileType(file)}">${fileIcon(file)}</span>${file}</button>`).join('');
  $('#add-script').title = state.files['script.js'] === undefined ? 'Добавить script.js и кнопку смены темы' : 'Открыть script.js';
}
function renderEditor() {
  renderFiles();
  const isHTML = state.currentFile === 'index.html';
  const isBlocks = isHTML && state.mode === 'blocks';
  $('#editor-mode').hidden = !isHTML;
  document.querySelectorAll('[data-mode]').forEach((el) => el.classList.toggle('active', el.dataset.mode === state.mode));
  $('#file-description').textContent = ({ html: 'HTML · структура страницы', css: 'CSS · оформление страницы', js: 'JS · поведение страницы' })[fileType(state.currentFile)];
  $('#builder-panel').hidden = !isBlocks;
  $('#element-properties').hidden = false;
  $('#block-library').hidden = !isHTML;
  $('#code-panel').hidden = isBlocks;
  $('#class-button').hidden = state.currentFile !== 'style.css';
  $('#code-caption').textContent = state.currentFile === 'style.css' ? 'Создай класс или измени CSS здесь' : state.currentFile === 'script.js' ? 'Бонус: кнопка меняет тему страницы' : 'Те же блоки — в настоящем HTML';
  $('#code-hint').innerHTML = state.currentFile === 'style.css' ? 'Класс начинается с точки: <b>.card</b>. В HTML он назначается так: <b>class="card"</b>. Измени цвет и посмотри направо.' : state.currentFile === 'script.js' ? 'Попробуй кнопку «Сменить тему» в предпросмотре. Сними флажок «Выбрать элемент», если он включён.' : 'HTML использует открывающие и закрывающие теги: <b>&lt;p&gt;Текст&lt;/p&gt;</b>. Файл стилей подключается через <b>&lt;link&gt;</b>.';
  if (isBlocks) renderTree();
  else { $('#code-editor').value = state.files[state.currentFile]; updateLineNumbers(); renderProperties(); }
  $('#undo-button').disabled = !history.length;
  $('#element-count').textContent = `${parseHTML().body.querySelectorAll('*').length} элементов`;
}
function renderTree(properties = true) {
  const doc = parseHTML();
  function row(node, path, depth) {
    const tag=node.tagName.toLowerCase(),container=CONTAINERS.has(tag),selected=path===state.selectedPath;
    const summary=container?({main:'Вся страница',header:'Знакомство',section:'Раздел обо мне',div:'Нейтральный контейнер',figure:'Место для картинки',footer:'Подпись автора',article:'Карточка'}[tag]||'Контейнер'):node.textContent.trim()||node.getAttribute('alt')||'Пустой элемент';
    const className=node.getAttribute('class')||'';
    const textNodes=[...node.childNodes].filter(child=>child.nodeType===3&&child.textContent.trim());
    const itemCount=node.children.length+textNodes.length;
    const children=container?[...node.childNodes].map(child=>child.nodeType===1?row(child,nodePath(child,doc.body),depth+1):child.nodeType===3&&child.textContent.trim()?`<div class="direct-text">${escapeHTML(child.textContent.trim())}</div>`:'').join(''):'';
    const collapsed=container&&(collapsedNodes.has(path)||(!node.children.length&&!expandedEmptyNodes.has(path)));
    return `<div class="tree-node ${container?'container-node':''} ${itemCount===0?'empty-node':''} ${collapsed?'scope-collapsed':''}" data-node-path="${path}" style="--level:${depth%4}"><div class="drop-line" data-drop="before" data-path="${path}"></div><div class="block-heading">${container?`<button class="fold-button" data-fold="${path}" aria-expanded="${!collapsed}" aria-label="${collapsed?'Раскрыть':'Свернуть'} ${tag}">${collapsed?'›':'⌄'}</button>`:'<span class="leaf-mark">·</span>'}<div class="block-row ${selected?'selected':''}" draggable="true" data-path="${path}" data-container="${container}" tabindex="0" role="button" aria-label="${escapeHTML(tag+': '+summary.slice(0,70))}" aria-pressed="${selected}"><span class="tag-name ${container?'container':''}">&lt;${tag}&gt;</span><span class="node-summary">${escapeHTML(summary)}</span>${className?`<span class="node-class">.${escapeHTML(className.split(/\s+/).join(' .'))}</span>`:''}${container?'<span class="scope-inline" aria-hidden="true">{ }</span>':''}</div></div>${container?`<div class="scope-content"><div class="scope-open" data-drop="inside" data-path="${path}" aria-hidden="true">{ <small>${itemCount?'ВНУТРИ · '+itemCount:'ПУСТОЙ КОНТЕЙНЕР'}</small></div><div class="scope-body" data-drop="inside" data-path="${path}">${children}<div class="nesting-drop" data-drop="inside" data-path="${path}">+ Вложить в &lt;${tag}&gt;</div></div><div class="scope-close" data-drop="inside" data-path="${path}"><b>}</b><span>&lt;/${tag}&gt;</span></div></div>`:''}<div class="drop-line" data-drop="after" data-path="${path}"></div></div>`;
  }
  $('#block-tree').innerHTML=[...doc.body.children].filter(node=>node.tagName!=='SCRIPT').map(node=>row(node,nodePath(node,doc.body),0)).join('');
  if(properties)renderProperties(doc);
}
function revealPath(path){
  const parts=path.split('.');
  for(let i=1;i<=parts.length;i++)collapsedNodes.delete(parts.slice(0,i).join('.'));
}
function computedBlockStyle(node){
  const style=document.createElement('div').style;
  for(const name of validClasses(node)) for(const property of classStyle(name)) style.setProperty(property,classStyle(name).getPropertyValue(property));
  return style;
}
function findClasses() { return [...new Set([...state.files['style.css'].matchAll(/\.([A-Za-z_][\w-]*)\s*\{/g)].map((m) => m[1]))]; }
function classPattern(name){return new RegExp('(^|\\n)[ \\t]*\\.'+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*\\{([^}]*?)\\}');}
function classStyle(name){const el=document.createElement('div');el.style.cssText=state.files['style.css'].match(classPattern(name))?.[2]||'';return el.style;}
function validClasses(node){return [...node.classList].filter(name=>/^[A-Za-z_][\w-]*$/.test(name));}
function activeClass(node){if(state.selectedClass==='__own__')return null;const names=validClasses(node);return names.includes(state.selectedClass)?state.selectedClass:names.at(-1)||null;}
function styleValue(node,property,fallback){const name=activeClass(node);return name?classStyle(name).getPropertyValue(property).trim()||fallback:fallback;}
function hexColor(value,fallback){if(/^#[\da-f]{6}$/i.test(value))return value;const numbers=value.match(/^rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/);return numbers?'#'+numbers.slice(1,4).map(v=>Number(v).toString(16).padStart(2,'0')).join(''):fallback;}
function slider(property,title,value,min,max){return `<label><span class="slider-label-row"><span>${title}</span><output>${value} px</output></span><input type="range" min="${min}" max="${max}" value="${value}" data-style="${property}" data-unit="px" aria-label="${title}"></label>`;}
function selectControl(id,property,title,value,options){return `<label>${title}<select id="${id}" data-style="${property}">${options.map(([key,text])=>`<option value="${key}" ${key===value?'selected':''}>${text}</option>`).join('')}</select></label>`;}
function renderProperties(doc=parseHTML()){
  const node=resolvePath(doc,state.selectedPath);
  if(!node){$('#element-properties').innerHTML='<p class="property-help">Выбери блок в структуре или прямо в предпросмотре.</p>';return;}
  const tag=node.tagName.toLowerCase(),container=CONTAINERS.has(tag),isList=['ul','ol'].includes(tag),editable=(!container||(!node.children.length&&Boolean(node.textContent.trim())))&&!VOID_TAGS.has(tag);
  const value=isList?[...node.children].map(li=>li.textContent).join('\n'):node.textContent;
  let fields=editable?`<label>${isList?'Пункты · один на строку':'Содержимое'}${isList||value.length>80?`<textarea id="property-text" rows="3">${escapeHTML(value)}</textarea>`:`<input id="property-text" value="${escapeHTML(value)}">`}</label>`:'';
  if(container)fields+=`<label>Смысл блока · тег<select id="semantic-tag">${Object.keys(SEMANTICS).map(t=>`<option value="${t}" ${t===tag?'selected':''}>${t} — ${({main:'главное',header:'вступление',section:'раздел',footer:'завершение',figure:'картинка',div:'нейтральный блок',article:'история',nav:'навигация',aside:'дополнение'})[t]}</option>`).join('')}</select></label><p class="semantic-note">${escapeHTML(SEMANTICS[tag]||'Контейнер объединяет вложенные блоки.')}</p>`;
  if(tag==='a')fields+=`<label>Адрес ссылки · href<input id="property-href" value="${escapeHTML(node.getAttribute('href')||'')}"></label>`;
  if(tag==='img')fields+=`<img class="image-property-thumb" src="${escapeHTML(node.getAttribute('src')||'')}" alt="Текущая картинка"><button id="property-image" class="image-choose-button">Выбрать картинку ↗</button><label>Описание · alt<input id="property-alt" value="${escapeHTML(node.getAttribute('alt')||'')}" placeholder="Что изображено?"></label><span class="image-credit">Описание помогает, когда картинка недоступна.</span>`;
  if(tag==='img'){const imageStyle=computedBlockStyle(node);fields+=slider('width','Ширина картинки',parseInt(imageStyle.width)||180,60,420);}
  fields+=`<label>CSS-классы<div class="class-field-row"><input id="property-class" value="${escapeHTML(node.getAttribute('class')||'')}" list="class-list" placeholder="например, about my-style"><button id="property-new-class" aria-label="Создать CSS-класс" title="Создать общий класс">+</button></div><datalist id="class-list">${findClasses().map(name=>`<option value="${escapeHTML(name)}"></option>`).join('')}</datalist></label>`;
  const parents=[...doc.body.querySelectorAll('*')].filter(el=>CONTAINERS.has(el.tagName.toLowerCase())&&el!==node&&!node.contains(el));
  fields+=`<label>Вложить в контейнер<select id="parent-container"><option value="" ${node.parentElement===doc.body?'selected':''}>body — корень страницы</option>${parents.map(el=>{const path=nodePath(el,doc.body);return `<option value="${path}" ${el===node.parentElement?'selected':''}>${'· '.repeat(path.split('.').length-1)}${el.tagName.toLowerCase()}${el.className?'.'+el.className.trim().split(/\s+/).join('.'):''}</option>`;}).join('')}</select></label>`;
  const theme=THEMES[state.theme],name=activeClass(node),names=validClasses(node),style=name?classStyle(name):document.createElement('div').style;
  const font=parseInt(style.fontSize)||({h1:46,h2:24,h3:20,span:12}[tag]||16),padding=parseInt(style.padding)||0,radius=parseInt(style.borderRadius)||0;
  const color=hexColor(style.color,theme.ink),background=hexColor(style.backgroundColor,theme.card);
  const styleFields=`<details class="inspector-section" ${container&&state.mission!==4?'':'open'}><summary>Оформление</summary><div class="style-fields"><div class="box-model" aria-label="Блочная модель"><span>margin · снаружи</span><div><span>border · граница</span><div><span>padding · внутри</span><b>Содержимое &lt;${tag}&gt;</b></div></div></div><label>Какой класс изменяем<select id="style-rule-target"><option value="">Отдельный стиль блока</option>${names.map(n=>`<option value="${n}" ${n===name?'selected':''}>.${n}</option>`).join('')}</select></label><div id="style-target-note" class="style-target-note">${name?'Правило .'+escapeHTML(name)+' действует на все блоки с этим классом.':'При изменении появится отдельный класс в style.css.'}</div><div class="field-pair"><label>Текст<div class="color-control"><input type="color" value="${color}" data-style="color" aria-label="Цвет текста"><span>${color}</span></div></label><label>Фон<div class="color-control"><input type="color" value="${background}" data-style="background" aria-label="Цвет фона"><span>${style.backgroundColor==='transparent'?'нет':background}</span></div></label></div>${slider('font-size','Размер текста',font,10,72)}${slider('padding','Внутренний отступ',padding,0,64)}${slider('border-radius','Скругление',radius,0,40)}${selectControl('text-align-control','text-align','Текст',style.textAlign||'left',[['left','Слева'],['center','По центру'],['right','Справа']])}${tag==='img'?selectControl('image-ratio-control','aspect-ratio','Формат картинки',style.aspectRatio||'16 / 9',[['16 / 9','Широкая · 16:9'],['1 / 1','Квадрат · 1:1'],['3 / 4','Портрет · 3:4']]):''}</div></details>`;
  const flexOn=style.display==='flex',direction=style.flexDirection||'row',gap=Number.parseInt(style.gap)||0,justify=style.justifyContent||'flex-start',align=style.alignItems||'stretch';
  const flexFields=container?`<details class="inspector-section" open><summary>Flexbox · расположение</summary><div class="flex-fields"><label class="checkbox-field"><input id="property-flex-enabled" type="checkbox" ${flexOn?'checked':''}> Включить Flexbox</label><div class="direction-buttons"><button data-direction="row" class="${flexOn&&direction==='row'?'active':''}">↔ В ряд</button><button data-direction="column" class="${flexOn&&direction==='column'?'active':''}">↕ Колонка</button></div><div class="flex-demo ${flexOn?'':'flex-off'}" style="display:${flexOn?'flex':'block'};flex-direction:${direction};justify-content:${justify};align-items:${align}"><span>1</span><span>2</span><span>3</span></div><p class="property-help">Расположение прямых дочерних блоков. Сейчас их ${node.children.length}.</p>${slider('gap','Расстояние между блоками',gap,0,48)}<p class="axis-note">${direction==='row'?'↔ Главная ось — горизонталь<br>↕ Поперечная — вертикаль':'↕ Главная ось — вертикаль<br>↔ Поперечная — горизонталь'}</p>${selectControl('justify-control','justify-content','justify-content · '+(direction==='row'?'↔ горизонталь':'↕ вертикаль'),justify,[['flex-start','В начале'],['center','По центру'],['space-between','Между краями'],['space-evenly','Равномерно'],['flex-end','В конце']])}${selectControl('align-control','align-items','align-items · '+(direction==='row'?'↕ вертикаль':'↔ горизонталь'),align,[['stretch','Растянуть'],['flex-start','В начале'],['center','По центру'],['flex-end','В конце']])}<div class="position-presets"><span>Попробуй положение</span><button data-position="center">⊙ Центр</button><button data-position="left">⇤ Слева</button><button data-position="bottom">↓ Снизу</button></div><label class="checkbox-field"><input id="property-flex-wrap" type="checkbox" ${style.flexWrap==='wrap'?'checked':''}> Перенос на новую строку · wrap</label></div></details>`:`<details class="inspector-section" open><summary>Flexbox</summary><div class="flex-empty">Flexbox включается у контейнера и располагает его детей.<button id="jump-to-flex">Выбрать родителя картинки →</button></div></details>`;
  const trail=[];let ancestor=node;while(ancestor&&ancestor!==doc.body){trail.unshift(`<button data-select-path="${nodePath(ancestor,doc.body)}">${ancestor.tagName.toLowerCase()}</button>`);ancestor=ancestor.parentElement;}
  $('#element-properties').innerHTML=`<nav class="nesting-trail" aria-label="Вложенность выбранного блока">${trail.join('<span>›</span>')}</nav><div class="property-heading"><b>&lt;${tag}&gt;</b><div class="node-actions"><button data-node-action="up" aria-label="Переместить элемент выше">↑</button><button data-node-action="down" aria-label="Переместить элемент ниже">↓</button><button data-node-action="duplicate" aria-label="Дублировать элемент">⧉</button><button data-node-action="delete" aria-label="Удалить элемент">×</button></div></div>${container&&state.mission===3?flexFields:''}<div class="property-fields">${fields}<p class="class-explainer">HTML: <code>class="${escapeHTML(names.join(' ')||'my-style')}"</code><br>CSS: <code>.${escapeHTML(name||'my-style')} { … }</code></p></div>${styleFields}${container&&state.mission===3?'':flexFields}<p class="property-help">${escapeHTML(BLOCKS.find(b=>b.key===tag)?.hint||(container?'Вложи блоки в контейнер, затем настрой его расположение.':'Оформление элемента задаётся CSS.'))}</p>`;
}
function putClassStyle(name,style){
  const rule='.'+name+' {\n'+[...style].map(property=>'  '+property+': '+style.getPropertyValue(property)+';').join('\n')+'\n}';
  const pattern=classPattern(name);
  state.files['style.css']=pattern.test(state.files['style.css'])?state.files['style.css'].replace(pattern,(_,lead)=>lead+rule):state.files['style.css']+'\n\n/* Настройки блока */\n'+rule;
}
function applyStyles(changes,live=false){
  flushSource();const doc=parseHTML(),node=resolvePath(doc,state.selectedPath);if(!node)return;
  checkpoint();
  const targetSelect=$('#style-rule-target');let name=targetSelect?targetSelect.value:activeClass(node);
  if(!name){name='block-'+newId().replace(/-/g,'').slice(0,6);node.classList.add(name);}
  state.selectedClass=name;
  const style=classStyle(name);for(const [property,value] of Object.entries(changes))style.setProperty(property,value);
  putClassStyle(name,style);state.files['index.html']=serializeHTML(doc);
  if(Object.keys(changes).some(key=>['display','gap','flex-direction','justify-content','align-items','flex-wrap'].includes(key))&&!state.flexTouched.includes(name))state.flexTouched.push(name);
  if(live){if(state.mode==='blocks'&&state.currentFile==='index.html')renderTree(false);const note=$('#style-target-note');if(note)note.textContent='Изменяется .'+name+' в style.css.';clearTimeout(previewTimer);previewTimer=setTimeout(updatePreview,75);}
  else {renderEditor();updatePreview();}
  updateMissions();saveDraft();
}
function selectPath(path){revealPath(path);state.selectedPath=path;state.selectedClass=null;state.currentFile='index.html';state.mode='blocks';renderEditor();const row=$('.block-row[data-path="'+path+'"]');row?.scrollIntoView({block:'nearest',behavior:'smooth'});saveDraft();}
function jumpToFlex(){const doc=parseHTML();const selected=resolvePath(doc,state.selectedPath);let node=selected?.tagName==='IMG'?selected.parentElement:doc.querySelector('.photo-zone')||doc.querySelector('img')?.parentElement||doc.querySelector('.cards');if(node)selectPath(nodePath(node,doc.body));else toast('Добавь контейнер и вложи в него два блока.');}
function missionAction(){
  const doc=parseHTML();let node;
  if(state.mission===0)node=doc.querySelector('h1');
  if(state.mission===1||state.mission===4)node=doc.querySelector('#about,.about,section');
  if(state.mission===2)node=doc.querySelector('.photo-zone img')||doc.querySelector('.photo-zone,figure');
  if(state.mission===3){jumpToFlex();return;}
  if(state.mission===5){$('#project-title').focus();return;}
  if(node)selectPath(nodePath(node,doc.body));
}
function applyTheme(key){if(!THEMES[key])return;flushSource();checkpoint();state.theme=key;const theme=THEMES[key],pattern=/(body\s*\{)([^}]*)(\})/;state.files['style.css']=state.files['style.css'].replace(pattern,(_,open,body,close)=>{for(const [name,value]of Object.entries({'--page-bg':theme.background,'--ink':theme.ink,'--muted':theme.muted,'--accent':theme.accent,'--card-bg':theme.card})){const prop=new RegExp(name+':[^;]*;');body=prop.test(body)?body.replace(prop,name+': '+value+';'):'\n  '+name+': '+value+';'+body;}return open+body+close;});renderProjectHeader();renderEditor();updatePreview();updateMissions();saveDraft();}
function openGallery(){flushSource();stopPhoneUpload();imageTargetPath=state.selectedPath;galleryFilter='Все';$('#image-upload-status').textContent='';renderGallery();$('#gallery-dialog').showModal();}
function renderGallery(){$('#gallery-filters').innerHTML=['Все','Природа','Космос','Увлечения'].map(category=>`<button data-gallery-filter="${category}" class="${category===galleryFilter?'active':''}">${category}</button>`).join('');$('#gallery-grid').innerHTML=IMAGES.filter(image=>galleryFilter==='Все'||image.category===galleryFilter).map(image=>`<button class="gallery-item" data-image="${image.id}"><img src="${image.file}" alt="${image.alt}"><span>${image.title}<small>Добавить ↗</small></span></button>`).join('');}
function installImage(source,alt,id){
  mutateHTML(doc=>{
    let node=resolvePath(doc,imageTargetPath);
    if(node?.tagName!=='IMG'){
      const selected=node;node=doc.createElement('img');node.className='photo';
      if(selected&&CONTAINERS.has(selected.tagName.toLowerCase()))selected.append(node);
      else (doc.querySelector('.photo-zone')||defaultContainer(doc)).append(node);
    }
    node.setAttribute('src',source);node.alt=alt;
    if(!state.imagesChosen.includes(id))state.imagesChosen.push(id);
    return node;
  });
  $('#gallery-dialog').close();toast('Картинка внутри блока. Попробуй изменить её ширину и положение.');
}
function chooseImage(id){const image=IMAGES.find(item=>item.id===id);if(image)installImage(image.file,image.alt,id);}
async function chooseLocalImage(file){
  if(!file||uploadBusy)return;uploadBusy=true;
  const projectId=library.activeId;$('#image-upload-status').textContent='Подготавливаем фото…';
  try{const image=await WorkshopPhoto.prepare(file);if(projectId!==library.activeId||!$('#gallery-dialog').open)return;installImage(image,'Моя картинка','upload-'+newId());}
  catch(error){$('#image-upload-status').textContent=error.message;}
  finally{uploadBusy=false;$('#photo-file').value='';}
}
function stopPhoneUpload(){
  photoGeneration++;clearTimeout(photoPollTimer);
  if(photoSession){fetch(photoSession.poll_url,{method:'DELETE'}).catch(()=>{});photoSession=null;}
  $('#phone-upload-panel').hidden=true;$('#phone-upload-button').disabled=false;
}
async function startPhoneUpload(){
  stopPhoneUpload();const generation=photoGeneration,projectId=library.activeId;
  $('#phone-upload-panel').hidden=false;$('#phone-upload-status').textContent='Создаём QR-код…';$('#phone-qr').hidden=true;$('#phone-upload-link').hidden=true;$('#phone-upload-button').disabled=true;
  let expires=0;
  try{
    const response=await fetch('/api/photo-sessions',{method:'POST'});
    if(!response.ok)throw new Error('Для QR запусти мастерскую командой python3 server.py. Пока можно загрузить фото с компьютера.');
    const session=await response.json();
    if(generation!==photoGeneration){fetch(session.poll_url,{method:'DELETE'}).catch(()=>{});return;}
    photoSession=session;expires=Date.now()+session.expires_in*1000;
    $('#phone-qr').src=session.qr_url;$('#phone-qr').hidden=false;
    $('#phone-upload-link').href=session.upload_url;$('#phone-upload-link').textContent=session.upload_url;$('#phone-upload-link').hidden=false;
    $('#phone-upload-status').textContent='Открой камеру телефона и наведи на QR. Оба устройства должны быть в одной сети. Код действует 10 минут.';
    let failures=0;
    const poll=async()=>{
      if(generation!==photoGeneration)return;
      if(Date.now()>expires){stopPhoneUpload();$('#image-upload-status').textContent='QR-код истёк. Нажми «С телефона по QR» ещё раз.';return;}
      try{
        const result=await fetch(session.poll_url),data=await result.json();
        if(generation!==photoGeneration)return;
        if(!result.ok)throw new Error(data.error||'Код истёк. Создай новый QR.');
        failures=0;
        if(data.image){if(projectId!==library.activeId){stopPhoneUpload();return;}stopPhoneUpload();installImage(data.image,'Моя картинка с телефона','phone-'+newId());return;}
      }catch(error){
        if(generation!==photoGeneration)return;
        if(++failures>=3){stopPhoneUpload();$('#image-upload-status').textContent='Связь с сервером прервалась. Создай новый QR или загрузи фото с компьютера.';return;}
      }
      photoPollTimer=setTimeout(poll,1200);
    };
    photoPollTimer=setTimeout(poll,1200);
  }catch(error){if(generation===photoGeneration){stopPhoneUpload();$('#image-upload-status').textContent=error.message;}}
}

function updateLineNumbers() { const lines = $('#code-editor').value.split('\n').length; $('#line-numbers').textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n'); $('#line-numbers').scrollTop = $('#code-editor').scrollTop; }
function commitSource() {
  sourceTimer = null;
  const value = $('#code-editor').value;
  if (value === state.files[state.currentFile]) return;
  checkpoint(); ensureDraft(); state.files[state.currentFile] = value;
  updateLineNumbers(); updatePreview(); updateMissions(); saveDraft();
}
function addBlock(key, targetPath = null, position = 'append') {
  const block = BLOCKS.find((b) => b.key === key); if (!block) return;
  if(key==='img'&&!state.imagesChosen.includes('mountains'))state.imagesChosen.push('mountains');
  mutateHTML((doc) => {
    const temp = doc.createElement('template'); temp.innerHTML = block.html; const element = temp.content.firstElementChild;
    placeNode(doc, element, targetPath, position);
    return element;
  }, { announce: `${block.name} добавлен. Выбери его и измени содержимое.` });
}
function defaultContainer(doc) {
  const chosen = resolvePath(doc, state.selectedPath);
  if (chosen && CONTAINERS.has(chosen.tagName.toLowerCase())) return chosen;
  if (chosen?.parentElement && chosen.parentElement !== doc.body) return chosen.parentElement;
  return doc.body.querySelector('main') || doc.body;
}
function placeNode(doc, element, path, position) {
  const target = path === null ? null : resolvePath(doc, path);
  if (position === 'before' && target) target.before(element);
  else if (position === 'after' && target) target.after(element);
  else if (position === 'inside' && target && CONTAINERS.has(target.tagName.toLowerCase())) target.append(element);
  else defaultContainer(doc).append(element);
}
function clearDragHighlights() { document.querySelectorAll('.drop-active,.drop-inside,.drop-expanded,.dragging').forEach(node=>node.classList.remove('drop-active','drop-inside','drop-expanded','dragging')); }
function highlightDrop(drop){
  document.querySelectorAll('.drop-active,.drop-inside').forEach(node=>node.classList.remove('drop-active','drop-inside'));
  const scope=drop?.position==='inside'?drop.element.closest('.container-node'):null;
  document.querySelectorAll('.drop-expanded').forEach(node=>{if(node!==scope)node.classList.remove('drop-expanded');});
  if(!drop)return;
  drop.element.classList.add(drop.position==='inside'?'drop-inside':'drop-active');
  scope?.classList.add('drop-expanded');
}
function getDropTarget(event) {
  const row = event.target.closest('.block-row');
  if (row) return { element: row, position: row.dataset.container === 'true' ? 'inside' : 'after', path: row.dataset.path };
  const explicit = event.target.closest('[data-drop]');
  if (explicit) return { element: explicit, position: explicit.dataset.drop, path: explicit.dataset.path ?? null };
  return null;
}
function handleDrop(event) {
  const target = getDropTarget(event); if (!target) return;
  event.preventDefault();
  const payload = dragPayload || event.dataTransfer?.getData('text/plain'); clearDragHighlights(); dragPayload = null;
  if (!payload) return;
  if (payload.startsWith('new:')) addBlock(payload.slice(4), target.path, target.position);
  else if (payload.startsWith('move:')) {
    const fromPath = payload.slice(5);
    const doc = parseHTML(); const from = resolvePath(doc, fromPath); const to = target.path === null ? defaultContainer(doc) : resolvePath(doc, target.path);
    if (!from || !to || from === to || from.contains(to)) { toast('Выбери другое место: элемент нельзя вложить в самого себя.'); return; }
    mutateHTML((updated) => { const node = resolvePath(updated, fromPath); placeNode(updated, node, target.path, target.position); return node; }, { announce: 'Блок перемещён. Вкладка «Код» показывает новую структуру.' });
  }
}
function applyProperty(id, value) {
  const active = document.activeElement;
  const focusId = active?.id;
  const caretStart = active?.selectionStart;
  const caretEnd = active?.selectionEnd;
  mutateHTML((doc) => {
    const node = resolvePath(doc, state.selectedPath); if (!node) return;
    if(id==='semantic-tag'&&SEMANTICS[value]){const replacement=doc.createElement(value);for(const attr of node.attributes)replacement.setAttribute(attr.name,attr.value);replacement.append(...node.childNodes);node.replaceWith(replacement);return replacement;}
    if (id === 'property-text') {
      if (['UL', 'OL'].includes(node.tagName)) {
        node.replaceChildren(...value.split('\n').filter((v) => v.trim()).map((text) => { const li = doc.createElement('li'); li.textContent = text; return li; }));
      } else node.textContent = value;
    } else {
      const attr = ({ 'property-class': 'class', 'property-href': 'href', 'property-src': 'src', 'property-alt':'alt' })[id];
      if (attr) { if (value.trim()) node.setAttribute(attr, value.trim()); else node.removeAttribute(attr); }
    }
    return node;
  });
  if (focusId === id) {
    const replacement = document.getElementById(id);
    replacement?.focus({ preventScroll: true });
    if (typeof caretStart === 'number' && replacement?.setSelectionRange) replacement.setSelectionRange(caretStart, caretEnd);
  }
}
function nodeAction(action) {
  const doc = parseHTML(); const selected = resolvePath(doc, state.selectedPath); if (!selected) return;
  if (action === 'up' && !selected.previousElementSibling || action === 'down' && !selected.nextElementSibling) { toast('Это уже крайний элемент в своём контейнере.'); return; }
  mutateHTML((updated) => {
    const node = resolvePath(updated, state.selectedPath);
    if (action === 'delete') { const parent = node.parentElement; node.remove(); state.selectedPath = parent === updated.body ? null : nodePath(parent, updated.body); return null; }
    if (action === 'duplicate') { const copy = node.cloneNode(true); copy.querySelectorAll('[id]').forEach((item) => item.removeAttribute('id')); copy.removeAttribute('id'); node.after(copy); return copy; }
    if (action === 'up') node.previousElementSibling.before(node);
    if (action === 'down') node.nextElementSibling.after(node);
    return node;
  });
}
function addScript() {
  if (state.files['script.js'] !== undefined) { selectFile('script.js'); return; }
  mutateHTML((doc) => {
    state.files['script.js'] = INITIAL_JS;
    if (!doc.querySelector('script[src="script.js"]')) { const script = doc.createElement('script'); script.src = 'script.js'; doc.body.append(script); }
    if (!doc.getElementById('theme-button')) { const button = doc.createElement('button'); button.type = 'button'; button.id = 'theme-button'; button.className = 'action'; button.textContent = 'Сменить тему'; (doc.querySelector('.hero') || doc.querySelector('main') || doc.body).append(button); }
  });
  selectFile('script.js');
  toast('script.js подключён. Нажми «Сменить тему» справа — это работа JavaScript.');
}
function classCode() {
  const name = $('#class-name').value.trim();
  return `.${name} {\n  color: ${$('#class-color').value};\n  background: ${$('#class-background').value};\n  padding: ${$('#class-padding').value}px;\n  border-radius: ${$('#class-radius').value}px;\n  font-size: ${$('#class-size').value}px;${$('#class-flex').checked?`\n  display: flex;\n  flex-direction: ${$('#class-direction').value};\n  gap: ${$('#class-gap').value}px;\n  flex-wrap: wrap;`:''}\n}`;
}
function updateClassSample() {
  $('#class-code').textContent = classCode();
  $('#class-flex-fields').hidden=!$('#class-flex').checked;
  const sample = $('#class-sample'); sample.style.color = $('#class-color').value; sample.style.background = $('#class-background').value; sample.style.padding = `${$('#class-padding').value}px`; sample.style.borderRadius = `${$('#class-radius').value}px`; sample.style.fontSize = `${$('#class-size').value}px`;
}
function openClassDialog() {
  flushSource(); classEditingName = null;
  const node = resolvePath(parseHTML(), state.selectedPath);
  const existing = node?[...node.classList].reverse().find(name=>state.createdClasses.includes(name)):null;
  $('#class-flex').checked=existing?classStyle(existing).display==='flex':false;
  $('#class-direction').value=existing?classStyle(existing).flexDirection||'row':'row';
  $('#class-gap').value=existing?parseInt(classStyle(existing).gap)||16:16;
  $('#class-name').value = state.createdClasses.includes(existing) ? existing : state.createdClasses.includes('my-style') ? `my-style-${state.createdClasses.length + 1}` : 'my-style';
  if (state.createdClasses.includes(existing)) {
    classEditingName = existing;
    const rule = state.files['style.css'].match(new RegExp(`\\.${existing}\\s*\\{([^}]*)\\}`));
    const temp = document.createElement('div'); temp.style.cssText = rule?.[1] || '';
    function colorHex(value, fallback) { const m = value.match(/\d+/g); return m?.length >= 3 ? '#' + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('') : /^#[\da-f]{6}$/i.test(value) ? value : fallback; }
    $('#class-color').value = colorHex(temp.style.color, '#243246'); $('#class-background').value = colorHex(temp.style.backgroundColor, '#dff5eb'); $('#class-padding').value = parseInt(temp.style.padding) || 20; $('#class-radius').value = parseInt(temp.style.borderRadius) || 16; $('#class-size').value = parseInt(temp.style.fontSize) || 16;
  } else { $('#class-color').value = '#243246'; $('#class-background').value = '#dff5eb'; $('#class-padding').value = 20; $('#class-radius').value = 16; $('#class-size').value = 16; }
  $('#class-apply').checked = Boolean(node);
  $('#class-apply').disabled = !node;
  $('#class-target').textContent = node ? `Выбран элемент <${node.tagName.toLowerCase()}>` : 'Сначала выбери HTML-блок, чтобы назначить класс.';
  updateClassSample(); $('#class-dialog').showModal(); $('#class-name').focus();
}
function saveClass(event) {
  event.preventDefault(); const name = $('#class-name').value.trim();
  if (!/^[A-Za-z_][\w-]*$/.test(name)) { toast('Назови класс латиницей, без точки и пробелов. Например: my-style.'); return; }
  const classNumbers = ['class-padding', 'class-radius', 'class-size'].map((id) => Number($('#' + id).value));
  if (classNumbers.some((v) => !Number.isFinite(v))) return;
  checkpoint(); ensureDraft();
  const rule = classCode();
  const pattern = new RegExp(`\\.${name}\\s*\\{[^}]*\\}`);
  state.files['style.css'] = pattern.test(state.files['style.css']) ? state.files['style.css'].replace(pattern, rule) : state.files['style.css'] + '\n\n/* Мой CSS-класс */\n' + rule;
  if (!state.createdClasses.includes(name)) state.createdClasses.push(name);
  if($('#class-flex').checked&&!state.flexTouched.includes(name))state.flexTouched.push(name);
  if ($('#class-apply').checked) {
    const doc = parseHTML(); const node = resolvePath(doc, state.selectedPath);
    if (node) { if (classEditingName && classEditingName !== name) node.classList.remove(classEditingName); node.classList.add(name); state.files['index.html'] = serializeHTML(doc); }
  }
  $('#class-dialog').close(); renderEditor(); updatePreview(); updateMissions(); saveDraft(); toast(`Класс .${name} сохранён в style.css и назначен выбранному блоку. Его можно использовать повторно.`);
}
function completion(){
  const doc=parseHTML(),h1=doc.querySelector('h1'),intro=doc.querySelector('header p');
  const ownText=Boolean(h1?.textContent.trim()&&!['Привет, я …','Привет, я Саша','Привет, я Саша.'].includes(h1.textContent.trim())&&intro?.textContent.trim()&&intro.textContent.trim()!=='Напиши пару слов о себе или о придуманном герое.');
  const about=doc.querySelector('section#about,section.about')||[...doc.querySelectorAll('section')].find(el=>el.querySelector('h2')&&el.querySelector('p'));
  const heading=about?.querySelector('h2')?.textContent.trim(),text=about?.querySelector('p')?.textContent.trim();
  const structure=Boolean(heading&&text&&text!=='Несколько слов обо мне.');
  const image=doc.querySelector('figure img'),imageStyle=image?computedBlockStyle(image):null;
  const photo=Boolean(image?.getAttribute('src')&&image.alt.trim()&&imageStyle?.width&&imageStyle.width!=='180px');
  const parentStyle=image?computedBlockStyle(image.parentElement):null;
  const flex=Boolean(parentStyle?.display==='flex'&&parentStyle.justifyContent&&parentStyle.alignItems);
  const starterClasses=new Set(['page','hero','intro','about','photo-zone','photo','site-footer','card','action']);
  const classes=findClasses().filter(name=>state.createdClasses.includes(name)||!starterClasses.has(name)).some(name=>[...doc.body.querySelectorAll('*')].some(node=>node.classList.contains(name))&&classStyle(name).background&&parseFloat(classStyle(name).padding)>0);
  const saved=Boolean(ownText&&image&&state.lastManualFingerprint===fingerprint());
  return [ownText,structure,photo,flex,classes,saved];
}
function updateMissions(){
  const done=completion(),count=done.filter(Boolean).length;$('#progress-count').textContent=`${count} / ${MISSIONS.length}`;$('#progress-caption').textContent=count===MISSIONS.length?'Твоя страница готова!':'Шесть шагов · одна страница о себе';
  $('#mission-nav').innerHTML=MISSIONS.map((mission,i)=>`<button class="${i===state.mission?'active':''} ${done[i]?'done':''}" data-mission="${i}" aria-current="${i===state.mission?'step':'false'}"><span>${done[i]?'✓':i+1}</span>${mission.short}</button>`).join('');
  const mission=MISSIONS[state.mission];$('#mission-number').textContent=String(state.mission+1).padStart(2,'0');$('#mission-category').textContent=`ШАГ ${state.mission+1} · ${mission.category}`;$('#mission-time').textContent=mission.time;$('#mission-title').textContent=mission.title;$('#mission-description').textContent=mission.description;
  $('#mission-action-button').textContent=state.mission===5?'Сохранить страницу':'К нужному блоку';
  $('#check-button').textContent=done[state.mission]?(state.mission===MISSIONS.length-1?'Готово ✓':'Дальше →'):'Проверить →';
  $('#hint-button').setAttribute('aria-expanded',String(!$('#hint-box').hidden));if(!$('#hint-box').hidden)$('#hint-box').innerHTML='<b>Подсказка.</b> '+mission.hint;
  if(count===MISSIONS.length&&!lessonCompleteAnnounced){lessonCompleteAnnounced=true;toast('Все шаги пройдены! Сохрани переносимый код через «Результат», чтобы продолжить на другом компьютере.');}
}
function checkMission(){flushSource();const done=completion();if(!done[state.mission]){$('#hint-box').hidden=false;updateMissions();toast(MISSIONS[state.mission].fail);return;}const next=done.findIndex((finished,i)=>!finished&&i>state.mission);if(next>=0){state.mission=next;$('#hint-box').hidden=true;updateMissions();saveDraft();missionAction();toast('Шаг выполнен. Следующее задание уже открыто.');}else toast(done.every(Boolean)?'Готово! Твоя страница: HTML, смысловые блоки, картинка, Flexbox и CSS-класс.':'Шаг выполнен. Выбери остальные задания в маршруте.');}

function buildPreview(files) {
  const doc = parseHTML(files['index.html']);
  doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    if (link.getAttribute('href')?.replace(/^\.\//, '') === 'style.css') { if (cssEnabled) { const style = doc.createElement('style'); style.textContent = files['style.css']; link.replaceWith(style); } else link.remove(); }
  });
  doc.querySelectorAll('script[src]').forEach((script) => {
    if (script.getAttribute('src')?.replace(/^\.\//, '') === 'script.js') { if (files['script.js'] !== undefined) { const inline = doc.createElement('script'); inline.textContent = files['script.js'].replace(/<\/script/gi, '<\\/script'); script.replaceWith(inline); } else script.remove(); }
  });
  const receiver = doc.createElement('script');
  receiver.textContent = `(() => {
    const nonce = ${JSON.stringify(previewNonce)};
    let inspect = ${inspectMode};
    document.addEventListener('DOMContentLoaded',()=>window.scrollTo(0,${previewScroll}));
    window.addEventListener('scroll',()=>send('scroll',{y:window.scrollY}),{passive:true});
    const send = (type, data) => parent.postMessage({channel:'web-lab', nonce, type, ...data}, '*');
    window.addEventListener('error', event => send('error', {message:event.message, line:event.lineno}));
    window.addEventListener('unhandledrejection', event => send('error', {message:String(event.reason)}));
    function path(el) { const parts=[]; while(el && el !== document.body) { if(!el.parentElement) return null; parts.unshift([...el.parentElement.children].indexOf(el)); el=el.parentElement; } return parts.join('.'); }
    document.addEventListener('click', event => {
      const el = event.target.closest('body *'); if(!el) return;
      if(inspect) { event.preventDefault(); event.stopImmediatePropagation(); send('select', {path:path(el)}); }
      else if(event.target.closest('a')) { event.preventDefault(); const href=event.target.closest('a').getAttribute('href')||'';if(href.startsWith('#'))document.getElementById(href.slice(1))?.scrollIntoView({behavior:'smooth',block:'start'});else send('link',{href}); }
    }, true);
    window.addEventListener('message', event => { if(event.source !== parent || event.data?.channel !== 'web-lab' || event.data.nonce !== nonce)return;if(typeof event.data.inspect==='boolean')inspect=event.data.inspect;if(event.data.focusPath){const node=event.data.focusPath.split('.').reduce((parent,index)=>parent?.children[Number(index)],document.body);node?.scrollIntoView({block:'center',behavior:'smooth'});} });
  })();`;
  doc.head.prepend(receiver);
  if (inspectMode) { const style = doc.createElement('style'); style.textContent = 'body *:hover{outline:1px dashed #4665ec;outline-offset:3px;cursor:crosshair}'; doc.head.append(style); }
  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}
function scalePreview(){const stage=$('#preview-stage');if(!stage?.clientWidth)return;const width=state.device==='phone'?320:720,scale=Math.min(1,stage.clientWidth/width),frame=$('#preview-frame');frame.style.width=width+'px';frame.style.height=(stage.clientHeight/scale)+'px';frame.style.transform='scale('+scale+')';frame.style.left=Math.max(0,(stage.clientWidth-width*scale)/2)+'px';$('#preview-width').textContent=width+' px';}
function updatePreview(){clearTimeout(previewTimer);$('#script-error').hidden=true;previewNonce=newId();$('#preview-frame').srcdoc=buildPreview(state.files);scalePreview();}
window.addEventListener('message',event=>{if(event.source!==$('#preview-frame').contentWindow||event.data?.channel!=='web-lab'||event.data.nonce!==previewNonce)return;
  if(event.data.type==='select')selectPath(event.data.path);
  if(event.data.type==='scroll')previewScroll=Math.max(0,Number(event.data.y)||0);
  if(event.data.type==='error'){$('#script-error').textContent='JavaScript: '+event.data.message+'. Проверь script.js или отмени изменение.';$('#script-error').hidden=false;}
  if(event.data.type==='link'){const href=event.data.href||'';if(!href.startsWith('#'))toast('Ссылка ведёт на: '+href);}
});
function inlineDocument(files){const doc=parseHTML(files['index.html']);doc.querySelectorAll('link[rel="stylesheet"]').forEach(link=>{if(link.getAttribute('href')?.replace(/^\.\//,'')==='style.css'){const style=doc.createElement('style');style.textContent=files['style.css'];link.replaceWith(style);}});doc.querySelectorAll('script[src]').forEach(script=>{if(script.getAttribute('src')?.replace(/^\.\//,'')==='script.js'&&files['script.js']!==undefined){const inline=doc.createElement('script');inline.textContent=files['script.js'].replace(/<\/script/gi,'<\\/script');script.replaceWith(inline);}});return doc;}
function showResult(){flushSource();$('#result-dialog').showModal();}
function showFullscreen(){flushSource();$('#result-dialog').close();$('#fullscreen-title').textContent=state.name;$('#result-frame').srcdoc='<!DOCTYPE html>\n'+inlineDocument(state.files).documentElement.outerHTML;$('#fullscreen-dialog').showModal();}
function bytesToBase64(bytes){let binary='';for(let offset=0;offset<bytes.length;offset+=8192)binary+=String.fromCharCode(...bytes.subarray(offset,offset+8192));return btoa(binary);}
function base64ToBytes(encoded){const binary=atob(encoded);return Uint8Array.from(binary,c=>c.charCodeAt(0));}
async function projectCode(){const payload=new TextEncoder().encode(JSON.stringify({version:1,name:state.name,state}));if(typeof CompressionStream!=='undefined'){const compressed=await new Response(new Blob([payload]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();return 'WL1:G:'+bytesToBase64(new Uint8Array(compressed));}return 'WL1:J:'+bytesToBase64(payload);}
async function decodeProject(code){
  if(code.length>700000)throw new Error('Код слишком большой.');const match=code.trim().match(/^WL1:([GJ]):([A-Za-z0-9+/=\s]+)$/);if(!match)throw new Error('Нужен код проекта, начинающийся с WL1:.');
  let bytes=base64ToBytes(match[2].replace(/\s/g,''));if(match[1]==='G'){if(typeof DecompressionStream==='undefined')throw new Error('Этот браузер не поддерживает сжатые коды. Открой мастерскую в современном браузере.');const reader=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader(),chunks=[];let total=0;while(true){const part=await reader.read();if(part.done)break;total+=part.value.length;if(total>700000){await reader.cancel();throw new Error('Размер проекта превышает предел.');}chunks.push(part.value);}bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}}
  if(bytes.length>700000)throw new Error('Проект слишком большой.');const payload=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(payload.version!==1||typeof payload.state?.files?.['index.html']!=='string'||typeof payload.state?.files?.['style.css']!=='string')throw new Error('В коде нет HTML и CSS проекта.');return hydrate({...payload.state,name:payload.name||payload.state.name});
}
async function openTransfer(mode){flushSource();$('#result-dialog').close();$('#projects-dialog').close();transferMode=mode;$('#code-transfer-status').textContent='';$('#project-code-text').readOnly=mode==='export';$('#copy-code-button').hidden=mode!=='export';$('#restore-code-button').hidden=mode!=='import';$('#project-code-heading').textContent=mode==='export'?'Код твоего проекта':'Открыть проект по коду';$('#project-code-description').textContent=mode==='export'?'Скопируй этот текст и сохрани в доступном месте: например, в школьном дневнике. Позже открой «Мои проекты → Открыть по коду» и вставь его. Исходная работа останется здесь.':'Вставь ранее сохранённый код WL1:. Работа откроется как новый проект; существующие проекты сохранятся.';$('#project-code-text').value=mode==='export'?'Подготавливаем код…':'';$('#code-dialog').showModal();if(mode==='export'){try{$('#project-code-text').value=await projectCode();$('#code-transfer-status').textContent='Готово. Код переносит HTML, CSS, JavaScript и настройки.';}catch(error){$('#code-transfer-status').textContent='Не удалось подготовить код: '+error.message;}}else $('#project-code-text').focus();}
async function restoreCode(){if(transferBusy)return;transferBusy=true;$('#restore-code-button').disabled=true;try{const restored=await decodeProject($('#project-code-text').value);flushSource();persistState();const id=newId();library.activeId=id;state=restored;if(Object.values(library.projects).some(project=>project.name===state.name))state.name=state.name.slice(0,50)+' (копия)';library.projects[id]={id,name:state.name,createdAt:Date.now(),updatedAt:Date.now(),state:clone(state),versions:[]};$('#code-dialog').close();resetView();persistState();toast('Проект восстановлен из кода. Можно продолжать.');}catch(error){$('#code-transfer-status').textContent='Не удалось открыть: '+error.message;}finally{transferBusy=false;$('#restore-code-button').disabled=false;}}
function libraryButton(block){return `<button class="library-item" draggable="true" data-block="${block.key}" title="${escapeHTML(block.hint)}"><b>${block.tag}</b>${block.name}</button>`;}
const basicBlocks=new Set(['h1','h2','p','section','div','img']);
$('#library-items').innerHTML=BLOCKS.filter(block=>basicBlocks.has(block.key)).map(libraryButton).join('')+`<details class="extra-blocks"><summary>Ещё блоки · необязательно</summary><div>${BLOCKS.filter(block=>!basicBlocks.has(block.key)).map(libraryButton).join('')}</div></details>`;
document.addEventListener('click',event=>{
  const target=event.target,file=target.closest('[data-file]');if(file)selectFile(file.dataset.file);
  const mode=target.closest('[data-mode]');if(mode){flushSource();state.mode=mode.dataset.mode;renderEditor();saveDraft();}
  const fold=target.closest('[data-fold]');if(fold){const path=fold.dataset.fold;if(fold.getAttribute('aria-expanded')==='true'){collapsedNodes.add(path);expandedEmptyNodes.delete(path);}else{collapsedNodes.delete(path);expandedEmptyNodes.add(path);}renderTree();return;}
  const crumb=target.closest('[data-select-path]');if(crumb)selectPath(crumb.dataset.selectPath);
  const preset=target.closest('[data-position]');if(preset){const node=resolvePath(parseHTML(),state.selectedPath),column=styleValue(node,'flex-direction','row')==='column';const positions={center:['center','center'],left:column?['center','flex-start']:['flex-start','center'],bottom:column?['flex-end','center']:['center','flex-end']};const [justify,align]=positions[preset.dataset.position];applyStyles({display:'flex','justify-content':justify,'align-items':align});}
  const row=target.closest('.block-row');if(row&&!dragPayload)selectPath(row.dataset.path);
  const block=target.closest('[data-block]');if(block&&!dragPayload){if(block.dataset.block==='img')openGallery();else addBlock(block.dataset.block);}
  const action=target.closest('[data-node-action]');if(action)nodeAction(action.dataset.nodeAction);
  const mission=target.closest('[data-mission]');if(mission){state.mission=Number(mission.dataset.mission);$('#hint-box').hidden=true;updateMissions();saveDraft();missionAction();}
  const close=target.closest('[data-close]');if(close)$('#'+close.dataset.close).close();
  const direction=target.closest('[data-direction]');if(direction)applyStyles({'display':'flex','flex-direction':direction.dataset.direction,'gap':styleValue(resolvePath(parseHTML(),state.selectedPath),'gap','16px'),'flex-wrap':'wrap'});
  const theme=target.closest('[data-theme]');if(theme)applyTheme(theme.dataset.theme);
  const device=target.closest('[data-device]');if(device){state.device=device.dataset.device;renderProjectHeader();scalePreview();saveDraft();}
  if(target.closest('#property-new-class'))openClassDialog();
  if(target.closest('#property-image'))openGallery();
  if(target.closest('#jump-to-flex'))jumpToFlex();
  const filter=target.closest('[data-gallery-filter]');if(filter){galleryFilter=filter.dataset.galleryFilter;renderGallery();}
  const image=target.closest('[data-image]');if(image)chooseImage(image.dataset.image);
  const project=target.closest('[data-open-project]');if(project)openProject(project.dataset.openProject);
  const version=target.closest('[data-version-project]');if(version)restoreVersion(version.dataset.versionProject,Number(version.dataset.version));
});
$('#block-tree').addEventListener('keydown',event=>{const row=event.target.closest('.block-row');if(row&&['Enter',' '].includes(event.key)){event.preventDefault();selectPath(row.dataset.path);}});

document.addEventListener('dragstart', (event) => {
  if (pointerDrag) { event.preventDefault(); return; }
  const block = event.target.closest('[data-block]'); const row = event.target.closest('.block-row');
  if (!block && !row) return;
  flushSource(); dragPayload = block ? 'new:' + block.dataset.block : 'move:' + row.dataset.path;
  event.dataTransfer.setData('text/plain', dragPayload); event.dataTransfer.effectAllowed = block ? 'copy' : 'move';
  if (row) row.classList.add('dragging');
});
document.addEventListener('dragover', (event) => { if (!dragPayload && !event.dataTransfer?.types.includes('text/plain')) return; const drop = getDropTarget(event); if (!drop) return; event.preventDefault(); highlightDrop(drop); event.dataTransfer.dropEffect = dragPayload?.startsWith('new:') ? 'copy' : 'move'; });
document.addEventListener('drop', handleDrop);
document.addEventListener('dragend', () => { clearDragHighlights(); dragPayload = null; });
// Pointer dragging also works in embedded browsers and with touch input.
document.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  const source = event.target.closest('[data-block],.block-row');
  if (!source) return;
  pointerDrag = { source, id: event.pointerId, x: event.clientX, y: event.clientY, active: false, payload: source.dataset.block ? 'new:' + source.dataset.block : 'move:' + source.dataset.path };
});
document.addEventListener('pointermove', (event) => {
  if (!pointerDrag || event.pointerId !== pointerDrag.id) return;
  if (!pointerDrag.active && Math.hypot(event.clientX - pointerDrag.x, event.clientY - pointerDrag.y) < 7) return;
  if (!pointerDrag.active) {
    flushSource(); pointerDrag.active = true; dragPayload = pointerDrag.payload;
    pointerDrag.source.setPointerCapture(event.pointerId);
    const ghost = document.createElement('div'); ghost.id = 'drag-ghost'; ghost.className = 'drag-ghost'; ghost.textContent = pointerDrag.source.textContent.trim(); document.body.append(ghost);
  }
  event.preventDefault();
  const ghost = $('#drag-ghost'); ghost.style.left = `${event.clientX + 14}px`; ghost.style.top = `${event.clientY + 12}px`;
  const target = document.elementFromPoint(event.clientX, event.clientY);
  const drop = target && getDropTarget({ target });
  highlightDrop(drop);
  const panel = $('#builder-panel'); const rect = panel.getBoundingClientRect();
  if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
    if (event.clientY < rect.top + 30) panel.scrollTop -= 10;
    if (event.clientY > rect.bottom - 30) panel.scrollTop += 10;
  }
}, { passive: false });
document.addEventListener('pointerup', (event) => {
  if (!pointerDrag || event.pointerId !== pointerDrag.id) return;
  const active = pointerDrag.active;
  if (pointerDrag.source.hasPointerCapture(event.pointerId)) pointerDrag.source.releasePointerCapture(event.pointerId);
  pointerDrag = null; $('#drag-ghost')?.remove();
  if (active) {
    suppressClickUntil = Date.now() + 350;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (target) handleDrop({ target, preventDefault() {}, dataTransfer: null });
    clearDragHighlights(); dragPayload = null;
  }
});
document.addEventListener('pointercancel', () => { pointerDrag = null; dragPayload = null; $('#drag-ghost')?.remove(); clearDragHighlights(); });
document.addEventListener('click', (event) => { if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
$('#element-properties').addEventListener('input',event=>{
  const target=event.target;
  if(target.id.startsWith('property-')&&!['property-flex-enabled','property-flex-wrap'].includes(target.id))applyProperty(target.id,target.value);
  if(target.dataset.style&&target.tagName!=='SELECT'){const value=target.value+(target.dataset.unit||'');if(target.type==='range'){const output=target.closest('label').querySelector('output');if(output)output.textContent=value.replace('px',' px');applyStyles({[target.dataset.style]:value},true);}else{const text=target.parentElement.querySelector('span');if(text)text.textContent=target.value;applyStyles({[target.dataset.style]:value},true);}}
});
$('#element-properties').addEventListener('change',event=>{
  const target=event.target;
  if(target.id==='semantic-tag')applyProperty(target.id,target.value);
  if(target.id==='parent-container'){const path=target.value;mutateHTML(doc=>{const node=resolvePath(doc,state.selectedPath),parent=path?resolvePath(doc,path):doc.body;if(!node||!parent||node===parent||node.contains(parent))return;parent.append(node);return node;},{announce:'Вложенность изменена. Посмотри на скобки в структуре.'});}
  if(target.id==='style-rule-target'){state.selectedClass=target.value||'__own__';renderProperties();}
  if(target.dataset.style){applyStyles({[target.dataset.style]:target.value+(target.dataset.unit||'')});}
  if(target.id==='property-flex-enabled')applyStyles(target.checked?{display:'flex','flex-direction':'row',gap:'16px','flex-wrap':'wrap'}:{display:'block'});
  if(target.id==='property-flex-wrap')applyStyles({'flex-wrap':target.checked?'wrap':'nowrap'});
});
$('#code-editor').addEventListener('input',()=>{updateLineNumbers();clearTimeout(sourceTimer);sourceTimer=setTimeout(commitSource,350);});
$('#code-editor').addEventListener('scroll',()=>$('#line-numbers').scrollTop=$('#code-editor').scrollTop);
$('#code-editor').addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();const el=event.target;el.setRangeText('  ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input'));}});
$('#undo-button').addEventListener('click',()=>{flushSource();if(!history.length)return;state=hydrate(JSON.parse(history.pop()));renderProjectHeader();renderEditor();updatePreview();updateMissions();saveDraft();toast('Последнее изменение отменено.');});
$('#add-script').addEventListener('click',addScript);
$('#class-button').addEventListener('click',openClassDialog);
$('#class-form').addEventListener('input',updateClassSample);
$('#class-form').addEventListener('submit',saveClass);
$('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());
$('#hint-button').addEventListener('click',()=>{$('#hint-box').hidden=!$('#hint-box').hidden;updateMissions();if(!$('#hint-box').hidden)$('#hint-box').scrollIntoView({behavior:'smooth',block:'nearest'});});
$('#mission-action-button').addEventListener('click',()=>state.mission===5?saveProject():missionAction());
$('#check-button').addEventListener('click',checkMission);
$('#inspect-toggle').addEventListener('change',event=>{inspectMode=event.target.checked;updatePreview();if(inspectMode)toast('Нажми на блок в странице — справа откроются его настройки.');});
$('#css-toggle').addEventListener('change',event=>{cssEnabled=event.target.checked;updatePreview();event.target.nextElementSibling.textContent=cssEnabled?'CSS включён':'CSS выключен';toast(cssEnabled?'Оформление вернулось.':'Осталась структура HTML — элементы существуют без оформления.');});
$('#refresh-button').addEventListener('click',()=>{flushSource();updatePreview();});
$('#show-css-button').addEventListener('click',()=>selectFile('style.css'));
$('#gallery-button').addEventListener('click',openGallery);
$('#local-upload-button').addEventListener('click',()=>$('#photo-file').click());
$('#photo-file').addEventListener('change',event=>chooseLocalImage(event.target.files[0]));
$('#phone-upload-button').addEventListener('click',startPhoneUpload);
$('#gallery-dialog').addEventListener('close',stopPhoneUpload);
$('#save-button').addEventListener('click',saveProject);
$('#project-title').addEventListener('input',event=>{state.name=event.target.value.trim().slice(0,60)||'Мой сайт';saveDraft();});
$('#projects-button').addEventListener('click',renderProjects);
$('#create-project-button').addEventListener('click',createProject);
$('#new-project-button').addEventListener('click',createProject);
$('#result-button').addEventListener('click',showResult);
$('#view-result-button').addEventListener('click',showFullscreen);
$('#fullscreen-button').addEventListener('click',showFullscreen);
$('#project-code-button').addEventListener('click',()=>openTransfer('export'));
$('#import-project-button').addEventListener('click',()=>openTransfer('import'));
$('#restore-code-button').addEventListener('click',restoreCode);
$('#copy-code-button').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#project-code-text').value);$('#code-transfer-status').textContent='Код скопирован. Сохрани его в доступном месте.';}catch(_){$('#project-code-text').select();$('#code-transfer-status').textContent='Код выделен. Нажми Ctrl+C или ⌘C.';}});
new ResizeObserver(scalePreview).observe($('#preview-stage'));
$('#preview-frame').addEventListener('load',()=>{if(pendingPreviewFocus){$('#preview-frame').contentWindow.postMessage({channel:'web-lab',nonce:previewNonce,focusPath:pendingPreviewFocus},'*');pendingPreviewFocus=null;}});
window.addEventListener('beforeunload',()=>{flushSource();clearTimeout(saveTimer);persistState();});
renderProjectHeader();

renderEditor(); updatePreview(); updateMissions(); persistState();
