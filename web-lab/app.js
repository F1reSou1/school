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
  fresh: {background:'#ffffff',ink:'#292d33',muted:'#707780',accent:'#dfe3e9',card:'#f2f4f6'},
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
      <section id="interests" class="interests">
        <h2>Мои интересы</h2>
      </section>
      <footer class="site-footer">Моя первая страница · HTML + CSS</footer>
    </main>
  </body>
</html>`;
const INITIAL_CSS = `/* Класс page оформляет всю страницу. Выбери для него фон. */
body {
  margin: 0;
  background: #f1f3f5;
  color: #292d33;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}
* { box-sizing: border-box; }
.page { max-width: 760px; min-height: 100vh; margin: 0 auto; padding: 36px; }
.hero { margin-bottom: 32px; }
h1 { font-size: 38px; line-height: 1.15; margin: 0 0 16px; }
h2 { font-size: 26px; margin: 0 0 20px; }
p { font-size: 16px; margin: 0 0 16px; }
.intro { color: #6b737e; }
.interests { margin-bottom: 32px; }
figure { margin: 0; }
img { max-width: 100%; }
.photo { display: block; width: 420px; max-width: 100%; height: auto; object-fit: contain; border-radius: 0; }
.site-footer { border-top: 1px solid #dfe3e9; padding-top: 16px; color: #757e8b; font-size: 12px; }
`;

const BLOCKS = [
  {key:'h1',tag:'h1',name:'Заголовок',html:'<h1>Мой заголовок</h1>',hint:'h1 — главный заголовок.'},
  {key:'h2',tag:'h2',name:'Подзаголовок',html:'<h2>Мои интересы</h2>',hint:'h2 — заголовок раздела.'},
  {key:'p',tag:'p',name:'Абзац',html:'<p>Несколько слов обо мне.</p>',hint:'p — текст. Для названий и описаний карточек используй разные классы.'},
  {key:'div',tag:'div',name:'Контейнер',html:'<div></div>',hint:'div объединяет вложенные блоки.'},
  {key:'article',tag:'article',name:'Подборка',html:'<article></article>',hint:'article — самостоятельный материал. В упражнении это подборка интересов.'},
  {key:'section',tag:'section',name:'Раздел',html:'<section></section>',hint:'section — раздел с заголовком.'},
  {key:'figure',tag:'figure',name:'Иллюстрация',html:'<figure></figure>',hint:'figure — самостоятельная иллюстрация, например с подписью. Для img эта обёртка необязательна.'},
  {key:'img',tag:'img',name:'Картинка',html:'<img class="photo" src="assets/mountains.jpg" alt="Горные вершины">',hint:'img — изображение. Выбери готовое или отправь фото по QR.'}
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
};
const MISSIONS = WorkshopLesson.lessons;
function newId(){return crypto.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
function freshState(){return {name:'Моя страница',files:{'index.html':INITIAL_HTML,'style.css':INITIAL_CSS},currentFile:'index.html',mode:'blocks',selectedPath:'0.0.0',selectedClass:null,createdClasses:[],flexTouched:[],imagesChosen:[],lastManualFingerprint:null,theme:'fresh',mission:0,lessonStarted:[],lessonActions:[],qrImages:[]};}
function clone(value){return JSON.parse(JSON.stringify(value));}
function hydrate(value){
  const clean=freshState(); if(!value || typeof value!=='object') return clean;
  if(value.files && typeof value.files['index.html']==='string' && typeof value.files['style.css']==='string') clean.files=Object.fromEntries(FILE_ORDER.filter(f=>typeof value.files[f]==='string').map(f=>[f,value.files[f]]));
  for(const field of ['name','currentFile','mode','selectedPath','selectedClass','lastManualFingerprint','theme']) if(typeof value[field]==='string') clean[field]=value[field];
  clean.name=clean.name.slice(0,60)||'Мой сайт';
  for(const field of ['createdClasses','flexTouched','imagesChosen','lessonStarted','lessonActions','qrImages']) if(Array.isArray(value[field])) clean[field]=value[field].filter(v=>typeof v==='string').slice(0,100);
  clean.mission=Math.max(0,Math.min(MISSIONS.length-1,Number(value.mission)||0));
  if(!['index.html','style.css'].includes(clean.currentFile))clean.currentFile='index.html';
  if(!(clean.currentFile in clean.files)) clean.currentFile='index.html';
  if(!THEMES[clean.theme]) clean.theme='fresh';
  if(!['blocks','code'].includes(clean.mode)) clean.mode='blocks';
  return clean;
}
function readLibrary(){
  try {const saved=JSON.parse(localStorage.getItem(BOOK_KEY)||'null'); if(saved?.projects && typeof saved.projects==='object') {
    const projects={}; for(const [id,entry] of Object.entries(saved.projects).slice(0,50)) if(/^[\w-]{6,70}$/.test(id)&&!['__proto__','constructor','prototype'].includes(id)&&entry?.state?.files) projects[id]={id,name:String(entry.name||'Мой сайт').slice(0,60),createdAt:Number(entry.createdAt)||Date.now(),updatedAt:Number(entry.updatedAt)||Date.now(),state:hydrate(entry.state),versions:Array.isArray(entry.versions)?entry.versions.slice(0,6).filter(v=>v?.state?.files).map(v=>({...v,state:hydrate(v.state)})):[]};
    const ids=Object.keys(projects); if(ids.length) {
      let activeId=projects[saved.activeId]?saved.activeId:ids[0];
      if(saved.lessonVersion!==3){const id=newId(),initial=freshState();initial.name='О себе · вводный урок';projects[id]={id,name:initial.name,createdAt:Date.now(),updatedAt:Date.now(),state:initial,versions:[]};activeId=id;}
      return {version:1,lessonVersion:3,activeId,projects};
    }
  }} catch(_) {}
  const id=newId(), book={version:1,lessonVersion:3,activeId:id,projects:{}}; let initial=freshState();
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
const taskPercentages=new Map();
let imageTargetPath=null,galleryFilter='Все';
let transferMode='export',transferBusy=false;
const collapsedNodes=new Set(),expandedEmptyNodes=new Set();
let photoSession=null,photoPollTimer=null,photoGeneration=0;

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
function renderProjectHeader(){$('#project-title').value=state.name;}
function resetView(){collapsedNodes.clear();expandedEmptyNodes.clear();stopPhoneUpload();history=[];cssEnabled=true;inspectMode=false;previewScroll=0;$('#hint-box').hidden=true;state.selectedClass=null;$('#css-toggle').checked=true;$('#inspect-toggle').checked=false;$('#css-toggle').nextElementSibling.textContent='CSS';renderProjectHeader();renderEditor();updatePreview();updateMissions();showTaskIfNeeded();}
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
function mutateHTML(mutator, { select = null, announce = null, refreshTree = true } = {}) {
  flushSource();
  checkpoint(); ensureDraft();
  const doc = parseHTML();
  const result = mutator(doc);
  state.files['index.html'] = serializeHTML(doc);
  if (result instanceof Element) {state.selectedPath=nodePath(result,doc.body);revealPath(state.selectedPath);}
  else if (select !== null) state.selectedPath = select;
  if(announce || result?.tagName==='IMG') pendingPreviewFocus=state.selectedPath;
  if(refreshTree)renderEditor();else renderProperties(doc);
  updatePreview(); updateMissions(); saveDraft();
  if (announce) toast(announce);
}
function flushSource() { if (sourceTimer) { clearTimeout(sourceTimer); sourceTimer = null; commitSource(); } }
function renderEditor() {
  const isHTML = state.currentFile === 'index.html';
  const isBlocks = isHTML && state.mode === 'blocks';
  $('#editor-mode').hidden=false;
  const editorMode=isBlocks?'blocks':state.currentFile==='style.css'?'css':'html';
  document.querySelectorAll('[data-mode]').forEach(el=>{el.classList.toggle('active',el.dataset.mode===editorMode);el.setAttribute('aria-pressed',String(el.dataset.mode===editorMode));});
  $('#builder-panel').hidden = !isBlocks;
  $('#element-properties').hidden = false;
  $('#block-library').hidden = !isBlocks;
  $('#code-panel').hidden = isBlocks;
  $('#class-button').hidden = state.currentFile !== 'style.css';
  $('#code-caption').textContent=state.currentFile==='style.css'?'CSS':'HTML';
  $('#code-hint').innerHTML = state.currentFile === 'style.css' ? 'Класс в CSS начинается с точки: <b>.page</b>. В HTML: <b>class="page"</b>. Измени цвет и посмотри направо.' : state.currentFile === 'script.js' ? 'Попробуй кнопку «Сменить тему» в предпросмотре. Сними флажок «Выбрать элемент», если он включён.' : 'HTML использует открывающие и закрывающие теги: <b>&lt;p&gt;Текст&lt;/p&gt;</b>. Файл стилей подключается через <b>&lt;link&gt;</b>.';
  if (isBlocks) renderTree();
  else { $('#code-editor').value = state.files[state.currentFile]; updateLineNumbers(); renderProperties(); }
  $('#undo-button').disabled = !history.length;
  $('#element-count').textContent = `${parseHTML().body.querySelectorAll('*').length} элементов`;
}
function renderTree(properties = true) {
  const doc = parseHTML();
  function row(node, path, depth) {
    const tag=node.tagName.toLowerCase(),container=CONTAINERS.has(tag),selected=path===state.selectedPath;
    const summary=container?({main:'Страница',header:'Знакомство',section:'Раздел',div:'Блок',figure:'Картинка',footer:'Подпись',article:'Карточка'}[tag]||'Контейнер'):node.textContent.trim()||node.getAttribute('alt')||'Пустой элемент';
    const className=node.getAttribute('class')||'';
    const textNodes=[...node.childNodes].filter(child=>child.nodeType===3&&child.textContent.trim());
    const itemCount=node.children.length+textNodes.length;
    const children=container?[...node.childNodes].map(child=>child.nodeType===1?row(child,nodePath(child,doc.body),depth+1):child.nodeType===3&&child.textContent.trim()?`<div class="direct-text">${escapeHTML(child.textContent.trim())}</div>`:'').join(''):'';
    const collapsed=container&&(collapsedNodes.has(path)||(!node.children.length&&!expandedEmptyNodes.has(path)));
    return `<div class="tree-node ${container?'container-node':''} ${itemCount===0?'empty-node':''} ${collapsed?'scope-collapsed':''}" data-node-path="${path}" style="--level:${depth%4}"><div class="drop-line" data-drop="before" data-path="${path}"></div><div class="block-heading">${container?`<button class="fold-button" data-fold="${path}" aria-expanded="${!collapsed}" aria-label="${collapsed?'Раскрыть':'Свернуть'} ${tag}">${collapsed?'›':'⌄'}</button>`:'<span class="leaf-mark">·</span>'}<div class="block-row ${selected?'selected':''}" draggable="true" data-path="${path}" data-container="${container}" role="group" aria-label="${escapeHTML(tag)}"><button type="button" class="block-select" aria-label="${escapeHTML(tag+': '+summary.slice(0,70))}" aria-pressed="${selected}"><span class="tag-name ${container?'container':''}">&lt;${tag}&gt;</span><span class="node-summary">${escapeHTML(summary)}</span></button><input class="node-class-input" data-class-path="${path}" value="${escapeHTML(className)}" placeholder="класс" aria-label="CSS-классы элемента ${tag}" title="CSS-классы без точки, через пробел. Enter — сохранить, Esc — отменить." autocomplete="off" autocapitalize="off" spellcheck="false">${container?'<span class="scope-inline" aria-hidden="true">{ }</span>':''}<div class="block-row-actions"><button type="button" data-clear-block-classes="${path}" ${className?'':'disabled'}>Снять классы</button><button type="button" data-delete-block="${path}" class="delete-block-button">Удалить блок</button></div></div></div>${container?`<div class="scope-content"><div class="scope-open" data-drop="inside" data-path="${path}" aria-hidden="true">{ </div><div class="scope-body" data-drop="inside" data-path="${path}">${children}<div class="nesting-drop" data-drop="inside" data-path="${path}">+ Вложить в &lt;${tag}&gt;</div></div><div class="scope-close" data-drop="inside" data-path="${path}"><b>}</b><span>&lt;/${tag}&gt;</span></div></div>`:''}<div class="drop-line" data-drop="after" data-path="${path}"></div></div>`;
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
  let fields=editable?`<label>${isList?'Пункты · один на строку':'Содержимое'}${isList||tag==='p'||value.length>80?`<textarea id="property-text" rows="3">${escapeHTML(value)}</textarea>`:`<input id="property-text" value="${escapeHTML(value)}">`}</label>`:'';
  if(container)fields+=`<label>Тег<select id="semantic-tag">${Object.keys(SEMANTICS).map(t=>`<option value="${t}" ${t===tag?'selected':''}>${t} — ${({main:'главное',header:'вступление',section:'раздел',footer:'завершение',figure:'картинка',div:'нейтральный блок',article:'история',nav:'навигация',aside:'дополнение'})[t]}</option>`).join('')}</select></label>`;
  if(tag==='a')fields+=`<label>Адрес ссылки · href<input id="property-href" value="${escapeHTML(node.getAttribute('href')||'')}"></label>`;
  if(tag==='img')fields+=`<img class="image-property-thumb" src="${escapeHTML(node.getAttribute('src')||'')}" alt="Текущая картинка"><button id="property-image" class="image-choose-button">Заменить картинку</button><label>Описание · alt<input id="property-alt" value="${escapeHTML(node.getAttribute('alt')||'')}" placeholder="Что изображено?"></label>`;
  if(tag==='img'){const imageStyle=computedBlockStyle(node);fields+=slider('width','Ширина картинки',parseInt(imageStyle.width)||420,60,420);}
  fields+=`<label>CSS-классы<div class="class-field-row"><input id="property-class" value="${escapeHTML(node.getAttribute('class')||'')}" list="class-list" placeholder="имя класса"><button id="property-new-class" aria-label="Создать CSS-класс" title="Создать общий класс">+</button></div><datalist id="class-list">${findClasses().map(name=>`<option value="${escapeHTML(name)}"></option>`).join('')}</datalist>${validClasses(node).length?`<div class="assigned-classes">${validClasses(node).map(name=>`<span class="assigned-class"><button data-edit-class="${name}">.${name}</button><button class="remove-class-button" data-remove-class="${name}" aria-label="Снять класс ${name} с блока" title="Снять класс с этого блока">Снять</button></span>`).join('')}</div>`:''}</label>`;
  const parents=[...doc.body.querySelectorAll('*')].filter(el=>CONTAINERS.has(el.tagName.toLowerCase())&&el!==node&&!node.contains(el));
  fields+=`<label>Родитель<select id="parent-container"><option value="" ${node.parentElement===doc.body?'selected':''}>body — корень страницы</option>${parents.map(el=>{const path=nodePath(el,doc.body);return `<option value="${path}" ${el===node.parentElement?'selected':''}>${'· '.repeat(path.split('.').length-1)}${el.tagName.toLowerCase()}${el.className?'.'+el.className.trim().split(/\s+/).join('.'):''}</option>`;}).join('')}</select></label>`;
  const theme=THEMES[state.theme],name=activeClass(node),names=validClasses(node),style=name?classStyle(name):computedBlockStyle(node);
  const font=parseInt(style.fontSize)||({h1:46,h2:24,h3:20,span:12}[tag]||16),padding=parseInt(style.padding)||0,radius=parseInt(style.borderRadius)||0;
  const color=hexColor(style.color,theme.ink),background=hexColor(style.backgroundColor,theme.card);
  const styleFields=`<details class="inspector-section" ${container&&state.mission!==0?'':'open'}><summary>Оформление</summary><div class="style-fields"><details class="model-details"><summary>Блочная модель</summary><div class="box-model" aria-label="Блочная модель"><span>margin · снаружи</span><div><span>border · граница</span><div><span>padding · внутри</span><b>Содержимое &lt;${tag}&gt;</b></div></div></div></details><label>Стиль класса<select id="style-rule-target"><option value="">Отдельный стиль блока</option>${names.map(n=>`<option value="${n}" ${n===name?'selected':''}>.${n}</option>`).join('')}</select></label><div id="style-target-note" class="style-target-note">${name?'.'+escapeHTML(name):'Новый класс'}</div>${tag!=='img'?`<div class="field-pair"><label>Текст<div class="color-control"><input type="color" value="${color}" data-style="color" aria-label="Цвет текста"><span>${color}</span></div></label><label>Фон<div class="color-control"><input type="color" value="${background}" data-style="background" aria-label="Цвет фона"><span>${style.backgroundColor==='transparent'?'нет':background}</span></div></label></div>${slider('font-size','Размер текста',font,10,72)}`:''}${slider('padding','Внутренний отступ',padding,0,64)}${slider('border-radius','Скругление',radius,0,40)}${container?slider('width','Ширина блока',parseInt(style.width)||240,100,640):''}${tag!=='img'?selectControl('text-align-control','text-align','Текст',style.textAlign||'left',[['left','Слева'],['center','По центру'],['right','Справа']]):''}${tag==='img'?selectControl('image-ratio-control','aspect-ratio','Пропорции',style.aspectRatio||'auto',[['auto','Исходные'],['16 / 9','16:9'],['1 / 1','1:1'],['3 / 4','3:4']])+selectControl('image-fit-control','object-fit','Вписать картинку',style.objectFit||'contain',[['contain','Целиком'],['cover','Заполнить рамку']]):''}</div></details>`;
  const flexOn=style.display==='flex',direction=style.flexDirection||'row',gap=Number.parseInt(style.gap)||0,justify=style.justifyContent||'flex-start',align=style.alignItems||'stretch';
  const flexFields=container?`<details class="inspector-section" open><summary>Расположение · Flexbox</summary><div class="flex-fields"><label class="checkbox-field"><input id="property-flex-enabled" type="checkbox" ${flexOn?'checked':''}> Включить Flexbox</label><div class="direction-buttons"><button data-direction="row" class="${flexOn&&direction==='row'?'active':''}">↔ В ряд</button><button data-direction="column" class="${flexOn&&direction==='column'?'active':''}">↕ Колонка</button></div>${slider('gap','Расстояние',gap,0,48)}${selectControl('justify-control','justify-content','justify-content · '+(direction==='row'?'↔ горизонталь':'↕ вертикаль'),justify,[['flex-start','В начале'],['center','По центру'],['space-between','Между краями'],['space-evenly','Равномерно'],['flex-end','В конце']])}${selectControl('align-control','align-items','align-items · '+(direction==='row'?'↕ вертикаль':'↔ горизонталь'),align,[['stretch','Растянуть'],['flex-start','В начале'],['center','По центру'],['flex-end','В конце']])}<div class="position-presets"><span>Положение</span><button data-position="center">Центр</button><button data-position="left">Слева</button><button data-position="bottom">Снизу</button></div><label class="checkbox-field"><input id="property-flex-wrap" type="checkbox" ${style.flexWrap==='wrap'?'checked':''}> Перенос · wrap</label></div></details>`:`<div class="flex-parent-link"><button id="jump-to-flex">Расположение у родителя →</button></div>`;
  const trail=[];let ancestor=node;while(ancestor&&ancestor!==doc.body){trail.unshift(`<button data-select-path="${nodePath(ancestor,doc.body)}">${ancestor.tagName.toLowerCase()}</button>`);ancestor=ancestor.parentElement;}
  $('#element-properties').innerHTML=`<nav class="nesting-trail" aria-label="Вложенность выбранного блока">${trail.join('<span>›</span>')}</nav><div class="property-heading"><b>&lt;${tag}&gt;</b><div class="node-actions"><button data-node-action="up" aria-label="Переместить элемент выше">↑</button><button data-node-action="down" aria-label="Переместить элемент ниже">↓</button><button data-node-action="duplicate" aria-label="Дублировать элемент">⧉</button><button data-node-action="delete" class="delete-block-button" aria-label="Удалить блок">Удалить блок</button></div></div>${container&&state.mission===2?flexFields:''}<div class="property-fields">${fields}</div>${styleFields}${container&&state.mission===2?'':flexFields}`;
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
  if(live){if(state.mode==='blocks'&&state.currentFile==='index.html')renderTree(false);const note=$('#style-target-note');if(note)note.textContent='.'+name;clearTimeout(previewTimer);previewTimer=setTimeout(updatePreview,75);}
  else {renderEditor();updatePreview();}
  updateMissions();saveDraft();
}
function selectPath(path,userAction=false,{keepTree=false}={}){if(userAction){const node=resolvePath(parseHTML(),path);if(node?.matches('main.page')&&!state.lessonActions.includes('page-selected'))state.lessonActions.push('page-selected');}revealPath(path);state.selectedPath=path;state.selectedClass=null;state.currentFile='index.html';state.mode='blocks';if(keepTree){document.querySelectorAll('.block-row').forEach(row=>{const selected=row.dataset.path===path;row.classList.toggle('selected',selected);row.querySelector('.block-select')?.setAttribute('aria-pressed',String(selected));});renderProperties();}else renderEditor();const row=$('.block-row[data-path="'+path+'"]');row?.scrollIntoView({block:'nearest',behavior:'smooth'});updateMissions();saveDraft();}

function commitBlockClass(input){
  const path=input.dataset.classPath,value=input.value.trim();
  const node=resolvePath(parseHTML(),path);
  if(!node||value===(node.getAttribute('class')||''))return;
  state.selectedClass=null;
  mutateHTML(doc=>{const target=resolvePath(doc,path);if(value)target.setAttribute('class',value);else target.removeAttribute('class');return target;},{refreshTree:false});
  input.value=value;
  input.closest('.block-row').querySelector('[data-clear-block-classes]').disabled=!value;
}
function jumpToFlex(){
  const doc=parseHTML(),selected=resolvePath(doc,state.selectedPath);
  const parent=selected?.parentElement;
  const node=parent&&CONTAINERS.has(parent.tagName.toLowerCase())?parent:doc.querySelector('.hero_img')||doc.querySelector('img')?.parentElement;
  if(node)selectPath(nodePath(node,doc.body));
}
function missionAction(){
  flushSource();
  const doc=parseHTML(),checks=lessonChecks(doc)[state.mission];
  const next=WorkshopLesson.progress(checks).next;
  if(!next)return;
  let node=next.node||doc.querySelector(next.selector||'');
  if(!node)node=doc.querySelector(state.mission===0?'main.page':state.mission===1?'header.hero':'section#interests,section.interests');
  if(node)selectPath(nodePath(node,doc.body));
  if(next.styleClass&&node?.classList.contains(next.styleClass)){
    state.selectedClass=next.styleClass;renderProperties();
    const target=$('#style-rule-target');target?.closest('details')?.setAttribute('open','');
    target?.focus({preventScroll:true});
  }
  if(next.flex){$('#property-flex-enabled')?.closest('details')?.setAttribute('open','');$('#property-flex-enabled')?.focus({preventScroll:true});}
  if(next.action==='qr'&&node){openGallery();startPhoneUpload();}
}

function openGallery(){flushSource();stopPhoneUpload();imageTargetPath=state.selectedPath;galleryFilter='Все';$('#image-upload-status').textContent='';renderGallery();$('#gallery-dialog').showModal();}
function renderGallery(){
  $('#gallery-filters').innerHTML=['Все','Природа','Космос','Увлечения'].map(category=>`<button data-gallery-filter="${category}" class="${category===galleryFilter?'active':''}" aria-pressed="${category===galleryFilter}">${category}</button>`).join('');
  $('#gallery-grid').innerHTML=IMAGES.filter(item=>galleryFilter==='Все'||item.category===galleryFilter).map(item=>`<button class="gallery-item" data-image="${item.id}" aria-label="Выбрать: ${item.title}"><img src="${new URL(item.file,location.href).href}" alt="${item.alt}" width="240" height="160"><span>${item.title}</span></button>`).join('');
}

function installImage(source,alt,id){
  mutateHTML(doc=>{
    let node=resolvePath(doc,imageTargetPath);
    if(node?.tagName!=='IMG'){
      let target=node;
      if(!target||!CONTAINERS.has(target.tagName.toLowerCase()))target=node?.parentElement||defaultContainer(doc);
      if(!CONTAINERS.has(target.tagName.toLowerCase()))target=defaultContainer(doc);
      const existing=[...target.children].find(child=>child.tagName==='IMG');
      node=existing||doc.createElement('img');
      if(!existing){node.className='photo';target.append(node);}
    }
    node.setAttribute('src',source);node.alt=alt;
    if(id.startsWith('phone-')){const key=WorkshopLesson.photoKey(source);if(!state.qrImages.includes(key))state.qrImages.push(key);}
    if(!state.imagesChosen.includes(id))state.imagesChosen.push(id);
    return node;
  });
  $('#gallery-dialog').close();toast('Картинка внутри блока. Попробуй изменить её ширину и положение.');
}
function chooseImage(id){const image=IMAGES.find(item=>item.id===id);if(image)installImage(image.file,image.alt,id);}

function stopPhoneUpload(){
  photoGeneration++;clearTimeout(photoPollTimer);
  if(photoSession){fetch(photoSession.poll_url,{method:'DELETE'}).catch(()=>{});photoSession=null;}
  $('#phone-upload-panel').hidden=true;$('#phone-upload-button').disabled=false;
}
async function startPhoneUpload(){
  stopPhoneUpload();const generation=photoGeneration,projectId=library.activeId;
  $('#image-upload-status').textContent='';
  $('#phone-upload-panel').hidden=false;$('#phone-upload-status').textContent='Создаём QR-код…';$('#phone-qr').hidden=true;$('#phone-upload-link').hidden=true;$('#phone-upload-button').disabled=true;
  let expires=0;
  try{
    const response=await fetch('/api/photo-sessions',{method:'POST'});
    let session;
    try{session=await response.json();}catch{}
    if([404,405,501].includes(response.status))throw new Error(`Сервис передачи фото не подключён к этому сайту (HTTP ${response.status}). Сообщи преподавателю.`);
    if(!response.ok)throw new Error(session?.error||`Сервер передачи фото вернул ошибку (HTTP ${response.status}). Попробуй ещё раз.`);
    if(!session?.upload_url||!session?.poll_url||!session?.qr_url||!(session.expires_in>0))throw new Error('Вместо сервиса передачи фото открылась обычная страница. Сообщи преподавателю.');
    if(generation!==photoGeneration){fetch(session.poll_url,{method:'DELETE'}).catch(()=>{});return;}
    photoSession=session;expires=Date.now()+session.expires_in*1000;
    $('#phone-qr').src=session.qr_url;$('#phone-qr').hidden=false;
    $('#phone-upload-link').href=session.upload_url;$('#phone-upload-link').textContent='Открыть страницу загрузки';$('#phone-upload-link').hidden=false;
    $('#phone-upload-status').textContent='Отсканируй QR и выбери фото на телефоне. Ссылка действует 10 минут.';
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
        if(++failures>=3){stopPhoneUpload();$('#image-upload-status').textContent='Связь прервалась. Создай QR ещё раз или выбери готовую картинку.';return;}
      }
      photoPollTimer=setTimeout(poll,1200);
    };
    photoPollTimer=setTimeout(poll,1200);
  }catch(error){if(generation===photoGeneration){stopPhoneUpload();$('#image-upload-status').textContent=error instanceof TypeError?'Не удалось связаться с сервером передачи фото. Проверь подключение и попробуй ещё раз.':error.message;}}
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
    mutateHTML((updated) => { const node = resolvePath(updated, fromPath); placeNode(updated, node, target.path, target.position); return node; }, { announce: 'Блок перемещён. Вкладка HTML показывает новую структуру.' });
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
function nodeAction(action,path=state.selectedPath) {
  const doc = parseHTML(); const selected = resolvePath(doc, path); if (!selected) return;
  if (action === 'up' && !selected.previousElementSibling || action === 'down' && !selected.nextElementSibling) { toast('Это уже крайний элемент в своём контейнере.'); return; }
  mutateHTML((updated) => {
    const node = resolvePath(updated, path);
    if (action === 'delete') { const parent = node.parentElement; node.remove(); state.selectedPath = parent === updated.body ? null : nodePath(parent, updated.body); return null; }
    if (action === 'duplicate') { const copy = node.cloneNode(true); copy.querySelectorAll('[id]').forEach((item) => item.removeAttribute('id')); copy.removeAttribute('id'); node.after(copy); return copy; }
    if (action === 'up') node.previousElementSibling.before(node);
    if (action === 'down') node.nextElementSibling.after(node);
    return node;
  });
  if(action==='delete')toast('Блок удалён. Кнопка ↶ вверху редактора вернёт его.');
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
  const suggested=state.mission===1?(['FIGURE','IMG'].includes(node?.tagName)?'hero_img':'hero_item'):state.mission===2?(node?.tagName==='ARTICLE'?'interesting':node?.tagName==='P'?'interesting_title':'interesting_card'):'my-style';
  $('#class-name').value=existing||suggested;
  if (state.createdClasses.includes(existing)) {
    classEditingName = existing;
    const rule = state.files['style.css'].match(new RegExp(`\\.${existing}\\s*\\{([^}]*)\\}`));
    const temp = document.createElement('div'); temp.style.cssText = rule?.[1] || '';
    function colorHex(value, fallback) { const m = value.match(/\d+/g); return m?.length >= 3 ? '#' + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('') : /^#[\da-f]{6}$/i.test(value) ? value : fallback; }
    $('#class-color').value = colorHex(temp.style.color, '#243246'); $('#class-background').value = colorHex(temp.style.backgroundColor, '#dff5eb'); $('#class-padding').value = parseInt(temp.style.padding) || 20; $('#class-radius').value = parseInt(temp.style.borderRadius) || 16; $('#class-size').value = parseInt(temp.style.fontSize) || 16;
  } else { $('#class-color').value = '#20252b'; $('#class-background').value = '#f1f3f5'; $('#class-padding').value = 20; $('#class-radius').value = 16; $('#class-size').value = 16; }
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
function lessonChecks(doc=parseHTML()){
  return WorkshopLesson.checks(doc,(node,name)=>name?classStyle(name):computedBlockStyle(node),state);
}
function completion(){return lessonChecks().map(items=>WorkshopLesson.progress(items).complete);}
function updateMissions(){
  const groups=lessonChecks(),progress=groups.map(WorkshopLesson.progress),current=progress[state.mission],mission=MISSIONS[state.mission];
  $('#progress-count').textContent=`${progress.filter(item=>item.complete).length} / ${MISSIONS.length}`;
  $('#mission-nav').innerHTML=MISSIONS.map((item,i)=>{
    const locked=i>0&&!progress.slice(0,i).every(step=>step.complete);
    return `<button class="${i===state.mission?'active':''} ${progress[i].complete?'done':''}" data-mission="${i}" ${locked?'disabled title="Сначала заверши предыдущую задачу"':''} aria-current="${i===state.mission?'step':'false'}"><span>${progress[i].complete?'✓':i+1}</span>${item.short}<small>${progress[i].percent}%</small></button>`;
  }).join('');
  $('#mission-number').textContent=String(state.mission+1);
  $('#mission-title').textContent=mission.title;$('#mission-description').textContent=mission.description;
  $('#task-percent').textContent=current.percent+'%';
  $('#task-progress').value=current.percent;$('#task-progress').setAttribute('aria-label',`Задача ${state.mission+1}: ${current.percent}%`);
  $('#task-count').textContent=`${current.done} из ${current.total} действий`;
  const earlierIncomplete=progress.findIndex((item,i)=>i<state.mission&&!item.complete);
  const status=current.complete?(earlierIncomplete>=0?`Эта задача выполнена. Вернись к задаче ${earlierIncomplete+1}: в ней остались незавершённые шаги.`:state.mission<MISSIONS.length-1?'Задача выполнена! Можно переходить к следующей.':'Все три задачи выполнены! Сохрани страницу и посмотри результат.'):current.next.label;
  $('#next-step').textContent=status;
  $('#next-step-label').textContent=current.complete?'Отлично!':'Следующий шаг';
  $('#task-success').hidden=!current.complete;
  $('#task-success').textContent=current.complete?'Поздравляем, 100%! '+status:'';
  $('#mission-action-button').hidden=current.complete;
  $('#check-button').textContent=current.complete?(earlierIncomplete>=0?`К задаче ${earlierIncomplete+1}`:state.mission<MISSIONS.length-1?'Следующая задача →':'Сохранить страницу'):'Проверить';
  $('#task-checklist').innerHTML=groups[state.mission].map(item=>`<li class="${item.done?'done':''}"><span aria-hidden="true">${item.done?'✓':'○'}</span>${escapeHTML(item.label)}</li>`).join('');
  if(!$('#hint-box').hidden)$('#hint-box').textContent=mission.hint;
  const key=library.activeId+':'+state.mission,previous=taskPercentages.get(key);
  taskPercentages.set(key,current.percent);
  if(previous!==undefined&&previous<100&&current.complete)toast(`Поздравляем! Задача ${state.mission+1} выполнена на 100%. ${progress.every(item=>item.complete)?'Все задачи пройдены.':earlierIncomplete>=0?'Проверь предыдущие задачи.':'Можно переходить к следующей.'}`);
}
function openTaskTheory(){
  const mission=MISSIONS[state.mission];
  $('#theory-step').textContent=`Задача ${state.mission+1} из ${MISSIONS.length}`;
  $('#theory-title').textContent=mission.title;
  $('#theory-content').innerHTML=mission.theory;
  $('#theory-task').innerHTML=mission.task.map(text=>`<li>${escapeHTML(text)}</li>`).join('');
  $('#theory-sources').innerHTML=mission.sources.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener">${escapeHTML(name)}</a>`).join('');
  $('#theory-start').textContent=state.lessonStarted.includes(String(state.mission))?'Вернуться к задаче':'Начать задачу';
  $('#theory-dialog').showModal();$('#theory-dialog').scrollTop=0;
}
function showTaskIfNeeded(){if(!state.lessonStarted.includes(String(state.mission)))openTaskTheory();}
function startTask(){
  const id=String(state.mission);if(!state.lessonStarted.includes(id))state.lessonStarted.push(id);
  $('#theory-dialog').close();saveDraft();missionAction();
}
function enterMission(index){
  flushSource();
  if(index>0&&!completion().slice(0,index).every(Boolean)){toast('Сначала заверши предыдущую задачу.');return;}
  state.mission=index;$('#hint-box').hidden=true;updateMissions();saveDraft();openTaskTheory();
}
function checkMission(){
  flushSource();updateMissions();const result=WorkshopLesson.progress(lessonChecks()[state.mission]);
  if(!result.complete){$('#hint-box').hidden=false;updateMissions();toast(`Выполнено ${result.percent}%. Следующий шаг: ${result.next.label}`);return;}
  const earlier=completion().findIndex((done,i)=>i<state.mission&&!done);
  if(earlier>=0){enterMission(earlier);return;}
  if(state.mission<MISSIONS.length-1)enterMission(state.mission+1);
  else saveProject();
}

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
function scalePreview(){const stage=$('#preview-stage');if(!stage?.clientWidth)return;const width=720,scale=Math.min(1,stage.clientWidth/width),frame=$('#preview-frame');frame.style.width=width+'px';frame.style.height=(stage.clientHeight/scale)+'px';frame.style.transform='scale('+scale+')';frame.style.left=Math.max(0,(stage.clientWidth-width*scale)/2)+'px';}
function updatePreview(){clearTimeout(previewTimer);$('#script-error').hidden=true;previewNonce=newId();$('#preview-frame').srcdoc=buildPreview(state.files);scalePreview();}
window.addEventListener('message',event=>{if(event.source!==$('#preview-frame').contentWindow||event.data?.channel!=='web-lab'||event.data.nonce!==previewNonce)return;
  if(event.data.type==='select')selectPath(event.data.path,true);
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
$('#library-items').innerHTML=BLOCKS.map(libraryButton).join('');
document.addEventListener('click',event=>{
  const target=event.target;
  if(target.closest('[data-class-path]'))return;
  const clearClasses=target.closest('[data-clear-block-classes]');
  if(clearClasses){const input=clearClasses.closest('.block-row').querySelector('[data-class-path]');input.value='';commitBlockClass(input);toast('Классы сняты с блока. Их стили доступны другим блокам.');return;}
  const deleteBlock=target.closest('[data-delete-block]');if(deleteBlock){nodeAction('delete',deleteBlock.dataset.deleteBlock);return;}
  const removeClass=target.closest('[data-remove-class]');
  if(removeClass){mutateHTML(doc=>{const node=resolvePath(doc,state.selectedPath);node.classList.remove(removeClass.dataset.removeClass);if(!node.classList.length)node.removeAttribute('class');return node;});toast('Класс снят с блока.');return;}
  const mode=target.closest('[data-mode]');if(mode){flushSource();state.currentFile=mode.dataset.mode==='css'?'style.css':'index.html';state.mode=mode.dataset.mode==='blocks'?'blocks':'code';renderEditor();saveDraft();}
  const fold=target.closest('[data-fold]');if(fold){const path=fold.dataset.fold;if(fold.getAttribute('aria-expanded')==='true'){collapsedNodes.add(path);expandedEmptyNodes.delete(path);}else{collapsedNodes.delete(path);expandedEmptyNodes.add(path);}renderTree();return;}
  const crumb=target.closest('[data-select-path]');if(crumb)selectPath(crumb.dataset.selectPath,true);
  const preset=target.closest('[data-position]');if(preset){const node=resolvePath(parseHTML(),state.selectedPath),column=styleValue(node,'flex-direction','row')==='column';const positions={center:['center','center'],left:column?['center','flex-start']:['flex-start','center'],bottom:column?['flex-end','center']:['center','flex-end']};const [justify,align]=positions[preset.dataset.position];applyStyles({display:'flex','justify-content':justify,'align-items':align});}
  const row=target.closest('.block-row');if(row&&!dragPayload)selectPath(row.dataset.path,true);
  const block=target.closest('[data-block]');if(block&&!dragPayload){if(block.dataset.block==='img')openGallery();else addBlock(block.dataset.block);}
  const action=target.closest('[data-node-action]');if(action)nodeAction(action.dataset.nodeAction);
  const mission=target.closest('[data-mission]');if(mission&&!mission.disabled)enterMission(Number(mission.dataset.mission));
  const close=target.closest('[data-close]');if(close)$('#'+close.dataset.close).close();
  const direction=target.closest('[data-direction]');if(direction)applyStyles({'display':'flex','flex-direction':direction.dataset.direction,'gap':styleValue(resolvePath(parseHTML(),state.selectedPath),'gap','16px'),'flex-wrap':'wrap'});
  const editClass=target.closest('[data-edit-class]');if(editClass){state.selectedClass=editClass.dataset.editClass;if(state.selectedClass==='page'&&!state.lessonActions.includes('page-selected'))state.lessonActions.push('page-selected');renderProperties();$('#style-rule-target')?.closest('details')?.setAttribute('open','');updateMissions();saveDraft();}
  if(target.closest('#property-new-class'))openClassDialog();
  if(target.closest('#property-image'))openGallery();
  if(target.closest('#jump-to-flex'))jumpToFlex();
  const filter=target.closest('[data-gallery-filter]');if(filter){galleryFilter=filter.dataset.galleryFilter;renderGallery();}
  const image=target.closest('[data-image]');if(image)chooseImage(image.dataset.image);
  const project=target.closest('[data-open-project]');if(project)openProject(project.dataset.openProject);
  const version=target.closest('[data-version-project]');if(version)restoreVersion(version.dataset.versionProject,Number(version.dataset.version));
});
$('#block-tree').addEventListener('focusin',event=>{const input=event.target.closest('[data-class-path]');if(!input)return;input.closest('.block-row').draggable=false;selectPath(input.dataset.classPath,true,{keepTree:true});});
$('#block-tree').addEventListener('focusout',event=>{const input=event.target.closest('[data-class-path]');if(input)input.closest('.block-row').draggable=true;});
$('#block-tree').addEventListener('change',event=>{if(event.target.matches('[data-class-path]'))commitBlockClass(event.target);});
$('#block-tree').addEventListener('keydown',event=>{
  const input=event.target.closest('[data-class-path]');
  if(input){
    if(event.isComposing)return;
    if(event.key==='Enter'){event.preventDefault();commitBlockClass(input);}
    if(event.key==='Escape'){event.preventDefault();input.value=resolvePath(parseHTML(),input.dataset.classPath)?.getAttribute('class')||'';input.closest('.block-row').querySelector('.block-select').focus();}
    return;
  }
});

document.addEventListener('dragstart', (event) => {
  if(event.target.closest('[data-class-path]'))return;
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
  if (event.target.closest('[data-class-path],[data-clear-block-classes],[data-delete-block]')) return;
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
  if(target.id.startsWith('property-')&&!['property-class','property-flex-enabled','property-flex-wrap'].includes(target.id))applyProperty(target.id,target.value);
  if(target.dataset.style&&target.tagName!=='SELECT'){const value=target.value+(target.dataset.unit||'');if(target.type==='range'){const output=target.closest('label').querySelector('output');if(output)output.textContent=value.replace('px',' px');applyStyles({[target.dataset.style]:value},true);}else{const text=target.parentElement.querySelector('span');if(text)text.textContent=target.value;applyStyles({[target.dataset.style]:value},true);}}
});
$('#element-properties').addEventListener('change',event=>{
  const target=event.target;
  if(target.id==='property-class')applyProperty(target.id,target.value);
  if(target.id==='semantic-tag')applyProperty(target.id,target.value);
  if(target.id==='parent-container'){const path=target.value;mutateHTML(doc=>{const node=resolvePath(doc,state.selectedPath),parent=path?resolvePath(doc,path):doc.body;if(!node||!parent||node===parent||node.contains(parent))return;parent.append(node);return node;},{announce:'Вложенность изменена. Посмотри на скобки в структуре.'});}
  if(target.id==='style-rule-target'){state.selectedClass=target.value||'__own__';if(target.value==='page'&&resolvePath(parseHTML(),state.selectedPath)?.matches('main.page')&&!state.lessonActions.includes('page-selected'))state.lessonActions.push('page-selected');renderProperties();$('#style-rule-target')?.closest('details')?.setAttribute('open','');updateMissions();saveDraft();}
  if(target.dataset.style){applyStyles({[target.dataset.style]:target.value+(target.dataset.unit||'')});}
  if(target.id==='property-flex-enabled')applyStyles(target.checked?{display:'flex','flex-direction':'row',gap:'16px','flex-wrap':'wrap'}:{display:'block'});
  if(target.id==='property-flex-wrap')applyStyles({'flex-wrap':target.checked?'wrap':'nowrap'});
});
$('#code-editor').addEventListener('input',()=>{updateLineNumbers();clearTimeout(sourceTimer);sourceTimer=setTimeout(commitSource,350);});
$('#code-editor').addEventListener('scroll',()=>$('#line-numbers').scrollTop=$('#code-editor').scrollTop);
$('#code-editor').addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();const el=event.target;el.setRangeText('  ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input'));}});
$('#undo-button').addEventListener('click',()=>{flushSource();if(!history.length)return;state=hydrate(JSON.parse(history.pop()));renderProjectHeader();renderEditor();updatePreview();updateMissions();saveDraft();toast('Последнее изменение отменено.');});
$('#class-button').addEventListener('click',openClassDialog);
$('#class-form').addEventListener('input',updateClassSample);
$('#class-form').addEventListener('submit',saveClass);
$('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());
$('#hint-button').addEventListener('click',()=>{$('#hint-box').hidden=!$('#hint-box').hidden;updateMissions();if(!$('#hint-box').hidden)$('#hint-box').scrollIntoView({behavior:'smooth',block:'nearest'});});
$('#mission-action-button').addEventListener('click',missionAction);
$('#theory-button').addEventListener('click',openTaskTheory);
$('#theory-start').addEventListener('click',startTask);
$('#theory-dialog').addEventListener('cancel',event=>{event.preventDefault();startTask();});
$('#check-button').addEventListener('click',checkMission);
$('#inspect-toggle').addEventListener('change',event=>{inspectMode=event.target.checked;updatePreview();if(inspectMode)toast('Нажми на блок в странице — справа откроются его настройки.');});
$('#css-toggle').addEventListener('change',event=>{cssEnabled=event.target.checked;updatePreview();$('#css-toggle').nextElementSibling.textContent='CSS';toast(cssEnabled?'Оформление вернулось.':'Осталась структура HTML — элементы существуют без оформления.');});
$('#refresh-button').addEventListener('click',()=>{flushSource();updatePreview();});
$('#gallery-button').addEventListener('click',openGallery);
$('#phone-upload-button').addEventListener('click',startPhoneUpload);
$('#gallery-dialog').addEventListener('close',stopPhoneUpload);
$('#save-button').addEventListener('click',saveProject);
$('#project-title').addEventListener('input',event=>{state.name=event.target.value.trim().slice(0,60)||'Мой сайт';saveDraft();});
$('#projects-button').addEventListener('click',renderProjects);
$('#create-project-button').addEventListener('click',createProject);
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

renderEditor(); updatePreview(); updateMissions(); persistState();showTaskIfNeeded();
