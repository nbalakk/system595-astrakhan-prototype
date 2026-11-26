import { centre, centreStories, centreVideos } from './content.mjs';
import { icon } from './components.mjs';
import { centreLessonClip } from './reviews.mjs';

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});

function newsCard(p, story, { id, tag, title, text, link, action }) {
  return `<article class="news-card" aria-labelledby="${id}">
    <div class="news-heading">
      <img class="news-portrait" src="${p}assets/${story.image}" width="${story.width}" height="${story.height}" loading="lazy" alt="${story.alt}">
      <div class="news-meta"><span class="news-tag">${tag}</span><time datetime="${story.date}">${dateFormat.format(new Date(story.date))}</time></div>
    </div>
    <h2 id="${id}">${title}</h2><p>${text}</p>
    <a class="button button-secondary" href="${p}${link}">${action} ${icon('arrow')}</a>
  </article>`;
}

export function home(p) {
  const account = centreStories.find(story => story.slug === 'otzyv-posetitelnitsy');
  const holiday = centreStories.find(story => story.slug === 'den-rossii-v-centre');
  return `<section class="home-intro container" aria-labelledby="welcome-title">
    <div class="home-intro-copy">
      <span class="place-tag">${icon('pin')}Астрахань · ТЦ «Факел»</span>
      <h1 id="welcome-title">Центр здоровья и долголетия</h1>
      <p>В нашем центре люди старшего возраста собираются, чтобы размяться и пообщаться. На бесплатном ознакомительном занятии вы познакомитесь с группой и сможете попробовать массажную накидку вместе с консультантом.</p>
      <div class="intro-actions">
        <a class="button" href="${centre.phoneHref}">${icon('phone')}Позвонить и записаться</a>
        <div class="intro-contact"><a href="${centre.phoneHref}">${centre.phone}</a><span>Запись ведёт Светлана Михайловна Бабак</span></div>
      </div>
      <a class="intro-film-link" href="#video-iz-zala"><span class="mini-play" aria-hidden="true"></span>Посмотреть занятие в центре</a>
    </div>
    <figure class="intro-image">
      <img src="${p}assets/network-welcome.webp" width="1152" height="768" fetchpriority="high" alt="Посетительница и сотрудница центра рассматривают карточку у входа в зал">
      <figcaption><a href="${p}media/#centre-photographs">Встреча в центре NovuMedical · <span>Фото сети</span></a></figcaption>
    </figure>
  </section>

  <section class="first-visit-band" id="first-meeting" aria-labelledby="meeting-title">
    <div class="container">
      <div class="first-visit-heading"><h2 id="meeting-title">Как проходит первое посещение</h2>
        <p>Если хотите прийти с близким человеком, скажите об этом Светлане при записи.</p></div>
      <ol class="visit-cards" role="list">
        <li><span class="step-number" aria-hidden="true">01</span><h3>Познакомиться с группой</h3>
          <p>Посмотрите, как проходит встреча, и пообщайтесь с теми, кто уже ходит в центр. В зале собираются и по праздникам.</p>
          <a class="text-link" href="${p}rehabilitation/">О первом посещении ${icon('arrow')}</a></li>
        <li><span class="step-number" aria-hidden="true">02</span><h3>Попробовать оборудование</h3>
          <p>Консультант покажет, как устроена массажная накидка системы 5/95, где менять режим и как её выключить.</p>
          <a class="text-link" href="${p}equipment/">Об аппаратах в центре ${icon('arrow')}</a></li>
        <li><span class="step-number" aria-hidden="true">03</span><h3 id="steps-preview-title">Пять шагов программы</h3>
          <p>От первой беседы до следующей встречи. В коротком фильме можно заглянуть и в школу здоровья и долголетия.</p>
          <a class="text-link" href="${p}five-steps/">Посмотреть пять шагов · 57 секунд ${icon('arrow')}</a></li>
      </ol>
    </div>
  </section>

  <section class="home-film container" aria-labelledby="home-film-title">
    ${centreLessonClip(p, { featured: true, description: centreVideos.lesson.description })}
  </section>

  <div class="centre-news container">
    ${newsCard(p, account, {
      id: 'home-account-title', tag: 'Рассказ посетительницы', title: account.title,
      text: 'Посетительница рассказала, что привело её в центр. К тому времени она ходила на занятия уже три месяца.',
      link: 'reviews/', action: 'Посмотреть отзыв'
    })}
    ${newsCard(p, holiday, {
      id: 'home-reading-title', tag: 'Из жизни центра', title: 'День России в зале на Савушкина',
      text: 'В июне 2024 года участницы подготовили праздничное выступление. Светлана сохранила запись встречи в Одноклассниках.',
      link: 'articles/den-rossii-v-centre/', action: 'Посмотреть встречу'
    })}
  </div>

  <section class="home-invite container" id="appointment" aria-labelledby="arrival-footer-title">
    <div class="invite-panel">
      <div><h2 id="arrival-footer-title">Договоримся о встрече?</h2>
        <p>Позвоните в центр, чтобы выбрать день и узнать, что будет в зале.</p>
        <div class="invite-detail-links"><a href="${p}booking/">Что уточнить перед посещением</a>
          <a href="${p}contacts/">Как добраться до центра</a></div>
      </div>
      <div class="invite-contacts"><a class="invite-phone" href="${centre.phoneHref}">${centre.phone}</a>
        <span class="invite-location">${icon('pin')}${centre.address}</span>
        <div class="invite-actions"><a class="button" href="${centre.phoneHref}">${icon('phone')}Позвонить</a>
          <a class="button button-secondary" href="${centre.mapUrl}">${icon('pin')}Открыть карту</a></div>
      </div>
    </div>
  </section>`;
}
