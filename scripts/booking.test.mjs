import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { booking, home } from '../site/pages.mjs';
import { layout } from '../site/components.mjs';

for (const [page, render, prefix] of [['home', home, './'], ['visit arrangements', booking, '../']]) {
  test(`${page} offers a direct call and map before JavaScript runs`, () => {
    const body = render(prefix);
    assert.match(body, /<a\b[^>]*href="tel:\+79093738094"[^>]*>/i);
    assert.match(body, /<a\b[^>]*href="https:\/\/yandex\.ru\/maps\/\?text=[^"]+"[^>]*>/i);
    assert.doesNotMatch(body, /<form\b|<fieldset\b|name="(?:name|phone|purpose)"/i);
  });
}

// The static server serves /booking/index.html for every search string.
// Exercise the shipped client script with those old URLs as well. Booking
// content, including the title, must not change on load or history restore.
const script = await readFile(new URL('../site/app.js', import.meta.url), 'utf8');

test('the static header exposes the navigation and telephone without JavaScript', () => {
  const html = layout({ title: 'Статьи', description: '', route: 'articles/', prefix: '../', body: '' });
  const header = html.match(/<header\b[\s\S]*?<\/header>/u)?.[0];
  const nav = header.match(/<nav\b[^>]*id="main-nav"[^>]*>[\s\S]*?<\/nav>/u)?.[0];
  assert(nav);
  assert.doesNotMatch(nav, /\bhidden\b|aria-hidden="true"/u);
  assert.match(nav, /href="\.\.\/articles\/" aria-current="page"/u);
  assert.match(nav, /href="\.\.\/five-steps\/"/u);
  assert.match(header, /<button\b[^>]*aria-controls="main-nav"[^>]*\bhidden\b/u);
  assert.equal((header.match(/href="tel:\+79093738094"/gu) || []).length, 1);
  assert.match(html, /href="#main"/u);
  assert.match(html, /<main id="main" tabindex="-1">/u);
});

test('the menu keeps disclosure, keyboard focus and layout changes in sync', () => {
  const document = new EventTarget();
  const menu = new EventTarget();
  const breakpoint = new EventTarget();
  const attributes = new Map();
  const sectionLink = { focus() { document.activeElement = sectionLink; } };
  const nav = {
    querySelector: () => sectionLink,
    contains: element => element === sectionLink
  };
  menu.getAttribute = name => attributes.get(name);
  menu.setAttribute = (name, value) => attributes.set(name, value);
  menu.focus = () => { document.activeElement = menu; };
  document.querySelector = selector => ({ '.menu-toggle': menu, '#main-nav': nav })[selector];
  document.querySelectorAll = () => [];
  breakpoint.matches = true;
  vm.runInNewContext(script, { document, window: { matchMedia: () => breakpoint } });

  assert.equal(menu.hidden, false);
  assert.equal(nav.hidden, true);
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
  menu.dispatchEvent(new Event('click'));
  assert.equal(nav.hidden, false);
  assert.equal(menu.getAttribute('aria-expanded'), 'true');
  menu.dispatchEvent(new Event('click'));
  assert.equal(nav.hidden, true);
  menu.dispatchEvent(new Event('click'));
  sectionLink.focus();
  const escape = Object.assign(new Event('keydown'), { key: 'Escape' });
  document.dispatchEvent(escape);
  assert.equal(nav.hidden, true);
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
  assert.equal(document.activeElement, menu);

  menu.dispatchEvent(new Event('click'));
  breakpoint.matches = false;
  breakpoint.dispatchEvent(new Event('change'));
  assert.equal(menu.hidden, true);
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
  assert.equal(nav.hidden, false);
  assert.equal(document.activeElement, sectionLink);
  breakpoint.matches = true;
  breakpoint.dispatchEvent(new Event('change'));
  assert.equal(menu.hidden, false);
  assert.equal(nav.hidden, true);
  assert.equal(document.activeElement, menu);
});

const oldLinks = [
  '/booking/?purpose=price',
  '/booking/?purpose=equipment',
  '/booking/?purpose=price&product=bodyhealth',
  '/booking/?purpose=equipment&product=eyesystem',
  '/booking/?product=footsystem',
  '/booking/?purpose=visit'
];
test('old booking URLs leave the static visit information and actions intact', () => {
  const location = new URL('https://example.test/booking/');
  const listeners = new Map();
  const document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const window = {
    location,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(callback);
    }
  };
  // Reading a legacy parameter would bring back a second, hidden enquiry flow.
  class VisitSearchParams extends URLSearchParams {
    get(name) {
      assert(!['purpose', 'product'].includes(name), 'Old enquiry parameters must be ignored');
      return super.get(name);
    }
  }
  Object.defineProperty(document, 'title', { value: 'Посещение центра', writable: false });
  for (const link of oldLinks) {
    location.href = new URL(link, location.origin).href;
    listeners.clear();
    vm.runInNewContext(script, { window, location, document, URLSearchParams: VisitSearchParams });
    for (const event of ['pageshow', 'popstate']) {
      for (const callback of listeners.get(event) ?? []) callback({ type: event });
    }
    assert.equal(document.title, 'Посещение центра');
  }
});

test('only an explicit activation creates and focuses the approved external player', () => {
  const approvedIds = ['4414548478691', '4274475829987'];
  for (const id of [...approvedIds, '8048117615331', '', '123?other=1', 'https://example.test/video']) {
    const created = [];
    const frame = { replaceChildren(player) { this.player = player; } };
    const button = {
      dataset: { okPlayer: id },
      hidden: true,
      closest(selector) { return selector === '[data-video-frame]' ? frame : null; },
      getAttribute(name) { return name === 'aria-label' ? 'Смотреть видео центра' : null; },
      addEventListener(event, handler) { if (event === 'click') this.activate = handler; }
    };
    const document = {
      querySelector: () => null,
      querySelectorAll: selector => selector === '[data-ok-player]' ? [button] : [],
      createElement(tag) {
        const element = { tag, focus() { this.focused = true; } };
        created.push(element);
        return element;
      }
    };
    vm.runInNewContext(script, { document });
    assert.equal(created.length, 0, 'Opening the page does not contact the video provider');
    if (!approvedIds.includes(id)) {
      assert.equal(button.activate, undefined, 'Unapproved media IDs must not produce an embed');
      continue;
    }
    assert.equal(button.hidden, false);
    button.activate();
    assert.equal(created.length, 1);
    assert.equal(frame.player.tag, 'iframe');
    const url = new URL(frame.player.src);
    assert.equal(url.origin, 'https://ok.ru');
    assert.equal(url.pathname, '/videoembed/' + id);
    assert.equal(frame.player.focused, true);
    assert.equal(frame.player.title, button.getAttribute('aria-label'));
  }
});
