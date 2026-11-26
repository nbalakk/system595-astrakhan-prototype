import { centre } from './content.mjs';

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = value => value.replace(/[&<>"']/g, character => entities[character]);

export const icon = (name, cls = '') => {
  const paths = {
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="m5 3 4 1 1 5-3 2c2 4 3 5 7 7l2-3 5 1 1 4c-1 2-4 2-6 1C9 18 5 14 3 7c-1-2 0-4 2-4Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    camera: '<path d="M3 7h4l2-3h6l2 3h4v13H3Z"/><circle cx="12" cy="13" r="4"/>',
    book: '<path d="M12 6c-3-2-7-3-10-1v15c3-2 7-1 10 1 3-2 7-3 10-1V5c-3-2-7-1-10 1Zm0 0v15"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
  };
  return `<svg class="icon ${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

export const button = (href, text, secondary = false) => `<a class="button${secondary ? ' button-secondary' : ''}" href="${href}">${text}</a>`;
export function visitActions() {
  return `<div class="visit-actions">
    <a class="button" href="${centre.phoneHref}" aria-label="Позвонить в центр ${centre.phone}">${icon('phone')}${centre.phone}</a>
    <a class="button button-secondary" href="${centre.mapUrl}">${icon('pin')}Адрес на карте</a>
  </div>`;
}
export function faqMarkup(items) {
  return `<div class="faq-list">${items.map(([q, a]) => `<details><summary>${q}${icon('plus')}</summary><div class="faq-answer"><p>${a}</p></div></details>`).join('')}</div>`;
}
export function productCard(product, prefix) {
  return `<article class="product-card">
    <a class="product-image" href="${prefix}equipment/${product.slug}/" aria-label="Как устроен ${product.name}"><img src="${prefix}assets/${product.image}" alt="Аппарат ${product.name}" width="480" height="360" loading="lazy"></a>
    <div class="product-info"><span class="product-area">${product.area}</span>
      <h3><a href="${prefix}equipment/${product.slug}/">${product.name}</a></h3><p>${product.description}</p>
    </div></article>`;
}

const navigation = [
  ['rehabilitation/', 'Первое посещение'],
  ['five-steps/', 'Пять шагов'],
  ['equipment/', 'Об аппаратах'],
  ['reviews/', 'Отзывы'],
  ['articles/', 'Статьи'],
  ['contacts/', 'Контакты']
];

function identity(prefix) {
  return `<a class="brand centre-identity" href="${prefix}">
    <span class="identity-symbol" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="identity-text">${centre.name} <small>${centre.city}</small></span>
    <span class="masthead-link-hint">— главная страница</span>
  </a>`;
}

function sectionLinks(prefix, route) {
  return navigation.map(([href, label]) => {
    const current = route === href ? 'page' : route.startsWith(href) ? 'location' : '';
    return `<a href="${prefix}${href}"${current ? ` aria-current="${current}"` : ''}>${label}</a>`;
  }).join('');
}

export function layout({ title, description, route, body, prefix }) {
  const showEquipmentNote = route.startsWith('equipment/') || route === 'five-steps/' || route === 'rehabilitation/';
  return `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#FFFFFF"><meta name="description" content="${escapeHtml(description)}"><title>${escapeHtml(title)} — Астрахань</title><link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><link rel="preload" as="font" href="${prefix}assets/inter-cyrillic.woff2" type="font/woff2" crossorigin><link rel="stylesheet" href="${prefix}styles.css"><script src="${prefix}display.js"></script><script src="${prefix}app.js" defer></script></head><body>
<a class="skip-link" href="#main">Перейти к содержимому</a>
<header class="site-header centre-masthead">
  <div class="masthead-utility"><div class="container utility-inner">
    <a class="masthead-address" href="${centre.mapUrl}">${icon('pin')}<span>${centre.city}, ул. Савушкина, 46А</span><span class="masthead-link-hint">— открыть на карте</span></a>
    <a class="utility-phone" href="${centre.phoneHref}">${icon('phone')}${centre.phone}</a>
    <button type="button" class="masthead-display" data-display-toggle aria-controls="display-settings" aria-expanded="false" hidden disabled>${icon('eye')}<span>Версия для слабовидящих</span></button>
  </div></div>
  <section class="display-settings" id="display-settings" aria-labelledby="display-title" tabindex="-1" hidden>
    <div class="display-panel-inner"><h2 id="display-title" class="masthead-link-hint">Настройки отображения</h2><div class="container display-toolbar">
      <div class="display-choice" role="group" aria-label="Размер текста"><span class="display-group-label">Размер текста</span>
        <button type="button" data-display-size="large" aria-pressed="true">Крупный</button>
        <button type="button" data-display-size="larger" aria-pressed="false">Больше</button>
        <button type="button" data-display-size="largest" aria-pressed="false">Максимальный</button>
      </div>
      <div class="display-choice" role="group" aria-label="Контрастность"><span class="display-group-label">Контрастность</span>
        <button type="button" data-display-theme="light" aria-pressed="true">Чёрный на белом</button>
        <button type="button" data-display-theme="dark" aria-pressed="false">Белый на чёрном</button>
      </div>
      <button class="display-return" type="button" data-display-close>Обычная версия</button>
    </div></div>
  </section>
  <div class="container masthead-main">
    ${identity(prefix)}
    <button type="button" class="menu-toggle masthead-menu" aria-controls="main-nav" aria-expanded="false" aria-label="Открыть меню" hidden>${icon('menu')}<span>Меню</span></button>
    <nav class="centre-navigation" id="main-nav" aria-label="Основная навигация">${sectionLinks(prefix, route)}</nav>
    <div class="masthead-actions">
      <a class="masthead-call" href="${centre.phoneHref}">${icon('phone')}<span>${centre.phone}</span></a>
      <a class="masthead-book" href="${centre.phoneHref}">Записаться<span class="masthead-link-hint"> по телефону</span></a>
    </div>
  </div>
</header>
<main id="main" tabindex="-1">${body}</main>
<footer class="site-footer centre-footer"><div class="container">
  <div class="footer-main">
    <div class="footer-about">${identity(prefix)}
      <a href="${centre.okUrl}">Мы в Одноклассниках</a>
    </div>
    <nav aria-label="Навигация в подвале"><strong>Разделы сайта</strong>${sectionLinks(prefix, route)}</nav>
    <div class="footer-contact"><strong>Связаться с центром</strong>
      <a class="footer-number" href="${centre.phoneHref}">${centre.phone}</a>
      <a class="footer-number" href="${centre.secondaryPhoneHref}">${centre.secondaryPhone}</a>
      <a class="footer-address" href="${centre.mapUrl}">${centre.address}</a>
    </div>
  </div>
  ${showEquipmentNote ? `<p class="health-note">${centre.healthNote}</p>` : ''}
  <div class="footer-bottom"><span>© 2026. ${centre.name}</span><a href="${prefix}media/">Источники фото и видео</a><a href="${prefix}privacy/">О данных на сайте</a></div>
</div></footer>
</body></html>`;
}

export function breadcrumbs(prefix, current, middle = null) {
  const reading = middle?.[0] === 'articles/';
  const parentLabel = reading
    ? `<span class="breadcrumb-full-label">${middle[1]}</span><span class="breadcrumb-short-label">К статьям</span>`
    : middle?.[1];
  return `<nav class="breadcrumbs container${reading ? ' reading-crumbs' : ''}" aria-label="Хлебные крошки">
    <a href="${prefix}">Главная</a><span aria-hidden="true">/</span>
    ${middle ? `<a href="${prefix}${middle[0]}">${parentLabel}</a><span aria-hidden="true">/</span>` : ''}
    <span aria-current="page">${current}</span>
  </nav>`;
}
export const pageHead = (heading, lead, cls = '') => `<div class="container page-head ${cls}"><h1>${heading}</h1><p class="lead">${lead}</p></div>`;
export const consultation = () => `<section class="container consultation"><div><h2>Договориться о посещении</h2><p>Позвоните в центр, чтобы выбрать время первого визита. Центр находится по адресу ${centre.address}.</p></div>${visitActions()}</section>`;
