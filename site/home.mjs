import { centre, centreStories, centreVideos } from './content.mjs';
import { icon } from './components.mjs';
import { visitFilm } from './reviews.mjs';

export function home(p) {
  const account = centreStories.find(story => story.slug === 'otzyv-posetitelnitsy');
  return `<section class="welcome-spread" aria-labelledby="welcome-title">
    <div class="container welcome-panel">
      <header class="welcome-title-block">
        <p class="welcome-place">Астрахань <span aria-hidden="true">·</span> ул. Савушкина, 46А</p>
        <h1 id="welcome-title">Разминка и общение для старшего поколения</h1>
      </header>
      <div class="welcome-copy">
        <p class="welcome-lead">В центре здоровья и долголетия на Савушкина собираются, чтобы размяться вместе и провести время в компании. В первый раз можно познакомиться со Светланой, посмотреть занятие и решить, хочется ли присоединиться к группе.</p>
        <div class="welcome-links">
          <a class="button welcome-primary" href="${centre.phoneHref}">${icon('phone')} Позвонить и записаться</a>
          <a href="#video-iz-zala">Видео из зала · ${centreVideos.lesson.duration}</a>
        </div>
      </div>
      <figure class="welcome-photo">
        <img src="${p}assets/centre-ageing-better-seated-exercise.webp" width="1800" height="1200" alt="Женщины и мужчины на групповой разминке поднимают руки, сидя на стульях" fetchpriority="high">
        <figcaption>Групповая разминка. <a href="${p}media/#centre-photographs">Фото из британской коллекции Centre for Ageing Better</a></figcaption>
      </figure>
    </div>
  </section>
  ${visitFilm(p, { firstMeeting: true })}
  <div class="home-visit-desk container">
    <section class="home-consultant" id="appointment" aria-labelledby="home-consultant-title">
      <p class="home-person-role">Консультант центра</p>
      <h2 id="home-consultant-title">${centre.contact}</h2>
      <p>Расскажите Светлане, что вам важно — чаще гулять, самостоятельно ходить по делам или найти компанию для занятий. Она подскажет, когда собирается группа, сколько длится первое посещение и сколько оно стоит. Если хотите прийти вдвоём или вам нужен вход без ступеней, скажите об этом при звонке.</p>
      <div class="home-desk-links">
        <a class="home-desk-phone" href="${centre.phoneHref}" aria-label="Позвонить Светлане ${centre.phone}">${icon('phone')}${centre.phone}</a>
        <a href="${p}booking/">Что уточнить перед поездкой</a>
      </div>
    </section>
    <section class="home-account" aria-labelledby="home-account-title">
      <p class="home-person-role">Рассказ посетительницы</p>
      <h2 id="home-account-title">${account.title}</h2>
      <p>«Три месяца», — отвечает посетительница, когда её спрашивают, давно ли она ходит в центр. В записи от <time datetime="${account.date}">27 января 2023 года</time> она рассказывает, почему пришла на занятия.</p>
      <a class="text-link" href="${p}reviews/">Прочитать отзыв и посмотреть запись ${icon('arrow')}</a>
    </section>
  </div>
  <section class="home-directions" aria-labelledby="home-directions-title">
    <div class="container home-directions-inner">
      <div><h2 id="home-directions-title">Как нас найти</h2>
        <p><a href="${centre.mapUrl}">${centre.address}</a></p></div>
      <div class="home-direction-links">
        <a class="button" href="${centre.phoneHref}">${icon('phone')} Позвонить и записаться</a>
        <a href="${p}contacts/">Контакты и карта ${icon('arrow')}</a>
      </div>
    </div>
  </section>`;
}
