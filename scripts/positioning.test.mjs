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

const healthSlugs = ['blood-pressure', 'swollen-ankles', 'sleep', 'back-pain', 'knee-arthritis', 'steady-walking', 'diabetes-foot-care', 'vision-changes'];
const healthPaths = new Set(healthSlugs.map(slug => `articles/${slug}/index.html`));
const articles = rendered.filter(page => healthPaths.has(page.route));
const mainContent = html => html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] ?? '';
const home = rendered.find(page => page.route === 'index.html');
const homeMain = mainContent(home.html);
const homeSections = [...homeMain.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/giu)].map(match => match[0]);
const homeHero = homeSections[0];
const heroFigures = [...homeHero.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/giu)].map(match => match[0]);
const homeLesson = homeMain.match(/<figure\b[^>]*\bid="video-iz-zala"[^>]*>[\s\S]*?<\/figure>/iu)?.[0] ?? '';
const approvedStories = new Map([
  ['zanyatie-v-zale', ['2023-03-07', '4414548478691', 'zanyatie.jpg']],
  ['otzyv-posetitelnitsy', ['2023-01-27', '4274475829987', 'feedback.jpg']],
  ['den-pensionera', ['2025-09-24', '9605424941795', 'den-pensionera.webp']],
  ['den-rossii-v-centre', ['2024-06-19', '7050131409635', 'den-rossii-astrakhan.jpg']],
  ['novueye-v-kresle', ['2023-01-18', '4247297264355', 'novueye-ok.jpg']],
  ['teplovoy-kovrik-voprosy', ['2026-10-08', null, 'novuheat-autumn.jpg']],
  ['kogda-vyveski-rasplyvayutsya', ['2026-03-17', null, 'vision-street-ok.jpg']]
]);
const photoSources = new Map([
  ['teplovoy-kovrik-voprosy', 'https://ok.ru/profile/583466162659/statuses/157546717183459'],
  ['kogda-vyveski-rasplyvayutsya', 'https://ok.ru/profile/583466162659/statuses/157318563626467']
]);
const relatedGuides = new Map([
  ['novueye-v-kresle', 'vision-changes'],
  ['teplovoy-kovrik-voprosy', 'blood-pressure'],
  ['kogda-vyveski-rasplyvayutsya', 'vision-changes']
]);
const stories = rendered.filter(page => /^articles\/[^/]+\/index\.html$/.test(page.route) && approvedStories.has(page.route.split('/')[1]));
const archiveRoutes = new Set(['articles/index.html', ...stories.map(page => page.route)]);
const editorialRoutes = new Set([...archiveRoutes, ...healthPaths]);

// Resolve real links as the browser does on a repository subpath, even when a
// card includes an illustration, a title and an excerpt inside the same anchor.
function linksInMain({ route, html }, markup = mainContent(html)) {
  const base = new URL(route, 'https://site.test/prototype/');
  return [...markup.matchAll(/<a\b[^>]*?\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/giu)].map(match => {
    const url = new URL(match[1].replaceAll('&amp;', '&'), base);
    return { url, label: match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() };
  });
}

test('the established pages, eight health guides and centre archive are built', () => {
  assert.equal(stories.length, approvedStories.size);
  assert.equal(rendered.length, 17 + healthSlugs.length + stories.length);
  assert.equal(articles.length, 8);
  assert(rendered.some(page => page.route === 'articles/first-visit/index.html'));
  assert(rendered.some(page => page.route === 'five-steps/index.html'));
});

