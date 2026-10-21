'use strict';
/* Lesson content and result checks. The editor calls this on every change. */
window.WorkshopLesson = (() => {
  const lessons = [
    {
      short: 'HTML и CSS', title: 'Знакомство со страницей',
      description: 'Выбери main.page, задай фон классу page, впиши имя в h1 и замени текст знакомства.',
      theory: `<h3>HTML — содержимое и структура</h3><p>HTML — язык разметки. Теги говорят браузеру, где заголовок, абзац или картинка. <code>&lt;h1&gt;Привет, я Саша&lt;/h1&gt;</code> — главный заголовок с открывающим и закрывающим тегом.</p><h3>Блоки и вложенность</h3><p>Элемент занимает область на странице. Контейнер может включать другие элементы: это его дети. В редакторе скобки <code>{ }</code> показывают границы контейнера. В HTML эту границу задаёт пара тегов.</p><h3>CSS и классы</h3><p>CSS задаёт цвет, размер, отступы и расположение. Класс — имя для общего оформления. В HTML пишем <code>class="page"</code>, в CSS — <code>.page { background: #eef2f7; }</code>. Точка нужна только в CSS. Изменение правила затронет все элементы с этим классом.</p><pre>&lt;main class="page"&gt;\n  &lt;h1&gt;Привет, я Саша&lt;/h1&gt;\n  &lt;p&gt;Люблю музыку и прогулки.&lt;/p&gt;\n&lt;/main&gt;</pre>`,
      task: ['Нажми main в дереве блоков.', 'В «Оформление → Стиль класса» выбери .page и поменяй фон.', 'Выбери h1 и впиши своё имя или имя героя.', 'Выбери абзац p в header.hero и замени текст знакомства.'],
      hint: 'Выбери main.page → «Оформление» → класс .page → «Фон». Затем отредактируй h1 и p через поле «Содержимое».',
      sources: [['HTML и семантика · MDN','https://developer.mozilla.org/en-US/docs/Glossary/Semantics']]
    },
    {
      short: 'Блоки и классы', title: 'Собери вступление из двух блоков',
      description: 'Внутри hero объедини h1 и p в div.hero_item. Рядом создай figure.hero_img, отправь фото по QR и настрой его.',
      theory: `<h3>Семантика: тег обозначает смысл</h3><p>Смысловые теги помогают скринридерам, которыми пользуются незрячие люди, находить разделы и заголовки. Поисковым роботам они тоже помогают понимать структуру. Оформление при этом задаёт CSS.</p><dl class="semantic-list"><dt>main</dt><dd>Главное содержимое страницы. Обычно одно.</dd><dt>header</dt><dd>Вступление: здесь имя и знакомство.</dd><dt>section + h2</dt><dd>Раздел с заголовком, например «Мои интересы».</dd><dt>article</dt><dd>Самостоятельный материал. В упражнении — подборка интересов.</dd><dt>div</dt><dd>Нейтральный контейнер для группировки и расположения.</dd><dt>figure + img</dt><dd>Иллюстрация и сама картинка. Атрибут alt описывает значимое изображение.</dd><dt>h1, h2, p</dt><dd>Главный заголовок, заголовок раздела и обычный абзац.</dd><dt>footer</dt><dd>Завершение страницы: подпись автора.</dd></dl><h3>БЭМ — блок, элемент, модификатор</h3><p>Понятные имена классов показывают связь частей: блок <code>hero</code>, его элемент <code>hero__item</code>, вариант <code>hero__item--wide</code>. Это один из распространённых способов записи БЭМ. Классы помогают разработчикам; смысл для скринридера задают теги, а не названия классов.</p><p>В этом упражнении используем заданные короткие имена с одним подчёркиванием: <code>hero_item</code> и <code>hero_img</code>. Это учебные имена, а не стандартная запись элемента БЭМ через <code>__</code>.</p><pre>header.hero {\n  div.hero_item { h1, p }\n  figure.hero_img { img }\n}</pre>`,
      task: ['Выбери header.hero и добавь «Контейнер» (div). Назначь класс hero_item.', 'Перемести существующие h1 и p внутрь hero_item: перетащи их или измени «Родитель».', 'В том же hero создай «Блок картинки» (figure), назначь класс hero_img.', 'Выбери figure.hero_img → «Картинка» → «С телефона по QR». Отправь своё фото.', 'Выбери img, напиши описание alt и настрой ширину, скругление или пропорции.'],
      hint: 'Сначала выдели header.hero, чтобы новый блок оказался внутри него. Классы вводятся без точки. Для переноса h1 и p используй поле «Родитель». Фото добавляй в figure.hero_img.',
      sources: [['Именование БЭМ','https://getbem.com/naming/'],['Семантика · MDN','https://developer.mozilla.org/en-US/docs/Glossary/Semantics']]
    },
    {
      short: 'Flexbox и карточки', title: 'Расположи вступление и собери интересы',
      description: 'Поставь текст и фото в hero в строку. В «Мои интересы» добавь article.interesting с четырьмя карточками: два абзаца и картинка в каждой.',
      theory: `<h3>Flexbox работает у родителя</h3><p><code>display: flex</code> включает расположение прямых детей. У <code>header.hero</code> это <code>hero_item</code> и <code>hero_img</code>. Режим <code>row</code> ставит их в строку, <code>column</code> — в колонку.</p><h3>Две оси и расстояние</h3><p>В строке <code>justify-content</code> распределяет детей по горизонтали, <code>align-items</code> — по вертикали. В колонке оси меняются местами. <code>gap</code> задаёт расстояние между детьми, <code>wrap</code> разрешает перенос на новую строку.</p><pre>.hero {\n  display: flex;\n  flex-direction: row;\n  gap: 24px;\n  align-items: center;\n}\n.photo { width: 220px; }</pre><h3>Общий класс — одинаковое оформление</h3><p>В <code>article.interesting</code> создай четыре контейнера. У каждой карточки — два абзаца <code>p</code>: название с классом <code>interesting_title</code> и описание с классом <code>interesting_description</code>, а также картинка.</p><p>Назначь всем четырём карточкам один общий класс (например, <code>interesting_card</code>). Заголовки оформляй через <code>.interesting_title</code>, описания — через <code>.interesting_description</code>. Тогда одно изменение CSS обновит все четыре карточки.</p><pre>section.interests {\n  h2 «Мои интересы»\n  article.interesting {\n    div.interesting_card {\n      p.interesting_title\n      p.interesting_description\n      img\n    }\n    … ещё 3 карточки\n  }\n}</pre>`,
      task: ['Выбери header.hero, включи Flexbox и направление «В ряд».', 'Выбери фото и уменьши ширину до 240 px или меньше, чтобы оно помещалось рядом с текстом.', 'В section «Мои интересы» добавь пустой article, назначь класс interesting.', 'Внутри article создай четыре div с одним общим классом, например interesting_card.', 'В каждую карточку добавь два p: interesting_title и interesting_description. Заполни их своим текстом и вставь картинку.', 'Настрой общий класс карточек и оба текстовых класса. Карточки с одним классом оформятся одинаково.'],
      hint: 'Удобно собрать и оформить первую карточку, затем дублировать её три раза кнопкой ⧉. В копиях замени текст и картинки. В выборе «Стиль класса» меняй общий класс, чтобы стиль применялся ко всем карточкам.',
      sources: [['Flexbox · MDN','https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts']]
    }
  ];
  function photoKey(source){let hash=2166136261;for(let i=0;i<source.length;i++){hash^=source.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(36);}
  const text = node => node?.textContent.trim() || '';
  const own = node => text(node).length > 0 && !['Привет, я …','Привет, я Саша.','Мой заголовок','Несколько слов обо мне.','Напиши пару слов о себе или о придуманном герое.','Название карточки','Напиши пару предложений о себе.'].includes(text(node));
  const child = (node,selector) => [...(node?.children||[])].find(el=>el.matches(selector));
  function checks(doc, getStyle, state) {
    const main=doc.querySelector('main.page'),hero=main?.querySelector('header.hero'),heading=hero?.querySelector('h1'),intro=hero?.querySelector('p');
    const item=child(hero,'div.hero_item'),figure=child(hero,'figure.hero_img,div.hero_img'),image=figure?.querySelector('img');
    const section=main?.querySelector('section#interests,section.interests')||[...(main?.querySelectorAll('section')||[])].find(el=>/интерес/i.test(text(el.querySelector('h2'))));
    const article=child(section,'article.interesting'),cards=[...(article?.children||[])].filter(el=>el.matches('div'));
    const style=node=>node?getStyle(node):document.createElement('div').style;
    const pageStyle=style(main),imageStyle=style(image),heroStyle=style(hero);
    const row = (id,label,done,selector,extra={}) => ({id,label,done:Boolean(done),selector,...extra});
    const qr = Boolean(image?.getAttribute('src')?.startsWith('data:image/')&&state.qrImages?.includes(photoKey(image.getAttribute('src'))));
    const configured = image&&(parseFloat(imageStyle.width)!==420&&Boolean(imageStyle.width)||parseFloat(imageStyle.borderRadius)>0||imageStyle.aspectRatio&&imageStyle.aspectRatio!=='auto');
    const groups = [
      [
        row('page-select','Выбери main и класс page.',main&&state.lessonActions?.includes('page-selected'),'main.page',{styleClass:'page'}),
        row('page-background','У класса page задай фон.',main&&Boolean(pageStyle.backgroundColor)&&!['transparent','rgba(0, 0, 0, 0)'].includes(pageStyle.backgroundColor),'main.page',{styleClass:'page'}),
        row('name','В h1 впиши своё имя или имя героя.',own(heading),'header.hero h1'),
        row('intro','Замени текст абзаца о себе.',own(intro),'header.hero p')
      ],
      [
        row('hero-item','В hero создай div с классом hero_item.',item,'header.hero'),
        row('hero-text','Перемести h1 и p внутрь hero_item.',item&&child(item,'h1')&&child(item,'p')&&hero?.querySelectorAll('h1').length===1,'header.hero'),
        row('hero-img','Рядом создай figure с классом hero_img.',figure,'header.hero'),
        row('qr','Добавь в hero_img своё фото через QR.',qr,'header.hero .hero_img',{action:'qr'}),
        row('alt','Напиши описание фото в alt.',image?.alt.trim()&&!['Моя картинка с телефона','Моя картинка'].includes(image.alt.trim()),'header.hero .hero_img img'),
        row('photo-settings','Настрой ширину, пропорции или скругление фото.',configured,'header.hero .hero_img img')
      ],
      [
        row('hero-row','У hero включи Flexbox и направление «В ряд».',item&&figure&&heroStyle.display==='flex'&&['','row'].includes(heroStyle.flexDirection),'header.hero',{flex:true}),
        row('photo-small','Уменьши фото до 240 px или меньше.',image&&parseFloat(imageStyle.width)>0&&parseFloat(imageStyle.width)<=240,'header.hero .hero_img img'),
        row('interests-article','В «Мои интересы» создай article.interesting.',article,'section#interests,section.interests')
      ]
    ];
    // Each card contributes separately; one finished card never completes all four.
    for(let i=0;i<4;i++){
      const card=cards[i],title=child(card,'p.interesting_title'),description=child(card,'p.interesting_description');
      const rootSelector=card?null:'article.interesting';
      groups[2].push(row('card-'+i,`Создай карточку ${i+1} из 4.`,card,rootSelector,{node:card}));
      groups[2].push(row('title-'+i,`Карточка ${i+1}: заполни p.interesting_title.`,own(title),rootSelector,{node:title||card}));
      groups[2].push(row('description-'+i,`Карточка ${i+1}: заполни p.interesting_description.`,own(description),rootSelector,{node:description||card}));
      const picture=child(card,'img')||card?.querySelector('figure img');
      groups[2].push(row('picture-'+i,`Карточка ${i+1}: вставь картинку и заполни alt.`,picture?.getAttribute('src')&&picture.alt.trim(),rootSelector,{node:picture||card}));
    }
    const firstFour=cards.slice(0,4);
    const signature=node=>{const value=style(node);return [...value].sort().map(key=>key+':'+value.getPropertyValue(key)).join(';');};
    const shared=firstFour.length===4?[...firstFour[0].classList].find(name=>firstFour.every(card=>card.classList.contains(name))&&style(firstFour[0]).length>0&&getStyle(firstFour[0],name).length>0):null;
    groups[2].push(row('shared-cards','Назначь четырём карточкам общий класс и оформи его.',cards.length===4&&shared&&firstFour.every(card=>signature(card)===signature(firstFour[0])),'article.interesting',{node:firstFour[0],styleClass:shared||'interesting_card'}));
    for(const [className,label] of [['interesting_title','названий'],['interesting_description','описаний']]){
      const nodes=firstFour.map(card=>child(card,'p.'+className));
      const rule=nodes[0]?getStyle(nodes[0],className):document.createElement('div').style;
      groups[2].push(row(className,`Задай общий стиль ${label} через .${className}.`,nodes.length===4&&nodes.every(Boolean)&&rule.length>0&&nodes.every(node=>signature(node)===signature(nodes[0])),'p.'+className,{styleClass:className}));
    }
    return groups;
  }
  function progress(items){const done=items.filter(item=>item.done).length;return {done,total:items.length,percent:Math.round(done/items.length*100),complete:done===items.length,next:items.find(item=>!item.done)||null};}
  return {lessons,checks,progress,photoKey};
})();
