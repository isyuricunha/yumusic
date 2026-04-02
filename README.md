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

1. go to the [releases page](https://github.com/isyuricunha/yumusic/releases)
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
git clone https://github.com/isyuricunha/yumusic.git
cd yumusic
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

---

<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/38b2c892-3e53-4285-a2e3-6af1e5d75576" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/4db3620f-ea90-4a3c-a2e5-77b4da9aaa11" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/97969baa-ab62-4669-be64-df6e0523b36c" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/735fe727-fc39-4aca-b898-e722382ec330" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/554f3b39-04ef-4867-9f26-524b944c6b7f" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/9829884f-5fb8-4459-a54a-8e3d9c8fa5c5" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/fc4c21a4-609d-4eed-89cb-5d4c6ff5e2fa" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/8ba92779-752a-4b07-85ce-c9183c49a0e3" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/68b70c87-30cd-4da7-bec6-d805624e2548" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/034130f7-a0b8-4753-8793-77ac63dad492" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/ca1cc55e-8c48-4907-9246-1f81e6cd22b3" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/ebb5f147-c23a-4104-b8ec-3711a9fce481" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/a0fa1670-7f1b-4f05-aef7-b4769a185156" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/7a495661-cc3b-4f46-9154-8ab2a1a2ec51" />
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/9bcf7376-883d-40db-856b-9d21873fcff5" />
