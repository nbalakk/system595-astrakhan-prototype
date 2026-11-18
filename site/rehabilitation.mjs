import { breadcrumbs, faqMarkup, icon, visitActions } from './components.mjs';
import { faqs } from './content.mjs';
import { visitFilm } from './reviews.mjs';

export function rehabilitation(p) {
  return `${breadcrumbs(p, 'Первое посещение')}
  <div class="container visit-opening">
    <header class="visit-opening-copy"><h1>Первое посещение</h1>
      <p class="lead">Первый визит — повод провести время с людьми своего поколения. Можно познакомиться с соседями по залу, посмотреть занятие и решить, хочется ли к нему присоединиться.</p>
      <p>Позвоните Светлане Бабак, чтобы выбрать время и узнать, чем группа будет заниматься в этот день.</p>
      ${visitActions()}
    </header>
    ${visitFilm(p)}
  </div>
  <div class="container visit-plan">
    <div class="visit-chapters">
      <section id="first-visit"><h2>С кем познакомиться</h2>
        <p>Если вы впервые в зале, можно попросить Светлану представить вас группе. Спросите у тех, кто уже здесь бывал, на какие встречи им нравится приходить. Так легче выбрать, что интересно вам самим.</p>
        <a href="${p}articles/den-rossii-v-centre/">Как в центре отмечали День России</a></section>
      <section id="visits"><h2>Что можно попробовать</h2>
        <p>В фильме о «Школе здоровья и долголетия» участники повторяют простые движения за ведущей. Если в день вашего визита будет такое занятие, можно присмотреться к темпу и решить, хочется ли попробовать вместе.</p>
        <p>Когда показывают массажную накидку, можно сначала посмотреть со стороны. Попросите Светлану показать, как накидка ложится на плечи и как остановить аппарат, если захочется её снять.</p>
        <div class="visit-plan-links"><a href="${p}five-steps/#step-3">Глава фильма о занятиях в группе</a><a href="${p}articles/zanyatie-v-zale/">Как надевают накидку в зале центра</a></div></section>
      <section id="after-visit"><h2 id="at-home">Перед уходом</h2>
        <p>Если захочется снова встретиться с этой группой, узнайте у Светланы, когда она соберётся. Если заинтересовал аппарат, запишите название модели. Дома по нему удобно найти описание и обдумать вопросы к следующей встрече.</p>
        <div class="visit-plan-links"><a href="${p}equipment/">Описания аппаратов</a><a href="${p}reviews/">Как поделиться впечатлениями</a></div></section>
    </div>
    <aside class="visit-prep"><h2>Перед поездкой</h2>
      ${faqMarkup(faqs)}<a class="text-link" href="${p}articles/first-visit/">Памятка к первому визиту${icon('arrow')}</a>
    </aside>
  </div>`;
}
