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
  visit: 'Посещение центра или выбор аппарата для дома — расскажите, что вас интересует.',
  equipment: 'Обсудите выбор аппарата для дома: устройство, комплектацию и условия приобретения.',
  price: 'Уточните стоимость, наличие и условия приобретения оборудования.'
};
const expectations = {
  visit: ['Как будет работать запись', 'После запуска сайта сотрудник сможет связаться с вами, уточнить запрос и согласовать посещение.'],
  equipment: ['Как будет работать консультация', 'После запуска сайта сотрудник сможет связаться с вами и обсудить выбранное оборудование.'],
  price: ['Как будет работать запрос цены', 'После запуска сайта сотрудник сможет связаться с вами и уточнить стоимость и условия покупки выбранного аппарата.']
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
  document.querySelectorAll('[data-demo-form]').forEach(form => {
    if (form.elements.purpose) form.elements.purpose.value = selectedPurpose;
  });
};
updateBookingContext();
window.addEventListener('popstate', updateBookingContext);
window.addEventListener('pageshow', updateBookingContext);

document.querySelectorAll('[data-demo-form]').forEach(form => {
  const name = form.elements.name;
  const phone = form.elements.phone;
  const purpose = form.elements.purpose;
  if (purpose) purpose.value = selectedPurpose;
  const error = form.querySelector('.form-error');
  const result = form.querySelector('.form-result');
  const originalChildren = [...form.children].filter(item => item !== result);
  const clearErrors = () => {
    name.removeAttribute('aria-invalid'); phone.removeAttribute('aria-invalid');
    error.hidden = true; error.textContent = '';
  };
  form.addEventListener('submit', event => {
    event.preventDefault(); clearErrors();
    const digits = phone.value.replace(/\D/g, '');
    let invalid;
    if (name.value.trim().length < 2) {
      error.textContent = 'Введите имя: не менее двух символов.'; invalid = name;
    } else if (!(digits.length === 11 && /^[78]/.test(digits) || digits.length === 10)) {
      error.textContent = 'Проверьте номер: введите 10 цифр или 11 цифр, начиная с 7 или 8.'; invalid = phone;
    }
    if (invalid) {
      error.hidden = false; invalid.setAttribute('aria-invalid', 'true'); invalid.focus(); return;
    }
    // No request is sent. The prototype never stores the input.
    originalChildren.forEach(child => { child.hidden = true; });
    result.hidden = false;
    name.value = ''; phone.value = '';
    result.focus();
  });
  [name, phone].forEach(input => input.addEventListener('input', clearErrors));
  form.querySelector('[data-reset-form]').addEventListener('click', () => {
    form.reset(); if (purpose) purpose.value = selectedPurpose;
    originalChildren.forEach(child => { child.hidden = false; });
    clearErrors(); result.hidden = true; name.focus();
  });
  // Enable inputs only after the local-only submit handler is attached.
  form.querySelector('[data-demo-fields]').disabled = false;
});
