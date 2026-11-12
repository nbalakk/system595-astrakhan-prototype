import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as pages from '../site/pages.mjs';
import { layout } from '../site/components.mjs';
import { products } from '../site/content.mjs';

const routes = [
  ['', 'Реабилитация в центре и оборудование для дома', pages.home],
  ['rehabilitation/', 'Реабилитация в центре', pages.rehabilitation],
  ['equipment/', 'Каталог оборудования системы 5/95', pages.catalog],
  ['reviews/', 'Отзывы посетителей', pages.reviews],
  ['articles/', 'Полезные материалы', pages.articles],
  ['articles/first-visit/', 'Как подготовиться к первому посещению', pages.article],
  ['contacts/', 'О центре и контакты', pages.contacts],
  ['booking/', 'Запись на посещение', pages.booking],
  ['media/', 'О материалах и данных прототипа', pages.media],
  ['privacy/', 'Как работает демонстрационная форма', pages.privacy],
  ...products.map(product => [`equipment/${product.slug}/`, product.name, p => pages.productPage(p, product)])
];
await mkdir('dist', { recursive: true });
await mkdir('dist/assets', { recursive: true });
const assets = ['eyesystem.png', 'spinesystem.png', 'sleepsystem.png', 'footsystem.png', 'moxi.png', 'hero-source.jpg', 'sleep-use.jpg', 'foot-use.jpg', 'bodyhealth.jpg', 'bodyhealth-use.jpg', 'bodyhealth-controls.jpg', 'favicon.svg', 'OFL.txt', ...[0,1,2,3].map(i => `golos-${i}.ttf`)];
for (const asset of assets) await cp(`site/assets/${asset}`, `dist/assets/${asset}`);
const styles = await Promise.all(['site/styles.css', 'site/refinement.css', 'site/bodyhealth.css', 'site/landing.css', 'site/display.css'].map(file => readFile(file, 'utf8')));
await writeFile('dist/styles.css', styles.join('\n'));
await cp('site/app.js', 'dist/app.js');
await cp('site/display.js', 'dist/display.js');
for (const [route, title, render] of routes) {
  const depth = route.split('/').filter(Boolean).length;
  const prefix = depth ? '../'.repeat(depth) : './';
  const directory = path.join('dist', route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), layout({ title, description: 'Центр реабилитации в Астрахани: знакомство с центром и оборудованием системы 5/95 для дома. Демонстрационный прототип.', route, prefix, body: render(prefix).replaceAll('<br>', '<br> ') }));
}
await writeFile('dist/.nojekyll', '');
await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
console.log(`Built ${routes.length} static pages in dist. All internal paths are relative.`);
