import { centre } from './content.mjs';

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
export function bookingForm(prefix, id = 'booking-form', compact = false) {
  return `<form class="booking-form${compact ? ' booking-form-compact' : ''}" id="${id}" method="dialog" data-booking-form aria-describedby="${id}-note">
    <p class="booking-form-note" id="${id}-note">Онлайн-запись пока недоступна. Данные не отправляются</p>
    <a class="text-link booking-call" href="${centre.phoneHref}">${icon('phone')}Позвонить ${centre.phone}</a>
    <fieldset class="booking-form-fields" disabled data-booking-fields>
    <div class="form-fields">
      <div class="field"><label for="${id}-name">Как к вам обращаться</label><input id="${id}-name" name="name" autocomplete="off" maxlength="80" placeholder="Ваше имя"></div>
      <div class="field"><label for="${id}-phone">Номер телефона</label><input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="off" placeholder="+7 (___) ___-__-__"></div>
    </div>
    <div class="field"><label for="${id}-purpose">Что вас интересует</label><select id="${id}-purpose" name="purpose"><option value="visit">Посещение центра</option><option value="equipment">Выбор оборудования для дома</option><option value="price">Стоимость оборудования</option></select></div>
    <button class="button" type="submit" disabled>Онлайн-запись недоступна</button>
    </fieldset>
  </form>`;
}
export const sourceCaption = (prefix, custom = 'Фото из материалов системы 5/95. Не является съёмкой центра в Астрахани.') => `<figcaption class="photo-caption">${custom} <a href="${prefix}media/">Источник фото</a></figcaption>`;
export const productPhotoCaption = (prefix) => `<p class="photo-caption">Фото из материалов системы 5/95. Не является съёмкой центра в Астрахани. <a href="${prefix}media/">Источник</a></p>`;
export function faqMarkup(items) {
  return `<div class="faq-list">${items.map(([q, a]) => `<details><summary>${q}${icon('plus')}</summary><div class="faq-answer"><p>${a}</p></div></details>`).join('')}</div>`;
}
export function productCard(product, prefix) {
  return `<article class="product-card" data-category="${product.category}"><a class="product-image" href="${prefix}equipment/${product.slug}/" aria-label="Подробнее об аппарате ${product.name}"><img src="${prefix}assets/${product.image}" alt="Аппарат ${product.name} из линейки системы 5/95" width="480" height="360" loading="lazy"></a><div class="product-info"><span class="product-area">${product.area}</span><h3><a href="${prefix}equipment/${product.slug}/">${product.name}</a></h3><p>${product.description}</p><div class="product-card-bottom"><a class="text-link" href="${prefix}equipment/${product.slug}/">Подробнее об аппарате${icon('arrow')}</a><a href="${prefix}booking/?purpose=price&product=${product.slug}" class="price-link">Узнать стоимость</a></div></div></article>`;
}

export function layout({ title, description, route, body, prefix }) {
  const nav = [['rehabilitation/', 'Посещения центра'], ['equipment/', 'Оборудование'], ['reviews/', 'Отзывы'], ['articles/', 'Полезные материалы'], ['contacts/', 'О центре и контакты']];
  const active = (href) => route.startsWith(href) ? ' aria-current="page"' : '';
  return `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#c7193e"><meta name="description" content="${description}"><title>${title} — Астрахань, система 5/95</title><link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><link rel="preload" as="font" href="${prefix}assets/golos-0.ttf" type="font/ttf" crossorigin><link rel="stylesheet" href="${prefix}styles.css"><script src="${prefix}display.js"></script><script src="${prefix}app.js" defer></script></head><body>
<a class="skip-link" href="#main">Перейти к содержимому</a>
<header class="site-header"><div class="container header-main"><a class="brand" href="${prefix}" aria-label="Главная — ${centre.name} в Астрахани"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>${centre.name}<small>Астрахань · система 5/95</small></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Открыть меню">${icon('menu')}<span>Меню</span></button><a class="header-phone" href="${centre.phoneHref}">${icon('phone')}<span>${centre.phone}</span></a><button type="button" class="display-toggle" data-display-toggle aria-pressed="false" hidden disabled>${icon('eye')}<span data-display-label>Версия для слабовидящих</span></button><a class="button header-book" href="${prefix}booking/">Записаться</a></div><div class="container header-secondary"><nav class="main-nav" id="main-nav" aria-label="Основная навигация">${nav.map(([href, text]) => `<a href="${prefix}${href}"${active(href)}>${text}</a>`).join('')}<a class="mobile-book" href="${prefix}booking/">Записаться на посещение</a></nav></div></header>
<section class="display-settings" id="display-settings" aria-labelledby="display-title" tabindex="-1" hidden><div class="container display-toolbar"><h2 id="display-title">Настройки отображения</h2><details data-display-options><summary>Размер текста и цвета</summary><div class="display-controls"><div class="display-choice" role="group" aria-label="Размер текста"><span class="display-group-label">Размер текста</span><button type="button" class="display-option" data-display-size="large" aria-pressed="true">Крупный</button><button type="button" class="display-option" data-display-size="larger" aria-pressed="false">Больше</button><button type="button" class="display-option" data-display-size="largest" aria-pressed="false">Максимальный</button></div><div class="display-choice" role="group" aria-label="Контрастная схема"><span class="display-group-label">Цвета</span><button type="button" class="display-option" data-display-theme="light" aria-pressed="true">Чёрный на белом</button><button type="button" class="display-option" data-display-theme="dark" aria-pressed="false">Белый на чёрном</button></div></div></details><button type="button" class="display-return" data-display-close>Обычная версия</button></div></section>
<main id="main">${body}</main>
<footer class="site-footer"><div class="container"><div class="footer-main"><a class="brand" href="${prefix}"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>${centre.name}<small>${centre.city} · Система 5/95</small></span></a><nav aria-label="Навигация в подвале">${nav.map(([href, text]) => `<a href="${prefix}${href}">${text}</a>`).join('')}</nav><div class="footer-contact"><strong><a href="${centre.phoneHref}">${centre.phone}</a></strong><p>${centre.address}</p><a href="${prefix}booking/">Записаться на посещение</a></div></div><p class="health-note">${centre.healthNote}</p><div class="footer-bottom"><span>© 2026. ${centre.name}</span><a href="${prefix}media/">Источники фото</a><a href="${prefix}privacy/">Онлайн-запись</a></div></div></footer>
</body></html>`;
}

export const breadcrumbs = (prefix, current, middle = null) => `<nav class="breadcrumbs container" aria-label="Хлебные крошки"><a href="${prefix}">Главная</a><span aria-hidden="true">/</span>${middle ? `<a href="${prefix}${middle[0]}">${middle[1]}</a><span aria-hidden="true">/</span>` : ''}<span aria-current="page">${current}</span></nav>`;
export const pageHead = (heading, lead, cls = '') => `<div class="container page-head ${cls}"><h1>${heading}</h1><p class="lead">${lead}</p></div>`;
export const consultation = (prefix) => `<section class="container consultation"><div><h2>Посещение и консультация</h2><p>Запишитесь в центр или обсудите выбор аппарата для дома.</p></div><div class="consultation-actions">${button(`${prefix}booking/`, 'Записаться на посещение')}${button(`${prefix}booking/?purpose=equipment`, 'Получить консультацию', true)}</div></section>`;