for (const { route, html } of rendered) {
  test(`${route} keeps the centre identity and visit-only positioning`, () => {
    const publicCopy = readableContent(html);
    if (!editorialRoutes.has(route)) {
      assert.doesNotMatch(publicCopy, /реабилитац/iu);
      assert.doesNotMatch(publicCopy, /(?<!\p{L})(?:покуп[ак]|купить|продаж|приобрест|приобрет|заказать|доставк|корзин|каталог|(?:стоимость|цена|цену|цены)\s+(?:на\s+)?(?:аппарат|модел|оборудован))/iu,
        'Service pages must guide a visit, including on former shop routes');
      assert.doesNotMatch(publicCopy, /(?:выбрать|выбор[ае]?|подобрать|подбор[ае]?)\s+(?:модел|аппарат|оборудован)/iu);
    } else {
      // A health source may discuss rehabilitation or buying a walking aid.
      // It must never turn this centre into a clinic or a shop.
      assert.doesNotMatch(publicCopy, /наш(?:ем|его|им)?\s+реабилитационн|(?:купить|заказать|прода[её]м)\s+(?:аппарат|оборудован)|узнать\s+(?:стоимость|цену)\s+(?:аппарат|оборудован)|добавить\s+в\s+корзину/iu);
    }
    assert.doesNotMatch(publicCopy, /(?:систем[аы]\s*5\/95|BodyHealth)\s+(?:лечит|излечивает|нормализует давление|восстанавливает зрение|гарантирует выздоровление)/iu);
    for (const brand of html.matchAll(/<a\b(?=[^>]*\bclass="[^"]*\bbrand\b[^"]*")[^>]*>[\s\S]*?<\/a>/giu)) {
      assert.doesNotMatch(readableContent(brand[0]), /факел/iu, 'The address landmark must not become the centre brand');
    }
    const header = html.match(/<header\b[\s\S]*?<\/header>/iu)?.[0] || '';
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/iu)?.[0] || '';
    for (const region of [header, footer]) {
      assert.match(readableContent(region), /Центр здоровья и долголетия/u);
    }
  });
}

test('the first screen names the centre in Astrakhan and offers a free introductory visit by phone', () => {
  const heading = homeHero.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/iu);
  assert(heading, 'The centre name is the main heading');
  assert.match(readableContent(heading[1]), /центр здоровья и долголетия/iu);
  const copy = readableContent(homeHero.replace(/<figure\b[\s\S]*?<\/figure>/giu, ''));
  assert.match(copy, /Астрахан/iu);
  assert.match(copy, /бесплатн[а-яё]*\s+ознакомительн[а-яё]*\s+заняти[а-яё]*/iu);
  const links = linksInMain(home, homeHero);
  assert(links.some(link => link.url.href === 'tel:+79093738094' && /позвон|запис/iu.test(link.label)),
    'The named first-visit action dials the centre directly');
  assert(links.some(link => link.url.hash === '#video-iz-zala' && /смотр|видео|заняти/iu.test(link.label)),
    'A separate hero action takes the visitor to the local lesson');
});

