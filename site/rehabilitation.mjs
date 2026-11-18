import { breadcrumbs, faqMarkup, icon, visitActions } from './components.mjs';
import { faqs } from './content.mjs';
import { visitFilm } from './reviews.mjs';

export function rehabilitation(p) {
  return `${breadcrumbs(p, 'Первое посещение')}
  <div class="container visit-opening">
    <header class="visit-opening-copy"><h1>Первое посещение</h1>
      <p class="lead">Вы познакомитесь со Светланой Бабак и увидите, как проходят групповые занятия для людей старшего возраста. Светлана покажет, как пользоваться массажными и тепловыми аппаратами системы 5/95, и ответит на ваши вопросы.</p>
      <p>Время первой встречи согласуйте по телефону.</p>
      ${visitActions()}
    </header>
    ${visitFilm(p)}
  </div>
  <div class="container visit-plan">
    <div class="visit-chapters">
      <section id="first-visit"><h2>С чего начать разговор</h2>
        <p>Расскажите, что для вас важно в повседневной жизни. Может быть, хочется чаще выходить из дома или самостоятельно справляться с привычными делами. Спросите, сколько займёт встреча и с чем вы успеете познакомиться.</p>
        <a href="${p}articles/">Занятия и встречи на фотографиях из центра</a></section>
      <section id="visits"><h2>Знакомство с аппаратом</h2>
        <p>Попросите показать, как включить и остановить аппарат, где посмотреть режим и найти инструкцию. Если пока хотите только посмотреть, скажите об этом Светлане.</p>
        <a href="${p}equipment/">Посмотреть фотографии аппаратов</a></section>
      <section id="after-visit"><h2 id="at-home">После встречи</h2>
        <p>Запишите название модели и вопросы, которые остались. Если захотите продолжить, договоритесь о следующем посещении. С пятью шагами программы знакомятся постепенно, за несколько встреч.</p>
        <div class="visit-plan-links"><a href="${p}five-steps/">Фильм о пяти шагах</a><a href="${p}reviews/">Как оставить отклик</a></div></section>
    </div>
    <aside class="visit-prep"><h2>Перед поездкой</h2>
      ${faqMarkup(faqs)}<a class="text-link" href="${p}articles/first-visit/">Памятка к первому визиту${icon('arrow')}</a>
    </aside>
  </div>`;
}
