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
      assert.doesNotMatch(publicCopy, /(?<!\p{L})(?:покуп[ак]|купить|продаж|приобрест|приобрет|заказать|стоимост|доставк|корзин|каталог|цен(?:а|у|е|ой|ы|ам|ами|ах)?(?!\p{L}))/iu,
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

test('the homepage explains the audience and purpose of a visit', () => {
  const home = rendered.find(page => page.route === 'index.html');
  assert(home, 'Homepage must be built');
  const main = readableContent(home.html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] || '');
  for (const concept of [/здоров/iu, /долголети/iu, /(?:старшего|своего)\s+поколения|старшего\s+возраста|ровесник|пенсионер/iu, /5\s*\/\s*95/u, /Светлан/iu, /Бабак/iu]) {
    assert.match(main, concept);
  }
  assert.match(home.html, /<a\b[^>]*class="[^"]*welcome-primary[^"]*"[^>]*href="tel:\+79093738094"[^>]*>[\s\S]*?Позвонить Светлане<\/a>/u);
});

test('the first screen explains the personal value and leads to examples before the programme', () => {
  const home = rendered.find(page => page.route === 'index.html');
  const main = mainContent(home.html);
  const hero = main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>([\s\S]*?)<\/p>/iu);
  assert(hero, 'The first screen needs a heading and a short introduction');
  const introduction = readableContent(hero[0]);
  assert.doesNotMatch(readableContent(hero[1]), /аппарат|оборудован/iu);
  assert.match(introduction, /знаком|общать|общение|в\s+компании|сверстник|ровесник/iu);
  assert.match(introduction, /двиг|движ|размять|размин|разомн/iu);
  assert.match(introduction, /подход|подойд|реши|по\s+душе|удобн|хочет|захоч|понрав/iu);

  const firstMeeting = main.indexOf('id="first-meeting"');
  const programme = main.indexOf('aria-labelledby="steps-preview-title"');
  assert(firstMeeting >= 0 && programme > firstMeeting, 'Examples belong before the programme');
  const links = linksInMain(home, main.slice(firstMeeting, programme));
  for (const route of ['articles/den-rossii-v-centre/', 'five-steps/#step-3', 'articles/zanyatie-v-zale/', 'rehabilitation/']) {
    const destination = new URL(route, 'https://site.test/prototype/');
    assert(links.some(link => link.url.href === destination.href && /[а-яё]/iu.test(link.label)),
      `The first meeting needs a named link to ${route}`);
  }
});

test('the articles hub opens with centre stories and links to all eight health guides', () => {
  const hub = rendered.find(page => page.route === 'articles/index.html');
  const main = mainContent(hub.html);
  assert.match(main, /<h1\b[^>]*>\s*Статьи\s*<\/h1>/iu);
  const sections = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/giu)].map(match => readableContent(match[1]).trim());
  assert(sections.indexOf('Из жизни центра') >= 0 && sections.indexOf('О здоровье') > sections.indexOf('Из жизни центра'));
  const hubLinks = linksInMain(hub);
  const site = 'https://site.test/prototype/';
  const storyOrder = hubLinks.map(link => link.url.pathname.split('/').filter(Boolean).at(-1)).filter(slug => approvedStories.has(slug));
  assert.deepEqual([...new Set(storyOrder)].slice(0, 4), [
    'novueye-v-kresle', 'den-rossii-v-centre', 'teplovoy-kovrik-voprosy', 'kogda-vyveski-rasplyvayutsya'
  ], 'The four opening archive stories follow the approved editorial order');
  for (const page of [...stories, ...articles]) {
    const url = site + page.route.replace(/index\.html$/, '');
    assert(hubLinks.some(link => link.url.href === url && /[а-яё]/iu.test(link.label)),
      `The hub needs a text link to ${url}`);
  }
  for (const suffix of ['articles/first-visit/', 'articles/first-visit/#documents']) {
    assert(hubLinks.some(link => link.url.href === site + suffix && link.label), `The visit guide remains reachable at ${suffix}`);
  }
});

