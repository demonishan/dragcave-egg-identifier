const loadTallyData = async () => {
  try {
    const cacheBust = chrome.runtime.getManifest().version;
    const response = await fetch(`${chrome.runtime.getURL('dragon_tally.json')}?v=${cacheBust}`);
    const json = await response.json();
    return json || {};
  } catch (err) {
    console.error('Failed to load dragcave images data', err);
    return {};
  }
};
const runTally = async () => {
  const imagesDb = await loadTallyData();
  const pageTally = {};
  const dragons = document.querySelectorAll('table#dragonlist tr td:first-child a');
  dragons.forEach(a => {
    const img = a.querySelector('img');
    if (!img) return;
    const src = img.getAttribute('src');
    if (!src) return;
    const filename = src.split('/').filter(Boolean).at(-1);
    const breed = imagesDb[filename] || filename;
    const href = a.getAttribute('href');
    const dragonId = href.split('/').filter(Boolean).at(-1);
    if (!pageTally[breed]) {
      pageTally[breed] = [];
    }
    if (!pageTally[breed].includes(dragonId)) {
      pageTally[breed].push(dragonId);
    }
  });
  for (const [b, ids] of Object.entries(pageTally)) {
    console.log(`"${b}": ${ids.join(', ')}`);
  }
  if (Object.keys(pageTally).length > 0) {
    chrome.storage.local.get(['dragonTally'], data => {
      const existingTally = data.dragonTally || {};
      for (const breed in pageTally) {
        if (!existingTally[breed]) existingTally[breed] = [];
        for (const id of pageTally[breed]) {
          if (!existingTally[breed].includes(id)) {
            existingTally[breed].push(id);
          }
        }
      }
      chrome.storage.local.set({ dragonTally: existingTally });
    });
  }
};
if (window.location.hostname === 'dragcave.net' && window.location.pathname.startsWith('/dragons')) {
  runTally();
}
