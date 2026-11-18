import { association, centre, centreVideos, products } from './content.mjs';
import { breadcrumbs, consultation, icon, pageHead, visitActions } from './components.mjs';
import { bodyhealthPage } from './bodyhealth.mjs';

export { home } from './home.mjs';
export { rehabilitation } from './rehabilitation.mjs';
export { reviewsPage as reviews } from './reviews.mjs';

export function catalog(p) {
  const featured = products.find(model => model.slug === 'bodyhealth');
  return `${breadcrumbs(p, 'Аппараты системы 5/95')}
    <div class="container equipment-opening">
      <header><h1>Аппараты системы 5/95</h1>
        <p class="lead">Здесь можно рассмотреть аппараты и их управление перед встречей. Если вас интересует определённая модель, спросите у Светланы, можно ли увидеть её в центре.</p>
        <a class="text-link" href="${p}articles/first-visit/#documents">Инструкции и сертификаты на аппараты${icon('arrow')}</a></header>
      <a class="equipment-feature" href="${p}equipment/${featured.slug}/">
        <img src="${p}assets/bodyhealth-controls.jpg" width="545" height="473" alt="Площадка для стоп и панель управления аппарата BodyHealth">
        <span><strong>${featured.name}</strong><span>Рассмотреть управление ${icon('arrow')}</span></span>
      </a>
    </div>
    <section class="container equipment-directory" aria-labelledby="other-models"><h2 id="other-models">Другие аппараты</h2>
      <ul>${products.filter(model => model !== featured).map(model => `<li><a href="${p}equipment/${model.slug}/" class="equipment-row">
        <img src="${p}assets/${model.image}" alt="" width="100" height="78" loading="lazy">
        <span><strong>${model.name}</strong><small>${model.area}</small></span>
        <span class="equipment-description">${model.description}</span>${icon('arrow')}
      </a></li>`).join('')}</ul>
      <p class="photo-caption">Фотографии из материалов System 5/95 и NovuMedical. <a href="${p}media/#equipment">Источники изображений</a></p>
    </section>
    ${consultation(p)}`;
}

function modelPhotos(p, product) {
  return `<div class="product-gallery">
    <div class="gallery-main"><img id="product-main-image" src="${p}assets/${product.image}" alt="Аппарат ${product.name}" width="720" height="540"></div>
    ${product.lifestyle ? `<div class="gallery-thumbs" role="group" aria-label="Фотографии аппарата" hidden>
      <button class="selected" aria-pressed="true" data-gallery-src="${p}assets/${product.image}" data-gallery-alt="Аппарат ${product.name}"><img src="${p}assets/${product.image}" alt="Общий вид аппарата" width="100" height="80"></button>
      <button aria-pressed="false" data-gallery-lifestyle data-gallery-src="${p}assets/${product.lifestyle}" data-gallery-alt="Пример использования ${product.name} из материалов системы 5/95"><img src="${p}assets/${product.lifestyle}" alt="Пример использования" width="100" height="80"></button>
    </div><noscript><p><a href="${p}assets/${product.lifestyle}">Открыть пример использования ${product.name}</a></p></noscript>` : ''}
    <p class="photo-caption">Иллюстрации из материалов системы 5/95. <a href="${p}media/#equipment">Источник фотографий</a></p>
  </div>`;
}

export function productPage(p, product) {
  if (product.slug === 'bodyhealth') return bodyhealthPage(p, product);
  return `${breadcrumbs(p, product.name, ['equipment/', 'Аппараты системы 5/95'])}
    <section class="container product-detail model-spread">
      <header class="model-heading"><h1>${product.name}</h1><p class="lead">${product.description}</p></header>
      ${modelPhotos(p, product)}
      <div class="model-question">
        <h2>Вопрос для встречи</h2><p>${product.question}</p>
        <p>Если хотите увидеть ${product.name}, назовите модель Светлане при звонке. Она уточнит, какой аппарат можно посмотреть в день встречи.</p>
        <a class="text-link" href="${centre.phoneHref}">Позвонить Светлане ${centre.phone}</a>
      </div>
    </section>
    <section class="container model-documents"><div class="product-information">
      <div><h2>Инструкции и сертификаты на аппараты</h2></div><div><p>Попросите Светлану показать инструкцию к ${product.name}. Сверьте полное обозначение на корпусе с названием в инструкции. Уточните, есть ли у этой модели сертификат или декларация и где можно посмотреть документ.</p>
      <a class="text-link" href="${p}articles/first-visit/#documents">О документах к модели${icon('arrow')}</a></div>
    </div><a class="text-link" href="${p}equipment/">Все аппараты системы 5/95${icon('arrow')}</a></section>`;
}

export function article(p) {
  return `${breadcrumbs(p, 'Памятка перед поездкой', ['articles/', 'Статьи'])}
    <article class="container article-layout visit-memo">
      <header class="memo-heading"><h1>Памятка перед поездкой</h1><p class="article-lead">Для первого звонка достаточно сказать, что вы хотите познакомиться с центром. Светлана Бабак поможет выбрать время.</p></header>
      <nav class="memo-jump" aria-label="Содержание памятки"><a href="#before">До поездки</a><a href="#bring">Что взять</a><a href="#questions">Что спросить</a><a href="#documents">Документы к аппарату</a></nav>
      <div class="article-body">
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
    <section class="container contacts-spread" id="contact-details"><h1>Как связаться и прийти</h1>
      <div class="contacts-top">
        <div class="contacts-call"><h2>Позвонить Светлане</h2>
          <p>${centre.contact}, консультант центра. Позвоните перед поездкой, чтобы договориться о времени.</p>
          <a class="contact-main-number" href="${centre.phoneHref}">${icon('phone')}${centre.phone}</a>
          <p class="contact-alternate">Дополнительный телефон<br><a href="${centre.secondaryPhoneHref}">${centre.secondaryPhone}</a></p>
        </div>
        <div class="contacts-address"><h2>Куда прийти</h2><p class="contact-street">${centre.address}</p>
          <p>Если планируете прийти с близким человеком или хотите узнать, есть ли ступени у входа, уточните это при звонке.</p>
          <a class="button button-secondary" href="${centre.mapUrl}">${icon('pin')}Открыть адрес на карте</a>
        </div>
      </div>
      <div class="contacts-more"><a class="text-link" href="${p}rehabilitation/">Как проходит первое посещение${icon('arrow')}</a>
        <div><span>Страницы центра</span><a href="${centre.okUrl}">Одноклассники</a><a href="${centre.instagram}">Instagram · ${centre.instagramLabel}</a></div></div>
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
      <p><a href="${p}articles/">Фотографии и заметки из жизни центра</a>. В каждой истории указаны дата и ссылка на оригинальную публикацию.</p>
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
      <h2>Видео из Одноклассников</h2><p>Когда вы нажимаете «Смотреть видео» на обложке, загружается плеер Одноклассников. Рядом с каждой записью есть прямая ссылка на неё.</p>
      <h2>Настройки отображения</h2><p>Если вы включите версию для слабовидящих, браузер запомнит размер текста и выбранные цвета на этом устройстве. Кнопка «Обычная версия» возвращает исходный вид.</p>
    </section>`;
}
