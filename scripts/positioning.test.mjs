import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'pipe' });

async function collectPages(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectPages(file));
    else if (entry.name === 'index.html') files.push(file);
  }
  return files;
}

const files = await collectPages(path.join(root, 'dist'));
const rendered = await Promise.all(files.map(async file => ({
  route: path.relative(path.join(root, 'dist'), file).replaceAll('\\', '/'),
  html: await readFile(file, 'utf8')
})));

// Inspect what visitors read and assistive technology announces. Technical
// route names and CSS classes deliberately remain compatible with old links.
function readableContent(html) {
  const attributes = [...html.matchAll(/\b(?:aria-label|alt|title|content)="([^"]*)"/giu)].map(match => match[1]);
  const text = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, '')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  return [text, ...attributes].join(' ');
}

test('the build retains all 16 demonstration pages', () => {
  assert.equal(rendered.length, 16);
});

for (const { route, html } of rendered) {
  test(`${route} presents the health and longevity centre consistently`, () => {
    assert.equal(/реабилитац|факел/iu.test(readableContent(html)), false,
      'Public copy, metadata and accessible labels must use the agreed positioning');
    const header = html.match(/<header\b[\s\S]*?<\/header>/iu)?.[0] || '';
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/iu)?.[0] || '';
    for (const region of [header, footer]) {
      assert.match(readableContent(region), /Центр здоровья и долголетия/u);
      assert.match(readableContent(region), /Посещения центра/u);
    }
    assert.match(header, /aria-label="Главная — Центр здоровья и долголетия в Астрахани"/u);
  });
}

test('the homepage explains the audience and purpose of a visit', () => {
  const home = rendered.find(page => page.route === 'index.html');
  assert(home, 'Homepage must be built');
  const main = readableContent(home.html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] || '');
  for (const concept of [/здоров/iu, /долголети/iu, /пенсионер/iu, /(?:System|систем[аы])\s*5\/95/iu]) {
    assert.match(main, concept);
  }
});
