import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { booking } from '../site/pages.mjs';
import { layout } from '../site/components.mjs';
import { products } from '../site/content.mjs';

const source = await readFile(new URL('../site/app.js', import.meta.url), 'utf8');
const html = layout({ title: 'Запись на посещение', description: '', route: 'booking/', prefix: '../', body: booking('../') });
const suffix = ' — Астрахань, система 5/95';

class Element {
  constructor(textContent = '', hidden = false) {
    Object.assign(this, { textContent, hidden, disabled: false, value: '', attributes: {}, listeners: {}, focused: false });
  }
  set innerHTML(value) { throw Error(`Booking context must use textContent: ${value}`); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  addEventListener(name, listener) { (this.listeners[name] ??= []).push(listener); }
  dispatch(name, event = {}) { this.listeners[name]?.forEach(listener => listener(event)); }
  focus() { this.focused = true; }
}

function run(search = '', bookingPage = true) {
  const fromHtml = (pattern, hidden = false) => {
    const match = html.match(pattern);
    assert(match, `Booking renderer must provide ${pattern}`);
    return new Element(match[1].replace(/<[^>]*>/g, ''), hidden);
  };
  const heading = fromHtml(/<h1>(.*?)<\/h1>/s);
  const intro = fromHtml(/<p class="lead">(.*?)<\/p>/s);
  const expectationsHeading = fromHtml(/<div class="booking-expectations"><h2>(.*?)<\/h2>/s);
  const expectationsText = fromHtml(/<div class="booking-expectations"><h2>.*?<\/h2><p>(.*?)<\/p>/s);
  const breadcrumb = fromHtml(/<span aria-current="page">(.*?)<\/span>/s);
  const context = fromHtml(/<h2 id="booking-context">(.*?)<\/h2>/s);
  const product = fromHtml(/<p id="product-context"[^>]*>(.*?)<\/p>/s, true);
  const name = new Element();
  const phone = new Element();
  const purpose = new Element();
  purpose.value = html.match(/<select[^>]*name="purpose">\s*<option value="([^"]+)"/)[1];
  const error = new Element('', true);
  const result = fromHtml(/<div class="form-result"[^>]*>(.*?)<\/div>/s, true);
  const fields = new Element(); fields.disabled = true;
  const reset = new Element();
  const form = new Element();
  form.elements = { name, phone, purpose };
  form.children = [fields, new Element(), result];
  form.querySelector = selector => ({ '.form-error': error, '.form-result': result, '[data-reset-form]': reset, '[data-demo-fields]': fields })[selector] ?? null;
  form.reset = () => { name.value = ''; phone.value = ''; purpose.value = 'visit'; };
  const nodes = { '.booking-page h1': heading, '.booking-page .lead': intro, '.booking-expectations h2': expectationsHeading, '.booking-expectations p:first-of-type': expectationsText, '.breadcrumbs [aria-current="page"]': breadcrumb, '#booking-context': context, '#product-context': product };
  const document = {
    title: html.match(/<title>(.*?)<\/title>/s)[1],
    querySelector: selector => bookingPage ? nodes[selector] ?? null : null,
    querySelectorAll: selector => selector === '[data-demo-form]' ? [form] : [],
    addEventListener() {}
  };
  const window = new Element();
  const location = { search };
  const forbidden = () => { throw Error('Demo form must not send or store data'); };
  const storage = new Proxy({}, { get: forbidden, set: forbidden });
  vm.runInNewContext(source, { document, window, location, URLSearchParams, fetch: forbidden, XMLHttpRequest: forbidden, localStorage: storage, sessionStorage: storage, navigator: { sendBeacon: forbidden } });
  return { document, heading, intro, expectationsHeading, expectationsText, breadcrumb, context, product, name, phone, purpose, form, fields, error, result, reset,
    navigate(nextSearch, event = 'popstate') { location.search = nextSearch; window.dispatch(event); },
    submit() { let prevented = false; form.dispatch('submit', { preventDefault() { prevented = true; } }); assert(prevented, 'Demo submit must prevent a real request'); }
  };
}

function assertPurpose(app, purpose, heading, introPattern) {
  assert.equal(app.heading.textContent, heading);
  assert.equal(app.context.textContent, heading);
  assert.equal(app.breadcrumb.textContent, heading);
  assert.equal(app.document.title, heading + suffix);
  assert.match(app.intro.textContent, introPattern);
  assert.equal(app.purpose.value, purpose);
  assert.equal(app.fields.disabled, false);
  const expectations = {
    visit: ['Как будет работать запись', 'После запуска сайта сотрудник сможет связаться с вами, уточнить запрос и согласовать посещение.'],
    equipment: ['Как будет работать консультация', 'После запуска сайта сотрудник сможет связаться с вами и обсудить выбранное оборудование.'],
    price: ['Как будет работать запрос цены', 'После запуска сайта сотрудник сможет связаться с вами и уточнить стоимость и условия покупки выбранного аппарата.']
  };
  assert.equal(app.expectationsHeading.textContent, expectations[purpose][0]);
  assert.equal(app.expectationsText.textContent, expectations[purpose][1]);
}

