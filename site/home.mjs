import { association, centre, centreStories, faqs, healthArticles } from './content.mjs';
import { faqMarkup, icon } from './components.mjs';
import { visitFilm } from './reviews.mjs';
import { fiveStepsPreview } from './five-steps.mjs';
import { healthPreview } from './health-articles.mjs';

export function home(p) {
  const invitation = centreStories.find(story => story.slug === 'den-pensionera');
  return `<section class="container welcome-spread" aria-labelledby="welcome-title">
    <div class="welcome-panel">
      <div class="welcome-copy">
        <h1 id="welcome-title">Групповые занятия для старшего поколения</h1>
        <p class="welcome-lead">Светлана Бабак покажет массажные и тепловые аппараты системы 5/95. На первой встрече вы увидите, как ими пользуются, и сможете задать вопросы.</p>
        <div class="welcome-links"><a class="button welcome-primary" href="${centre.phoneHref}">${icon('phone')} Позвонить Светлане</a>
          <a href="#first-meeting">О первой встрече</a></div>
      </div>
      <figure class="welcome-photo">
        <img src="${p}assets/${invitation.image}" width="${invitation.width}" height="${invitation.height}" alt="${invitation.alt}" fetchpriority="high">
        <figcaption><a href="${p}articles/${invitation.slug}/">Приглашение ко Дню пенсионера</a><time datetime="${invitation.date}">Сентябрь 2025</time></figcaption>
      </figure>
    </div>
    <p class="welcome-address"><a href="${centre.mapUrl}">${centre.address.replace(centre.city + ', ', '')} на карте</a></p>
  </section>
  ${visitFilm(p, { firstMeeting: true })}
  ${fiveStepsPreview(p)}
  ${healthPreview(p, healthArticles, centreStories)}
  <section class="home-model-strip"><div class="container home-model">
    <figure class="home-model-photo"><img src="${p}assets/bodyhealth-controls.jpg" alt="Площадка для стоп и кнопки управления на корпусе BodyHealth" width="545" height="473" loading="lazy">
      <figcaption><a href="${p}media/#equipment">Фото производителя</a></figcaption></figure>
    <div class="home-model-copy"><h2>С какими аппаратами можно познакомиться</h2>
      <p>Например, у BodyHealth есть площадка для стоп, прогрев и вибрация. На встрече можно попросить показать управление и узнать об ограничениях конкретной модели.</p>
      <div class="home-model-links"><a class="text-link" href="${p}equipment/">Все аппараты ${icon('arrow')}</a><a href="${p}equipment/bodyhealth/">Как устроен BodyHealth</a></div>
      <p class="home-model-credit"><a href="${association.url}">${association.name}</a></p>
    </div>
  </div></section>
  <section class="container home-preparation">
    <div><h2>Перед поездкой</h2>
      <p>Если у вас есть вопрос о конкретном аппарате, запишите его название.</p>
      <a class="text-link" href="${p}articles/first-visit/#documents">Инструкции и сертификаты ${icon('arrow')}</a>
    </div>${faqMarkup(faqs.slice(0, 3))}
  </section>
  <section class="home-contact-strip" id="appointment"><div class="container home-contact">
    <div><h2>Договориться о первом визите</h2><p>Позвоните консультанту Светлане Михайловне Бабак. Она поможет выбрать время и подскажет, как найти вход.</p></div>
    <div class="home-contact-links"><a class="button" href="${centre.phoneHref}">${icon('phone')}${centre.phone}</a>
      <a href="${p}booking/">Как подготовиться к звонку</a></div>
  </div></section>`;
}
