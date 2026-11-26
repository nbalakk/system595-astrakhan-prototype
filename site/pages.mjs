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
        <p class="lead">В центре на занятиях знакомят с массажными и тепловыми аппаратами системы 5/95. Если хотите увидеть определённую модель, при записи на посещение уточните, когда её покажут.</p>
        <div class="visit-entry-actions"><a class="button" href="${centre.phoneHref}" aria-label="Позвонить в центр для записи, ${centre.phone}">${icon('phone')}Позвонить в центр</a>
          <a href="${p}articles/first-visit/#documents">Как посмотреть документы на аппарат</a></div></header>
      <a class="equipment-feature" href="${p}equipment/${featured.slug}/">
        <img src="${p}assets/bodyhealth-controls.jpg" width="545" height="473" alt="Площадка для стоп и панель управления аппарата BodyHealth">
        <span><strong>${featured.name}</strong><span>Как устроен аппарат для стоп ${icon('arrow')}</span></span>
      </a>
    </div>
    <section class="container equipment-directory" aria-labelledby="other-models"><h2 id="other-models">Как выглядят другие модели</h2>
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
      <button class="selected" aria-label="Показать ${product.name} отдельно" aria-pressed="true" data-gallery-src="${p}assets/${product.image}" data-gallery-alt="Аппарат ${product.name}"><img src="${p}assets/${product.image}" alt="" width="100" height="80"></button>
      <button aria-label="Показать, как пользуются ${product.name}" aria-pressed="false" data-gallery-lifestyle data-gallery-src="${p}assets/${product.lifestyle}" data-gallery-alt="Пример использования ${product.name} из материалов системы 5/95"><img src="${p}assets/${product.lifestyle}" alt="" width="100" height="80"></button>
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
        <h2>О чём спросить на занятии</h2><p>${product.question}</p>
        <p>Чтобы прийти на занятие, позвоните в центр. Если вам интересен ${product.name}, уточните, будет ли он в зале в выбранный день.</p>
        <a class="text-link" href="${centre.phoneHref}">Позвонить в центр ${centre.phone}</a>
      </div>
    </section>
    <section class="container model-documents"><div class="product-information">
      <div><h2>Инструкция к ${product.name}</h2></div><div><p>В инструкции указано, для чего предназначен аппарат и какие у него есть ограничения. Попросите Светлану показать документ с тем же названием модели, что и на корпусе.</p>
      <a class="text-link" href="${p}articles/first-visit/#documents">Как узнать о сертификате или декларации${icon('arrow')}</a></div>
    </div><a class="text-link" href="${p}equipment/">Все аппараты системы 5/95${icon('arrow')}</a></section>`;
}

export function article(p) {
  return `${breadcrumbs(p, 'Памятка перед поездкой', ['articles/', 'Статьи'])}
    <article class="container article-layout visit-memo">
      <header class="memo-heading"><h1>Памятка перед поездкой</h1><p class="article-lead">Договоритесь о времени по телефону, запишите адрес и уточните, с какой стороны войти в ТЦ «Факел».</p></header>
      <nav class="memo-jump" aria-label="Содержание памятки"><a href="#before">До поездки</a><a href="#bring">Что взять</a><a href="#questions">Что спросить</a><a href="#documents">Документы к аппарату</a></nav>
      <div class="article-body">
        <h2 id="before">До поездки</h2><p>Ознакомительное занятие бесплатное. Уточните, сколько оно продлится и сколько стоят последующие посещения. Если вам нужен вход без ступеней или вы собираетесь с близким человеком, скажите об этом при записи.</p>
        <p><a href="${centre.mapUrl}">Открыть адрес на карте</a></p>
        <h2 id="bring">Что взять с собой</h2><p>Уточните у Светланы, понадобятся ли сменная обувь или документы. Адрес и оба телефона центра можно <a href="${p}contacts/#contact-details">сохранить в телефон</a>.</p>
        <h2 id="questions">Что спросить в зале</h2><ul class="article-checklist"><li>Можно сначала посмотреть, как проходит занятие?</li><li>Для чего предназначен этот аппарат?</li><li>Как им управлять и где кнопка остановки?</li></ul>
        <h2 id="documents">Как посмотреть документы на аппарат</h2><p id="home">Попросите показать полное название модели на корпусе и инструкцию с тем же обозначением. В инструкции найдите назначение, правила использования и ограничения.</p>
        <p>Назовите Светлане модель и спросите, есть ли для неё сертификат или декларация и где посмотреть документ.</p>
        <p>Если у вас есть вопросы о своём здоровье, обсудите возможность использования аппарата с лечащим врачом.</p>
      </div>
    </article>${consultation(p)}`;
}

export function contacts(p) {
  return `${breadcrumbs(p, 'Контакты')}
    <section class="container contacts-spread" id="contact-details"><h1>Контакты центра</h1>
      <div class="contacts-top">
        <div class="contacts-call"><h2>Телефон для записи</h2>
          <p>Консультант центра — ${centre.contact}.</p>
          <a class="contact-main-number" href="${centre.phoneHref}" aria-label="Позвонить в центр, ${centre.phone}">${icon('phone')}${centre.phone}</a>
          <p class="contact-alternate">Дополнительный телефон<br><a href="${centre.secondaryPhoneHref}">${centre.secondaryPhone}</a></p>
        </div>
        <div class="contacts-address"><h2>Адрес</h2><p class="contact-street">${centre.address}</p>
          <a class="button button-secondary" href="${centre.mapUrl}">${icon('pin')}Открыть в Яндекс Картах</a>
          <p class="contact-entry">Если вам нужен вход без ступеней, уточните маршрут у Светланы при записи.</p>
        </div>
      </div>
      <div class="contact-save">
        <a class="button" href="${p}assets/centre-contact.vcf" download="centre-contact.vcf">Сохранить контакт</a>
        <p>Адрес и телефоны будут под рукой. Карточку можно переслать близким.</p>
      </div>
      <div class="contacts-more"><a class="text-link" href="${p}booking/">Что уточнить при первом звонке${icon('arrow')}</a>
        <div><span>Страницы центра</span><a href="${centre.okUrl}">Одноклассники</a><a href="${centre.instagram}">Instagram · ${centre.instagramLabel}</a></div></div>
    </section>`;
}

export function booking(p) {
  return `${breadcrumbs(p, 'Договориться о посещении')}
    <div class="container booking-call-plan">
      <header><h1>Договориться о первом визите</h1>
        <p class="lead">Позвоните в Центр здоровья и долголетия и скажите, что хотите прийти впервые. Уточните, как пройдёт ближайшее занятие, и договоритесь об удобном времени.</p>
        <a class="button" href="${centre.phoneHref}" aria-label="Позвонить в центр, ${centre.phone}">${icon('phone')}${centre.phone}</a>
        <p class="booking-alternate">Дополнительный телефон<br><a href="${centre.secondaryPhoneHref}">${centre.secondaryPhone}</a></p>
      </header>
      <section class="booking-questions" aria-labelledby="questions-for-call"><h2 id="questions-for-call">Что уточнить по телефону</h2>
        <h3>О встрече</h3>
        <ul><li>В какой день и к какому времени можно прийти?</li><li>Сколько длится бесплатное ознакомительное занятие?</li><li>Какие условия у последующих посещений?</li></ul>
        <h3>О дороге</h3>
        <ul><li>Через какой вход в ТЦ «Факел» зайти? Есть ли ступени?</li><li>Можно ли прийти вдвоём с близким человеком?</li></ul>
      </section>
      <div class="booking-directions"><p>${icon('pin')}<a href="${centre.mapUrl}">${centre.address} на карте</a></p>
        <a class="text-link" href="${p}contacts/">Контакты центра${icon('arrow')}</a></div>
    </div>`;
}

export function media(p) {
  return `${breadcrumbs(p, 'Фотографии и видео')}
    ${pageHead('Фотографии и видео', 'Здесь можно найти оригиналы записей из астраханского зала и авторов фотографий с других площадок.')}
    <section class="container legal-copy"><h2>Материалы центра</h2>
      <p>Страница в Одноклассниках называется <a href="${centre.okUrl}">«Центр Здоровья и Долголетия»</a>. Порядок записи по телефону указан <a href="https://ok.ru/profile/583466162659/statuses/157577238805987">в сообщении центра</a>.</p>
      <p>Две записи из зала можно открыть в Одноклассниках.</p>
      <ul>${Object.values(centreVideos).map(video => `<li><a href="${video.url}">${video.title}</a>, ${video.published} года, ${video.duration}.</li>`).join('')}</ul>
      <p><a href="${p}articles/">Фотографии и заметки из жизни центра</a>. В каждой истории указаны дата и ссылка на оригинальную публикацию.</p>
      <p>Светлана Бабак предоставила <a href="${p}five-steps/">фильм о пяти шагах программы</a>. Он длится 57 секунд.</p>
      <h2 id="centre-photographs">Фотография встречи в центре NovuMedical</h2>
      <p>На главной и на странице первого посещения использована фотография из серии NovuMedical. На ней посетительницу встречают у стойки одного из центров сети. <a href="https://novumedical.org/wp-content/uploads/2020/07/slides-2.jpg">Открыть оригинал NovuMedical</a>.</p>
      <h2 id="equipment">Фотографии аппаратов</h2><p>Студийные фотографии и описание функций опубликованы на страницах производителя — <a href="https://novumedical.org/products/novueye/">маска NovuEye</a> и <a href="https://novumedical.org/products/toprelax/">накидка TopRelax</a>. Изображения EyeSystem, SpineSystem, SleepSystem, FootSystem и Moxi опубликованы <a href="https://system595la.com/ru/">System 5/95</a>.</p>
      <p>Фотографии BodyHealth, панели управления и пример использования опубликованы <a href="https://novumedical.org/products/bodyhealth/">на странице модели NovuMedical</a>.</p>
      <h2>Об Ассоциации</h2><p>${association.description} <a href="${association.url}">Официальная страница Ассоциации</a>.</p>
      <h2>Шрифт</h2><p>Сайт использует шрифт <a href="https://fonts.google.com/specimen/Inter">Inter из коллекции Google Fonts</a>. <a href="${p}assets/inter-OFL.txt">Лицензия SIL Open Font License 1.1</a>.</p>
    </section>`;
}

export function privacy(p) {
  return `${breadcrumbs(p, 'О сайте')}
    ${pageHead('О сайте', 'Договориться о первом посещении Центра здоровья и долголетия в Астрахани можно по телефону.')}
    <section class="container legal-copy"><h2>Звонок и маршрут</h2>
      <p>Ссылка с номером телефона открывает набор номера, ссылка с адресом — карту. Имя и телефон для этого вводить не нужно.</p>
      ${visitActions()}
      <h2>Видео из Одноклассников</h2><p>Плеер Одноклассников загружается, когда вы нажимаете кнопку просмотра. Запись также можно открыть по ссылке в самих Одноклассниках.</p>
      <h2>Настройки отображения</h2><p>Если вы включите версию для слабовидящих, браузер запомнит размер текста и выбранные цвета на этом устройстве. Кнопка «Обычная версия» возвращает исходный вид.</p>
    </section>`;
}
