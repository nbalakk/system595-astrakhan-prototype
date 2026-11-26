import { readFile } from 'node:fs/promises';

export const healthArticles = JSON.parse(await readFile(new URL('./articles.json', import.meta.url), 'utf8'));
export const centreStories = JSON.parse(await readFile(new URL('./centre-stories.json', import.meta.url), 'utf8'));

const city = 'Астрахань';
const streetAddress = 'ул. Савушкина, 46А, ТЦ «Факел»';
const address = city + ', ' + streetAddress;

export const centre = {
  name: 'Центр здоровья и долголетия',
  city,
  streetAddress,
  contact: 'Светлана Михайловна Бабак',
  phone: '+7 909 373-80-94',
  phoneHref: 'tel:+79093738094',
  secondaryPhone: '+7 917 086-73-29',
  secondaryPhoneHref: 'tel:+79170867329',
  address,
  mapUrl: 'https://yandex.ru/maps/?text=' + encodeURIComponent(address),
  instagram: 'https://www.instagram.com/novumedical_astrakhan/',
  instagramLabel: '@novumedical_astrakhan',
  okUrl: 'https://ok.ru/profile/583466162659',
  scheduleNote: 'Время встречи согласуйте по телефону.',
  healthNote: 'Перед использованием аппарата прочитайте инструкцию к конкретной модели. Если у вас есть вопросы о здоровье или ограничениях, обсудите их с лечащим врачом.'
};

export const association = {
  name: 'Международная ассоциация NovuMedical',
  description: 'NovuMedical объединяет исследователей, врачей и разработчиков из Японии и Южной Кореи. По сведениям Ассоциации, её массажно-тепловые аппараты выпускаются под марками NovuMedical и System 5/95.',
  url: 'https://novumedical.org/o-nas/'
};

export const centreVideos = {
  lesson: {
    title: 'Занятие в астраханском центре',
    url: 'https://ok.ru/video/4414548478691',
    id: '4414548478691',
    date: '2023-03-07',
    published: '7 марта 2023',
    duration: '1 мин 39 с',
    description: 'Ведущая помогает участнице надеть массажную накидку и показывает, где находятся кнопки.',
    poster: 'astrakhan-lesson-poster.jpg',
    alt: 'Ведущая показывает кнопки на массажной накидке, надетой на плечи участницы',
    width: 1280,
    height: 720
  },
  feedback: {
    title: 'Отзыв посетительницы',
    url: 'https://ok.ru/video/4274475829987',
    id: '4274475829987',
    date: '2023-01-27',
    published: '27 января 2023',
    duration: '1 мин 36 с',
    description: 'Посетительница делится впечатлениями перед камерой. На странице центра эта запись опубликована под названием «Отзыв о нас».',
    poster: 'feedback.jpg',
    alt: 'Посетительница смотрит в камеру во время записи отзыва',
    width: 199,
    height: 294
  }
};

export const products = [
  {
    slug: 'eyesystem', name: 'EyeSystem', category: 'eyes', area: 'Для области глаз',
    image: 'eyesystem.png', lifestyle: 'hero-source.jpg',
    description: 'Маска закрывает глаза. Ею управляют с небольшого пульта, который можно держать в руке.',
    question: 'Как располагается маска и как остановить работу с помощью пульта?'
  },
  {
    slug: 'spinesystem', name: 'SpineSystem', category: 'body', area: 'Для спины',
    image: 'spinesystem.png',
    description: 'Мягкая накидка ложится на плечи. На одной из её длинных ручек находятся кнопки.',
    question: 'Как расположить накидку, чтобы кнопки оставались под рукой?'
  },
  {
    slug: 'sleepsystem', name: 'SleepSystem', category: 'body', area: 'Для тела',
    image: 'sleepsystem.png', lifestyle: 'sleep-use.jpg',
    description: 'Гибкий мат можно накинуть на плечи. Настройки меняют на небольшом проводном пульте.',
    question: 'Как прочитать обозначения на пульте и где находится выключатель?'
  },
  {
    slug: 'footsystem', name: 'FootSystem', category: 'feet', area: 'Для стоп',
    image: 'footsystem.png', lifestyle: 'foot-use.jpg',
    description: 'Аппарат ставят на пол перед стулом. Внутри достаточно места для обеих стоп.',
    question: 'Как устроено место для ног и где находится управление?'
  },
  {
    slug: 'moxi', name: 'Moxi', category: 'body', area: 'Для отдельного участка тела',
    image: 'moxi.png',
    description: 'Ручной аппарат с длинной тонкой ручкой. На её конце — гладкий круглый наконечник.',
    question: 'Для чего предназначена рабочая часть и какие ограничения есть в инструкции?'
  },
  {
    slug: 'bodyhealth', name: 'BodyHealth', category: 'feet body', area: 'Для стоп и тела',
    image: 'bodyhealth.jpg', lifestyle: 'bodyhealth-use.jpg',
    description: 'Аппарат с прогревом и вибромассажем. Внутри есть площадка для обеих стоп, а кнопки находятся на краю корпуса.',
    source: 'https://novumedical.org/products/bodyhealth/'
  }
];

export const faqs = [
  ['Как договориться о первом визите?', 'Позвоните Светлане Бабак и скажите, что хотите познакомиться с центром. Выберите удобное время и уточните, сколько продлится встреча.'],
  ['Можно ли прийти с близким человеком?', 'Скажите Светлане, что хотите прийти вместе. Если вам важен вход без ступеней, лифт или возможность отдохнуть по дороге, спросите об этом до поездки.'],
  ['Как узнать об ограничениях у аппарата?', 'Назовите модель и попросите показать её инструкцию. Найдите раздел об ограничениях. Вопрос о том, подходит ли аппарат при вашем состоянии здоровья, обсудите с лечащим врачом.'],
  ['Что взять с собой?', 'Запишите вопросы, которые хотите задать. Во время звонка уточните, понадобятся ли какие-либо документы или сменная обувь.']
];
