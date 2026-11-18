import { association, centre, centreVideos, products } from './content.mjs';
import { breadcrumbs, consultation, icon, pageHead, productCard, visitActions } from './components.mjs';
import { bodyhealthPage } from './bodyhealth.mjs';

export { home } from './home.mjs';
export { rehabilitation } from './rehabilitation.mjs';
export { reviewsPage as reviews } from './reviews.mjs';

export function catalog(p) {
  return `${breadcrumbs(p, 'Аппараты системы 5/95')}
    ${pageHead('Аппараты системы 5/95', 'Фотографии помогут узнать аппарат и подготовить вопросы к встрече. Если вас интересует определённая модель, уточните у Светланы, можно ли увидеть её в центре.')}
    <section class="container catalog-section" aria-label="Фотографии и описания аппаратов">
      <div class="product-grid">${products.map(model => productCard(model, p)).join('')}</div>
      <p class="photo-caption">Фотографии из материалов System 5/95 и NovuMedical. <a href="${p}media/#equipment">Источники изображений</a></p>
      <p><a class="text-link" href="${p}articles/first-visit/#documents">Инструкции и сертификаты на аппараты${icon('arrow')}</a></p>
    </section>
    ${consultation(p)}`;
}

function modelPhotos(p, product) {
  return `<div class="product-gallery">
    <div class="gallery-main"><img id="product-main-image" src="${p}assets/${product.image}" alt="Аппарат ${product.name}" width="720" height="540"></div>
    ${product.lifestyle ? `<div class="gallery-thumbs" role="group" aria-label="Фотографии аппарата">
      <button class="selected" aria-pressed="true" data-gallery-src="${p}assets/${product.image}" data-gallery-alt="Аппарат ${product.name}"><img src="${p}assets/${product.image}" alt="Общий вид аппарата" width="100" height="80"></button>
      <button aria-pressed="false" data-gallery-lifestyle data-gallery-src="${p}assets/${product.lifestyle}" data-gallery-alt="Пример использования ${product.name} из материалов системы 5/95"><img src="${p}assets/${product.lifestyle}" alt="Пример использования" width="100" height="80"></button>
    </div>` : ''}
    <p class="photo-caption">Иллюстрации из материалов системы 5/95. <a href="${p}media/#equipment">Источник фотографий</a></p>
  </div>`;
}

export function productPage(p, product) {
  if (product.slug === 'bodyhealth') return bodyhealthPage(p, product);
  return `${breadcrumbs(p, product.name, ['equipment/', 'Аппараты системы 5/95'])}
    <section class="container product-detail">
      ${modelPhotos(p, product)}
      <div class="product-summary"><span class="product-area">${product.area}</span>
        <h1>${product.name}</h1><p class="lead">${product.description}</p>
        <h2>Вопрос для встречи</h2><p>${product.question}</p>
        <p>Если хотите увидеть ${product.name}, назовите модель Светлане при звонке. Она уточнит, какой аппарат можно посмотреть в день встречи.</p>
        <a class="text-link" href="${centre.phoneHref}">Позвонить Светлане ${centre.phone}</a>
      </div>
    </section>
    <section class="surface-section"><div class="container section product-information">
      <div><h2>Инструкции и сертификаты на аппараты</h2></div><div><p>Попросите Светлану показать инструкцию к ${product.name}. Сверьте полное обозначение на корпусе с названием в инструкции. Уточните, есть ли у этой модели сертификат или декларация и где можно посмотреть документ.</p>
      <a class="text-link" href="${p}articles/first-visit/#documents">О документах к модели${icon('arrow')}</a></div>
    </div></section>
    ${consultation(p)}`;
}

