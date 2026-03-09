*Read this in other languages: [🇮🇩 Bahasa Indonesia](README.id.md)*
# 🗑️ Clean Browser History (Ghost Mode)
> [!NOTE]
> Current Version: 2.0.09032026

> "Ghost mode for your doomscrolling sessions. Keeps your history clean."

A lightweight, fast, and robust browser extension to keep your browsing history clean during your doomscrolling sessions. Built entirely using HTML, CSS, and Vanilla JavaScript (Manifest V3) without any external libraries.

## ✨ Key Features (Version 2.0)

This extension has been completely rebuilt with a new architecture inspired by [Dark Reader](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh)'s site list management:

* **Dual Operation Mode (Blacklist & Whitelist):**
  * **Erase Listed Only (Blacklist):** Only deletes the history of explicitly listed sites.
  * **Never Erase Listed (Whitelist):** Deletes ALL history by default, EXCEPT for the sites in your safe list.
* **Instant Toggle Popup:** Turn "Ghost Mode" on or off for the currently active tab with just a single click.
* **Global Keyboard Shortcut:** Press `Alt+G` (default) to toggle the cleaning mode without moving your mouse or opening the popup.
* **Real-time Theme Sync:** Full support for Dark and Light modes. Toggling the theme in the popup will instantly sync and change the theme on the options page in real-time!
* **Interactive Native Dashboard:** A modern, sidebar-style Options page to effortlessly manage your site lists. Supports pressing `Enter` to add sites and includes duplicate entry prevention (featuring a shake error animation).

## 📸 Screenshots

| Popup Interface | Options Dashboard |
| :---: | :---: |
| ![Popup UI](assets/v2.0/v2.0popup.png) | ![Options UI](assets/v2.0/v2.0optionpage.png) |

## 🚀 Installation (Developer Mode)

Since this extension is not yet available on the Chrome Web Store, you can install the bundled version manually:
### For New Usage
1. **Download the Release:** Go to the [Releases](../../releases) page of this repository and download the latest `.zip` file (e.g., `CleanBrowserHistoryExtv2.0.zip`).
2. **Extract:** Extract the downloaded ZIP file into a new folder on your computer.
3. Open a Chromium-based browser (Google Chrome, Brave, Edge, etc.).
4. Navigate to `chrome://extensions/` in your address bar.
5. Enable the **Developer mode** toggle in the top right corner.
6. Click the **Load unpacked** button in the top left.
7. Select the folder where you extracted the extension files.
8. Done! Pin the 🗑️ icon to your browser's toolbar for easy access.
### For Update
1. **Download the Release:** Go to the [Releases](../../releases) page of this repository and download the latest `.zip` file (e.g., `CleanBrowserHistoryExtv2.0.zip`).
2. **Extract:** Extract the downloaded ZIP file into a the previous version folder on your computer.
3. **Ensure your ZIP extractor replaces the existing files** to prevent multi-version crashes when loaded on the browser.
4. Open a Chromium-based browser (Google Chrome, Brave, Edge, etc.).
5. Navigate to `chrome://extensions/` in your address bar.
6. Find **Clean Browser History** extension. Reload it. Ensure the version is updated to latest (e.g. `v2.0`).
7. If you are opening the option page, reload it to check the update.

## 📖 Quick User Guide: How the Toggle Works

The toggle switch in the popup is designed to be incredibly simple and intuitive. You don't need to worry about the underlying lists; just look at the toggle status for the current site:

* **🟢 Toggle ON:** Ghost Mode is **ACTIVE**. The browsing history for this specific site **will be deleted** immediately after you visit it.
* **🔴 Toggle OFF:** Ghost Mode is **INACTIVE**. The browsing history for this site **will be saved** normally by your browser.

> **💡 Pro Tip:** Behind the scenes, clicking this toggle automatically manages your site lists. If you turn it ON, the extension will instantly add/remove the site from your Blacklist or Whitelist in the Options page to ensure its history gets cleaned!

## ⚙️ Why these Permissions?

This extension is built with privacy in mind. The permissions declared in `manifest.json` are strictly used for core functionalities:
* `"history"`: Used **only** to delete specific URLs immediately after you visit them. This extension DOES NOT read, collect, or send your history data to any remote server.
* `"storage"`: Used to save your list preferences (Blacklist/Whitelist) and theme state (Dark/Light) locally in your browser.
* `"tabs"`: Used to read the URL of the active tab to determine whether the current site should be monitored, and to detect the `Alt+G` hotkey press.

## 👨‍💻 Author
Developed by **Zeyn The Dev**.

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.