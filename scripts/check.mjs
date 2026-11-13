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
    for (const region of ['header', 'footer']) {
      const markup = html.match(new RegExp(`<${region}\\b[\\s\\S]*?<\\/${region}>`, 'i'))?.[0] || '';
      assert.match(markup, /<a\b[^>]*href="tel:\+79093738094"[^>]*>/, `${file}: ${region} must link to the main centre telephone`);
      checks++;
    }
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
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
    assert(!/<form[^>]+action="https?:/i.test(html), 'Unavailable booking cannot post externally');
    if (html.includes('data-booking-form')) {
      assert.match(html, /<fieldset[^>]*disabled[^>]*data-booking-fields/, 'Booking fields stay disabled');
      assert.match(html, /Онлайн-запись пока недоступна\. Данные не отправляются/, 'Unavailable booking is stated next to the form');
      assert.match(html, /<button[^>]*type="submit"[^>]*disabled/, 'Unavailable submit stays disabled');
      assert(!html.includes('form-result'), 'No fictional booking success');
      const fields = html.match(/<fieldset[^>]*data-booking-fields[^>]*>[\s\S]*?<\/fieldset>/)?.[0] || '';
      assert(!/href="tel:/i.test(fields), 'Telephone links must stay outside disabled booking controls');
      checks += 5;
    }
  }
}
await inspect(root);
const contacts = await readFile(path.join(root, 'contacts/index.html'), 'utf8');
for (const value of ['tel:+79093738094', 'tel:+79170867329', 'https://www.instagram.com/novumedical_astrakhan/']) {
  assert(contacts.includes(`href="${value}"`), `Contacts must include the supplied clickable ${value}`);
  checks++;
}
assert.match(contacts, /Светлана Михайловна Бабак/, 'Contacts must identify the supplied contact person');
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
assert(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon)\b|document\.cookie/.test(js), 'Booking must not transmit or persist form data');
const displayJs = await readFile(path.join(root, 'display.js'), 'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|sessionStorage|indexedDB|sendBeacon)\b|document\.cookie/.test(displayJs), 'Display preferences cannot send data or use other storage');
assert.match(displayJs, /centre595\.display/, 'Only the owned display-preference key is used');
assert(!/\.elements\b|querySelector\(['"](?:input|form)/.test(displayJs), 'Display script must not read form fields');
for (const [route, minimum] of [['index.html', 3], ['reviews/index.html', 4]]) {
  const html = await readFile(path.join(root, route), 'utf8');
  assert(!html.includes('Примеры отзывов для оценки оформления'), `${route}: old review caption must be absent`);
  assert([...html.matchAll(/<blockquote\b/g)].length >= minimum, `${route}: populated reviews`);
  if (route === 'reviews/index.html') assert.match(html, /aria-label="Отзывы о посещении"/, `${route}: reviews use the agreed accessible label`);
  assert(!/aggregateRating|reviewRating|itemprop="ratingValue"|проверенный отзыв|проверено|звёзд|звезд/iu.test(html), `${route}: no fabricated rating or verification`);
  checks += route === 'reviews/index.html' ? 4 : 3;
}
const media = await readFile(path.join(root, 'media/index.html'), 'utf8');
assert(!/отзыв/iu.test(media.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || ''), 'Photo sources must not contain a public review-sample disclosure');
checks++;
console.log(`PASS: ${checks} page, link, content and asset checks; required pages present; booking privacy and distribution checks passed.`);
