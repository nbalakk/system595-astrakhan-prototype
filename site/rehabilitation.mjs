import { breadcrumbs, icon } from './components.mjs';
import { centre } from './content.mjs';
import { visitFilm } from './reviews.mjs';

export function rehabilitation(p) {
  return `${breadcrumbs(p, 'Первое посещение')}
  <div class="container visit-opening">
    <header class="visit-opening-copy"><h1>Первое посещение</h1>
      <p class="lead">В первый раз можно посмотреть, как проходит занятие, поговорить с участниками и познакомиться с аппаратами системы 5/95. Консультант поможет разобраться, если что-то будет непонятно.</p>
      <p>Позвоните в центр, чтобы выбрать день. Консультант ${centre.contact} подскажет, что будет в зале в день вашего визита.</p>
      <div class="visit-entry-actions"><a class="button" href="${centre.phoneHref}" aria-label="Позвонить в центр для записи, ${centre.phone}">${icon('phone')}Позвонить в центр</a>
        <a href="${p}booking/">Что уточнить при записи</a></div>
    </header>
    <figure class="visit-welcome-photo">
      <img src="${p}assets/network-welcome.webp" width="1152" height="768" alt="У входа сотрудница и посетительница в платье с цветами держат жёлтую карточку. За ними ждёт мужчина.">
      <figcaption>Встреча посетителей в одном из центров NovuMedical. <a href="${p}media/#centre-photographs">Фото сети</a></figcaption>
    </figure>
  </div>
  <div class="container visit-plan">
    <div class="visit-chapters">
      <section id="first-visit"><h2>Знакомство с группой</h2>
        <p>Если хочется познакомиться с группой, попросите консультанта представить вас участникам. В центре встречаются и по праздникам. Например, на День России участницы устроили выступление в зале.</p>
        <a href="${p}articles/den-rossii-v-centre/">Как в центре отмечали День России</a></section>
      <section id="visits"><h2>Что можно попробовать</h2>
        <p>В фильме о программе участники повторяют движения за ведущей. При записи можно узнать, когда будет такая встреча. А на показе массажной накидки удобно спросить, как её надеть и какой кнопкой выключить.</p>
        <div class="visit-plan-links"><a href="${p}five-steps/#step-3">Глава фильма о занятиях в группе</a><a href="${p}articles/zanyatie-v-zale/">Как надевают накидку в зале центра</a></div></section>
      <section id="after-visit"><h2 id="at-home">Если захочется вернуться</h2>
        <p>Спросите у Светланы, когда снова соберётся группа или пройдёт показ интересующего вас аппарата.</p>
        <div class="visit-plan-links"><a href="${p}equipment/">Описания аппаратов</a><a href="${p}reviews/">Прочитать отзыв посетительницы</a></div></section>
    </div>
    <div class="visit-support">
      ${visitFilm(p)}
      <aside class="visit-prep"><h2>Перед поездкой</h2>
        <nav class="visit-prep-links" aria-label="Подготовиться к поездке">
          <a href="${p}contacts/">Открыть карту и сохранить телефон центра</a>
          <a href="${p}articles/first-visit/">Что взять и какие вопросы задать в зале</a>
        </nav>
      </aside>
    </div>
  </div>`;
}
