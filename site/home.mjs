import { association, centre, faqs } from './content.mjs';
import { faqMarkup, icon, visitActions } from './components.mjs';
import { visitFilm } from './reviews.mjs';
import { fiveStepsPreview } from './five-steps.mjs';

export function home(p) {
  return `<section class="container landing-hero"><div class="landing-hero-stage">
  <div class="landing-hero-copy">
    <p class="landing-audience">Для людей старшего возраста в Астрахани</p>
    <h1>Центр здоровья и долголетия</h1>
    <p class="lead">Здесь проходят групповые занятия для тех, кому важно заботиться о здоровье и сохранять активность с возрастом. Консультант Светлана Бабак показывает, как пользоваться массажными и тепловыми аппаратами системы 5/95.</p>
  </div>
  <div class="landing-invitation">
    <h2>Договориться о первом визите</h2><p>Позвоните Светлане, чтобы выбрать время.</p>
    <p class="landing-address">${icon('pin')}<span>${centre.address}</span></p>
    ${visitActions()}
  </div>
</div></section>
<section class="landing-visit"><div class="container landing-visit-layout">
  <h2>Как проходит первая встреча</h2>
  <div class="landing-visit-intro"><p>Расскажите Светлане, что для вас важно в обычной жизни. Может быть, вы хотите чаще гулять или самостоятельно справляться с делами. Спросите, как проходит занятие, и попросите показать управление аппаратом.</p>
    <p>Если захотите продолжить, договоритесь о следующей встрече.</p>
    <a class="text-link" href="${p}rehabilitation/">Подробнее о посещении${icon('arrow')}</a></div>
</div></section>
${visitFilm(p)}
${fiveStepsPreview(p)}
<section class="container landing-centre">
  <div><p class="landing-role">Ваш консультант</p><h2>${centre.contact}</h2></div>
  <div class="landing-centre-copy"><p>Со Светланой можно поговорить ещё до поездки. Она подскажет, где вход, и ответит на вопросы о первом визите. Скажите, если хотите прийти с близким человеком или вам трудно подниматься по ступенькам.</p>
  <a class="text-link" href="${centre.phoneHref}">${icon('phone')}Позвонить Светлане</a></div>
</section>
<section class="container landing-equipment">
  <h2>Знакомство с аппаратами системы 5/95</h2>
  <div class="landing-apparatus">
    <figure><img src="${p}assets/bodyhealth-controls.jpg" alt="BodyHealth сверху. Внутри расположена площадка для стоп, по верхнему краю — кнопки управления." width="545" height="473" loading="lazy"><figcaption>BodyHealth, вид сверху. <a href="${p}media/">Фото из материалов производителя</a></figcaption></figure>
    <div><h3>Как выглядит BodyHealth</h3><p>Ноги ставят на площадку внутри корпуса. На верхней панели видны кнопки и экран. В описании этой модели производитель указывает прогрев и вибрацию.</p><p>Перед поездкой спросите Светлану, какие аппараты можно увидеть во время вашего визита.</p>
    <div class="landing-device-links"><a class="text-link" href="${p}equipment/bodyhealth/">Рассмотреть BodyHealth${icon('arrow')}</a><a href="${p}equipment/">Другие аппараты системы</a></div></div>
  </div>
  <aside class="landing-association"><h3>${association.name}</h3><div><p>${association.description}</p><a href="${association.url}">Об Ассоциации на сайте NovuMedical</a></div></aside>
</section>
<section class="container landing-faq">
  <div class="landing-faq-intro"><h2>Перед поездкой</h2><p>Если вас интересуют документы, назовите Светлане модель аппарата. Она подскажет, где посмотреть инструкцию и как уточнить сведения о сертификате.</p><a class="text-link" href="${p}articles/first-visit/#documents">Инструкции и сертификаты на аппараты${icon('arrow')}</a></div>
  ${faqMarkup(faqs.slice(0, 3))}
</section>
<section class="landing-booking" id="appointment"><div class="container landing-contacts">
  <div><h2>Договориться о посещении</h2><p>${centre.address}</p></div>
  <div><p>Позвоните перед поездкой, чтобы выбрать время.</p>${visitActions()}</div>
</div></section>`;
}
