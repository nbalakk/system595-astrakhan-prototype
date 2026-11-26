import { centre, centreStories, centreVideos } from './content.mjs';
import { breadcrumbs, icon } from './components.mjs';

export function centreLessonClip(p, {
  poster = centreVideos.lesson.poster,
  alt = centreVideos.lesson.alt,
  width = centreVideos.lesson.width,
  height = centreVideos.lesson.height,
  description = ''
} = {}) {
  const video = centreVideos.lesson;
  return `<figure class="centre-lesson-clip" id="video-iz-zala">
    <div class="lesson-player" data-video-frame data-video-kind="lesson">
      <img src="${p}assets/${poster}" width="${width}" height="${height}" alt="${alt}" decoding="async">
      <button type="button" class="lesson-play" data-ok-player="${video.id}" aria-label="Смотреть видео «${video.title}», ${video.duration}" hidden><span class="steps-play-icon" aria-hidden="true"></span>Смотреть видео</button>
    </div>
    <figcaption>
      <strong>${video.title}</strong>
      <span class="lesson-clip-meta"><time datetime="${video.date}">${video.published}</time> · ${video.duration}</span>
      ${description ? `<p>${description}</p>` : ''}
      <a href="${video.url}">Видео занятия в Одноклассниках</a>
    </figcaption>
  </figure>`;
}

export function visitFilm(p, { firstMeeting = false } = {}) {
  const headingId = 'film-lesson-title';
  if (firstMeeting) {
    return `<section class="first-meeting" id="first-meeting" aria-labelledby="${headingId}">
      <div class="container lesson-spread">
        <div class="lesson-intro">
          <h2 id="${headingId}">Как проходит занятие</h2>
          <p>Загляните в зал на Савушкина. В коротком видео ведущая помогает участнице надеть накидку и показывает, как ею управлять.</p>
          <a class="text-link" href="${p}rehabilitation/">Как проходит первый визит ${icon('arrow')}</a>
          <p class="lesson-programme" id="steps-preview-title">В программу встреч входит знакомство с системой 5/95. <a href="${p}five-steps/">Пять шагов программы посещений</a></p>
        </div>
        ${centreLessonClip(p)}
      </div>
    </section>`;
  }
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