test('plain booking retains the visit scenario and its form selection', () => {
  assertPurpose(run(), 'visit', 'Запись на посещение', /Посещение центра|посещение центра/);
});

for (const [purpose, heading, intro] of [
  ['visit', 'Запись на посещение', /посещение центра/iu],
  ['equipment', 'Консультация по оборудованию', /выбор аппарата/iu],
  ['price', 'Узнать стоимость оборудования', /стоимость.*наличие/iu]
]) {
  test(`${purpose} keeps heading, introduction, breadcrumb, title and selection consistent`, () => {
    assertPurpose(run(`?purpose=${purpose}`), purpose, heading, intro);
  });
  for (const { slug, name } of products) {
    test(`${purpose} preserves ${name} on direct open and reload`, () => {
      const query = `?purpose=${purpose}&product=${slug}`;
      for (const app of [run(query), run(query)]) {
        assertPurpose(app, purpose, heading, intro);
        assert.equal(app.product.hidden, false);
        assert.equal(app.product.textContent, `Вас интересует: ${name}`);
      }
    });
  }
}

test('missing purpose with a known model retains the visit scenario and model', () => {
  const app = run('?product=bodyhealth');
  assertPurpose(app, 'visit', 'Запись на посещение', /посещение центра/iu);
  assert.equal(app.product.textContent, 'Вас интересует: BodyHealth');
  assert.equal(app.product.hidden, false);
});

test('unknown and inherited purpose keys safely fall back to visit', () => {
  for (const purpose of ['', 'unknown', 'Price', 'constructor', 'prototype', '__proto__', '<img src=x onerror=alert(1)>', 'visit\0']) {
    const app = run(`?purpose=${encodeURIComponent(purpose)}&product=bodyhealth&name=Private&phone=79999999999`);
    assertPurpose(app, 'visit', 'Запись на посещение', /посещение центра/iu);
    assert.equal(app.product.textContent, 'Вас интересует: BodyHealth');
    assert.equal(app.name.value, '');
    assert.equal(app.phone.value, '');
  }
});

test('unknown and inherited product keys are never rendered as a model', () => {
  for (const product of ['', 'unknown', 'BodyHealth', 'constructor', 'prototype', '__proto__', 'toString', '<script>alert(1)</script>', 'bodyhealth\0']) {
    const app = run(`?purpose=price&product=${encodeURIComponent(product)}`);
    assert.equal(app.product.hidden, true);
    assert.equal(app.product.textContent, '');
    assert.equal(app.purpose.value, 'price');
  }
});

test('history and cached-page restoration refresh every context and clear a stale model', () => {
  const app = run('?purpose=price&product=bodyhealth');
  app.navigate('?purpose=equipment&product=eyesystem');
  assertPurpose(app, 'equipment', 'Консультация по оборудованию', /выбор аппарата/iu);
  assert.equal(app.product.textContent, 'Вас интересует: EyeSystem');
  app.navigate('?purpose=unknown&product=constructor', 'pageshow');
  assertPurpose(app, 'visit', 'Запись на посещение', /посещение центра/iu);
  assert.equal(app.product.hidden, true);
  assert.equal(app.product.textContent, '');
  app.reset.dispatch('click');
  assert.equal(app.purpose.value, 'visit');
});

test('demo validation, success clearing and repeat retain the requested purpose and model', () => {
  const app = run('?purpose=price&product=bodyhealth');
  app.name.value = 'А'; app.phone.value = '123'; app.submit();
  assert.equal(app.name.getAttribute('aria-invalid'), 'true');
  assert.equal(app.error.hidden, false);
  assert.equal(app.name.focused, true);
  app.name.value = 'Анна'; app.name.dispatch('input');
  assert.equal(app.error.hidden, true);
  assert.equal(app.name.getAttribute('aria-invalid'), null);
  app.submit();
  assert.equal(app.phone.getAttribute('aria-invalid'), 'true');
  assert.equal(app.phone.focused, true);
  app.phone.value = '+7 (999) 123-45-67'; app.submit();
  assert.equal(app.result.hidden, false);
  assert.equal(app.result.focused, true);
  assert.match(app.result.textContent, /Реальная заявка не отправлена/);
  assert.equal(app.name.value, '');
  assert.equal(app.phone.value, '');
  assert.equal(app.fields.hidden, true);
  app.reset.dispatch('click');
  assert.equal(app.result.hidden, true);
  assert.equal(app.fields.hidden, false);
  assert.equal(app.purpose.value, 'price');
  assert.equal(app.product.textContent, 'Вас интересует: BodyHealth');
});

test('booking query context does not rewrite titles on other pages', () => {
  const app = run('?purpose=price&product=bodyhealth', false);
  assert.equal(app.document.title, 'Запись на посещение' + suffix);
});
