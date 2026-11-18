import { centre, centreVideos } from './content.mjs';
import { breadcrumbs, button, icon, pageHead } from './components.mjs';

function filmSection(p, kind, { firstMeeting = false } = {}) {
  const video = centreVideos[kind];
  const headingId = `film-${kind}-title`;
  return `<section class="container reviews-preview${firstMeeting ? ' first-meeting' : ''}"${firstMeeting ? ' id="first-meeting"' : ''} aria-labelledby="${headingId}">
    <div class="reviews-preview-layout">
      ${firstMeeting ? `<div class="first-meeting-copy"><h2 id="${headingId}">Что вас ждёт на первой встрече</h2>
        <p>Можно начать с того, что важно лично вам: дольше гулять, чаще встречаться с людьми или самостоятельно справляться с привычными делами.</p>
        <p>Светлана ответит на ваши вопросы и покажет, как устроено занятие. Вы сможете посмотреть аппараты и решить, хотите ли прийти ещё.</p>
        <a class="text-link" href="${p}rehabilitation/">Подробнее о первом посещении ${icon('arrow')}</a></div>` : ''}
      <div class="interview-media">
      <div class="interview-frame" data-video-frame data-video-kind="${kind}">
        <img src="${p}assets/${video.poster}" alt="${video.alt}" width="${video.width}" height="${video.height}" loading="lazy">
        <button type="button" class="interview-play" data-ok-player="${video.id}" aria-label="Смотреть видео «${video.title}»" hidden>Смотреть видео</button>
      </div>
      ${firstMeeting ? `<p class="first-meeting-caption"><span>${video.title} · ${video.duration}</span><a href="${video.url}">Оригинал в ОК</a></p>` : ''}
      </div>
      ${firstMeeting ? '' : `<div class="interview-copy"><h2 id="${headingId}">${video.title}</h2>
        <p class="interview-meta"><time datetime="${video.date}">${video.published}</time> · ${video.duration}</p>
        <p>${video.description}</p>
        ${kind === 'feedback' ? '<p>Если вы используете инсулин, изменения дозы обсуждайте со своим лечащим врачом.</p>' : ''}
        <a class="text-link" href="${video.url}">Открыть в Одноклассниках${icon('arrow')}</a>
        ${kind === 'lesson' ? `<p><a href="${p}reviews/">Посмотреть отзыв посетительницы</a></p>` : `<p><a href="${p}articles/">Другие истории из жизни центра</a></p>`}
      </div>`}
    </div>
  </section>`;
}

export function visitFilm(p, options) {
  return filmSection(p, 'lesson', options);
}

export function reviewsPage(p) {
  return `${breadcrumbs(p, 'Отклики посетителей')}
    ${pageHead('Отклики посетителей', 'Посмотрите видео из архива центра. Если вы уже побывали на встрече, своими впечатлениями можно поделиться со Светланой.')}
    ${filmSection(p, 'feedback')}
    <section class="container contact-layout">
      <div><h2>Что запомнилось</h2><p>Можно рассказать об одном моменте. Например, что помогло найти центр, какая часть объяснения была понятной или на какой вопрос вам хотелось бы ещё получить ответ.</p>
      <p>Если хотите поделиться опытом с другими посетителями на сайте, обсудите со Светланой текст и подпись перед публикацией.</p></div>
      <div class="contact-panel"><h2>Передать отклик</h2><p>Светлана Михайловна Бабак, консультант центра</p>
      ${button(centre.phoneHref, 'Позвонить ' + centre.phone)}</div>
    </section>`;
}
