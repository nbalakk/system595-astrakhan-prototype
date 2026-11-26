import { breadcrumbs, icon } from './components.mjs';
import { centre } from './content.mjs';

export function bodyhealthPage(p, product) {
  return `${breadcrumbs(p, 'BodyHealth', ['equipment/', 'Аппараты системы 5/95'])}
  <section class="container bodyhealth-hero model-bodyhealth">
    <div class="bodyhealth-heading"><h1>BodyHealth</h1><p class="bodyhealth-purpose">Массажно-тепловой аппарат для стоп и тела</p></div>
    <div class="product-gallery bodyhealth-gallery">
      <div class="gallery-main"><img id="product-main-image" src="${p}assets/${product.image}" alt="BodyHealth с площадкой для обеих стоп" width="720" height="620" fetchpriority="high"></div>
      <div class="gallery-thumbs" role="group" aria-label="Фотографии BodyHealth" hidden>
        <button class="selected" aria-label="Показать BodyHealth отдельно" aria-pressed="true" data-gallery-src="${p}assets/${product.image}" data-gallery-alt="BodyHealth с площадкой для обеих стоп"><img src="${p}assets/${product.image}" alt="" width="100" height="80"></button>
        <button aria-label="Показать, как располагаются ноги в аппарате" aria-pressed="false" data-gallery-lifestyle data-gallery-src="${p}assets/${product.lifestyle}" data-gallery-alt="Женщина сидит в кресле, поставив обе ноги в BodyHealth"><img src="${p}assets/${product.lifestyle}" alt="" width="100" height="80"></button>
      </div>
      <noscript><p><a href="${p}assets/${product.lifestyle}">Открыть фотографию положения ног в BodyHealth</a></p></noscript>
      <p class="photo-caption">Иллюстрации производителя. <a href="${product.source}">Фотографии и описание NovuMedical</a></p>
    </div>
    <div class="bodyhealth-summary"><p>У BodyHealth внутри корпуса есть площадка для стоп. Им пользуются сидя, поставив на неё обе ноги. Аппарат сочетает прогрев и вибромассаж. Для других участков тела производитель предусмотрел отдельные накладки.</p>
      <p>При записи спросите у Светланы, будет ли BodyHealth в зале в день вашего визита.</p>
      <a class="text-link" href="${centre.phoneHref}">Позвонить Светлане ${centre.phone}</a></div>
  </section>
  <section class="container section bodyhealth-device">
    <div class="bodyhealth-device-heading"><h2>Где находятся кнопки</h2><p>Экран и кнопки расположены на верхнем крае корпуса. Попросите Светлану показать, как на экране найти выбранный режим и какой кнопкой остановить аппарат.</p></div>
    <figure class="bodyhealth-control-photo"><img src="${p}assets/bodyhealth-controls.jpg" alt="Вид BodyHealth сверху. У края корпуса расположены экран и кнопки" width="545" height="473" loading="lazy"><figcaption>Панель управления BodyHealth. Фото NovuMedical.</figcaption></figure>
  </section>
  <section class="container bodyhealth-documents" id="documents"><div><h2>Инструкция к BodyHealth</h2></div><div><p>Попросите Светлану показать инструкцию с полным названием модели. В ней описаны правила использования прогрева и вибромассажа, а также ограничения.</p>
    <a class="text-link" href="${p}articles/first-visit/#documents">Как узнать о сертификате или декларации${icon('arrow')}</a></div></section>
  <nav class="container model-return" aria-label="Другие аппараты"><a class="text-link" href="${p}equipment/">Все аппараты системы 5/95${icon('arrow')}</a></nav>`;
}