export function articles(p) {
  return `${breadcrumbs(p, 'Перед визитом')}
    ${pageHead('Перед визитом', 'Как договориться о встрече, найти вход и подготовить вопросы к консультанту.')}
    <section class="container article-index"><a class="article-feature" href="${p}articles/first-visit/">
      <div class="article-art" aria-hidden="true">${icon('book')}<span>Первое<br>посещение</span></div>
      <div><h2>Памятка перед поездкой</h2><p>Что уточнить по телефону, что взять с собой и где посмотреть инструкцию к аппарату.</p><span class="text-link">Прочитать памятку${icon('arrow')}</span></div></a>
      <div class="upcoming-material"><h2>Как найти центр</h2><div><p>${centre.address}. Позвоните Светлане, если вам нужен ориентир у входа.</p>
      <a class="text-link" href="${centre.mapUrl}">Открыть адрес на карте${icon('pin')}</a></div></div>
    </section>`;
}

export function article(p) {
  return `${breadcrumbs(p, 'Памятка перед поездкой', ['articles/', 'Перед визитом'])}
    <article class="container article-layout">
      <aside class="article-aside"><span>В этой памятке</span>
        <nav aria-label="Содержание памятки"><a href="#before">До поездки</a><a href="#bring">Что взять</a><a href="#questions">Что спросить</a><a href="#documents">Документы к аппарату</a></nav>
      </aside>
      <div class="article-body"><h1>Памятка перед поездкой</h1><p class="article-lead">Для первого звонка достаточно сказать, что вы хотите познакомиться с центром. Светлана Бабак поможет выбрать время.</p>
        <h2 id="before">До поездки</h2><p>Запишите адрес и время встречи. Уточните, сколько она продлится и где удобнее войти в здание. Если нужен путь без ступеней или вы хотите прийти вместе с близким, расскажите об этом Светлане.</p>
        <p><a href="${centre.mapUrl}">Открыть адрес на карте</a></p>
        <h2 id="bring">Что взять с собой</h2><p>Запишите вопросы в телефон или на бумагу. Спросите заранее, нужны ли какие-либо документы или сменная обувь.</p>
        <h2 id="questions">Что спросить на встрече</h2><ul class="article-checklist"><li>Что я могу посмотреть сегодня?</li><li>Как называется этот аппарат и для чего он предназначен?</li><li>Где находится управление и как остановить работу?</li><li>Как договориться о следующей встрече, если захочется вернуться?</li></ul>
        <h2 id="documents">Инструкции и сертификаты на аппараты</h2><p id="home">Попросите показать полное название модели на корпусе и инструкцию с тем же обозначением. В инструкции найдите назначение, правила использования и ограничения.</p>
        <p>Если хотите ознакомиться с документами, назовите Светлане конкретную модель. Спросите, есть ли для неё сертификат или декларация и как посмотреть этот документ.</p>
        <p>Если у вас есть вопросы о своём здоровье, обсудите возможность использования аппарата с лечащим врачом.</p>
      </div>
    </article>${consultation(p)}`;
}

export function contacts(p) {
  return `${breadcrumbs(p, 'Контакты')}
    ${pageHead('Как связаться и прийти', 'Договоритесь о времени до поездки. Когда будете звонить, скажите, что планируете прийти впервые.')}
    <section class="container contact-layout" id="contact-details">
      <div><h2>Консультант центра</h2><p class="large-copy">${centre.contact}</p>
      <p>На групповых занятиях Светлана показывает, как пользоваться массажными и тепловыми аппаратами системы 5/95. У неё можно узнать, как проходит первое занятие и где найти вход.</p>
      <p>Если вам важно прийти с близким человеком или уточнить, есть ли ступени у входа, обсудите это при звонке.</p>
      <a class="text-link" href="${p}rehabilitation/">Как проходит первое посещение${icon('arrow')}</a></div>
      <div class="contact-panel"><h2>Телефон и адрес</h2><dl>
        <div><dt>${icon('phone')} Телефоны</dt><dd><a class="contact-phone" href="${centre.phoneHref}">${centre.phone}</a><br><a class="contact-phone" href="${centre.secondaryPhoneHref}">${centre.secondaryPhone}</a></dd></div>
        <div><dt>${icon('pin')} Адрес</dt><dd>${centre.address}</dd></div>
        <div><dt>${icon('clock')} Время посещения</dt><dd>${centre.scheduleNote}</dd></div>
        <div><dt>Страницы центра</dt><dd><a href="${centre.okUrl}">Одноклассники</a><br><a href="${centre.instagram}">Instagram · ${centre.instagramLabel}</a></dd></div>
      </dl><a class="button" href="${centre.mapUrl}">Открыть адрес на карте</a></div>
    </section>`;
}

