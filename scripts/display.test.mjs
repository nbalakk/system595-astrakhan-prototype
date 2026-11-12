import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../site/display.js', import.meta.url), 'utf8');
const key = 'centre595.display';

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.attributes = {};
    this.listeners = {};
    this.hidden = true;
    this.disabled = true;
    this.textContent = '';
    this.focused = false;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  addEventListener(name, listener) { this.listeners[name] = listener; }
  querySelector() { return null; }
  focus() { this.focused = true; }
  click() { this.listeners.click?.(); }
}

function run({ raw, readDenied = false, writeDenied = false } = {}) {
  const root = new Element();
  const toggle = new Element();
  const panel = new Element();
  const close = new Element();
  const sizes = ['large', 'larger', 'largest'].map(size => new Element({ displaySize: size }));
  const themes = ['light', 'dark'].map(theme => new Element({ displayTheme: theme }));
  const writes = [];
  const values = new Map(raw === undefined ? [] : [[key, raw]]);
  const document = {
    documentElement: root,
    readyState: 'loading',
    listeners: {},
    addEventListener(name, listener) { this.listeners[name] = listener; },
    querySelector(selector) { return selector === '#display-settings' ? panel : null; },
    querySelectorAll(selector) {
      return {
        '[data-display-toggle]': [toggle],
        '[data-display-close]': [close],
        '[data-display-size]': sizes,
        '[data-display-theme]': themes
      }[selector] || [];
    }
  };
  const localStorage = {
    getItem(name) { assert.equal(name, key, 'Only display preferences may be read'); if (readDenied) throw Error('Storage disabled'); return values.get(name) ?? null; },
    setItem(name, value) {
      if (writeDenied) throw Error('Storage full');
      writes.push({ key: name, value }); values.set(name, value);
    }
  };
  const context = vm.createContext({ document, localStorage });
  vm.runInContext(source, context);
  return { document, root, toggle, panel, close, sizes, themes, writes, values, ready: () => document.listeners.DOMContentLoaded() };
}

test('head script restores valid display settings before page controls exist', () => {
  const app = run({ raw: JSON.stringify({ enabled: true, size: 'largest', theme: 'dark' }) });
  assert.deepEqual(app.root.dataset, { display: 'accessible', textSize: 'largest', contrast: 'dark' });
  assert.equal(app.toggle.hidden, true);
  app.ready();
  assert.equal(app.toggle.hidden, false);
  assert.equal(app.toggle.disabled, false);
  assert.equal(app.toggle.textContent, 'Обычная версия');
  assert.equal(app.toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(app.panel.hidden, false);
  assert.equal(app.sizes[2].getAttribute('aria-pressed'), 'true');
  assert.equal(app.themes[1].getAttribute('aria-pressed'), 'true');
});

test('only whitelisted settings are retained and written, never arbitrary fields', () => {
  const app = run({ raw: JSON.stringify({ enabled: 'yes', size: '400px', theme: 'red', name: 'Private Name', phone: '79999999999' }) });
  app.ready();
  assert.deepEqual(app.root.dataset, {});
  app.toggle.click();
  app.sizes[1].click();
  app.themes[1].click();
  assert(app.writes.length > 0);
  for (const item of app.writes) {
    assert.equal(item.key, key);
    const value = JSON.parse(item.value);
    assert.deepEqual(Object.keys(value).sort(), ['enabled', 'size', 'theme']);
    assert.equal(typeof value.enabled, 'boolean');
    assert(['large', 'larger', 'largest'].includes(value.size));
    assert(['light', 'dark'].includes(value.theme));
    assert(!item.value.includes('Private Name'));
    assert(!item.value.includes('79999999999'));
  }
  assert.deepEqual(JSON.parse(app.values.get(key)), { enabled: true, size: 'larger', theme: 'dark' });
});

test('display preference persists to a subsequent page and can return to normal', () => {
  const first = run(); first.ready();
  first.toggle.click(); first.sizes[2].click(); first.themes[1].click();
  assert.equal(first.panel.focused, true);
  const next = run({ raw: first.values.get(key) }); next.ready();
  assert.deepEqual(next.root.dataset, { display: 'accessible', textSize: 'largest', contrast: 'dark' });
  next.close.click();
  assert.deepEqual(next.root.dataset, {});
  assert.equal(next.panel.hidden, true);
  assert.equal(next.toggle.textContent, 'Версия для слабовидящих');
  assert.equal(next.toggle.getAttribute('aria-pressed'), 'false');
  assert.equal(next.toggle.focused, true);
  assert.deepEqual(JSON.parse(next.values.get(key)), { enabled: false, size: 'largest', theme: 'dark' });
});

test('malformed or unavailable storage does not block display controls', () => {
  for (const options of [{ raw: '{invalid' }, { readDenied: true }, { writeDenied: true }, { raw: '[]' }, { raw: 'null' }]) {
    const app = run(options); app.ready();
    assert.deepEqual(app.root.dataset, {});
    app.toggle.click();
    assert.equal(app.root.dataset.display, 'accessible');
    app.sizes[1].click();
    assert.equal(app.root.dataset.textSize, 'larger');
    app.close.click();
    assert.deepEqual(app.root.dataset, {});
  }
});
