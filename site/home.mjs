import { centre, centreStories } from './content.mjs';
import { icon } from './components.mjs';
import { centreLessonClip } from './reviews.mjs';

export function home(p) {
  const account = centreStories.find(story => story.slug === 'otzyv-posetitelnitsy');
  return `<section class="arrival container" aria-labelledby="welcome-title">
    <h1 id="welcome-title">Центр здоровья и долголетия</h1>
    <p class="arrival-intro">В нашем центре в Астрахани люди старшего возраста собираются, чтобы размяться и пообщаться. В первый раз можно посмотреть занятие и попробовать массажную накидку вместе с консультантом.</p>
    <figure class="arrival-photo">
      <img src="${p}assets/network-welcome.webp" width="1152" height="768" fetchpriority="high" alt="Посетительница и сотрудница центра рассматривают карточку у входа в зал">
      <figcaption>Встреча посетителей в центре NovuMedical. <a href="${p}media/#centre-photographs">Фото сети</a></figcaption>
    </figure>
    <div class="arrival-desk">
      <div class="arrival-booking">
        <a class="arrival-call" href="${centre.phoneHref}">
          <span><span class="call-label">Позвонить и записаться</span><strong>${centre.phone}</strong></span>
          <span class="call-icon">${icon('phone')}</span>
        </a>
        <a class="arrival-address" href="${centre.mapUrl}">${icon('pin')}<span>ул. Савушкина, 46А, ТЦ «Факел»</span></a>
      </div>
      ${centreLessonClip(p, { inOpening: true })}
    </div>
  </section>
  <section class="meeting-notes" id="first-meeting" aria-labelledby="meeting-title">
    <div class="container meeting-inner">
      <div class="meeting-heading">
        <h2 id="meeting-title">Первый раз в центре</h2>
        <p>Запись ведёт ${centre.contact}. Если хотите прийти с близким человеком, скажите об этом при звонке.</p>
        <a class="text-link" href="${p}rehabilitation/">Как проходит первое посещение ${icon('arrow')}</a>
      </div>
      <div class="meeting-details">
        <div><h3>Познакомиться с группой</h3><p>Посмотрите, как проходит встреча, и пообщайтесь с теми, кто уже ходит в центр. В зале собираются и по праздникам.</p></div>
        <div><h3>Попробовать оборудование</h3><p>Консультант покажет, как устроена массажная накидка системы 5/95, где менять режим и как её выключить.</p>
          <a href="${p}equipment/">Об аппаратах в центре</a></div>
        <div><h3 id="steps-preview-title">Пять шагов программы</h3><p>От первой беседы до следующей встречи. В коротком фильме можно заглянуть и в школу здоровья и долголетия.</p>
          <a href="${p}five-steps/">Посмотреть пять шагов · 57 секунд</a></div>
      </div>
    </div>
  </section>
  <div class="container centre-reading">
    <section aria-labelledby="home-account-title">
      <p class="reading-label">Рассказ посетительницы</p>
      <h2 id="home-account-title">${account.title}</h2>
      <p>В январе 2023 года посетительница рассказала, что привело её в центр. К тому времени она ходила на занятия уже три месяца.</p>
      <a class="text-link" href="${p}reviews/">Посмотреть отзыв ${icon('arrow')}</a>
    </section>
    <section aria-labelledby="home-reading-title">
      <p class="reading-label">Из жизни центра</p>
      <h2 id="home-reading-title">День России в зале на Савушкина</h2>
      <p>В июне 2024 года участницы подготовили праздничное выступление. Светлана сохранила запись встречи в Одноклассниках.</p>
      <a class="text-link" href="${p}articles/den-rossii-v-centre/">Посмотреть встречу ${icon('arrow')}</a>
    </section>
  </div>
  <section class="arrival-footer" id="appointment" aria-labelledby="arrival-footer-title">
    <div class="container arrival-footer-inner">
      <div><h2 id="arrival-footer-title">Договоримся о встрече?</h2>
        <p>Позвоните в центр, чтобы выбрать день и узнать, что будет в зале.</p>
        <a href="${p}booking/">Что уточнить перед посещением</a>
      </div>
      <div class="arrival-footer-contacts"><a class="arrival-footer-number" href="${centre.phoneHref}">${icon('phone')}${centre.phone}</a>
        <a href="${p}contacts/">Как добраться до центра ${icon('arrow')}</a></div>
    </div>
  </section>`;
}
