import { breadcrumbs, escapeHtml, icon } from './components.mjs';
import { healthArticles } from './content.mjs';

function articleUrl(prefix, slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Недопустимый адрес статьи');
  }
  return `${prefix}articles/${slug}/`;
}

function safeWebUrl(url) {
  if (!URL.canParse(url)) return '';
  const source = new URL(url);
  if (!['https:', 'http:'].includes(source.protocol) || source.username || source.password) {
    return '';
  }
  return escapeHtml(source.href);
}

function sourceItem({ label, url }) {
  const text = escapeHtml(label);
  const href = safeWebUrl(url);
  return `<li>${href ? `<a href="${href}">${text}</a>` : text}</li>`;
}

function healthStoryItem(prefix, article) {
  return `<li>
    <h4><a href="${articleUrl(prefix, article.slug)}">${escapeHtml(article.title)}</a></h4>
    <p>${escapeHtml(article.summary)}</p>
  </li>`;
}

function groupByCategory(articles) {
  const categories = new Map();
  for (const article of articles) {
    if (!categories.has(article.category)) categories.set(article.category, []);
    categories.get(article.category).push(article);
  }
  return categories;
}

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});

function archiveMeta(story) {
  const date = `<time datetime="${escapeHtml(story.date)}">${dateFormat.format(new Date(story.date))}</time>`;
  return story.duration ? `${date} · Видео&nbsp;${escapeHtml(story.duration)}` : date;
}

function archiveImage(prefix, story) {
  if (!story.image) return '';
  if (!/^[a-z0-9][a-z0-9.-]*\.(?:png|jpe?g|webp)$/i.test(story.image)) {
    throw new Error('Недопустимый файл иллюстрации');
  }
  const dimensions = Number.isInteger(story.width) && Number.isInteger(story.height)
    ? ` width="${story.width}" height="${story.height}"` : '';
  return `<img src="${prefix}assets/${story.image}" alt="${escapeHtml(story.alt)}"${dimensions} loading="lazy">`;
}

export function healthIndex(prefix, articles, stories = []) {
  const categories = groupByCategory(articles);
  const groups = Array.from(categories, ([category, entries]) => `
    <section class="health-category">
      <h3>${escapeHtml(category)}</h3>
      <ul class="health-story-list">${entries.map(article => healthStoryItem(prefix, article)).join('')}</ul>
    </section>`);
  return `${breadcrumbs(prefix, 'Статьи')}
    <div class="container health-index">
      <header class="page-head journal-mast"><h1>Статьи</h1>
        <nav aria-label="Разделы журнала">
          <a href="#health">Памятки о здоровье</a>
          ${stories.length ? '<a href="#archive-index-title">Архив центра</a>' : ''}
        </nav>
      </header>
      <section class="health-topics" aria-labelledby="health">
        <h2 id="health">О здоровье</h2>
        ${groups.join('')}
      </section>
      <nav class="health-visit-links" aria-label="Подготовка к посещению центра">
        <strong>Перед поездкой в центр</strong>
        <a href="${prefix}articles/first-visit/">Памятка к первому визиту</a>
        <a href="${prefix}articles/first-visit/#documents">Как посмотреть документы на аппарат</a>
      </nav>
      ${stories.length ? `<details class="journal-archive">
        <summary>Из жизни центра — архив встреч и публикаций</summary>
        <ul id="archive-index-title">${stories.map(story => `<li><a href="${articleUrl(prefix, story.slug)}">${escapeHtml(story.title)}</a>
          <span class="archive-meta">${archiveMeta(story)}</span></li>`).join('')}</ul>
      </details>` : ''}
    </div>`;
}

function articleSection({ heading, paragraphs, bullets = [] }) {
  return `<section><h2>${escapeHtml(heading)}</h2>
    ${paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
    ${bullets.length ? `<ul>${bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>` : ''}
  </section>`;
}

export function healthArticle(prefix, article) {
  const title = escapeHtml(article.title);
  return `${breadcrumbs(prefix, title, ['articles/', 'Статьи'])}
    <article class="container health-reading">
      <header>
        <p class="health-category-name">${escapeHtml(article.category)}</p>
        <h1>${title}</h1>
        <p class="lead">${escapeHtml(article.summary)}</p>
      </header>
      ${article.sections.map(articleSection).join('')}
      <section class="health-sources"><h2>Источники</h2>
        <ul>${article.sources.map(sourceItem).join('')}</ul>
      </section>
      <a class="health-return" href="${prefix}articles/#health">Все статьи о здоровье</a>
    </article>`;
}

export function healthPreview(prefix, articles) {
  if (!articles.length) return '';
  return `<section class="container health-preview" aria-labelledby="health-preview-title">
    <div class="health-preview-head"><h2 id="health-preview-title">Статьи о здоровье</h2>
      <a class="text-link" href="${prefix}articles/">Все статьи${icon('arrow')}</a></div>
    <ul class="health-preview-list">${articles.slice(0, 3).map(article => `<li><a href="${articleUrl(prefix, article.slug)}">${escapeHtml(article.title)}</a></li>`).join('')}</ul>
  </section>`;
}

export function centreStory(prefix, story) {
  const title = escapeHtml(story.title);
  const sourceUrl = safeWebUrl(story.sourceUrl);
  const guide = healthArticles.find(article => article.slug === story.relatedSlug);
  const image = archiveImage(prefix, story);
  const videoId = story.videoId && /^\d+$/.test(story.videoId) ? story.videoId : '';
  const media = videoId ? `<div class="reader-video" data-video-frame>
      <button type="button" class="reader-play" data-ok-player="${videoId}" aria-label="Смотреть видео · ${escapeHtml(story.duration)}. ${title}" hidden>Смотреть видео · ${escapeHtml(story.duration)}</button>
    </div>` : '';
  return `${breadcrumbs(prefix, title, ['articles/', 'Статьи'])}
    <article class="container health-reading centre-story">
      <header>
        <p class="archive-story-date">Из жизни центра · ${archiveMeta(story)}</p>
        <h1>${title}</h1>
        <p class="lead">${escapeHtml(story.summary)}</p>
      </header>
      ${story.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      ${story.slug === 'otzyv-posetitelnitsy' ? '<p class="archive-meta">В записи упоминается инсулин. Изменение дозы обсуждают с лечащим врачом.</p>' : ''}
      ${media}
      ${sourceUrl ? `<p><a class="text-link" href="${sourceUrl}">${videoId ? 'Видео в Одноклассниках' : 'Публикация в Одноклассниках'}${icon('arrow')}</a></p>` : ''}
      ${image ? `<details class="archive-illustration"><summary>${videoId ? 'Кадр из записи' : 'Иллюстрация из публикации'}</summary>${image}</details>` : ''}
      ${guide ? `<aside class="archive-related"><p>Памятка о здоровье</p>
        <a href="${articleUrl(prefix, guide.slug)}">${escapeHtml(guide.title)}</a></aside>` : ''}
      ${story.slug === 'otzyv-posetitelnitsy' ? `<p><a class="text-link" href="${prefix}rehabilitation/">Как прийти на первую встречу${icon('arrow')}</a></p>` : ''}
      <a class="health-return" href="${prefix}articles/">Все статьи</a>
    </article>`;
}
