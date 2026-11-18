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

test('the original sixteen pages and the new programme page are built', () => {
  assert.equal(rendered.length, 17);
  assert(rendered.some(page => page.route === 'five-steps/index.html'));
});

for (const { route, html } of rendered) {
  test(`${route} presents a visit to the health and longevity centre`, () => {
    const publicCopy = readableContent(html);
    assert.doesNotMatch(publicCopy, /реабилитац/iu);
    assert.doesNotMatch(publicCopy, /(?<!\p{L})(?:покуп[ак]|купить|продаж|приобрест|приобрет|заказать|стоимост|доставк|корзин|каталог|цен(?:а|у|е|ой|ы|ам|ами|ах)?(?!\p{L}))/iu,
      'Copy, metadata and accessible names should guide a visit, including on former shop pages');
    assert.doesNotMatch(publicCopy, /(?:выбрать|выбор[ае]?|подобрать|подбор[ае]?)\s+(?:модел|аппарат|оборудован)/iu);
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
  for (const concept of [/здоров/iu, /долголети/iu, /старшего возраста/iu, /5\s*\/\s*95/u, /Светлан/iu, /Бабак/iu]) {
    assert.match(main, concept);
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
    for (const match of html.matchAll(/href="(https?:\/\/(?:www\.)?ok\.ru\/video(?:embed)?\/[^"]+)"/giu)) {
      assert(approvedLinks.includes(match[1]), `${route}: only approved centre clips may be linked`);
    }
    assert.doesNotMatch(readableContent(html), /Пелаге[яеию]\s+Ивановн|Маслениц|Дн[юя]\s+пенсионер/iu);
    if (!clips.has(route)) continue;
    const main = html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] ?? '';
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
  const previewLists = [...home.matchAll(/<ol\b[^>]*>([\s\S]*?)<\/ol>/giu)].map(match =>
    [...match[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/giu)].map(item => readableContent(item[1]).trim())
  );
  assert(previewLists.some(list => list.length === 5 && titles.every((title, index) => list[index] === title)),
    'The landing page previews the same five scenes in order');
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
      assert.doesNotMatch(readableContent(html), dayCount, `${route}: local visit conditions must not be inferred from the film`);
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
