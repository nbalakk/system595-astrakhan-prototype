import { breadcrumbs, pageHead, button, icon } from './components.mjs';

const samples = [
  {
    context: 'О первом разговоре',
    quote: 'Я пришла с несколькими вопросами и переживала, что не всё запомню. Со мной поговорили без спешки, объяснили, с чего начинается знакомство с центром, и дали время переспросить. Для меня это было важно.'
  },
  {
    context: 'О знакомстве с управлением',
    quote: 'Сначала кнопки на аппарате показались сложными. Мне показали, где включение, как остановить работу и где посмотреть инструкцию. Потом я сама повторила эти действия и уточнила то, что осталось непонятным. Теперь представляю, какие вопросы задать перед выбором.'
  },
  {
    context: 'Об обстановке',
    quote: 'Понравилось, что можно спокойно сесть, осмотреться и поговорить, не торопясь принимать решение.'
  },
  {
    context: 'О выборе аппарата для дома',
    quote: 'Я присматривала аппарат для дома. На встрече записала название модели, размеры и вопросы о гарантии. Покупку сразу не оформляла: хотела спокойно обсудить всё с семьёй.'
  }
];

const quoteMarkup = (sample, extraClass = '') => `<figure class="reviews-quote ${extraClass}"><blockquote><p>«${sample.quote}»</p></blockquote><figcaption>${sample.context}</figcaption></figure>`;

export function reviewsPreview(p) {
  return `<section class="container reviews-samples reviews-preview" aria-labelledby="reviews-preview-title">
<header class="reviews-preview-head"><div><h2 id="reviews-preview-title">О посещении — своими словами</h2><p class="reviews-samples-note">Примеры отзывов для оценки оформления</p></div><a class="text-link" href="${p}reviews/">Все отзывы${icon('arrow')}</a></header>
<div class="reviews-preview-layout">${quoteMarkup(samples[0], 'reviews-quote-featured')}<div class="reviews-preview-short">${quoteMarkup(samples[2])}${quoteMarkup(samples[3])}</div></div>
</section>`;
}

export function reviewsPage(p) {
  return `${breadcrumbs(p, 'Отзывы')}${pageHead('Отзывы о посещении', 'Примеры отзывов для оценки оформления', 'reviews-page-head')}
<section class="container reviews-samples reviews-page-collection" aria-label="Примеры отзывов о посещении">
${quoteMarkup(samples[0], 'reviews-quote-featured')}
<div class="reviews-page-details">${samples.slice(1).map(sample => quoteMarkup(sample)).join('')}</div>
</section>
<section class="container reviews-next"><div><h2>Приходите со своими вопросами</h2><p>Ознакомьтесь с форматом посещений и запишите, что хотите уточнить о центре и аппаратах.</p></div><div class="reviews-next-actions">${button(`${p}rehabilitation/`, 'Как проходят посещения')}<a href="${p}articles/first-visit/">Подготовиться к первому визиту</a></div></section>`;
}
