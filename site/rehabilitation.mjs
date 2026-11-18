import { breadcrumbs, consultation, faqMarkup, visitActions } from './components.mjs';
import { faqs } from './content.mjs';
import { visitFilm } from './reviews.mjs';

export function rehabilitation(p) {
  return `${breadcrumbs(p, 'Первое посещение')}
  <section class="container rehab-opening">
    <div class="rehab-summary"><h1>Первое посещение</h1>
      <p class="lead">В центре проходят групповые занятия для людей старшего возраста. Консультант Светлана Бабак показывает, как пользоваться массажными и тепловыми аппаратами системы 5/95, и отвечает на вопросы.</p>
      ${visitActions()}
    </div>
    <figure><img src="${p}assets/foot-use.jpg" alt="На иллюстрации человек сидит, поставив стопы в аппарат" width="720" height="720">
      <figcaption>Иллюстрация системы 5/95. <a href="${p}media/">Источник фотографии</a></figcaption></figure>
    <nav class="rehab-contents" aria-label="Об этом посещении"><a href="#first-visit">Разговор со Светланой</a><a href="#visits">Знакомство с аппаратом</a><a href="#after-visit">После встречи</a></nav>
  </section>
  <section class="container section rehab-chapter" id="first-visit">
    <div class="chapter-title"><span aria-hidden="true">1</span><h2>С чего начать разговор</h2></div>
    <div class="chapter-content"><p>Расскажите, что для вас важно в повседневной жизни. Возможно, хочется чаще выходить из дома, сохранять привычный ритм или найти время для заботы о себе.</p><p>Спросите Светлану, как проходит встреча, сколько времени она занимает и с какими аппаратами можно познакомиться.</p></div>
  </section>
  ${visitFilm(p)}
  <section class="surface-section" id="visits"><div class="container section rehab-chapter">
    <div class="chapter-title"><span aria-hidden="true">2</span><h2>Как устроен аппарат</h2></div>
    <div class="chapter-content"><p>Попросите показать модель и её управление. Где включается аппарат? Как его остановить? Где прочитать инструкцию?</p>
    <p>Если пока хотите только посмотреть или задать вопросы, скажите об этом Светлане в начале встречи.</p>
    <a class="text-link" href="${p}equipment/">Посмотреть фотографии аппаратов</a>
    <p>С пятью шагами системы 5/95 знакомятся постепенно, за несколько посещений. <a href="${p}five-steps/">О пяти шагах</a>.</p></div>
  </div></section>
  <section class="container section rehab-chapter" id="after-visit">
    <div class="chapter-title" id="at-home"><span aria-hidden="true">3</span><h2>После встречи</h2></div>
    <div class="chapter-content"><p>Запишите название аппарата и вопросы, которые остались. Если захотите прийти снова, договоритесь со Светланой о следующей встрече. Своими впечатлениями можно поделиться лично или по телефону.</p>
    <a class="text-link" href="${p}reviews/">Как оставить отклик</a></div>
  </section>
  <section class="container section faq-section"><h2>Перед поездкой</h2>${faqMarkup(faqs)}</section>
  ${consultation(p)}`;
}