test('the homepage previews centre stories with a local cover and links to both parts of the hub', () => {
  const home = rendered.find(page => page.route === 'index.html');
  const preview = mainContent(home.html).match(/<section\b[^>]*\bclass="[^"]*\bhealth-preview\b[^"]*"[^>]*>[\s\S]*?<\/section>/iu)?.[0] ?? '';
  assert.match(preview, /<h2\b[^>]*>\s*Из жизни центра\s*<\/h2>/iu);
  assert.match(preview, /<img\b[^>]*\bsrc="(?![a-z]+:|\/)[^"]+"/iu);
  const links = linksInMain(home, preview);
  const hub = 'https://site.test/prototype/articles/';
  assert(links.some(link => link.url.href === hub && /^Все статьи$/iu.test(link.label)));
  assert(links.some(link => link.url.href === hub + '#health' && link.label));
  const storyUrls = new Set(stories.map(page => 'https://site.test/prototype/' + page.route.replace(/index\.html$/, '')));
  const selected = new Set(links.filter(link => storyUrls.has(link.url.href) && link.label).map(link => link.url.href));
  assert(selected.size >= 2 && selected.size <= 3, 'Two or three distinct stories have ordinary text links on the home page');
  const covers = [...preview.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/giu)].filter(match => /<img\b/i.test(match[2]));
  assert(covers.some(([, href, contents]) => {
    const slug = new URL(href, hub).pathname.split('/').filter(Boolean).at(-1);
    const story = approvedStories.get(slug);
    return story && contents.includes('assets/' + story[2] + '"');
  }), 'The lead story uses its own approved cover');
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

test('the association and equipment illustrations have sources for visitors', () => {
  const main = route => rendered.find(page => page.route === route)?.html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] ?? '';
  assert.match(main('index.html'), /href="https:\/\/novumedical\.org\/o-nas\/"/);
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

test('visit and feedback pages offer the matching approved clip with a direct fallback', () => {
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
    const main = route === 'index.html'
      ? mainContent(html).match(/<section\b[^>]*\baria-labelledby="film-lesson-title"[^>]*>[\s\S]*?<\/section>/iu)?.[0] ?? ''
      : mainContent(html);
    const clip = clips.get(route);
    assert.match(readableContent(main), clip.duration);
    if (clip === visit) assert.match(readableContent(main), /Занятие в центре/iu);
    assert(main.includes(`href="https://ok.ru/video/${clip.id}"`), `${route}: video must be reachable without JavaScript`);
    const controls = [...main.matchAll(/<button\b[^>]*\bdata-ok-player="([^"]+)"[^>]*>/gi)];
    assert.deepEqual(controls.map(match => match[1]), [clip.id], `${route}: one native play button supports keyboard and pointer activation`);
    assert(!/\bdisabled\b/i.test(controls[0][0]), `${route}: the play button can be activated`);
    assert.doesNotMatch(main, /<iframe\b/i, `${route}: no player before the visitor presses play`);
  }
});

test('the five-step preview leads to a page with the locally hosted recording and poster', () => {
  const home = rendered.find(page => page.route === 'index.html').html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] ?? '';
  const stepsTitle = /(?:пять|5)\s+шагов/iu;
  assert.match(readableContent(home), stepsTitle);
  assert.match(home, /href="(?:\.\/)?five-steps\/(?:#[^"]*)?"/i);
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
  const preview = home.match(/<section\b[^>]*aria-labelledby="steps-preview-title"[^>]*>([\s\S]*?)<\/section>/iu)?.[1] ?? '';
  const posterLink = preview.match(/<a\b[^>]*href="\.\/five-steps\/"[^>]*>([\s\S]*?)<\/a>/iu)?.[1] ?? '';
  assert.match(posterLink, /<img\b[^>]*src="\.\/assets\/five-steps-poster\.jpg"/iu);
  assert.match(readableContent(posterLink), /Открыть фильм\s+57 секунд/iu);
  const sceneLinks = [...preview.matchAll(/<li\b[^>]*>\s*<a\b[^>]*href="\.\/five-steps\/#([^"]+)"[^>]*>([\s\S]*?)<\/a>/giu)];
  assert.equal(sceneLinks.length, chapters.length);
  for (const [index, [, fragment, link]] of sceneLinks.entries()) {
    assert(main.includes(`id="${fragment}"><h3>${titles[index]}</h3>`), 'Every preview step opens its own chapter description');
    assert.equal(readableContent(link.match(/<span>([\s\S]*?)<\/span>/iu)?.[1] ?? '').trim(), titles[index]);
    assert(link.includes(`datetime="PT${times[index]}S"`), 'The preview and player must use the same chapter times');
  }
  assert.doesNotMatch(preview, /<(video|iframe|audio)\b/iu, 'The landing preview cannot play media');
  const video = main.match(/(<video\b[^>]*>)[\s\S]*?<\/video>/i);
  assert(video, 'The recording plays directly in the guide');
  assert.match(video[1], /\bcontrols\b/i, 'The visitor controls playback');
  assert.doesNotMatch(video[1], /\bautoplay\b/i);
  assert.match(video[1], /\bposter="(?![a-z]+:|\/)[^"]+"/i, 'The poster loads from this site');
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
