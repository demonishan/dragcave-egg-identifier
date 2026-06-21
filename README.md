# Dragcave Chrome Extension Starter

This folder contains a minimal Chrome Extension (Manifest V3).
The extension is scoped to https://dragcave.net/ only.

## Files

- `manifest.json`: Extension metadata and entry points.
- `popup.html`: Popup UI markup.
- `popup.css`: Popup styles.
- `logic.js`: Shared script for popup behavior and Dragcave page logic.
- `favicon.png`: Used as the extension icon.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder (`c:\\Reactor\\dragcave`).

You should now see the extension in your toolbar. Click it to open the popup.

## Scope

- The extension requests access only to `https://dragcave.net/*`.
- The popup disables actions if the active tab is outside Dragcave.
