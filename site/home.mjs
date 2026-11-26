import { centre, centreStories, centreVideos } from './content.mjs';
import { icon } from './components.mjs';
import { visitFilm } from './reviews.mjs';
import { fiveStepsPreview } from './five-steps.mjs';

export function home(p) {
  const account = centreStories.find(story => story.slug === 'otzyv-posetitelnitsy');
  return `<section class="welcome-spread" aria-labelledby="welcome-title">
    <div class="container welcome-panel">
      <div class="welcome-copy">
        <p class="welcome-place">Астрахань <span aria-hidden="true">·</span> Для старшего поколения</p>
        <h1 id="welcome-title">Центр здоровья и долголетия</h1>
        <p class="welcome-lead">На Савушкина можно размяться в группе, пообщаться с ровесниками и познакомиться с аппаратами системы 5/95. Светлана подскажет, когда покажут массажную накидку или маску для глаз. Вы сами решите, что хотите попробовать.</p>
        <div class="welcome-links"><a class="button welcome-primary" href="${centre.phoneHref}">${icon('phone')} Позвонить и записаться</a>
          <a href="${p}rehabilitation/">Как проходит первый визит</a></div>
      </div>
      <figure class="welcome-photo">
        <img src="${p}assets/novueye-studio.jpg" width="1920" height="950" alt="Белая маска NovuEye с красной отделкой и проводным пультом на светлом столе" fetchpriority="high">
        <figcaption>Маска для глаз NovuEye. <a href="https://novumedical.org/wp-content/uploads/2020/08/ne-1.jpg" aria-label="Фото NovuMedical — маска для глаз NovuEye">Фото NovuMedical</a></figcaption>
      </figure>
    </div>
  </section>
  ${visitFilm(p, { firstMeeting: true })}
  ${fiveStepsPreview(p)}
  <div class="home-visit-desk container">
    <section class="home-consultant" id="appointment" aria-labelledby="home-consultant-title">
      <p class="home-person-role">Консультант центра</p>
      <h2 id="home-consultant-title">${centre.contact}</h2>
      <p>Светлана подскажет, когда собирается группа, сколько длится первое посещение и сколько оно стоит. Если хотите прийти вдвоём или вам нужен вход без ступеней, скажите об этом при звонке.</p>
      <div class="home-desk-links">
        <a class="home-desk-phone" href="${centre.phoneHref}" aria-label="Позвонить Светлане ${centre.phone}">${icon('phone')}${centre.phone}</a>
        <a href="${p}booking/">Что уточнить перед поездкой</a>
      </div>
    </section>
    <section class="home-account" aria-labelledby="home-account-title">
      <p class="home-person-role">Рассказ посетительницы</p>
      <h2 id="home-account-title">${account.title}</h2>
      <p>Посетительница рассказывает, что привело её на занятия. Центр опубликовал этот разговор <time datetime="${account.date}">${centreVideos.feedback.published} года</time>.</p>
      <a class="text-link" href="${p}reviews/">Прочитать отзыв «${account.title}» ${icon('arrow')}</a>
    </section>
    <div class="home-directions">
      <p>${icon('pin')}<a href="${centre.mapUrl}">${centre.address}</a></p>
      <a href="${p}contacts/">Контакты и карта ${icon('arrow')}</a>
    </div>
  </div>`;
}
