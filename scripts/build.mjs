import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as pages from '../site/pages.mjs';
import { layout } from '../site/components.mjs';
import { centre, centreStories, healthArticles, products } from '../site/content.mjs';
import { contactCard } from './contact-card.mjs';
import { fiveStepsPage } from '../site/five-steps.mjs';
import { centreStory, healthArticle, healthIndex } from '../site/health-articles.mjs';

const articleSlugs = new Set(['first-visit']);
for (const { slug } of [...healthArticles, ...centreStories]) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || articleSlugs.has(slug)) {
    throw new Error(`Invalid or duplicate article slug: ${slug}`);
  }
  articleSlugs.add(slug);
}

const routes = [
  ['', 'Центр здоровья и долголетия', pages.home, 'Центр здоровья и долголетия на Савушкина в Астрахани. Познакомьтесь с группой, посмотрите занятие и запишитесь на первый визит по телефону.'],
  ['rehabilitation/', 'Первое посещение центра', pages.rehabilitation, 'Что ждёт вас в центре и какие вопросы можно задать Светлане перед встречей.'],
  ['five-steps/', 'Пять шагов программы посещений', fiveStepsPage, 'Пять шагов программы системы 5/95 от первого знакомства до повторной встречи. Видео можно смотреть прямо на сайте.'],
  ['equipment/', 'Об аппаратах системы 5/95', pages.catalog, 'Иллюстрированный справочник для посетителя. Посмотрите, как устроены аппараты и что уточнить о конкретной модели.'],
  ['reviews/', 'Отзывы о посещении центра', pages.reviews, 'Три месяца в центре. Рассказ посетительницы по записи от 27 января 2023 года, короткая цитата и оригинал видео.'],
  ['articles/', 'Статьи', p => healthIndex(p, healthArticles, centreStories), 'Истории и фотографии из архива центра в Астрахани. Статьи о давлении, сне, суставах, зрении и повседневном здоровье.'],
  ['articles/first-visit/', 'Как подготовиться к первому посещению', pages.article, 'О чём договориться по телефону, как найти центр и какие вопросы взять с собой.'],
  ...healthArticles.map(article => [`articles/${article.slug}/`, article.title, p => healthArticle(p, article), article.summary]),
  ...centreStories.map(story => [`articles/${story.slug}/`, story.title, p => centreStory(p, story), story.summary]),
  ['contacts/', 'Контакты центра', pages.contacts, 'Телефоны Светланы Бабак и адрес центра на карте Астрахани.'],
  ['booking/', 'Договориться о посещении', pages.booking, 'Позвоните в центр, подберите время первого визита и откройте адрес на карте.'],
  ['media/', 'Фото, видео и источники', pages.media, 'Архивные материалы центра и источники иллюстраций к справочнику об аппаратах.'],
  ['privacy/', 'О данных на сайте', pages.privacy, 'Как работают ссылки для звонка, переход на карту и настройки крупного текста.'],
  ...products.map(product => [`equipment/${product.slug}/`, product.name, p => pages.productPage(p, product), `Как выглядит ${product.name} и что уточнить у консультанта перед посещением центра.`])
];
await mkdir('dist', { recursive: true });
await mkdir('dist/assets', { recursive: true });
await writeFile('dist/assets/centre-contact.vcf', contactCard(centre), 'utf8');
const assets = ['eyesystem.png', 'spinesystem.png', 'sleepsystem.png', 'footsystem.png', 'moxi.png', 'hero-source.jpg', 'sleep-use.jpg', 'foot-use.jpg', 'bodyhealth.jpg', 'bodyhealth-use.jpg', 'bodyhealth-controls.jpg', 'novueye-studio.jpg', 'toprelax-studio.jpg', 'zanyatie.jpg', 'feedback.jpg', 'den-rossii-astrakhan.jpg', 'novueye-ok.jpg', 'novuheat-autumn.jpg', 'vision-street-ok.jpg', 'den-pensionera.webp', 'five-steps.mp4', 'five-steps-ru.vtt', 'five-steps-poster.jpg', 'favicon.svg', 'OFL.txt', ...[0,1,2,3].map(i => `golos-${i}.ttf`)];
const centrePhotos = ['astrakhan-lesson-poster.jpg', 'network-welcome.webp'];
for (const asset of [...assets, ...centrePhotos]) await cp(`site/assets/${asset}`, `dist/assets/${asset}`);
const styles = await Promise.all(['site/styles.css', 'site/refinement.css', 'site/bodyhealth.css', 'site/landing.css', 'site/reviews.css', 'site/five-steps.css', 'site/health-articles.css', 'site/navigation.css', 'site/interior.css', 'site/display.css'].map(file => readFile(file, 'utf8')));
await writeFile('dist/styles.css', styles.join('\n'));
await cp('site/app.js', 'dist/app.js');
await cp('site/display.js', 'dist/display.js');
for (const [route, title, render, description] of routes) {
  const depth = route.split('/').filter(Boolean).length;
  const prefix = depth ? '../'.repeat(depth) : './';
  const directory = path.join('dist', route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), layout({ title, description, route, prefix, body: render(prefix).replaceAll('<br>', '<br> ') }));
}
await writeFile('dist/.nojekyll', '');
await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
console.log(`Built ${routes.length} static pages in dist. All internal paths are relative.`);
