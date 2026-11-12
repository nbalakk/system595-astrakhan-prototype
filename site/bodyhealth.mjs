import { breadcrumbs, button, icon } from './components.mjs';

const official = 'https://system595.com/ru/bodyhealth-ru/';
const detailed = 'https://novumedical.org/products/bodyhealth/';

export function bodyhealthPage(p, product) {
  const image = product.image || 'bodyhealth.jpg';
  const lifestyle = product.lifestyle || 'bodyhealth-use.jpg';
  const visit = `${p}booking/?purpose=visit&product=bodyhealth`;
  const price = `${p}booking/?purpose=price&product=bodyhealth`;
  const advice = `${p}booking/?purpose=equipment&product=bodyhealth`;

  return `${breadcrumbs(p, 'BodyHealth', ['equipment/', 'Оборудование'])}
  <section class="container bodyhealth-hero">
    <div class="bodyhealth-heading">
      <h1>BodyHealth</h1>
      <p class="bodyhealth-purpose">Массажно-тепловой аппарат для стоп и тела</p>
    </div>
    <div class="product-gallery bodyhealth-gallery">
      <div class="gallery-main"><img id="product-main-image" src="${p}assets/${image}" alt="Аппарат BodyHealth" width="720" height="620" fetchpriority="high"></div>
      <div class="gallery-thumbs" role="group" aria-label="Фотографии BodyHealth">
        <button class="selected" aria-pressed="true" data-gallery-src="${p}assets/${image}" data-gallery-alt="Аппарат BodyHealth"><img src="${p}assets/${image}" alt="Вид аппарата" width="100" height="80"></button>
        <button aria-pressed="false" data-gallery-src="${p}assets/${lifestyle}" data-gallery-alt="Пример использования BodyHealth из материалов NovuMedical"><img src="${p}assets/${lifestyle}" alt="Пример использования" width="100" height="80"></button>
      </div>
      <p class="photo-caption">Фотографии NovuMedical. На них не изображён центр в Астрахани. <a href="${detailed}" target="_blank" rel="noopener">Источник</a></p>
    </div>
    <div class="bodyhealth-summary"><p>Площадка для обеих стоп, выносные накладки для тела и несколько способов воздействия в одном устройстве.</p><ul class="bodyhealth-highlights"><li>Прогрев и вибромассаж</li><li>Низкочастотная стимуляция</li><li>Выбор режима и интенсивности</li></ul><div class="bodyhealth-main-actions">${button(price, 'Узнать стоимость')}${button(visit, 'Посмотреть в центре', true)}</div><a class="text-link" href="${advice}">Получить консультацию</a><p class="bodyhealth-stock-note">Пример линейки системы 5/95. Наличие и условия покупки — по запросу.</p></div>
  </section>

  <section class="container section bodyhealth-device">
    <div class="bodyhealth-device-heading"><h2>Устройство BodyHealth</h2><p>Для стоп используется внутренняя площадка с турмалиновыми элементами. Для других участков тела предусмотрены низкочастотные накладки.</p><a class="text-link" href="${detailed}" target="_blank" rel="noopener">Описание NovuMedical</a></div>
    <figure class="bodyhealth-control-photo"><img src="${p}assets/bodyhealth-controls.jpg" alt="Вид BodyHealth сверху: площадка для стоп и электронная панель на верхнем крае корпуса" width="545" height="473" loading="lazy"><figcaption>Площадка для стоп и панель управления. Фото NovuMedical.</figcaption></figure>
    <div class="bodyhealth-controls-copy"><h3>Управление на корпусе</h3><p>На фотографии видны экран и кнопки на верхней панели. В описании производителя указаны несколько режимов и выбор интенсивности стимуляции.</p><p>Перед покупкой попросите показать переключение режимов и остановку аппарата. Так будет легче оценить удобство управления для себя.</p></div>
  </section>

  <section class="surface-section"><div class="container section bodyhealth-functions"><div><h2>Функции аппарата</h2><p>По описанию NovuMedical. Это сведения об устройстве, а не обещание результата лечения.</p></div><div class="bodyhealth-function-list"><div><h3>Тепло и вибрация</h3><p>Инфракрасный прогрев и вибромассаж.</p></div><div><h3>Стимуляция стоп и тела</h3><p>Низкочастотное воздействие через площадку и отдельные накладки.</p></div><div><h3>Красный и синий LLLT</h3><p>В описании модели предусмотрено раздельное и совместное включение.</p></div><div><h3>Другие функции</h3><p>Турмалиновые элементы, магнитное воздействие, ионизация и режим прижигания.</p></div></div></div></section>

  <section class="container section bodyhealth-visit"><div><h2>Посещение и покупка</h2></div><div><p>Укажите BodyHealth при записи и до поездки уточните, доступен ли аппарат. В центре можно обсудить управление, комплект поставки и условия приобретения.</p><div class="bodyhealth-visit-actions">${button(visit, 'Записаться на посещение')}${button(advice, 'Обсудить покупку', true)}</div></div></section>

  <section class="container bodyhealth-documents"><div><h2>Документы<br>перед использованием</h2><p>Обсудите возможность применения с лечащим врачом и прочитайте инструкцию именно к вашей модели. Режимы и ограничения не следует выбирать по рекламному описанию.</p></div><div><dl><div><dt>Инструкция и паспорт</dt><dd>Запросите у продавца до использования</dd></div><div><dt>Комплект поставки</dt><dd>Проверьте состав выбранной поставки</dd></div><div><dt>Цена, наличие и сервис</dt><dd>Получите условия для конкретного аппарата</dd></div></dl><p class="bodyhealth-source-note">Основные источники: <a href="${official}" target="_blank" rel="noopener">System 5/95</a> и <a href="${detailed}" target="_blank" rel="noopener">NovuMedical</a>. Открытая инструкция и подтверждённая комплектация местной поставки пока не получены.</p></div></section>
  <div class="container bodyhealth-final-action">${button(price, 'Узнать стоимость BodyHealth')}<a class="text-link" href="${p}equipment/">Вернуться в каталог${icon('arrow')}</a></div>`;
}
