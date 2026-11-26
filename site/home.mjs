import { centre, centreStories, centreVideos } from './content.mjs';
import { faqMarkup, icon } from './components.mjs';
import { centreLessonClip } from './reviews.mjs';

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});

const visitReasons = [
  ['movement', 'Мягко размять спину и суставы', 'Когда с утра трудно расходиться, хочется начать с малого. На занятии можно плавно подвигать плечами, размять спину и ноги. Темп и паузы вы выбираете сами.'],
  ['wrap', 'Попробовать массажную накидку', 'Устройтесь в кресле и дайте плечам и спине отдохнуть. Консультант поможет надеть накидку, подобрать приятный режим и покажет, где кнопка выключения.'],
  ['chat', 'Найти круг общения рядом с домом', 'В зале встречаются сверстники. За чашкой чая можно поделиться новостями или познакомиться с соседями по району. А по праздникам группа собирается на выступления и поздравления.'],
  ['book', 'Узнать полезные привычки для дома', 'В школе здоровья обсуждают повседневные вещи. Например, как найти время для движения среди домашних дел. Можно задать свой вопрос и выбрать привычку, которую хочется попробовать дома.']
];

const visitQuestions = [
  ['Сколько стоит первое занятие?', 'Ознакомительная встреча и проба массажной накидки бесплатны. Приходить ли ещё, вы решите после знакомства.'],
  ['Нужна ли спортивная форма или справка от врача?', 'Для лёгкой разминки достаточно удобной повседневной одежды. Возьмите сменную обувь. Нужна ли справка для выбранного занятия, подскажет Светлана Михайловна при записи.'],
  ['Я ни разу не пользовался массажной накидкой — разберусь ли я?', 'Да. Консультант поможет удобно сесть и надеть накидку, включит мягкий режим и покажет кнопки. Он будет рядом, если захочется что-то изменить или остановить массаж.'],
  ['Можно ли прийти просто посмотреть, без участия?', 'Да. Можно посидеть в зале, познакомиться с группой и Светланой Михайловной. Если захочется попробовать накидку, скажите об этом консультанту.'],
  ['Как добраться до центра в ТЦ «Факел»?', `Наш адрес — ${centre.address}. По телефону Светлана Михайловна подскажет, через какой вход удобнее зайти и на какой этаж подняться. <a href="${centre.mapUrl}">Открыть адрес на карте</a>`]
];

function newsCard(p, story, { id, tag, title, text, link, action }) {
  return `<article class="news-card" aria-labelledby="${id}">
    <img class="news-cover" src="${p}assets/${story.image}" width="${story.width}" height="${story.height}" loading="lazy" alt="${story.alt}">
    <div class="news-body">
      <div class="news-meta"><span class="news-tag">${tag}</span><time datetime="${story.date}">${dateFormat.format(new Date(story.date))}</time></div>
      <h3 id="${id}">${title}</h3><p>${text}</p>
      <a class="text-link" href="${p}${link}">${action} ${icon('arrow')}</a>
    </div>
  </article>`;
}

export function home(p) {
  const account = centreStories.find(story => story.slug === 'otzyv-posetitelnitsy');
  const holiday = centreStories.find(story => story.slug === 'den-rossii-v-centre');
  return `<section class="home-intro container" aria-labelledby="welcome-title">
    <div class="home-intro-copy">
      <span class="place-tag">Астрахань · ТЦ «Факел»</span>
      <h1 id="welcome-title">Центр здоровья и долголетия</h1>
      <p>Приходите на бесплатное ознакомительное занятие для людей старшего возраста. Вы сможете размяться, пообщаться с группой и попробовать массажную накидку вместе с консультантом.</p>
      <div class="intro-actions">
        <a class="button" href="${centre.phoneHref}">${icon('phone')}Позвонить и записаться</a>
        <a class="button button-secondary" href="#video-iz-zala"><span class="mini-play" aria-hidden="true"></span>Посмотреть занятие</a>
      </div>
      <div class="intro-contact"><a href="${centre.phoneHref}">${centre.phone}</a> <span aria-hidden="true">·</span> <span>Запись ведёт ${centre.contact}</span></div>
      <small class="call-note">Ответим на вопросы по телефону без навязывания · Пн–Сб</small>
    </div>
    <figure class="intro-image">
      <img src="${p}assets/network-welcome.webp" width="1152" height="768" fetchpriority="high" alt="Посетительница и сотрудница центра рассматривают карточку у входа в зал">
      <figcaption><a href="${p}media/#centre-photographs">Встреча в центре NovuMedical · <span>Фото сети</span></a></figcaption>
    </figure>
  </section>

  <section id="about-centre" class="centre-about container" aria-labelledby="about-title">
    <div class="centre-about-intro">
      <h2 id="about-title">Что такое Центр здоровья и долголетия</h2>
      <p>Наш зал на Савушкина в Астрахани открыт для людей старшего возраста. Сюда приходят на лёгкую суставную разминку, на разговор за чаем или на знакомство с массажной накидкой системы 5/95. Здесь нет больничных процедур и тяжёлых тренировок. Можно подвигаться вместе с группой, а когда хочется — сделать паузу.</p>
    </div>
    <ul class="centre-facts" role="list">
      <li><h3>Бесплатно</h3><p>Первое занятие и проба накидки бесплатны. Дальше — только по вашему желанию.</p></li>
      <li><h3>В своём темпе</h3><p>Даже если давно не делали зарядку, можно начать с пары простых движений и отдохнуть в любой момент.</p></li>
      <li><h3>Можно с близкими</h3><p>Возьмите с собой дочь или сына, супруга или подругу. Скажите Светлане при записи, сколько вас будет.</p></li>
    </ul>
  </section>

  <section id="visit-reasons" class="visit-reasons" aria-labelledby="reasons-title">
    <div class="container">
      <h2 id="reasons-title">Четыре причины заглянуть в зал на Савушкина</h2>
      <ul class="reason-cards" role="list">${visitReasons.map(([symbol, title, description]) => `
        <li>${icon(symbol)}<h3>${title}</h3><p>${description}</p></li>`).join('')}</ul>
    </div>
  </section>

  <section id="for-families" class="family-section container" aria-labelledby="family-title">
    <h2 id="family-title">Подходит и вам, и вашим родителям</h2>
    <div class="family-cards">
      <article><span class="family-tag">Для себя</span>
        <h3>Если хочется больше движения и живого общения</h3>
        <p>Когда дни дома становятся похожи один на другой, приятно договориться о встрече и выйти к людям. Приходите, даже если никого в зале пока не знаете. Светлана познакомит вас с группой, а к разминке можно присоединиться, когда освоитесь.</p>
      </article>
      <article><span class="family-tag">Для родителей</span>
        <h3>Если ищете заботу и безопасную среду для близких</h3>
        <p>Загляните вместе с мамой или папой. Вы сможете познакомиться с группой и рассказать, что важно вашему близкому. Если захочется попробовать накидку, консультант поможет удобно сесть, покажет кнопки и останется рядом.</p>
        <a class="button button-secondary" href="${centre.phoneHref}">${icon('phone')}Уточнить расписание для родителей</a>
      </article>
    </div>
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

  <section class="stories-band" aria-labelledby="stories-title"><div class="container">
    <h2 id="stories-title">Истории и жизнь центра</h2>
    <div class="centre-news">
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
  </div></section>

  <section id="visit-questions" class="visit-questions container" aria-labelledby="questions-title">
    <h2 id="questions-title">Частые вопросы перед первым визитом</h2>
    ${faqMarkup(visitQuestions)}
  </section>

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
