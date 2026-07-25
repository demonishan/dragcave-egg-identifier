const popupMessageEl = document.getElementById('message');
const popupEventSelectorEl = document.getElementById('eventSelector');
const EVENT_STORAGE_KEY = 'isHalloweenOrEaster';
if (popupMessageEl && popupEventSelectorEl && chrome?.tabs && chrome?.storage?.local) {
  const setOutsideDomainState = () => {
    popupMessageEl.textContent = 'Open DragCave.net to use this extension.';
    popupEventSelectorEl.disabled = true;
  };
  const setInsideDomainState = () => {
    popupMessageEl.textContent = '';
    popupEventSelectorEl.disabled = false;
  };
  chrome.storage.local.get([EVENT_STORAGE_KEY], data => {
    popupEventSelectorEl.value = data[EVENT_STORAGE_KEY] || 'none';
  });
  popupEventSelectorEl.addEventListener('change', () => {
    chrome.storage.local.set({ [EVENT_STORAGE_KEY]: popupEventSelectorEl.value });
    popupMessageEl.textContent = 'Saved. Reload to apply.';
  });
  const DISPLAY_KEYS = ['displayRelease', 'displayElement', 'displayHabitat', 'displayMorphology', 'displayPrice', 'displayURL'];
  chrome.storage.local.get(DISPLAY_KEYS, stored => {
    for (const key of DISPLAY_KEYS) {
      const el = document.getElementById(key);
      if (el) el.checked = stored[key] !== false;
    }
  });
  for (const key of DISPLAY_KEYS) {
    const el = document.getElementById(key);
    if (el)
      el.addEventListener('change', () => {
        chrome.storage.local.set({ [key]: el.checked });
        popupMessageEl.textContent = 'Saved. Reload to apply.';
      });
  }
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url || !activeTab.url.startsWith('https://dragcave.net/')) {
      setOutsideDomainState();
      return;
    }
    setInsideDomainState();
  });
}
if (window.location.hostname === 'dragcave.net') {
  const injectPageStyles = () => {
    if (document.getElementById('dragcave-inject-css')) return;
    const cacheBust = chrome.runtime.getManifest().version;
    const style = document.createElement('style');
    style.id = 'dragcave-inject-vars';
    style.textContent = `:root { --dragcave-sprite: url('${chrome.runtime.getURL('sprite.png')}?v=${cacheBust}'); }`;
    document.body.appendChild(style);
    const link = document.createElement('link');
    link.id = 'dragcave-inject-css';
    link.rel = 'stylesheet';
    link.href = `${chrome.runtime.getURL('inject.css')}?v=${cacheBust}`;
    document.body.appendChild(link);
  };
  if (document.body) injectPageStyles();
  else window.addEventListener('DOMContentLoaded', injectPageStyles, { once: true });
  // VARS
  const _CONSTS = {
    reloadTime: 100,
    enableLocationSwitcher: 0,
    locationURLBase: `https://dragcave.net/locations/`,
    locationList: [`5-alpine`, `1-coast`, `2-desert`, `3-forest`, `4-jungle`, `6-volcano`],
  };
  const loadDragData = async () => {
    const response = await fetch(`${chrome.runtime.getURL(`egg_identification.json`)}?v=${chrome.runtime.getManifest().version}`);
    const json = await response.json();
    const lookup = {};
    for (const [desc, entries] of Object.entries(json)) lookup[desc] = Array.isArray(entries) ? entries : [entries];
    return lookup;
  };
  // EVENT EGG CLICKER
  const runEventClicker = isHalloweenOrEaster => {
    if (isHalloweenOrEaster === 'none') return;
    setTimeout(() => {
      document.querySelectorAll(`a`).forEach(a => {
        const href = a.getAttribute(`href`) || ``;
        if (href.split(`/`)[1] === isHalloweenOrEaster) a.click();
      });
    }, 500);
  };
  if (chrome?.storage?.local) {
    chrome.storage.local.get([EVENT_STORAGE_KEY], data => {
      runEventClicker(data[EVENT_STORAGE_KEY] || 'none');
    });
  }
  // REDIRECT AND LOCATION SWITCHER
  const currentLocationIndex = _CONSTS.locationList.indexOf(window.location.href.replace(_CONSTS.locationURLBase, ''));
  if (_CONSTS.enableLocationSwitcher && currentLocationIndex >= 0 && currentLocationIndex <= 5) {
    const nextLocation = _CONSTS.locationList[(currentLocationIndex + 1) % _CONSTS.locationList.length];
    const timerElement = document.createElement(`div`);
    timerElement.id = `cd-timer`;
    document.body.appendChild(timerElement);
    let counter = _CONSTS.reloadTime * 1000;
    const timer = setInterval(() => {
      counter -= 100;
      timerElement.textContent = (counter / 1000).toFixed(1);
      if (counter <= 0) {
        clearInterval(timer);
        window.location.href = _CONSTS.locationURLBase + nextLocation;
      }
    }, 100);
  }
  // EGG IMAGE REPLACE
  const applyEggReplacements = async () => {
    const PREF_KEYS = ['displayRelease', 'displayElement', 'displayHabitat', 'displayMorphology', 'displayPrice', 'displayURL'];
    const [dragLookup, prefs] = await Promise.all([
      loadDragData(),
      new Promise(resolve =>
        chrome.storage.local.get(PREF_KEYS, data =>
          resolve({
            release: data.displayRelease !== false,
            element: data.displayElement !== false,
            habitat: data.displayHabitat !== false,
            morphology: data.displayMorphology !== false,
            price: data.displayPrice !== false,
            url: data.displayURL !== false,
          })
        )
      ),
    ]);
    document.querySelectorAll(`.eggs > div > span`).forEach(eggDescription => {
      const target = eggDescription.parentNode.querySelector(`a`);
      if (!target) return;
      const dragText = eggDescription.innerHTML.trim();
      const dragons = dragLookup[dragText] || [];
      const href = target.getAttribute(`href`) || ``;
      const linkID = href.split(`/`).filter(Boolean).at(-1) || `Error`;
      const list = dragons.length ? dragons : [{ name: `Dragon Not Found`, col: 1, row: 1 }];
      target.classList.add(`sprite`);
      const cards = list
        .map(d => {
          return `
          <div class="egg-img" style="background-position: ${(d.col - 1) * -50}px ${(d.row - 1) * -50}px;"></div>
          <div class="egg-name">${d.name}</div>
          <table class="egg-meta">
            ${prefs.release !== false && d.release ? `<tr><td>Release date</td><td>${d.release}</td></tr>` : ``}
            ${prefs.element !== false && d.element?.length ? `<tr><td>Elemental affinity</td><td>${Array.isArray(d.element) ? d.element.join(`, `) : d.element}</td></tr>` : ``}
            ${prefs.habitat !== false && d.habitat?.length ? `<tr><td>Habitat(s)</td><td>${Array.isArray(d.habitat) ? d.habitat.join(`, `) : d.habitat}</td></tr>` : ``}
            ${prefs.morphology !== false && d.morphology ? `<tr><td>Morphology</td><td>${d.morphology}</td></tr>` : ``}
            ${prefs.price !== false && d.price ? `<tr><td>Market price</td><td>${d.price}</td></tr>` : ``}
            <tr><td>Extension ID</td><td>c${d.col}r${d.row}</td></tr>
            ${prefs.url !== false && linkID ? `<tr><td>URL</td><td>${linkID}</td></tr>` : ``}
          </table>
        `;
        })
        .join(``);
      target.innerHTML = `
      ${cards}
      <div class="egg-desc">${dragText}</div>
    `;
    });
  };
  applyEggReplacements();
  // DRAGON RENAME HELP
  const pasteInput = document.querySelector(`input[name="type"]`);
  if (pasteInput) {
    pasteInput.addEventListener(`click`, () =>
      navigator.clipboard.readText().then(cliptext => {
        pasteInput.value = cliptext;
        const renameForm = document.querySelector(`form[method="name"]`);
        if (renameForm) setTimeout(() => renameForm.submit(), 50);
      }, alert)
    );
  }
  // ADD DAYCARE LINK TO THE MAIN MENU
  const mainMenu = document.querySelector(`._p_9`);
  if (mainMenu) {
    mainMenu.innerHTML += `<a href="https://www.allureofnds.net/daycare" target="_blank">Daycare</a>`;
  }
}
