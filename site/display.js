(() => {
  'use strict';

  const key = 'centre595.display';
  const version = 2;
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
    try { localStorage.setItem(key, JSON.stringify({ version, ...normalise(value) })); } catch { /* Display controls remain usable when storage is unavailable. */ }
  }

  function restore() {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return { ...defaults };
      const stored = JSON.parse(raw);
      const clean = normalise(stored);
      // The previous control saved this combination merely by opening its panel.
      if (stored?.version === undefined && clean.size === defaults.size && clean.theme === defaults.theme) {
        clean.enabled = false;
      }
      if (stored?.version !== version || Object.keys(stored).length !== 4 ||
          stored.enabled !== clean.enabled || stored.size !== clean.size || stored.theme !== clean.theme) {
        persist(clean);
      }
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
    const returnButtons = [...document.querySelectorAll('[data-display-close]')];
    let open = false;

    function synchronise() {
      for (const button of toggles) {
        button.hidden = false;
        button.disabled = false;
        button.setAttribute('aria-expanded', String(open));
      }
      if (panel) panel.hidden = !open;
      for (const button of returnButtons) button.hidden = !preferences.enabled;
      for (const button of sizeButtons) button.setAttribute('aria-pressed', String(preferences.enabled && button.dataset.displaySize === preferences.size));
      for (const button of themeButtons) button.setAttribute('aria-pressed', String(preferences.enabled && button.dataset.displayTheme === preferences.theme));
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
        synchronise();
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
    for (const button of returnButtons) {
      button.addEventListener('click', () => {
        open = false;
        change({ ...preferences, enabled: false });
        toggles[0]?.focus();
      });
    }
    apply();
    synchronise();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
