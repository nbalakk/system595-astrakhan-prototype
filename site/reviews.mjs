import { centre, centreStories, centreVideos } from './content.mjs';
import { breadcrumbs, icon } from './components.mjs';

export function centreLessonClip(p, { featured = false, description = '' } = {}) {
  const video = centreVideos.lesson;
  const meta = `<span class="lesson-clip-meta">${featured ? 'Из архива Светланы Бабак' : `<time datetime="${video.date}">${video.published}</time>`} · ${video.duration}</span>`;
  return `<figure class="centre-lesson-clip${featured ? ' feature-film' : ''}" id="video-iz-zala" tabindex="-1">
    <div class="lesson-player" data-video-frame data-video-kind="lesson">
      <img src="${p}assets/${video.poster}" width="${video.width}" height="${video.height}" alt="${video.alt}" decoding="async">
      <button type="button" class="lesson-play" data-ok-player="${video.id}" aria-label="Смотреть видео «${video.title}», ${video.duration}" hidden><span class="steps-play-icon" aria-hidden="true"></span><span>Смотреть видео</span></button>
    </div>
    <figcaption>
      ${featured ? `${meta}<h2 id="home-film-title">${video.title}</h2>` : `<strong>${video.title}</strong>${meta}`}
      ${description ? `<p>${description}</p>` : ''}
      <a${featured ? ' class="button"' : ''} href="${video.url}">${featured ? 'Смотреть в ОК' : 'Видео занятия в Одноклассниках'}</a>
    </figcaption>
  </figure>`;
}

export function visitFilm(p) {
  return centreLessonClip(p, { description: centreVideos.lesson.description });
}

export function reviewsPage(p) {
  const video = centreVideos.feedback;
  const story = centreStories.find(item => item.videoId === video.id);
  return `${breadcrumbs(p, 'Отзывы')}
    <div class="container visitor-account">
      <h1>Отзывы</h1>
      <article class="visitor-story" aria-labelledby="visitor-story-title">
        <div class="visitor-story-copy">
          <h2 id="visitor-story-title">${story.title}</h2>
          <p class="interview-meta"><time datetime="${video.date}">${video.published} года</time> · ${video.duration}</p>
          <p>«Три месяца», — отвечает посетительница на вопрос, как давно она ходит в центр. В разговоре она вспоминает, почему пришла на занятия, и рассказывает о своём самочувствии.</p>
          <p class="archive-meta">В записи упоминается инсулин. Изменение дозы обсуждают с лечащим врачом.</p>
        </div>
        <div class="visitor-recording">
          <div class="reader-video" data-video-frame data-video-kind="feedback">
            <button type="button" class="reader-play" data-ok-player="${video.id}" aria-label="Смотреть отзыв «${story.title}»" hidden>Смотреть отзыв</button>
          </div>
          <p><a href="${video.url}">Оригинал в Одноклассниках</a></p>
          <a href="${p}articles/${story.slug}/">Публикация в архиве центра</a>
        </div>
      </article>
      <div class="visitor-afterword">
        <a class="button" href="${p}rehabilitation/">Как прийти на первую встречу ${icon('arrow')}</a>
        <p>Уже были в центре? <a href="${centre.phoneHref}">Рассказать Светлане о своём посещении</a> можно по телефону.</p>
      </div>
    </div>`;
}
