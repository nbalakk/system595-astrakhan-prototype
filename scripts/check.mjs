import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('dist');
const required = ['index.html', 'rehabilitation/index.html', 'equipment/index.html', 'equipment/eyesystem/index.html', 'equipment/bodyhealth/index.html', 'reviews/index.html', 'articles/index.html', 'articles/first-visit/index.html', 'contacts/index.html', 'booking/index.html'];
let checks = 0;
for (const file of required) {
  const html = await readFile(path.join(root, file), 'utf8');
  assert.match(html, /<h1[ >]/, `${file}: heading`);
  assert.match(html, /name="viewport"/, `${file}: viewport`);
  assert.match(html, /noindex/, `${file}: site must not be indexed yet`);
  checks += 3;
}
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await inspect(file); continue; }
    assert(!/\.(?:md|env|log)$/.test(file), 'Internal files must not enter distribution');
    assert(!/^(?:review-pm(?:-v\d+)?|docs|preview|\.git)(?:[\\/]|$)/.test(path.relative(root, file)), 'Internal review material must not enter distribution');
    if (!file.endsWith('.html')) continue;
    const html = await readFile(file, 'utf8');
    const readable = html.replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    assert(!/прототип|демонстрацион|сценарий записи|после запуска сайта|на готовом сайте|позже добавим|здесь появ|появятся после подтверждения|планируем добавить|будет добавлен|место для реальной фотографии/iu.test(readable), `${file}: remove development copy from visitor content`);
    assert(!html.includes('class="prototype-bar"'), `${file}: no draft banner`);
    assert.match(html, /© 2026\. Центр здоровья и долголетия/, `${file}: neutral centre copyright`);
    checks += 3;
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
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
    assert(!/<form[^>]+action="https?:/i.test(html), 'Unavailable booking cannot post externally');
    if (html.includes('data-booking-form')) {
      assert.match(html, /<fieldset[^>]*disabled[^>]*data-booking-fields/, 'Booking fields stay disabled');
      assert.match(html, /Онлайн-запись пока недоступна\. Данные не отправляются/, 'Unavailable booking is stated next to the form');
      assert.match(html, /<button[^>]*type="submit"[^>]*disabled/, 'Unavailable submit stays disabled');
      assert(!html.includes('form-result'), 'No fictional booking success');
      checks += 4;
    }
    assert(!/tel:\+/.test(html), 'No centre telephone is confirmed');
  }
}
await inspect(root);
const js = await readFile(path.join(root, 'app.js'), 'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon)\b|document\.cookie/.test(js), 'Booking must not transmit or persist form data');
const displayJs = await readFile(path.join(root, 'display.js'), 'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|sessionStorage|indexedDB|sendBeacon)\b|document\.cookie/.test(displayJs), 'Display preferences cannot send data or use other storage');
assert.match(displayJs, /centre595\.display/, 'Only the owned display-preference key is used');
assert(!/\.elements\b|querySelector\(['"](?:input|form)/.test(displayJs), 'Display script must not read form fields');
for (const [route, minimum] of [['index.html', 3], ['reviews/index.html', 4]]) {
  const html = await readFile(path.join(root, route), 'utf8');
  assert.match(html, /Примеры отзывов для оценки оформления/, `${route}: example reviews must be visibly labelled`);
  assert([...html.matchAll(/<blockquote\b/g)].length >= minimum, `${route}: populated example reviews`);
  assert(!/aggregateRating|reviewRating|itemprop="ratingValue"|проверенный отзыв|проверено|звёзд|звезд/iu.test(html), `${route}: no fabricated rating or verification`);
  checks += 3;
}
console.log(`PASS: ${checks} page, link, content and asset checks; required pages present; booking privacy and distribution checks passed.`);
