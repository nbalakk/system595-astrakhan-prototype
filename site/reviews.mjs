import { association, centre, centreStories, centreVideos } from './content.mjs';
import { breadcrumbs, icon } from './components.mjs';

function filmFrame(_p, video, kind) {
  return `<div class="interview-frame on-demand-frame" data-video-frame data-video-kind="${kind}">
    <button type="button" class="on-demand-play" data-ok-player="${video.id}" aria-label="Смотреть видео «${video.title}»" hidden><span class="steps-play-icon" aria-hidden="true"></span>Смотреть видео</button>
  </div>`;
}

export function visitFilm(p, { firstMeeting = false } = {}) {
  const video = centreVideos.lesson;
  const headingId = 'film-lesson-title';
  if (firstMeeting) {
    return `<section class="container first-meeting" id="first-meeting" aria-labelledby="${headingId}">
      <header class="lesson-intro"><h2 id="${headingId}">Что показывают на занятии</h2>
        <p>В зале можно сначала посмотреть, как работает аппарат, и задать вопросы консультанту.</p></header>
      <div class="lesson-spread">
        <figure class="lesson-photo">
          <img src="${p}assets/toprelax-studio.jpg" width="1920" height="1080" alt="Мягкая массажная накидка TopRelax лежит на светлом диване" loading="lazy">
          <figcaption>Массажная накидка TopRelax. <a href="https://novumedical.org/wp-content/uploads/2021/11/tr_comp001.jpg" aria-label="Фото NovuMedical — массажная накидка TopRelax">Фото NovuMedical</a></figcaption>
        </figure>
        <div class="lesson-examples">
        <article><h3>Накидка для плеч</h3>
          <p>Мягкая накидка ложится на шею и плечи. У модели TopRelax на фотографии есть вибромассаж и подогрев. В записи из Астрахани видно, как ведущая помогает посетительнице надеть накидку.</p>
          <a class="text-link" href="${p}articles/zanyatie-v-zale/">Как надевают накидку ${icon('arrow')}</a></article>
        <article><h3>Маска для глаз NovuEye</h3>
          <p>У маски есть режимы вибрации и прогрева. Ею управляют с пульта. Перед примеркой можно попросить консультанта показать, как выбрать режим и остановить аппарат.</p>
          <a class="text-link" href="${p}articles/novueye-v-kresle/">Маска и пульт в записи занятия ${icon('arrow')}</a></article>
        </div>
      </div>
      <div class="visit-equipment-links">
        <a class="button" href="${centre.phoneHref}">${icon('phone')} Позвонить и записаться</a>
        <a href="${p}equipment/">Аппараты на занятиях</a>
        <a href="${p}articles/first-visit/#documents">Как посмотреть документы на аппарат</a>
        <a href="${association.url}">Об Ассоциации NovuMedical</a>
      </div>
    </section>`;
  }
  return `<section class="container reviews-preview" aria-labelledby="${headingId}">
    <div class="reviews-preview-layout">
      <div class="interview-copy"><h2 id="${headingId}">${video.title}</h2>
        <p class="interview-meta"><time datetime="${video.date}">${video.published}</time> · ${video.duration}</p>
        <p>${video.description}</p>
        ${filmFrame(p, video, 'lesson')}
        <a class="text-link" href="${video.url}">Видео занятия в Одноклассниках ${icon('arrow')}</a>
      </div>
    </div>
  </section>`;
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