test('home keeps the first visit and directions reachable', () => {
  const copy = readableContent(homeMain);
  assert.match(homeMain, /\bid="first-meeting"/u, 'The first-meeting section remains directly addressable');
  const links = linksInMain(home);
  assert(links.some(link => /\/prototype\/(?:rehabilitation|booking)\/$/u.test(link.url.pathname) && link.label));
  assert(links.some(link => (link.url.pathname === '/prototype/contacts/' || /yandex\..*\/maps\//u.test(link.url.href)) && link.label));
  assert.doesNotMatch(copy, /NovuEye|TopRelax|EyeSystem|SpineSystem|SleepSystem|FootSystem|BodyHealth|NovuHeat|\bMoxi\b/iu,
    'A first visit must not read like a list of models');
});

test('the articles hub leads with practical guides and keeps every archived story reachable', () => {
  const hub = rendered.find(page => page.route === 'articles/index.html');
  const main = mainContent(hub.html);
  assert.match(main, /<h1\b[^>]*>\s*Статьи\s*<\/h1>/iu);
  const guides = main.indexOf('id="health"');
  const archive = [...main.matchAll(/<details\b[^>]*>[\s\S]*?<\/details>/giu)]
    .find(match => match[0].includes('id="archive-index-title"'));
  assert(guides >= 0 && archive && archive.index > guides, 'Practical guides precede the optional archive');
  const hubLinks = linksInMain(hub);
  const site = 'https://site.test/prototype/';
  const archivedLinks = linksInMain(hub, archive[0]);
  for (const slug of approvedStories.keys()) {
    assert(archivedLinks.some(link => link.url.href === site + 'articles/' + slug + '/'), slug);
  }
  for (const page of [...stories, ...articles]) {
    const url = site + page.route.replace(/index\.html$/, '');
    assert(hubLinks.some(link => link.url.href === url && /[а-яё]/iu.test(link.label)),
      `The hub needs a text link to ${url}`);
  }
  for (const suffix of ['articles/first-visit/', 'articles/first-visit/#documents']) {
    assert(hubLinks.some(link => link.url.href === site + suffix && link.label), `The visit guide remains reachable at ${suffix}`);
  }
});

test('the first screen identifies and credits the network welcome photograph', () => {
  const photo = /<img\b[^>]*\bsrc="(?:\.\/)?assets\/network-welcome\.webp"[^>]*>/iu;
  const figure = heroFigures.find(markup => photo.test(markup));
  assert(figure, 'The hero includes the photograph from a network centre');
  const image = figure.match(photo)[0];
  assert.doesNotMatch(figure.split('>')[0] + image, /\bhidden\b|aria-hidden="true"/iu);
  assert.match(image, /\balt="[^"]*[а-яё][^"]*"/iu, 'The photograph has a Russian text alternative');
  const width = Number(image.match(/\bwidth="(\d+)"/iu)?.[1]);
  const height = Number(image.match(/\bheight="(\d+)"/iu)?.[1]);
  assert(width > height && height > 0, 'The landscape photograph reserves space while loading');
  const caption = figure.match(/<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/iu)?.[0] ?? '';
  assert.doesNotMatch(caption.split('>')[0], /\bhidden\b|aria-hidden="true"/iu);
  assert.match(readableContent(caption), /NovuMedical|сети|сетев/iu);
  assert(linksInMain(home, caption).some(link => link.url.href === 'https://site.test/prototype/media/#centre-photographs' && link.label),
    'Visitors can distinguish the network photograph from the local footage and check its credit');
});

test('the local lesson follows the three steps and opens only on request', () => {
  const lesson = homeLesson;
  assert(lesson, 'The original video address reaches the lesson figure');
  const beforeLesson = homeMain.slice(homeMain.indexOf(homeHero) + homeHero.length, homeMain.indexOf(lesson));
  const steps = [...beforeLesson.matchAll(/<ol\b[^>]*>[\s\S]*?<\/ol>/giu)]
    .find(list => [...list[0].matchAll(/<li\b/giu)].length === 3);
  assert(steps, 'An ordered list of three first-visit steps appears between the hero and the film');
  assert.equal([...homeMain.matchAll(/\bid="video-iz-zala"/gu)].length, 1);
  assert.doesNotMatch(lesson, /<(?:video|audio|iframe)\b/iu, 'Playback waits until the visitor activates the control');
  assert.doesNotMatch(lesson.split('>')[0], /\bhidden\b|aria-hidden="true"/iu);
  const poster = lesson.match(/<img\b[^>]*\bsrc="(?:\.\/)?assets\/astrakhan-lesson-poster\.jpg"[^>]*>/iu)?.[0] ?? '';
  assert.doesNotMatch(poster, /\bhidden\b|aria-hidden="true"/iu);
  assert.match(poster, /\balt="[^"]*[а-яё][^"]*"/iu, 'The real lesson still has a Russian text alternative');
  assert.match(readableContent(lesson), /1\s*:\s*39|1\s*мин\S*\s+39\s*с/iu);
  assert.match(lesson, /<button\b[^>]*\bdata-ok-player="4414548478691"/iu);
  assert(linksInMain(home, lesson).some(link => link.url.href === 'https://ok.ru/video/4414548478691' && link.label),
    'The local lesson also opens on OK from the same figure');
});

test('every article has a distinct title, subheadings and named source links', () => {
  const titles = new Set();
  for (const page of articles) {
    const article = mainContent(page.html).match(/<article\b[\s\S]*?<\/article>/iu)?.[0] ?? '';
    const headings = [...article.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/giu)];
    assert.equal(headings.length, 1, `${page.route}: one article title`);
    const title = readableContent(headings[0][1]).trim();
    assert(/[а-яё]/iu.test(title) && !titles.has(title), `${page.route}: unique readable article title`);
    titles.add(title);
    assert.match(article, /<h2\b[^>]*>[^<\s]/iu, `${page.route}: named sections`);
    const sources = article.match(/<section\b[^>]*\bclass="[^"]*\bhealth-sources\b[^"]*"[^>]*>([\s\S]*?)<\/section>/iu)?.[1] ?? '';
    const sourceLinks = [...sources.matchAll(/<a\b[^>]*?\bhref="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/giu)];
    assert(sourceLinks.length > 0, `${page.route}: sources must have actual links`);
    assert.equal(sourceLinks.length, [...sources.matchAll(/<li\b/gi)].length, `${page.route}: every listed source needs a link`);
    for (const [, address, name] of sourceLinks) {
      const url = new URL(address.replaceAll('&amp;', '&'));
      assert.equal(url.protocol, 'https:', `${page.route}: secure source link`);
      assert(url.pathname !== '/', `${page.route}: link to the referenced material`);
      assert(/[\p{L}]/u.test(name.replace(/<[^>]+>/g, '').replace(/https?:\/\/\S+/g, '')), `${page.route}: source links need publication names`);
    }
    assert(linksInMain(page).some(link => link.url.href === 'https://site.test/prototype/articles/' && link.label),
      `${page.route}: readers can return to all articles`);
  }
});

test('each centre story identifies its original dated OK publication', () => {
  for (const page of stories) {
    const main = mainContent(page.html);
    const article = main.match(/<article\b[\s\S]*?<\/article>/iu)?.[0] ?? '';
    const slug = page.route.split('/')[1];
    const [date, videoId, poster] = approvedStories.get(slug);
    assert.equal([...article.matchAll(/<h1\b/giu)].length, 1, `${page.route}: one story title`);
    assert(article.includes(`<time datetime="${date}">`), `${page.route}: original publication date`);
    const links = linksInMain(page, article);
    const original = videoId ? 'https://ok.ru/video/' + videoId : photoSources.get(slug);
    assert(links.some(link => link.url.href === original && link.label), `${page.route}: direct source fallback`);
    const players = [...article.matchAll(/<button\b[^>]*\bdata-ok-player="([^"]+)"[^>]*>/gi)];
    assert.deepEqual(players.map(match => match[1]), videoId ? [videoId] : [], `${page.route}: only source videos have a play button`);
    assert(article.includes('assets/' + poster + '"'), `${page.route}: matching local cover`);
    assert.doesNotMatch(article, /<(?:iframe|video|audio)\b/i, `${page.route}: no embedded player on first load`);
    if (!videoId) {
      assert.doesNotMatch(article, /data-video-frame|data-ok-player|ok\.ru\/video/iu, `${page.route}: no video controls or video links for a photo story`);
      assert.doesNotMatch(readableContent(article), /видео|смотреть (?:запись|ролик)/iu, `${page.route}: its source and media are labelled as a publication`);
    }
    if (relatedGuides.has(slug)) {
      const related = 'https://site.test/prototype/articles/' + relatedGuides.get(slug) + '/';
      assert(linksInMain(page).some(link => link.url.href === related && link.label), `${page.route}: related health guide`);
    }
    assert(linksInMain(page).some(link => link.url.href === 'https://site.test/prototype/articles/' && link.label),
      `${page.route}: return to the articles hub`);
  }
});

test('the association and equipment illustrations have sources on the relevant pages', () => {
  const main = route => rendered.find(page => page.route === route)?.html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] ?? '';
  assert.match(main('media/index.html'), /href="https:\/\/novumedical\.org\/o-nas\/"/);
  assert.match(main('equipment/bodyhealth/index.html'), /href="https:\/\/novumedical\.org\/products\/bodyhealth\/"/);
  const sources = readableContent(main('media/index.html'));
  assert.match(sources, /(?:фото|иллюстрац)/iu);
  assert.match(sources, /(?:NovuMedical|5\s*\/\s*95)/iu);
});

test('the feedback area does not reuse the retired sample testimonials or ratings', () => {
  const reviews = rendered.find(page => page.route === 'reviews/index.html');
  assert(reviews, 'Old review links need a visitor page');
  const main = reviews.html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] ?? '';
  assert.match(readableContent(main), /(?:отзыв|отклик|впечатлен|впечатлён|посетител)/iu);
  const retiredQuotes = [
    'Я пришла с несколькими вопросами',
    'Сначала кнопки на аппарате показались сложными',
    'Понравилось, что можно спокойно сесть',
    'Я присматривала аппарат для дома'
  ];
  for (const { route, html } of rendered) {
    const text = readableContent(html);
    for (const sample of retiredQuotes) assert(!text.includes(sample), `${route}: retired placeholder testimonial`);
    assert.doesNotMatch(html, /aggregateRating|reviewRating|itemprop="ratingValue"/iu);
  }
});

test('home, visit and feedback pages offer the matching approved clip with a direct fallback', () => {
  const visit = { id: '4414548478691', duration: /1\s*:\s*39|1\s*мин\S*\s+39\s*с/iu };
  const feedback = { id: '4274475829987', duration: /1\s*:\s*36|1\s*мин\S*\s+36\s*с/iu };
  const approvedLinks = [visit, feedback].map(clip => 'https://ok.ru/video/' + clip.id);
  const clips = new Map([['index.html', visit], ['rehabilitation/index.html', visit], ['reviews/index.html', feedback]]);
  for (const { route, html } of rendered) {
    if (!archiveRoutes.has(route) && route !== 'index.html') {
      for (const match of html.matchAll(/href="(https?:\/\/(?:www\.)?ok\.ru\/video(?:embed)?\/[^"]+)"/giu)) {
        assert(approvedLinks.includes(match[1]), `${route}: only approved service clips may be linked`);
      }
      assert.doesNotMatch(readableContent(html), /Пелаге[яеию]\s+Ивановн|Маслениц|Дн[юя]\s+пенсионер/iu);
    }
    if (!clips.has(route)) continue;
    const main = mainContent(html);
    const clip = clips.get(route);
    assert.match(readableContent(main), clip.duration);
    if (clip === visit) assert.match(readableContent(main), /Занятие в (?:астраханском )?центре/iu);
    const original = 'https://ok.ru/video/' + clip.id;
    assert(linksInMain({route, html}).some(link => link.url.href === original && link.label), `${route}: labelled link to the original`);
    const source = [...main.matchAll(/<a\b[^>]*>/giu)].find(match => match[0].includes(`href="${original}"`));
    assert.doesNotMatch(source[0], /\bhidden\b|aria-hidden="true"/iu, `${route}: source link remains visible without JavaScript`);
    const controls = [...main.matchAll(/<button\b[^>]*\bdata-ok-player="([^"]+)"[^>]*>/gi)];
    assert.deepEqual(controls.map(match => match[1]), [clip.id], `${route}: one native play button supports keyboard and pointer activation`);
    assert(!/\bdisabled\b/i.test(controls[0][0]), `${route}: the play button can be activated`);
    assert.doesNotMatch(main, /<(?:iframe|video|audio)\b/i, `${route}: no player before the visitor presses play`);
  }
});

test('two dated stories follow the film and a final call action follows those stories', () => {
  const review = rendered.find(page => page.route === 'reviews/index.html');
  const account = mainContent(review.html);
  assert(homeLesson, 'Home has a local film before the stories');
  const afterLesson = homeMain.slice(homeMain.indexOf(homeLesson) + homeLesson.length);
  const cards = [...afterLesson.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/giu)];
  assert.equal(cards.length, 2, 'Exactly two archive stories follow the local film');
  for (const [route, title, date] of [
    ['reviews/', /Три месяца в центре/iu, '2023-01-27'],
    ['articles/den-rossii-v-centre/', /День России в зале на Савушкина/iu, '2024-06-19']
  ]) {
    const story = cards.find(card => linksInMain(home, card[0]).some(link => link.url.pathname === '/prototype/' + route && link.label));
    assert(story, 'Each home story links to its corresponding visitor account or event');
    assert.match(readableContent(story[0]), title);
    assert(story[0].includes(`datetime="${date}"`), 'The story keeps its original publication date');
    assert.match(story[0], /<img\b(?=[^>]*\bsrc="[^"]+")(?=[^>]*\balt="[^"]*[а-яё][^"]*")[^>]*>/iu,
      'Each story includes a photograph with a Russian text alternative');
  }
  const afterStories = afterLesson.slice(cards[1].index + cards[1][0].length);
  const lastLinks = linksInMain(home, afterStories);
  assert(lastLinks.some(link => link.url.href === 'tel:+79093738094' && link.label),
    'Readers can call the centre directly after the archive stories');
  assert(lastLinks.some(link => /^https:\/\/(?:www\.)?yandex\.[^/]+\/maps\//u.test(link.url.href) && link.label),
    'The final section includes a direct link to the map');
  assert.match(account, /«Три месяца»/u);
  assert.match(account, /datetime="2023-01-27"/u);
  assert.match(account, /href="https:\/\/ok\.ru\/video\/4274475829987"/u);
  assert.match(readableContent(account), /самочувств|оборудован/iu);
});

test('the downloadable contact includes both phone numbers and the address in UTF-8', async () => {
  const contacts = rendered.find(page => page.route === 'contacts/index.html');
  assert.match(mainContent(contacts.html), /<a\b(?=[^>]*\bdownload\b)(?=[^>]*href="\.\.\/assets\/centre-contact\.vcf")[^>]*>/iu);
  const file = await readFile(path.join(root, 'dist/assets/centre-contact.vcf'));
  const text = new TextDecoder('utf-8', { fatal: true }).decode(file);
  assert.doesNotMatch(text.replaceAll('\r\n', ''), /[\r\n]/);
  assert(text.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
  const lines = text.replace(/\r\n[ \t]/g, '').split('\r\n');
  assert.deepEqual(lines.slice(0, 2), ['BEGIN:VCARD', 'VERSION:3.0']);
  assert.deepEqual(lines.slice(-2), ['END:VCARD', '']);
  for (const expected of [
    'FN:Центр здоровья и долголетия',
    'TEL;TYPE=WORK,VOICE,PREF:+79093738094', 'TEL;TYPE=WORK,VOICE:+79170867329',
    'ADR;TYPE=WORK:;;ул. Савушкина\\, 46А\\, ТЦ «Факел»;Астрахань;;;Россия',
    'NOTE:Консультант — Светлана Михайловна Бабак'
  ]) assert(lines.includes(expected), expected);
});

test('the five-step guide keeps every old chapter address and optional film', () => {
  const stepsTitle = /(?:пять|5)\s+шагов/iu;
  assert(rendered.some(page => page.route !== 'five-steps/index.html' &&
    linksInMain(page).some(link => link.url.pathname === '/prototype/five-steps/' && link.label)), 'The programme is reachable from the site');
  const steps = rendered.find(page => page.route === 'five-steps/index.html');
  assert(steps, 'The five-step guide must be built');
  const main = steps.html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] ?? '';
  assert.match(readableContent(main), stepsTitle);
  const chapters = [...main.matchAll(/<li\b[^>]*>\s*<h[2-4]\b[^>]*>([^<]+)<\/h[2-4]>([\s\S]*?)<\/li>/giu)];
  const titles = chapters.map(match => match[1].trim());
  assert.deepEqual(titles, [
    'Абонемент на посещения', 'Анкета и беседа', 'Школа здоровья и долголетия',
    'Знакомство с оборудованием', 'Повторная встреча'
  ]);
  const times = chapters.map(match => {
    const control = match[2].match(/<button\b[^>]*\bdata-video-time="(\d+(?:\.\d+)?)"[^>]*>/i);
    assert(control, `Chapter “${match[1]}” needs a numeric seek time`);
    return Number(control[1]);
  });
  assert(times.every((seconds, index) => Number.isFinite(seconds) && (!index || seconds > times[index - 1])),
    'Each scene must start after the preceding scene');
  for (const [index, chapter] of chapters.entries()) {
    assert(chapter[0].split('>')[0].includes(`id="step-${index + 1}"`), 'The original chapter links must still resolve');
  }
  const video = main.match(/(<video\b[^>]*>)[\s\S]*?<\/video>/i);
  assert(video, 'The recording plays directly in the guide');
  assert.match(video[1], /\bcontrols\b/i, 'The visitor controls playback');
  assert.doesNotMatch(video[1], /\bautoplay\b/i);
  assert.match(video[1], /\bpreload="none"/i, 'The film is optional on the visit guide');
  assert.match(video[0], /\bsrc="(?![a-z]+:|\/)[^"]+\.mp4"/i, 'The recording loads from this site');
});

test('programme timings describe the film and visitors can confirm current local conditions', () => {
  const dayCount = /(?<!\d)(?:25|20)[\s-]*(?:дн|сут)/iu;
  for (const { route, html } of rendered) {
    if (route !== 'five-steps/index.html') {
      const text = readableContent(html);
      if (editorialRoutes.has(route)) {
        assert.doesNotMatch(text, /(?:абонемент|посещени[яей]\s+центра|программ[аеы]\s+(?:центра|системы\s+5\/95))[^.!?]{0,55}(?:20|25)\s+дн|25\s+дней\s+бесплатн/iu,
          `${route}: articles must not advertise the film's visit conditions`);
      } else {
        assert.doesNotMatch(text, dayCount, `${route}: local visit conditions must not be inferred from the film`);
      }
      continue;
    }
    const main = html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] ?? '';
    const text = readableContent(main);
    assert.match(text, /25\s+дней/iu);
    assert.match(text, /через\s+20\s+дней/iu);
    assert.match(text, /(?:фильм|видео)[^.]{0,60}программ|программ[^.]{0,60}(?:фильм|видео)/iu);
    const paragraphs = [...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/giu)].map(match => readableContent(match[1]));
    assert(paragraphs.some(paragraph => /уточни|спроси|узнай/iu.test(paragraph) &&
      /доступ|действ|услови/iu.test(paragraph) && /Астрахан/iu.test(paragraph)),
      'Visitors should know to check whether this programme is available in Astrakhan');
  }
});
