const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
if (menu && nav) {
  const compact = window.matchMedia('(max-width: 820px)');
  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.hidden = compact.matches && !open;
  }
  function adaptMenu() {
    const focusWasOnMenu = document.activeElement === menu;
    const focusWasInNav = nav.contains(document.activeElement);
    menu.hidden = !compact.matches;
    setMenu(false);
    if (compact.matches && focusWasInNav) menu.focus();
    if (!compact.matches && focusWasOnMenu) {
      (nav.querySelector('[aria-current]') || nav.querySelector('a'))?.focus();
    }
  }
  menu.addEventListener('click', () => {
    setMenu(menu.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  compact.addEventListener('change', adaptMenu);
  adaptMenu();
}

document.querySelectorAll('.gallery-thumbs[hidden]').forEach(group => {
  group.hidden = false;
});
document.querySelectorAll('[data-gallery-src]').forEach(button => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#product-main-image');
    image.src = button.dataset.gallerySrc;
    image.alt = button.dataset.galleryAlt;
    image.parentElement.classList.toggle('is-lifestyle', button.hasAttribute('data-gallery-lifestyle'));
    document.querySelectorAll('[data-gallery-src]').forEach(item => {
      item.classList.toggle('selected', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
  });
});

const centreVideoIds = new Set(['4414548478691', '4274475829987', '9605424941795', '4247297264355', '7050131409635']);
document.querySelectorAll('[data-ok-player]').forEach(button => {
  const frame = button.closest('[data-video-frame]');
  const videoId = button.dataset.okPlayer;
  if (!frame || !centreVideoIds.has(videoId)) return;

  button.hidden = false;
  button.addEventListener('click', () => {
    const player = document.createElement('iframe');
    player.title = button.getAttribute('aria-label') || 'Видео центра';
    player.src = 'https://ok.ru/videoembed/' + videoId + '?autoplay=1';
    player.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    frame.replaceChildren(player);
    player.focus();
  }, { once: true });
});

const visitFilm = document.querySelector('#visit-film');
if (visitFilm) {
  document.querySelectorAll('[data-video-time]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      visitFilm.currentTime = Number(button.dataset.videoTime);
      visitFilm.scrollIntoView({ block: 'center' });
      visitFilm.focus({ preventScroll: true });
      visitFilm.play().catch(() => visitFilm.focus({ preventScroll: true }));
    });
  });
}
