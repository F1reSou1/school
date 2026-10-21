'use strict';
/* Lesson content and result checks. The editor calls this on every change. */
window.WorkshopLesson = (() => {
  const lessons = [
    {
      short: 'HTML и CSS', title: 'Знакомство со страницей',
      description: 'Выбери main.page, задай фон классу page, впиши имя в h1 и замени текст знакомства.',
      theory: `<h3>HTML — содержимое и структура</h3><p>HTML — язык разметки. Теги говорят браузеру, где заголовок, абзац или картинка. <code>&lt;h1&gt;Привет, я Саша&lt;/h1&gt;</code> — главный заголовок с открывающим и закрывающим тегом.</p><h3>Блоки и вложенность</h3><p>Элемент занимает область на странице. Контейнер может включать другие элементы: это его дети. В редакторе скобки <code>{ }</code> показывают границы контейнера. В HTML эту границу задаёт пара тегов.</p><h3>CSS и классы</h3><p>CSS — Cascading Style Sheets, то есть «каскадные таблицы стилей». Они задают цвет, размер, отступы и расположение. Класс — имя для общего оформления. В HTML пишем <code>class="page"</code>, в CSS — <code>.page { background: #eef2f7; }</code>. Точка нужна только в CSS. Изменение правила затронет все элементы с этим классом. Для частей блока используем запись <code>блок__элемент</code>: например, <code>hero__img</code> — картинка блока <code>hero</code>. Между именем блока и его элемента — два подчёркивания.</p><pre>&lt;main class="page"&gt;\n  &lt;h1&gt;Привет, я Саша&lt;/h1&gt;\n  &lt;p class="page__intro"&gt;Люблю музыку и прогулки.&lt;/p&gt;\n&lt;/main&gt;</pre><h3>Каскад и наследование</h3><p>Каскад — правила выбора стиля. Если несколько CSS-правил задают одно свойство одному элементу, браузер учитывает их важность, точность селектора и порядок записи. При равных остальных условиях побеждает правило, написанное ниже.</p><p>Некоторые свойства передаются от родителя детям — это <b>наследование</b>. Например, цвет текста и шрифт. Фон, ширина и отступы по умолчанию не наследуются.</p><pre>.page {\n  color: #334155;\n  font-family: Arial, sans-serif;\n}\n\n.page__intro {\n  color: #2563eb;\n}</pre><p>В примере выше <code>h1</code> унаследует цвет и шрифт от <code>main.page</code>. Абзац <code>p.page__intro</code> тоже получит шрифт Arial, но его цвет будет синим: он задан в собственном классе <code>page__intro</code>.</p><p><b>Значение, заданное самому ребёнку, имеет приоритет над унаследованным значением этого свойства.</b> Поэтому для своего цвета текста достаточно задать <code>color</code> в классе дочернего блока. Если же самому ребёнку подходят несколько правил с разными значениями, между ними снова работает каскад.</p>`,
      task: ['Нажми main в дереве блоков.', 'В «Оформление → Стиль класса» выбери .page и поменяй фон.', 'Выбери h1 и впиши своё имя или имя героя.', 'Выбери абзац p в header.hero и замени текст знакомства.'],
      hint: 'Выбери main.page → «Оформление» → класс .page → «Фон». Затем отредактируй h1 и p через поле «Содержимое».',
      sources: [['HTML и семантика · MDN','https://developer.mozilla.org/en-US/docs/Glossary/Semantics'],['Каскад · MDN','https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts'],['Наследование · MDN','https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Inheritance']]
    },
    {
      short: 'Блоки и классы', title: 'Собери вступление из двух блоков',
      description: 'Внутри hero объедини h1 и p в div.hero__item. Рядом добавь img.hero__img и фото по QR. Ограничь ширину текстового блока до 360 px, а картинки — до 240 px.',
      theory: `<h3>Семантика: тег обозначает смысл</h3><p>Смысловые теги помогают скринридерам, которыми пользуются незрячие люди, находить разделы и заголовки. Поисковым роботам они тоже помогают понимать структуру. Оформление при этом задаёт CSS.</p><dl class="semantic-list"><dt>main</dt><dd>Главное содержимое страницы. Обычно одно.</dd><dt>header</dt><dd>Вступление: здесь имя и знакомство.</dd><dt>section + h2</dt><dd>Раздел с заголовком, например «Мои интересы».</dd><dt>article</dt><dd>Самостоятельный материал. В упражнении — подборка интересов.</dd><dt>div</dt><dd>Нейтральный контейнер для группировки и расположения.</dd><dt>img</dt><dd>Картинка. Её можно вставить прямо в контейнер. Атрибут alt описывает изображение для тех, кто его не видит. Для декоративных картинок его оставляют пустым. В заданиях заполнение alt необязательно.</dd><dt>figure</dt><dd>Самостоятельная иллюстрация, при необходимости с подписью figcaption. Для img эта обёртка необязательна.</dd><dt>h1, h2, p</dt><dd>Главный заголовок, заголовок раздела и обычный абзац.</dd><dt>footer</dt><dd>Завершение страницы: подпись автора.</dd></dl><h3>БЭМ — блок, элемент, модификатор</h3><p>Понятные имена классов показывают связь частей: блок <code>hero</code>, его элемент <code>hero__item</code>, вариант <code>hero__item--wide</code>. Это один из распространённых способов записи БЭМ. Классы помогают разработчикам; смысл для скринридера задают теги, а не названия классов.</p><p>В заданиях называем элементы по схеме <code>блок__элемент</code>: между именами ставим <b>два подчёркивания</b>. У блока <code>hero</code> это <code>hero__item</code> и <code>hero__img</code>, у блока <code>interesting</code> — <code>interesting__card</code>, <code>interesting__title</code> и <code>interesting__description</code>. Имена самих блоков — <code>page</code>, <code>hero</code>, <code>interesting</code> — пишем без этого разделителя. В HTML класс указываем без точки.</p><pre>header.hero {\n  div.hero__item { h1, p }\n  img.hero__img\n}</pre><h3>Ширина блока и картинки</h3><p><code>width</code> задаёт ширину, а <code>max-width</code> — её верхнюю границу: блок может быть уже, но не шире указанного значения. Ограничь текстовый блок <code>hero__item</code> до 360 px, а самому <code>img</code> задай ширину до 240 px. Так текст и фото поместятся рядом, когда в следующем задании включим Flexbox.</p>`,
      task: ['Выбери header.hero и добавь «Контейнер» (div). Назначь класс hero__item.', 'Перемести существующие h1 и p внутрь hero__item: перетащи их или измени «Родитель».', 'В том же hero добавь «Картинка» (img), назначь ей класс hero__img.', 'Выбери img.hero__img → «Заменить картинку» → «С телефона по QR». Отправь своё фото.', 'Выбери div.hero__item → «Оформление» и у класса hero__item задай максимальную ширину 360 px или меньше.', 'Выбери само img → «Ширина картинки» и уменьши до 240 px или меньше. Описание alt можно оставить пустым.'],
      hint: 'Сначала выдели header.hero, чтобы новый блок оказался внутри него. Классы вводятся без точки. Для переноса h1 и p используй поле «Родитель». Затем у hero__item задай «Макс. ширина блока» 360 px, а у img — «Ширина картинки» 240 px. Фото можно вставить прямо как img.hero__img. Обёртка figure.hero__img или div.hero__img с вложенным img тоже допустима.',
      sources: [['Именование БЭМ','https://getbem.com/naming/'],['Семантика · MDN','https://developer.mozilla.org/en-US/docs/Glossary/Semantics']]
    },
    {
      short: 'Flexbox и карточки', title: 'Расположи вступление и собери интересы',
      description: 'Поставь текст и фото в hero в строку. В «Мои интересы» добавь article.interesting с четырьмя карточками: по два абзаца в каждой и картинки хотя бы в двух. Добавь внутренние отступы подборке и карточкам.',
      theory: `<h3>Flexbox работает у родителя</h3><p><code>display: flex</code> включает расположение прямых детей. У <code>header.hero</code> это <code>hero__item</code> и <code>hero__img</code>. Режим <code>row</code> ставит их в строку, <code>column</code> — в колонку.</p><h3>Две оси и расстояние</h3><p>В строке <code>justify-content</code> распределяет детей по горизонтали, <code>align-items</code> — по вертикали. В колонке оси меняются местами. <code>gap</code> задаёт расстояние между детьми, <code>wrap</code> разрешает перенос на новую строку.</p><pre>.hero {\n  display: flex;\n  flex-direction: row;\n  gap: 24px;\n  align-items: center;\n}\n.photo { width: 220px; }</pre><h3>Общий класс — одинаковое оформление</h3><p>В <code>article.interesting</code> создай четыре контейнера. У каждой карточки — два абзаца <code>p</code>: название с классом <code>interesting__title</code> и описание с классом <code>interesting__description</code>. Картинки добавь хотя бы в две из четырёх карточек; остальные могут быть только с текстом.</p><p>Назначь всем четырём карточкам один общий класс (например, <code>interesting__card</code>). Заголовки оформляй через <code>.interesting__title</code>, описания — через <code>.interesting__description</code>. Тогда одно изменение CSS обновит все четыре карточки.</p><pre>section.interests {\n  h2 «Мои интересы»\n  article.interesting {\n    div.interesting__card {\n      p.interesting__title\n      p.interesting__description\n      img\n    }\n    … ещё 3 карточки; картинки — минимум в двух из четырёх\n  }\n}</pre><h3>Отступы внутри и между блоками</h3><p><code>padding</code> — расстояние от границы блока до его содержимого. Задай <code>article.interesting</code> внутренний отступ, например 16 px, чтобы карточки не прилипали к краям подборки. Затем задай 16 px общему классу <code>interesting__card</code>: текст и картинки отступят от краёв всех четырёх карточек.</p><p><code>gap</code> задаёт расстояние <b>между</b> карточками у их Flexbox-родителя; <code>margin</code> — отступ снаружи отдельного блока. Это разные настройки.</p><h3>Как поставить карточки в ряд</h3><p>Если хочешь расположить карточки в строку, включай Flexbox у <code>article.interesting</code> — прямого родителя четырёх карточек. У <code>section.interests</code> прямые дети — заголовок и весь article, поэтому Flexbox на section расположит рядом именно их.</p><p>Выбери «В ряд» и оставь включённым «Разрешить перенос · wrap». Карточки, которые не помещаются по ширине с учётом <code>gap</code> и внутренних отступов, перейдут на следующую строку. Например:</p><pre>.interesting {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  gap: 16px;\n  padding: 16px;\n}\n\n.interesting__card {\n  width: 240px;\n  padding: 16px;\n}</pre><p>В редакторе перенос включается вместе с Flexbox. В обычном CSS значение по умолчанию — <code>nowrap</code>: дети остаются на одной линии и могут сжиматься или выходить за границы. В режиме <code>column</code> для переноса в соседнюю колонку нужна ограниченная высота контейнера.</p>`,
      task: ['Выбери header.hero, включи Flexbox и направление «В ряд».', 'Проверь, что текст и фото с размерами из прошлого задания помещаются в строку; настрой расстояние между ними.', 'В section «Мои интересы» добавь пустой article, назначь класс interesting.', 'Внутри article создай четыре div с одним общим классом, например interesting__card.', 'В каждую карточку добавь два p: interesting__title и interesting__description. Заполни их своим текстом. Картинки добавь хотя бы в две из четырёх карточек.', 'Настрой общий класс карточек и оба текстовых класса. Карточки с одним классом оформятся одинаково.', 'Выбери article.interesting → «Отступы и углы» и задай внутренний отступ, например 16 px.', 'У одной карточки выбери общий класс interesting__card и задай внутренний отступ, например 16 px. Он применится ко всем четырём.', 'По желанию: у article.interesting включи Flexbox → «В ряд», оставь «Разрешить перенос · wrap» и настрой gap, например 16 px.'],
      hint: 'Удобно собрать и оформить первую карточку, затем дублировать её три раза кнопкой ⧉. В копиях замени текст. Картинки достаточно оставить хотя бы в двух карточках. В выборе «Стиль класса» меняй общий класс, чтобы стиль применялся ко всем карточкам. В «Отступы и углы» задай padding подборке и общему классу карточек. Для ряда карточек включай Flexbox у article.interesting, а не у section.interests; wrap оставь включённым.',
      sources: [['Flexbox · MDN','https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts'],['Перенос · MDN','https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-wrap'],['Внутренние отступы · MDN','https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding']]
    }
  ];
  function photoKey(source){let hash=2166136261;for(let i=0;i<source.length;i++){hash^=source.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(36);}
  const text = node => node?.textContent.trim() || '';
  const own = node => text(node).length > 0 && !['Привет, я …','Привет, я Саша.','Мой заголовок','Несколько слов обо мне.','Напиши пару слов о себе или о придуманном герое.','Название карточки','Напиши пару предложений о себе.'].includes(text(node));
  const child = (node,selector) => [...(node?.children||[])].find(el=>el.matches(selector));
  function checks(doc, getStyle, state) {
    const main=doc.querySelector('main.page'),hero=main?.querySelector('header.hero'),heading=hero?.querySelector('h1'),intro=hero?.querySelector('p');
    const item=child(hero,'div.hero__item'),media=child(hero,'img.hero__img,figure.hero__img,div.hero__img'),image=media?.matches('img')?media:media?.querySelector('img');
    const imageSelector='header.hero img.hero__img, header.hero .hero__img img';
    const section=main?.querySelector('section#interests,section.interests')||[...(main?.querySelectorAll('section')||[])].find(el=>/интерес/i.test(text(el.querySelector('h2'))));
    const article=child(section,'article.interesting'),cards=[...(article?.children||[])].filter(el=>el.matches('div'));
    const style=node=>node?getStyle(node):document.createElement('div').style;
    const pageStyle=style(main),itemStyle=style(item),imageStyle=style(image),heroStyle=style(hero);
    const pixels=value=>/^\d+(?:\.\d+)?px$/.test(value)?parseFloat(value):null;
    const limits=[pixels(itemStyle.width),pixels(itemStyle.maxWidth)].filter(value=>value>0);
    const textSmall=limits.length>0&&Math.min(...limits)<=360;
    const photoSmall=pixels(imageStyle.width)>0&&pixels(imageStyle.width)<=240;
    const row = (id,label,done,selector,extra={}) => ({id,label,done:Boolean(done),selector,...extra});
    const qr = Boolean(image?.getAttribute('src')?.startsWith('data:image/')&&state.qrImages?.includes(photoKey(image.getAttribute('src'))));
    const groups = [
      [
        row('page-select','Выбери main и класс page.',main&&state.lessonActions?.includes('page-selected'),'main.page',{styleClass:'page'}),
        row('page-background','У класса page задай фон.',main&&Boolean(pageStyle.backgroundColor)&&!['transparent','rgba(0, 0, 0, 0)'].includes(pageStyle.backgroundColor),'main.page',{styleClass:'page'}),
        row('name','В h1 впиши своё имя или имя героя.',own(heading),'header.hero h1'),
        row('intro','Замени текст абзаца о себе.',own(intro),'header.hero p')
      ],
      [
        row('hero-item','В hero создай div с классом hero__item.',item,'header.hero'),
        row('hero-text','Перемести h1 и p внутрь hero__item.',item&&child(item,'h1')&&child(item,'p')&&hero?.querySelectorAll('h1').length===1,'header.hero'),
        row('hero-img','Рядом добавь картинку с классом hero__img.',media,'header.hero'),
        row('qr','Добавь в hero__img своё фото через QR.',qr,'header.hero .hero__img',{action:'qr'}),
        row('text-width','Ограничь ширину hero__item до 360 px или меньше.',textSmall,'header.hero .hero__item',{styleClass:'hero__item'}),
        row('photo-settings','Уменьши ширину картинки до 240 px или меньше.',photoSmall,imageSelector)
      ],
      [
        row('hero-row','У hero включи Flexbox и направление «В ряд».',item&&media&&heroStyle.display==='flex'&&['','row'].includes(heroStyle.flexDirection),'header.hero',{flex:true}),
        row('photo-small','Проверь ширину фото: не больше 240 px.',photoSmall,imageSelector),
        row('interests-article','В «Мои интересы» создай article.interesting.',article,'section#interests,section.interests')
      ]
    ];
    // Each card contributes separately; one finished card never completes all four.
    for(let i=0;i<4;i++){
      const card=cards[i],title=child(card,'p.interesting__title'),description=child(card,'p.interesting__description');
      const rootSelector=card?null:'article.interesting';
      groups[2].push(row('card-'+i,`Создай карточку ${i+1} из 4.`,card,rootSelector,{node:card}));
      groups[2].push(row('title-'+i,`Карточка ${i+1}: заполни p.interesting__title.`,own(title),rootSelector,{node:title||card}));
      groups[2].push(row('description-'+i,`Карточка ${i+1}: заполни p.interesting__description.`,own(description),rootSelector,{node:description||card}));
    }
    const firstFour=cards.slice(0,4);
    const hasPicture=card=>[...card.querySelectorAll('img')].some(image=>image.getAttribute('src')?.trim());
    const pictured=firstFour.filter(hasPicture),nextPicture=firstFour.find(card=>!hasPicture(card))||article;
    groups[2].push(row('picture-1','Добавь картинку в любую карточку.',pictured.length>=1,'article.interesting',{node:nextPicture}));
    groups[2].push(row('picture-2','Добавь картинку ещё в одну карточку: нужно хотя бы две.',pictured.length>=2,'article.interesting',{node:nextPicture}));
    const signature=node=>{const value=style(node);return [...value].sort().map(key=>key+':'+value.getPropertyValue(key)).join(';');};
    const shared=firstFour.length===4?[...firstFour[0].classList].find(name=>firstFour.every(card=>card.classList.contains(name))&&style(firstFour[0]).length>0&&getStyle(firstFour[0],name).length>0):null;
    groups[2].push(row('shared-cards','Назначь четырём карточкам общий класс и оформи его.',cards.length===4&&shared&&firstFour.every(card=>signature(card)===signature(firstFour[0])),'article.interesting',{node:firstFour[0],styleClass:shared||'interesting__card'}));
    const hasPadding=value=>['top','right','bottom','left'].some(side=>parseFloat(value.getPropertyValue('padding-'+side))>0);
    const paddingClass=firstFour.length===4?[...firstFour[0].classList].find(name=>firstFour.every(card=>card.classList.contains(name))&&hasPadding(getStyle(firstFour[0],name))):null;
    groups[2].push(row('interests-padding','Добавь внутренние отступы у article.interesting, например 16 px.',article&&hasPadding(style(article)),'article.interesting',{styleClass:'interesting',spacing:true}));
    groups[2].push(row('cards-padding','Задай общий внутренний отступ карточек, например 16 px.',cards.length===4&&paddingClass&&firstFour.every(card=>hasPadding(style(card))),'article.interesting',{node:firstFour[0],styleClass:paddingClass||shared||'interesting__card',spacing:true}));
    for(const [className,label] of [['interesting__title','названий'],['interesting__description','описаний']]){
      const nodes=firstFour.map(card=>child(card,'p.'+className));
      const rule=nodes[0]?getStyle(nodes[0],className):document.createElement('div').style;
      groups[2].push(row(className,`Задай общий стиль ${label} через .${className}.`,nodes.length===4&&nodes.every(Boolean)&&rule.length>0&&nodes.every(node=>signature(node)===signature(nodes[0])),'p.'+className,{styleClass:className}));
    }
    return groups;
  }
  function progress(items){const done=items.filter(item=>item.done).length;return {done,total:items.length,percent:Math.round(done/items.length*100),complete:done===items.length,next:items.find(item=>!item.done)||null};}
  return {lessons,checks,progress,photoKey};
})();
