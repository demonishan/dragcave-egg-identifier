const popupMessageEl = document.getElementById('message');
const popupEventSelectorEl = document.getElementById('eventSelector');
const EVENT_STORAGE_KEY = 'isHalloweenOrEaster';
if (popupMessageEl && popupEventSelectorEl && chrome?.tabs && chrome?.storage?.local) {
  const setOutsideDomainState = () => {
    popupMessageEl.textContent = 'Open https://dragcave.net/ to use this extension.';
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
    popupMessageEl.textContent = 'Saved. Reload Dragcave tab to apply now.';
  });
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
    const response = await fetch(`${chrome.runtime.getURL(`data.json`)}?v=${chrome.runtime.getManifest().version}`);
    const json = await response.json();
    const lookup = {};
    for (const [desc, entries] of Object.entries(json)) {
      lookup[desc] = Array.isArray(entries) ? entries : [entries];
    }
    return lookup;
  };
  const renderEggCard = (target, dragText, dragons, dragonID) => {
    const list = dragons.length ? dragons : [{ name: `Dragon Not Found`, col: 1, row: 1 }];
    const primary = list[0];
    const cards = list
      .map(d => {
        const val = v => (Array.isArray(v) ? v.join(`, `) : v);
        const meta = [
          d.release && `<tr><td>Release date</td><td>${d.release}</td></tr>`,
          d.element?.length && `<tr><td>Elemental affinity</td><td>${val(d.element)}</td></tr>`,
          d.habitat?.length && `<tr><td>Habitat(s)</td><td>${val(d.habitat)}</td></tr>`,
          d.morphology && `<tr><td>Morphology</td><td>${d.morphology}</td></tr>`,
          d.price && `<tr><td>Market price</td><td>${d.price}</td></tr>`
        ].filter(Boolean);
        const col = d.col ?? primary.col;
        const row = d.row ?? primary.row;
        return `
          <div class="egg-img" style="background-position: ${(col - 1) * -50}px ${(row - 1) * -50}px;"></div>
          <div class="egg-name">${d.name}</div>
          ${meta.length ? `<table class="egg-meta">${meta.join(``)}</table>
          <div class="egg-id">Extension ID: c${primary.col}r${primary.row}</div>
        ` : ``}
        `;
      })
      .join(``);
    target.innerHTML = `
      ${cards}
      <div class="egg-desc">${dragText}</div>
      <div class="cave-id">DragCave ID: ${dragonID}</div>
    `;
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
    const dragLookup = await loadDragData();
    document.querySelectorAll(`.eggs > div > span`).forEach(eggDescription => {
      const target = eggDescription.parentNode.querySelector(`a`);
      if (!target) return;
      target.classList.add(`sprite`);
      const dragText = eggDescription.innerHTML.trim();
      const dragons = dragLookup[dragText] || [];
      const dragonID = target.getAttribute(`href`).split(`/`)[4];
      renderEggCard(target, dragText, dragons, dragonID);
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
// ICE LAST