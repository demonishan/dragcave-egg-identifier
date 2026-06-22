# Dragcave Egg Identifier

A lightweight Chrome extension designed to help players identify Dragcave eggs using an offline, local dragon database.

> [!IMPORTANT]
> This extension is designed to function exclusively on `dragcave.net`.

## How It Works

- Local Database: The extension stores dragon egg data directly in a local JavaScript constant for fast, offline lookups.
- DOM Parsing: When you visit location pages on Dragcave, the extension automatically reads the egg description text displayed under each egg.
- Matching Algorithm: It compares the on-screen description against its local database to find and display the best matched egg sprite.

## Accuracy and Limitations

- Not 100% Accurate: Egg identification is based entirely on text matching and is subject to database limitations.
- Shared Descriptions: Some distinct dragon species share identical egg descriptions.
- Overlaps: In cases where descriptions overlap, the extension will only display one mapped result, which may occasionally be incorrect.

> [!WARNING]
> ## Important Disclaimer
> Use this extension at your own risk.
> 
> I take no responsibility for any infractions, warnings, penalties, or other administrative consequences you may face on Dragcave from using this tool. This extension was created primarily for personal use.

## Installation (Load in Chrome)

To run this extension locally in developer mode, follow these steps:

1. Download the Repository: Clone or download this repository to your local machine and extract the files.
2. Open Extensions Page: Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable Developer Mode: Toggle the Developer mode switch in the top-right corner of the page.
4. Load Unpacked Extension:
5. Click the Load unpacked button in the top-left corner of the page.
6. Select the root folder of this project, the folder containing `manifest.json`.

## Contributing

Contributions are not accepted for this project at this time.

Please refer to `CONTRIBUTING.md` for more details.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.