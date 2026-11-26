import { breadcrumbs, icon } from './components.mjs';
import { centre } from './content.mjs';
import { visitFilm } from './reviews.mjs';

export function rehabilitation(p) {
  return `${breadcrumbs(p, 'Первое посещение')}
  <div class="container visit-opening">
    <header class="visit-opening-copy"><h1>Первое посещение</h1>
      <p class="lead">Приходите посмотреть, как проходит занятие. Можно познакомиться с группой, понаблюдать за разминкой и попросить показать аппарат, который вас заинтересовал.</p>
      <p>Время встречи подскажет консультант ${centre.contact}. По телефону вы сможете выбрать день и узнать, что будет в зале.</p>
      <div class="visit-entry-actions"><a class="button" href="${centre.phoneHref}" aria-label="Позвонить Светлане для записи ${centre.phone}">${icon('phone')}Позвонить Светлане</a>
        <a href="${p}booking/">Что уточнить при записи</a></div>
    </header>
    ${visitFilm(p)}
  </div>
  <div class="container visit-plan">
    <div class="visit-chapters">
      <section id="first-visit"><h2>Знакомство с группой</h2>
        <p>Впервые прийти в незнакомую группу бывает непросто. Попросите Светлану представить вас участникам. Они встречаются в центре и на занятиях, и по праздникам.</p>
        <a href="${p}articles/den-rossii-v-centre/">Как в центре отмечали День России</a></section>
      <section id="visits"><h2>Что можно попробовать</h2>
        <p>На групповой разминке участники повторяют движения за ведущей. Посмотрите, подходит ли вам темп. Если интересует система 5/95, попросите показать, как накидка ложится на плечи и как остановить аппарат.</p>
        <div class="visit-plan-links"><a href="${p}five-steps/#step-3">Глава фильма о занятиях в группе</a><a href="${p}articles/zanyatie-v-zale/">Как надевают накидку в зале центра</a></div></section>
      <section id="after-visit"><h2 id="at-home">Если захочется вернуться</h2>
        <p>Спросите у Светланы, когда снова соберётся группа или пройдёт показ интересующего вас аппарата.</p>
        <div class="visit-plan-links"><a href="${p}equipment/">Описания аппаратов</a><a href="${p}reviews/">Прочитать отзыв посетительницы</a></div></section>
    </div>
    <aside class="visit-prep"><h2>Перед поездкой</h2>
      <nav class="visit-prep-links" aria-label="Подготовиться к поездке">
        <a href="${p}contacts/">Открыть карту и сохранить телефон центра</a>
        <a href="${p}articles/first-visit/">Что взять и какие вопросы задать в зале</a>
      </nav>
    </aside>
  </div>`;
}
