(() => {
  'use strict';

  const key = 'centre595.display';
  const sizes = ['large', 'larger', 'largest'];
  const fontSizes = { large: '22px', larger: '26px', largest: '30px' };
  const themes = ['light', 'dark'];
  const defaults = { enabled: false, size: 'large', theme: 'light' };

  function normalise(value) {
    const candidate = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return {
      enabled: candidate.enabled === true,
      size: sizes.includes(candidate.size) ? candidate.size : defaults.size,
      theme: themes.includes(candidate.theme) ? candidate.theme : defaults.theme
    };
  }

  function persist(value) {
    try { localStorage.setItem(key, JSON.stringify(normalise(value))); } catch { /* Display controls remain usable when storage is unavailable. */ }
  }

  function restore() {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return { ...defaults };
      const clean = normalise(JSON.parse(raw));
      // Rewriting this owned key removes unknown properties from older or modified settings.
      persist(clean);
      return clean;
    } catch { return { ...defaults }; }
  }

  let preferences = restore();

  function apply() {
    const data = document.documentElement.dataset;
    if (preferences.enabled) {
      data.display = 'accessible';
      data.textSize = preferences.size;
      data.contrast = preferences.theme;
      document.documentElement.style.setProperty('--reading-font-size', fontSizes[preferences.size]);
    } else {
      delete data.display;
      delete data.textSize;
      delete data.contrast;
      document.documentElement.style.removeProperty('--reading-font-size');
    }
    if (document.body) {
      document.body.classList.toggle('reading-mode', preferences.enabled);
      document.body.classList.toggle('reading-dark', preferences.enabled && preferences.theme === 'dark');
    }
  }

  // The head script applies a saved preference before the page content is painted.
  apply();

  function initialise() {
    const toggles = [...document.querySelectorAll('[data-display-toggle]')];
    const panel = document.querySelector('#display-settings');
    const sizeButtons = [...document.querySelectorAll('[data-display-size]')];
    const themeButtons = [...document.querySelectorAll('[data-display-theme]')];
    let open = false;

    function synchronise() {
      for (const button of toggles) {
        button.hidden = false;
        button.disabled = false;
        button.setAttribute('aria-expanded', String(open));
      }
      if (panel) panel.hidden = !open;
      for (const button of sizeButtons) button.setAttribute('aria-pressed', String(button.dataset.displaySize === preferences.size));
      for (const button of themeButtons) button.setAttribute('aria-pressed', String(button.dataset.displayTheme === preferences.theme));
    }

    function change(next) {
      preferences = normalise(next);
      apply();
      synchronise();
      persist(preferences);
    }

    for (const button of toggles) {
      button.addEventListener('click', () => {
        open = !open;
        if (open && !preferences.enabled) change({ ...preferences, enabled: true });
        else synchronise();
        if (open) panel?.focus();
      });
    }
    panel?.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !open) return;
      open = false;
      synchronise();
      toggles[0]?.focus();
    });
    for (const button of sizeButtons) {
      button.addEventListener('click', () => change({ ...preferences, enabled: true, size: button.dataset.displaySize }));
    }
    for (const button of themeButtons) {
      button.addEventListener('click', () => change({ ...preferences, enabled: true, theme: button.dataset.displayTheme }));
    }
    for (const button of document.querySelectorAll('[data-display-close]')) {
      button.addEventListener('click', () => {
        open = false;
        change({ ...preferences, enabled: false });
        toggles[0]?.focus();
      });
    }
    function openLinkedSettings() {
      if (!['#display-title', '#display-settings'].includes(document.location?.hash)) return;
      open = true;
      synchronise();
      panel?.focus();
    }
    document.defaultView?.addEventListener('hashchange', openLinkedSettings);
    apply();
    synchronise();
    openLinkedSettings();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