export function booking(p) {
  return `${breadcrumbs(p, 'Договориться о посещении')}
    ${pageHead('Договориться о посещении', 'Позвоните консультанту Светлане Бабак. Выберите удобное время и уточните, как найти вход.')}
    <section class="container contact-layout"><div><h2>Позвонить Светлане</h2>
      <p>Можно начать так: «Хочу прийти к вам в первый раз. Когда удобнее подойти и сколько времени займёт встреча?»</p>
      <p><a class="button" href="${centre.phoneHref}">${centre.phone}</a></p>
      <p>Дополнительный телефон <a class="contact-phone" href="${centre.secondaryPhoneHref}">${centre.secondaryPhone}</a></p></div>
      <div class="contact-panel"><h2>Куда прийти</h2><p>${centre.address}</p>
      <p>По этому адресу можно открыть карту и построить маршрут от вашего дома.</p><a class="button" href="${centre.mapUrl}">Открыть карту</a></div>
    </section>`;
}

export function media(p) {
  return `${breadcrumbs(p, 'Фотографии и видео')}
    ${pageHead('Фотографии и видео', 'Здесь собраны публикации центра и источники изображений аппаратов.')}
    <section class="container legal-copy"><h2>Материалы центра</h2>
      <p>Страница в Одноклассниках называется <a href="${centre.okUrl}">«Центр Здоровья и Долголетия»</a>. Порядок записи по телефону указан <a href="https://ok.ru/profile/583466162659/statuses/157577238805987">в сообщении центра</a>.</p>
      <p>Фрагмент занятия и рассказ посетительницы опубликованы самим центром. Обложки взяты из соответствующих записей.</p>
      <ul>${Object.values(centreVideos).map(video => `<li><a href="${video.url}">${video.title}</a>, ${video.published} года, ${video.duration}.</li>`).join('')}</ul>
      <p>Видео о пяти шагах системы 5/95 предоставила Светлана Бабак. Этим шагам посвящено несколько занятий. <a href="${p}five-steps/">Посмотреть пять шагов</a>.</p>
      <h2 id="equipment">Иллюстрации аппаратов</h2><p>Фотографии EyeSystem, SpineSystem, SleepSystem, FootSystem и Moxi показывают аппараты и примеры их использования. Источник — <a href="https://system595la.com/ru/">материалы System 5/95</a>.</p>
      <p>Фотографии BodyHealth, панели управления и пример использования опубликованы <a href="https://novumedical.org/products/bodyhealth/">на странице модели NovuMedical</a>.</p>
      <h2>Об Ассоциации</h2><p>${association.description} <a href="${association.url}">Официальная страница Ассоциации</a>.</p>
      <h2>Шрифт</h2><p>Golos Text распространяется по лицензии SIL Open Font License. <a href="${p}assets/OFL.txt">Текст лицензии</a>.</p>
    </section>`;
}

export function privacy(p) {
  return `${breadcrumbs(p, 'О сайте')}
    ${pageHead('О сайте', 'Сайт поможет подготовиться к поездке. Договориться о посещении можно напрямую со Светланой Бабак.')}
    <section class="container legal-copy"><h2>Звонок и маршрут</h2>
      <p>Ссылка с номером телефона открывает набор номера, ссылка с адресом — карту. Имя и телефон для этого вводить не нужно.</p>
      ${visitActions()}
      <h2>Видео из Одноклассников</h2><p>Когда вы нажимаете «Смотреть видео» на обложке занятия или отзыва, загружается плеер Одноклассников. Рядом с каждой записью есть прямая ссылка на неё.</p>
      <h2>Настройки отображения</h2><p>Если вы включите версию для слабовидящих, браузер запомнит размер текста и выбранные цвета на этом устройстве. Кнопка «Обычная версия» возвращает исходный вид.</p>
    </section>`;
}
