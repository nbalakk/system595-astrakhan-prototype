(() => {
  'use strict';

  const key = 'centre595.display';
  const sizes = ['large', 'larger', 'largest'];
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
    } else {
      delete data.display;
      delete data.textSize;
      delete data.contrast;
    }
  }

  // The head script applies a saved preference before the page content is painted.
  apply();

  function initialise() {
    const toggles = [...document.querySelectorAll('[data-display-toggle]')];
    const panel = document.querySelector('#display-settings');
    const sizeButtons = [...document.querySelectorAll('[data-display-size]')];
    const themeButtons = [...document.querySelectorAll('[data-display-theme]')];

    function synchronise() {
      for (const button of toggles) {
        button.hidden = false;
        button.disabled = false;
        button.setAttribute('aria-pressed', String(preferences.enabled));
        button.setAttribute('aria-expanded', String(preferences.enabled));
        button.setAttribute('aria-controls', 'display-settings');
        const label = button.querySelector('[data-display-label]') || button;
        label.textContent = preferences.enabled ? 'Обычная версия' : 'Версия для слабовидящих';
      }
      if (panel) panel.hidden = !preferences.enabled;
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
        change({ ...preferences, enabled: !preferences.enabled });
        if (preferences.enabled && panel) {
          const options = panel.querySelector('[data-display-options]');
          if (options) options.open = true;
          panel.focus();
        }
      });
    }
    for (const button of sizeButtons) {
      button.addEventListener('click', () => change({ ...preferences, size: button.dataset.displaySize }));
    }
    for (const button of themeButtons) {
      button.addEventListener('click', () => change({ ...preferences, theme: button.dataset.displayTheme }));
    }
    for (const button of document.querySelectorAll('[data-display-close]')) {
      button.addEventListener('click', () => {
        change({ ...preferences, enabled: false });
        toggles[0]?.focus();
      });
    }
    synchronise();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
