import { breadcrumbs, consultation, icon, pageHead } from './components.mjs';
import { centre } from './content.mjs';

const steps = [
  { start: 8.5, title: 'Абонемент на посещения', scene: 'По программе из фильма новому посетителю предлагают абонемент на 25 дней бесплатного посещения.' },
  { start: 17.2, title: 'Анкета и беседа', scene: 'Посетитель заполняет анкету, рассказывает о самочувствии и обсуждает с консультантом план посещений.' },
  { start: 29.2, title: 'Школа здоровья и долголетия', scene: 'Специалисты рассказывают об анатомии и проводят групповые занятия. В фильме участники повторяют простые движения за ведущей.' },
  { start: 41, title: 'Знакомство с оборудованием', scene: 'Консультант показывает аппараты и помогает познакомиться с их работой. В кадре можно увидеть маску для глаз.' },
  { start: 50.2, title: 'Повторная встреча', scene: 'По программе через 20 дней посетителю предлагают повторное тестирование. На встрече с консультантом обсуждают самочувствие.' }
];

export function fiveStepsPreview(p) {
  return `<section class="steps-preview container" aria-labelledby="steps-preview-title">
    <div class="steps-preview-intro"><h2 id="steps-preview-title">Пять шагов программы посещений</h2>
      <p>Что может быть после первого знакомства? В коротком фильме показан путь от беседы с консультантом до занятий и повторной встречи.</p></div>
    <ol class="steps-outline">${steps.map(step => `<li>${step.title}</li>`).join('')}</ol>
    <a class="text-link" href="${p}five-steps/">Посмотреть пять шагов · 57 секунд${icon('arrow')}</a>
  </section>`;
}

export function fiveStepsPage(p) {
  return `${breadcrumbs(p, 'Пять шагов', ['rehabilitation/', 'Первое посещение'])}
    ${pageHead('Пять шагов программы посещений', `В фильме показана программа системы 5/95 от первой беседы до повторной встречи. Уточните у Светланы, доступен ли сейчас этот абонемент в Астрахани и когда можно прийти. <a href="${centre.phoneHref}" aria-label="Позвонить Светлане ${centre.phone}">${centre.phone}</a>.`)}
    <div class="container steps-detail">
      <figure class="steps-video"><video id="visit-film" controls playsinline preload="metadata" poster="${p}assets/five-steps-poster.jpg" aria-label="Пять шагов программы посещений">
        <source src="${p}assets/five-steps.mp4" type="video/mp4">
        <track kind="captions" srclang="ru" label="Русские" src="${p}assets/five-steps-ru.vtt" default></video>
        <figcaption>Презентационный фильм · 57 секунд · <a href="${p}assets/five-steps.mp4">Открыть видеофайл</a></figcaption>
      </figure>
      <section aria-labelledby="scenes-title"><h2 id="scenes-title">Что показано в фильме</h2>
        <ol class="steps-scenes">${steps.map(step => `<li><h3>${step.title}</h3><p>${step.scene}</p>
          <button type="button" data-video-time="${step.start}" aria-controls="visit-film" aria-label="Смотреть фрагмент «${step.title}»" hidden>Смотреть с 0:${String(Math.round(step.start)).padStart(2, '0')}</button></li>`).join('')}
        </ol>
      </section></div>${consultation()}`;
}
