import { breadcrumbs, consultation, icon } from './components.mjs';
import { centre } from './content.mjs';

export function bodyhealthPage(p, product) {
  return `${breadcrumbs(p, 'BodyHealth', ['equipment/', 'Аппараты системы 5/95'])}
  <section class="container bodyhealth-hero">
    <div class="bodyhealth-heading"><h1>BodyHealth</h1><p class="bodyhealth-purpose">Массажно-тепловой аппарат для стоп и тела</p></div>
    <div class="product-gallery bodyhealth-gallery">
      <div class="gallery-main"><img id="product-main-image" src="${p}assets/${product.image}" alt="BodyHealth с площадкой для обеих стоп" width="720" height="620" fetchpriority="high"></div>
      <div class="gallery-thumbs" role="group" aria-label="Фотографии BodyHealth">
        <button class="selected" aria-pressed="true" data-gallery-src="${p}assets/${product.image}" data-gallery-alt="BodyHealth с площадкой для обеих стоп"><img src="${p}assets/${product.image}" alt="Общий вид аппарата" width="100" height="80"></button>
        <button aria-pressed="false" data-gallery-lifestyle data-gallery-src="${p}assets/${product.lifestyle}" data-gallery-alt="Иллюстрация NovuMedical: человек сидит, поставив ноги в BodyHealth"><img src="${p}assets/${product.lifestyle}" alt="Положение ног в аппарате" width="100" height="80"></button>
      </div>
      <p class="photo-caption">Иллюстрации производителя. <a href="${product.source}">Фотографии и описание NovuMedical</a></p>
    </div>
    <div class="bodyhealth-summary"><p>Внутри корпуса есть место для обеих стоп. На верхнем крае видны экран и кнопки. Для других участков тела производитель предусматривает отдельные накладки.</p>
      <p>Среди функций модели — прогрев и вибромассаж. Перед поездкой уточните у Светланы, можно ли увидеть BodyHealth на вашей встрече.</p>
      <a class="text-link" href="${centre.phoneHref}">Позвонить Светлане ${centre.phone}</a></div>
  </section>
  <section class="container section bodyhealth-device">
    <div class="bodyhealth-device-heading"><h2>Где находится управление</h2><p>На снимке виден аппарат сверху. Площадка для ног занимает центр корпуса, а панель управления расположена перед ней.</p>
    <p>При знакомстве попросите показать, где посмотреть выбранный режим и как остановить аппарат.</p></div>
    <figure class="bodyhealth-control-photo"><img src="${p}assets/bodyhealth-controls.jpg" alt="Вид BodyHealth сверху. У края корпуса расположены экран и кнопки" width="545" height="473" loading="lazy"><figcaption>Панель управления BodyHealth. Фото NovuMedical.</figcaption></figure>
  </section>
  <section class="container bodyhealth-documents" id="documents"><div><h2>Инструкции и сертификаты на аппараты</h2></div><div><p>Назовите Светлане модель BodyHealth и попросите показать инструкцию к конкретному аппарату. В ней можно найти назначение, правила использования и ограничения.</p>
    <p>Уточните, есть ли для этой модели сертификат или декларация и как с ними ознакомиться.</p>
    <a class="text-link" href="${p}articles/first-visit/#documents">Какие документы спросить перед визитом${icon('arrow')}</a></div></section>
  ${consultation(p)}`;
}
