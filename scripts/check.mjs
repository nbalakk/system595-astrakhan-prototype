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
  assert.match(html, /noindex/, `${file}: prototype must not be indexed`);
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
    assert(!/<form[^>]+action="https?:/i.test(html), 'Demo forms cannot post externally');
    if (html.includes('data-demo-form')) assert.match(html, /<fieldset[^>]*disabled[^>]*data-demo-fields/, 'Demo controls must stay disabled until JavaScript installs the non-sending handler');
    assert(!/tel:\+/.test(html), 'No centre telephone is confirmed');
  }
}
await inspect(root);
const js = await readFile(path.join(root, 'app.js'), 'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon)\b|document\.cookie/.test(js), 'Demo must not transmit or persist form data');
const displayJs = await readFile(path.join(root, 'display.js'), 'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|sessionStorage|indexedDB|sendBeacon)\b|document\.cookie/.test(displayJs), 'Display preferences cannot send data or use other storage');
assert.match(displayJs, /centre595\.display/, 'Only the owned display-preference key is used');
assert(!/\.elements\b|querySelector\(['"](?:input|form)/.test(displayJs), 'Display script must not read form fields');
console.log(`PASS: ${checks} page, link and asset checks; required pages present; demo privacy and distribution checks passed.`);
