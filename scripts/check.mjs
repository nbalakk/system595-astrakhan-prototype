import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('dist');
const requiredRoutes = [
  '', 'five-steps/', 'rehabilitation/', 'equipment/', 'articles/', 'articles/first-visit/',
  'reviews/', 'contacts/', 'booking/', 'media/', 'privacy/',
  ...['eyesystem', 'spinesystem', 'sleepsystem', 'footsystem', 'moxi', 'bodyhealth'].map(slug => `equipment/${slug}/`)
];
const legacySections = {
  '': ['appointment'],
  'rehabilitation/': ['first-visit', 'visits', 'at-home'],
  'articles/first-visit/': ['before', 'questions', 'bring', 'home'],
  'contacts/': ['contact-details']
};
let checks = 0;
for (const route of requiredRoutes) {
  const file = route + 'index.html';
  const html = await readFile(path.join(root, file), 'utf8');
  assert.match(html, /<h1[ >]/, `${file}: heading`);
  assert.match(html, /name="viewport"/, `${file}: viewport`);
  assert.match(html, /<meta\b(?=[^>]*name="robots")(?=[^>]*content="[^"]*\bnoindex\b)[^>]*>/i, `${file}: keep the site out of search results`);
  for (const id of legacySections[route] ?? []) {
    assert(html.includes(`id="${id}"`), `${route}#${id}: previous section link needs a visitor destination`);
    checks++;
  }
  checks += 3;
}
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await inspect(file); continue; }
    assert(!/\.(?:md|zip|env|log)$|^\.env(?:\.|$)/i.test(entry.name), 'Internal files must not enter distribution');
    assert(!/^(?:review-pm(?:-v\d+)?|docs|preview|\.git)(?:[\\/]|$)/.test(path.relative(root, file)), 'Internal review material must not enter distribution');
    if (!file.endsWith('.html')) continue;
    const html = await readFile(file, 'utf8');
    for (const resource of html.matchAll(/<(?:img|picture|source|iframe|script|video|audio|link)\b[^>]*>/gi)) {
      const remote = /\b(?:src|srcset|poster|href)="(?:[^"]*,\s*)?(?:https?:)?\/\//i;
      assert(!remote.test(resource[0]), `${file}: external media or scripts must not make a request on page load`);
    }
    const readable = html.replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    assert(!/прототип|демонстрацион|сценарий записи|после запуска сайта|на готовом сайте|позже добавим|здесь появ|появятся после подтверждения|планируем добавить|будет добавлен|место для реальной фотографии/iu.test(readable), `${file}: remove development copy from visitor content`);
    assert(!html.includes('class="prototype-bar"'), `${file}: no draft banner`);
    assert.match(html, /© 2026\. Центр здоровья и долголетия/, `${file}: neutral centre copyright`);
    checks += 3;
    for (const region of ['header', 'footer']) {
      const markup = html.match(new RegExp(`<${region}\\b[\\s\\S]*?<\\/${region}>`, 'i'))?.[0] || '';
      assert.match(markup, /<a\b[^>]*href="tel:\+79093738094"[^>]*>/, `${file}: ${region} must link to the main centre telephone`);
      checks++;
    }
    for (const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
      const value = match[1];
      if (value.startsWith('tel:')) {
        assert(['tel:+79093738094', 'tel:+79170867329'].includes(value), `${file}: only the two supplied telephone numbers may be linked`);
        checks++;
      }
      if (/^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
      assert(!value.startsWith('/'), `${file}: absolute path breaks repository hosting: ${value}`);
      const [urlPath] = value.split(/[?#]/);
      const target = path.resolve(path.dirname(file), decodeURIComponent(urlPath || '.'));
      assert(target.startsWith(root + path.sep) || target === root, 'Link escapes distribution');
      const targetStat = await stat(target);
      const targetFile = targetStat.isDirectory() ? path.join(target, 'index.html') : target;
      if (targetStat.isDirectory()) await stat(targetFile);
      const fragment = value.split('#')[1];
      if (fragment && targetFile.endsWith('.html')) {
        const targetHtml = await readFile(targetFile, 'utf8');
        const ids = new Set([...targetHtml.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
        assert(ids.has(decodeURIComponent(fragment)), `${file}: missing fragment ${fragment}`);
      }
      checks++;
    }
    assert.doesNotMatch(html, /<form\b|data-booking-form/i, `${file}: visits are arranged directly by phone`);
    assert.doesNotMatch(html, /(?:[?&]|&amp;)(?:purpose|product)=/i, `${file}: navigation must not launch an old enquiry scenario`);
    checks += 2;
  }
}
await inspect(root);
const contacts = await readFile(path.join(root, 'contacts/index.html'), 'utf8');
for (const value of ['tel:+79093738094', 'tel:+79170867329']) {
  assert(contacts.includes(`href="${value}"`), `Contacts must include the supplied clickable ${value}`);
  checks++;
}
assert.match(contacts, /Светлана (?:Михайловна )?Бабак/, 'Contacts must identify the consultant');
const mapLink = [...contacts.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]).find(value => value.startsWith('https://yandex.ru/maps/'));
assert(mapLink, 'Contacts must include a Yandex Maps address search');
const mapUrl = new URL(mapLink.replaceAll('&amp;', '&'));
assert.equal(mapUrl.pathname, '/maps/', 'The map link must be a simple address search');
assert.deepEqual([...mapUrl.searchParams.keys()], ['text'], 'The map must use only an address search, without an organisation ID or coordinates');
const mapAddress = mapUrl.searchParams.get('text');
for (const part of [/Астрахань/u, /Савушкина/u, /46А/u, /Факел/u]) assert.match(mapAddress, part, 'The map search must use the supplied centre address');
assert(!mapUrl.hash, 'The map search must not pin unverified coordinates');
checks += 4;
const js = await readFile(path.join(root, 'app.js'), 'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon)\b|document\.cookie/.test(js), 'Site interactions must not transmit or store visitor data');
const displayJs = await readFile(path.join(root, 'display.js'), 'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|sessionStorage|indexedDB|sendBeacon)\b|document\.cookie/.test(displayJs), 'Display preferences cannot send data or use other storage');
assert.match(displayJs, /centre595\.display/, 'Only the owned display-preference key is used');
assert(!/\.elements\b|querySelector\(['"](?:input|form)/.test(displayJs), 'Display script must not read form fields');
const stylesheet = await readFile(path.join(root, 'styles.css'), 'utf8');
assert.doesNotMatch(stylesheet, /(?:url\(\s*|@import\s+)["']?(?:https?:)?\/\//i, 'Styles must use local assets');
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /User-agent:\s*\*\s+Disallow:\s*\/\s*$/i);
console.log(`PASS: ${checks} page, link, asset and visit checks; all previous routes are present.`);
