import { breadcrumbs, icon } from './components.mjs';
import { centre } from './content.mjs';

const steps = [
  { start: 8.5, title: 'Абонемент на посещения', scene: 'По программе из фильма новому посетителю предлагают абонемент на 25 дней бесплатного посещения.' },
  { start: 17.2, title: 'Анкета и беседа', scene: 'Посетитель заполняет анкету, рассказывает о самочувствии и обсуждает с консультантом план посещений.' },
  { start: 29.2, title: 'Школа здоровья и долголетия', scene: 'Специалисты рассказывают об анатомии и проводят групповые занятия. В фильме участники повторяют простые движения за ведущей.' },
  { start: 41, title: 'Знакомство с оборудованием', scene: 'Консультант показывает аппараты и помогает познакомиться с их работой. В кадре можно увидеть маску для глаз.' },
  { start: 50.2, title: 'Повторная встреча', scene: 'По программе через 20 дней посетителю предлагают повторное тестирование. На встрече с консультантом обсуждают самочувствие.' }
];

function clockTime(seconds) {
  return '0:' + String(Math.floor(seconds)).padStart(2, '0');
}

export function fiveStepsPreview(p) {
  return `<section class="steps-preview container" aria-labelledby="steps-preview-title">
    <div class="steps-feature">
      <header class="steps-preview-intro">
        <h2 id="steps-preview-title">Пять шагов программы посещений</h2>
        <p>Посмотрите, как устроены занятия по системе 5/95: от знакомства с консультантом до повторной встречи.</p>
      </header>
      <a class="steps-poster-link" href="${p}five-steps/">
        <img src="${p}assets/five-steps-poster.jpg" alt="" width="848" height="480" loading="lazy">
        <span class="steps-poster-action"><span class="steps-poster-label"><span class="steps-play-icon" aria-hidden="true"></span>Открыть фильм</span>
          <span class="steps-duration">57 секунд</span></span>
      </a>
      <ol class="steps-outline">${steps.map((step, index) => `<li>
        <a href="${p}five-steps/#step-${index + 1}"><span>${step.title}</span><time datetime="PT${step.start}S">${clockTime(step.start)}</time></a>
      </li>`).join('')}</ol>
    </div>
  </section>`;
}

export function fiveStepsPage(p) {
  return `${breadcrumbs(p, 'Пять шагов', ['rehabilitation/', 'Первое посещение'])}
    <div class="container steps-program">
      <header class="steps-page-head">
        <h1>Пять шагов программы посещений</h1>
        <p class="lead">Короткий фильм о программе системы 5/95. В кадре участники знакомятся с консультантом, занимаются в группе и пробуют аппараты.</p>
      </header>
      <div class="steps-detail">
        <figure class="steps-video"><video id="visit-film" controls playsinline preload="metadata" poster="${p}assets/five-steps-poster.jpg" aria-label="Пять шагов программы посещений">
          <source src="${p}assets/five-steps.mp4" type="video/mp4">
          <track kind="captions" srclang="ru" label="Русские" src="${p}assets/five-steps-ru.vtt" default></video>
          <figcaption><span>57 секунд · Русские субтитры</span><a href="${p}assets/five-steps.mp4">Открыть видеофайл</a></figcaption>
        </figure>
        <section class="steps-chapters" aria-labelledby="scenes-title"><h2 id="scenes-title">Главы фильма</h2>
          <ol class="steps-scenes">${steps.map((step, index) => `<li id="step-${index + 1}"><h3>${step.title}</h3><p>${step.scene}</p>
            <button type="button" data-video-time="${step.start}" aria-controls="visit-film" aria-label="Смотреть фрагмент «${step.title}» с ${clockTime(step.start)}" hidden><span class="steps-play-icon" aria-hidden="true"></span>${clockTime(step.start)}</button></li>`).join('')}
          </ol>
        </section>
        <aside class="steps-local" aria-labelledby="steps-local-title">
          <h2 id="steps-local-title">Прийти в центр в Астрахани</h2>
          <p>Уточните у Светланы, действует ли сейчас абонемент из фильма в Астрахани и когда удобно прийти.</p>
          <a class="text-link" href="${centre.phoneHref}" aria-label="Позвонить Светлане ${centre.phone}">${icon('phone')}${centre.phone}</a>
          <a href="${p}rehabilitation/">О первом посещении</a>
        </aside>
      </div>
    </div>`;
}
