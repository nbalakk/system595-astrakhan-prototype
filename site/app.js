const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Открыть меню'); menu.focus();
    }
  });
}

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.category.split(/\s+/).includes(filter);
      if (!card.hidden) count++;
    });
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('.filter-count').textContent = `Показано: ${count}`;
  });
});

document.querySelectorAll('[data-gallery-src]').forEach(button => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#product-main-image');
    image.src = button.dataset.gallerySrc;
    image.alt = button.dataset.galleryAlt;
    image.parentElement.classList.toggle('is-lifestyle', !button.dataset.galleryAlt.startsWith('Аппарат'));
    document.querySelectorAll('[data-gallery-src]').forEach(item => {
      item.classList.toggle('selected', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
  });
});

const validPurposes = ['visit', 'equipment', 'price'];
const productNames = { eyesystem: 'EyeSystem', spinesystem: 'SpineSystem', sleepsystem: 'SleepSystem', footsystem: 'FootSystem', moxi: 'Moxi', bodyhealth: 'BodyHealth' };
const headings = { visit: 'Запись на посещение', equipment: 'Консультация по оборудованию', price: 'Узнать стоимость оборудования' };
const introductions = {
  visit: 'Подготовьтесь к посещению центра: уточните время, формат и необходимые документы.',
  equipment: 'Обсудите выбор аппарата для дома: устройство, комплектацию и условия приобретения.',
  price: 'Уточните стоимость, наличие и условия приобретения оборудования.'
};
const expectations = {
  visit: ['Что уточнить перед посещением', 'Уточните время, адрес, стоимость и доступные аппараты. Спросите о формате первого визита и необходимых документах.'],
  equipment: ['Перед выбором аппарата', 'Для каких задач предназначен аппарат, как им пользоваться дома и какие ограничения нужно учитывать? Уточните комплектацию и условия приобретения.'],
  price: ['При уточнении стоимости', 'Какова стоимость выбранной модели, что входит в комплект и есть ли дополнительные расходы? Уточните наличие, доставку и гарантию.']
};
let selectedPurpose = 'visit';
const updateBookingContext = () => {
  const query = new URLSearchParams(location.search);
  selectedPurpose = validPurposes.includes(query.get('purpose')) ? query.get('purpose') : 'visit';
  const context = document.querySelector('#booking-context');
  if (!context) return;
  const heading = headings[selectedPurpose];
  context.textContent = heading;
  for (const [selector, text] of [
    ['.booking-page h1', heading],
    ['.booking-page .lead', introductions[selectedPurpose]],
    ['.booking-expectations h2', expectations[selectedPurpose][0]],
    ['.booking-expectations p:first-of-type', expectations[selectedPurpose][1]],
    ['.breadcrumbs [aria-current="page"]', heading]
  ]) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  }
  document.title = `${heading} — Астрахань, система 5/95`;
  const productKey = query.get('product');
  const selectedProduct = Object.hasOwn(productNames, productKey) ? productNames[productKey] : null;
  const productContext = document.querySelector('#product-context');
  if (productContext) {
    productContext.hidden = !selectedProduct;
    productContext.textContent = selectedProduct ? `Вас интересует: ${selectedProduct}` : '';
  }
  document.querySelectorAll('[data-booking-form]').forEach(form => {
    if (form.elements.purpose) form.elements.purpose.value = selectedPurpose;
  });
};
updateBookingContext();
window.addEventListener('popstate', updateBookingContext);
window.addEventListener('pageshow', updateBookingContext);

document.querySelectorAll('[data-booking-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
  });
});
