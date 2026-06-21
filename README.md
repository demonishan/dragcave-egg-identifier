# Dragcave Egg Identifier

This Chrome extension helps identify Dragcave eggs from a local dragon database.

It is designed to work only on https://dragcave.net/.

## How It Works

- The extension stores dragon data in a JavaScript constant.
- On location pages, it reads the egg description text shown under each egg.
- It matches that description against the database and shows the best mapped result.

## Accuracy and Limitations

- Identification is not 100% accurate.
- Some different eggs can share the same description text.
- When descriptions overlap, the extension can only return one mapped result and may be wrong.

## Important Disclaimer

Use this extension at your own risk.

I do not take any responsibility for any infraction, warning, penalty, or other consequences you may face from using this tool.

This extension was created mostly for my personal use.

## Load in Chrome

1. Open chrome://extensions.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this folder: c:\Reactor\dragcave

## License

This project is licensed under the MIT License.
See LICENSE for details.

## Contributing

Contributions are not accepted for this project.
See CONTRIBUTING.md for details.
