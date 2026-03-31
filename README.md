# yumusic

yumusic is a desktop music player built for people who self-host their own music library. it connects to a navidrome/gonic/subsonic/gonic/subsonic  server and gives you a clean, dark interface to listen to your songs, albums, artists, and playlists without needing to open a browser.

beyond just playing music from a server, yumusic also supports local podcast feeds via rss and lets you add custom internet radio stations. everything runs as a native desktop app, so it feels fast and stays out of your way.

---

## what it does

- connects to any navidrome/gonic/subsonic-compatible server using the subsonic api
- browse and play songs, albums, artists, and playlists
- search across your entire library
- mark songs as favorites
- listen to podcasts by pasting an rss feed url directly into the app
- add and manage internet radio stations, including ones not listed on any directory
- persists your added podcasts and radio stations locally, so they survive restarts
- custom window title bar with minimize, maximize, and close controls
- themed confirmation dialogs instead of browser popups
- supports multiple languages, including english and portuguese

---

## supported platforms

yumusic is built with tauri and ships native binaries for the following platforms:

- windows (x86_64) - installer .exe and .msi
- macos (apple silicon, m1 and later) - .dmg
- macos (intel) - .dmg
- linux (x86_64) - .deb and .appimage

---

## installing from a release

1. go to the [releases page](https://github.com/isyuricunha/yumusic-windows/releases)
2. pick the latest release
3. download the file that matchs your operating system:
   - windows: grab the `.exe` (nsis installer) or the `.msi` file
   - macos: grab the `.dmg` file for your chip (arm64 or x86_64)
   - linux: grab the `.deb` if you are on debian/ubuntu, or the `.AppImage` if you prefer something portable
4. run the installer or mount the image and drag the app to your applications folder

on windows you may see a smartscreen warning since the app is not signed with a paid certificate. click "more info" and then "run anyway" to proceed.

---

## building from source

if you want to build yumusic yourself, here is what you need installed first:

- [node.js](https://nodejs.org) (v20 or later)
- [pnpm](https://pnpm.io) (used as the package manager)
- [rust](https://www.rust-lang.org/tools/install) (stable toolchain)
- on linux, a few system libraries are required - the build will tell you if something is missing

clone the repository:

```
git clone https://github.com/isyuricunha/yumusic-windows.git
cd yumusic-windows
```

install dependencies:

```
pnpm install
```

start the app in development mode:

```
pnpm tauri dev
```

to build a production installer for your current platform:

```
pnpm tauri build
```

the output files will be inside `src-tauri/target/release/bundle/`.

---

## setting it up

when you first open yumusic, it will ask for your navidrome/gonic/subsonic server url, username, and password. once you log in, your library loads automatically.

to add a podcast, go to the podcasts section and paste any valid rss feed url. to add a radio station, go to the radio section and click the add button.

---

## license

AGPL-3.0

<img width="1858" height="1080" alt="image" src="https://github.com/user-attachments/assets/daeea203-2bbf-4088-ba5c-2a8dbdeffabf" />
<img width="1858" height="1080" alt="image" src="https://github.com/user-attachments/assets/2dd56243-4c67-413f-b354-b3f7ead263b0" />
<img width="1858" height="1080" alt="image" src="https://github.com/user-attachments/assets/90783b7e-f290-4f10-b047-2a6e9a4277d0" />
<img width="1858" height="1080" alt="image" src="https://github.com/user-attachments/assets/02b6c041-8030-4912-8f5a-49adcda05227" />
<img width="1858" height="1080" alt="image" src="https://github.com/user-attachments/assets/292fdf94-bf55-4206-b9d8-02709c84861e" />
<img width="1858" height="1080" alt="image" src="https://github.com/user-attachments/assets/aea3b3c7-1cf4-4e61-adfe-9a59f7a3063f" />
<img width="1858" height="1080" alt="image" src="https://github.com/user-attachments/assets/5b5f051f-0f3e-41bb-8f85-bdc22cd31f27" />
<img width="1858" height="1080" alt="image" src="https://github.com/user-attachments/assets/a40771a7-85cf-4510-b8c8-546ee579c3fd" />
