const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
if (menu && nav) {
  const compact = window.matchMedia('(max-width: 1000px)');
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

const masthead = document.querySelector('.centre-masthead');
if (masthead) {
  function updateHeaderOffset() {
    const sticky = window.getComputedStyle(masthead).position === 'sticky';
    const offset = sticky ? Math.ceil(masthead.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--header-offset', offset + 'px');
  }
  updateHeaderOffset();
  window.addEventListener('resize', updateHeaderOffset);
  if (window.ResizeObserver) {
    new window.ResizeObserver(updateHeaderOffset).observe(masthead);
  } else {
    masthead.addEventListener('click', () => window.requestAnimationFrame(updateHeaderOffset));
    document.fonts?.ready.then(updateHeaderOffset);
  }

  // Keyboard focus can move to a link the browser considers visible behind a sticky bar.
  document.addEventListener('focusin', event => {
    const target = event.target;
    if (masthead.contains(target) || !target.matches(':focus-visible') || target.matches('.skip-link')) return;
    window.requestAnimationFrame(() => {
      if (target !== document.activeElement || window.getComputedStyle(masthead).position !== 'sticky') return;
      const rect = target.getBoundingClientRect();
      const toolbarBottom = masthead.getBoundingClientRect().bottom;
      if (rect.bottom > 0 && rect.top < toolbarBottom + 4) {
        window.scrollBy({ top: rect.top - toolbarBottom - 12, behavior: 'instant' });
      }
    });
  });
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
  const disclosure = visitFilm.closest('details');
  disclosure?.addEventListener('toggle', () => {
    if (!disclosure.open) visitFilm.pause();
  });
  document.querySelectorAll('[data-video-time]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (disclosure) disclosure.open = true;
      visitFilm.currentTime = Number(button.dataset.videoTime);
      visitFilm.scrollIntoView({ block: 'center' });
      visitFilm.focus({ preventScroll: true });
      visitFilm.play().catch(() => visitFilm.focus({ preventScroll: true }));
    });
  });
}
