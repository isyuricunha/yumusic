## [1.9.0](https://github.com/isyuricunha/yumusic/compare/v1.8.0...v1.9.0) (2026-04-01)

### ✨ Features

* **artist:** implement full discography page and navigation ([93e0e48](https://github.com/isyuricunha/yumusic/commit/93e0e48813bf98366d1e9b887a669ec310007c2e))
* **sidebar:** implement collapsible library and downloads filter ([02bc60c](https://github.com/isyuricunha/yumusic/commit/02bc60c1a11a124afcdcea90e876c03d0228a271))

### 🐛 Bug Fixes

* **automation:** implement automatic downloads and startup update checks ([9d83638](https://github.com/isyuricunha/yumusic/commit/9d836380aa2018b0817e09075849fa18d8546bac))

## [1.8.0](https://github.com/isyuricunha/yumusic/compare/v1.7.0...v1.8.0) (2026-04-01)

### ✨ Features

* **i18n:** add localized tooltips to player controls ([430c886](https://github.com/isyuricunha/yumusic/commit/430c88679b01c45c638de6cb61386a46a47a132a))
* **i18n:** cleanup and translate hardcoded strings in Login, Settings, and Footer ([0ad95aa](https://github.com/isyuricunha/yumusic/commit/0ad95aa65f2a2a98f571c425d24fc87ca8fcba02))
* **i18n:** localize services, layout labels, and logo alt text ([7c9b719](https://github.com/isyuricunha/yumusic/commit/7c9b719cc6b089152c3e597737550b8b0d0a43ec))
* **i18n:** localize specific deletion confirmations and podcast RSS tags ([5e8c9f0](https://github.com/isyuricunha/yumusic/commit/5e8c9f0b06aa0503bb9c6763ede504e1209a1df7))
* **i18n:** translate radio stations, settings dropdowns, and remaining strings ([bdf3510](https://github.com/isyuricunha/yumusic/commit/bdf3510f121ab97351bf09e60dc5fd63ea05c4bb))

## [1.7.0](https://github.com/isyuricunha/yumusic/compare/v1.6.0...v1.7.0) (2026-03-31)

### ✨ Features

* **i18n:** project-wide translation sweep for settings, playlists, radio, podcasts and more ([871a384](https://github.com/isyuricunha/yumusic/commit/871a384ff897f534446d1bde9bf7d17eb9467d5a))

## [1.6.0](https://github.com/isyuricunha/yumusic/compare/v1.5.0...v1.6.0) (2026-03-31)

### ✨ Features

* **album:** finalize Spotify-style redesign with refined metadata and spacing ([5f85b4f](https://github.com/isyuricunha/yumusic/commit/5f85b4f2e624ee2ad60edbb7dbbf97a767e63f6d))
* **album:** implement dynamic dominant color extraction from album art ([6bb9921](https://github.com/isyuricunha/yumusic/commit/6bb9921cc55bd37048ad68d74a97f17a218affdf))
* **album:** redesign AlbumDetail with Spotify-style sticky header and dynamic gradients ([2f1ea79](https://github.com/isyuricunha/yumusic/commit/2f1ea791fc16e5e4c3463aa185370442733f1466))
* **album:** remove mini-cover and make action buttons functional ([0b7cfc3](https://github.com/isyuricunha/yumusic/commit/0b7cfc369d0425ca78bfad6cc82a658523d1e480))
* **album:** simplify menu and improve add to queue logic ([5e657ea](https://github.com/isyuricunha/yumusic/commit/5e657ea548c9bd92918b090f9ecb322ebfc8ac22))
* **artist:** overhaul artist detail page with spotify-style hero banner ([7528ed1](https://github.com/isyuricunha/yumusic/commit/7528ed17655d431aa646f5b6e8cb94b069a26adb))
* **home:** redesign greeting grid and add Spotify-style hover play buttons ([d4e9fc9](https://github.com/isyuricunha/yumusic/commit/d4e9fc94239130b6a89322b96b8cfc6b80b1d7b3))
* **media:** enhance media session and prevent accidental refresh ([24152b8](https://github.com/isyuricunha/yumusic/commit/24152b8e913ce4a9debb7e118353e277f8c97009))
* **player:** implement functional queue drawer ([5119c1f](https://github.com/isyuricunha/yumusic/commit/5119c1fde3ce7a174207e2158b89d4a23f3804c9))
* **playlist:** overhaul playlist detail page with spotify-style hero header ([5848a46](https://github.com/isyuricunha/yumusic/commit/5848a46db5406fa95a19d853fcb088b622e5327d))
* **sidebar:** add vertical-to-horizontal wheel scroll conversion for chips ([4d36940](https://github.com/isyuricunha/yumusic/commit/4d36940fe1d01f4978cb406294eb329a6f51476f))
* **web:** overhaul UI with spotify-like panel layout and redesigned player ([5e093d5](https://github.com/isyuricunha/yumusic/commit/5e093d5d1e2024c34f1be964fa49f7f8ba853e28))

### 🐛 Bug Fixes

* **album:** correct imports and variables in AlbumDetail ([dcf4f9e](https://github.com/isyuricunha/yumusic/commit/dcf4f9e675a650ae29201fc208bfcc43676b3e45))
* **album:** resolve nested button hydration and browser download errors ([89b8558](https://github.com/isyuricunha/yumusic/commit/89b85588f155b07309d1bbc99babe0ab03f0e0e3))
* **artist:** properly localize all strings in artist detail page ([31e9b3d](https://github.com/isyuricunha/yumusic/commit/31e9b3d9c0ccc3b645787865cb382a07875e8dd9))
* **artist:** remove randomized counts and unused translation keys ([9f16ee5](https://github.com/isyuricunha/yumusic/commit/9f16ee5db2f21cc327dafcb3d9d6d4359b1fa549))
* **footer:** remove unused imports and finalize cleanup ([0b5ecc0](https://github.com/isyuricunha/yumusic/commit/0b5ecc03d8c38615228924f27ad52981a5fcac0b))
* **i18n:** add missing translations and remove hardcoded strings in AlbumDetail ([9e66905](https://github.com/isyuricunha/yumusic/commit/9e669051d529ba21d8cd9043d4f150b1659150fe))
* **layout:** refactor main layout to fix sidebar overlap and improve library chips ([6c0c423](https://github.com/isyuricunha/yumusic/commit/6c0c4232b6f1a93b0056ca053e5b2289da6e737b))
* **sidebar:** add horizontal scroll to chips and finalize i18n/layout ([cf87148](https://github.com/isyuricunha/yumusic/commit/cf87148670c8c7806eedfaf75e88bd1853ba6849))
* **sidebar:** correct structural layout and filter chip UI ([36c8a1e](https://github.com/isyuricunha/yumusic/commit/36c8a1e4695b01f6eea5286bf4df0210b3e0d416))
* **sidebar:** prevent header squashing and ensure internal scrolling ([1074a7f](https://github.com/isyuricunha/yumusic/commit/1074a7facfc5f326ec317812b59059b53cc2deac))
* **web:** additional browser-mode safety checks for stores ([d99e48a](https://github.com/isyuricunha/yumusic/commit/d99e48aab02c2c8f5aeb86b8a32f44d1a4129b90))
* **web:** prevent crash when running in browser mode ([b0ffd0e](https://github.com/isyuricunha/yumusic/commit/b0ffd0e1ed718d92d1e8065a16cd4f21c16ef5fd))

## [1.5.0](https://github.com/isyuricunha/yumusic/compare/v1.4.7...v1.5.0) (2026-03-31)

### ✨ Features

* **player:** implement Media Session API for taskbar controls and media keys ([d21f54c](https://github.com/isyuricunha/yumusic/commit/d21f54c5cc2f2c88a4b845d1b9beb33a6b020f35))

## [1.4.7](https://github.com/isyuricunha/yumusic/compare/v1.4.6...v1.4.7) (2026-03-31)

### 🐛 Bug Fixes

* **player:** fix CSP blocking remote streams and improve offline fallback ([94e4990](https://github.com/isyuricunha/yumusic/commit/94e4990c878192c8326949bc32fc9607d33193cd))

## [1.4.6](https://github.com/isyuricunha/yumusic/compare/v1.4.5...v1.4.6) (2026-03-31)

### 🐛 Bug Fixes

* **player:** use online-first playback with offline fallback ([586cfed](https://github.com/isyuricunha/yumusic/commit/586cfed1dca6b3f0e73631e54a83953840b2863c))

## [1.4.5](https://github.com/isyuricunha/yumusic/compare/v1.4.4...v1.4.5) (2026-03-31)

### 🐛 Bug Fixes

* **ci:** add createUpdaterArtifacts flag and fix release workflow for latest.json generation ([48e2ae8](https://github.com/isyuricunha/yumusic/commit/48e2ae834db8ea68a294a6d1b08303cd5cf42d02))

## [1.4.4](https://github.com/isyuricunha/yumusic/compare/v1.4.3...v1.4.4) (2026-03-31)

### 🐛 Bug Fixes

* **updater:** correct endpoint url, propagate check errors, show app version in settings ([6fd4cb5](https://github.com/isyuricunha/yumusic/commit/6fd4cb53bfa99045ab0059ef27dbd6704e40de85))

## [1.4.3](https://github.com/isyuricunha/yumusic/compare/v1.4.2...v1.4.3) (2026-03-31)

### 🐛 Bug Fixes

* **ci:** ensure builds run on every main branch push and upload artifacts ([5c88039](https://github.com/isyuricunha/yumusic/commit/5c88039a7bc73e548bcd9f586aa99f0a9ad964c5))

## [1.4.2](https://github.com/isyuricunha/yumusic/compare/v1.4.1...v1.4.2) (2026-03-31)

### 🐛 Bug Fixes

* **build:** synchronize notification plugin version to resolve build failure ([7643f98](https://github.com/isyuricunha/yumusic/commit/7643f984882c20b426c1b1c8371145734e29db1d))

## [1.4.1](https://github.com/isyuricunha/yumusic/compare/v1.4.0...v1.4.1) (2026-03-31)

### 🐛 Bug Fixes

* **build:** add missing tauri-plugin-notification dependency ([312f872](https://github.com/isyuricunha/yumusic/commit/312f872c859d529d37084e7c1844e132f8109fdd))

## [1.4.0](https://github.com/isyuricunha/yumusic/compare/v1.3.0...v1.4.0) (2026-03-31)

### ✨ Features

* **offline:** implement advanced download system, native playback, and batch progress ([a490a8d](https://github.com/isyuricunha/yumusic/commit/a490a8d2eba5f3e626e4fe5e5de551000b67e8b3))
* **ui:** replace all native confirm dialogs with custom themed ConfirmDialog ([32203c3](https://github.com/isyuricunha/yumusic/commit/32203c321bea4dd8275fea6d584a2e2f63673fa1))

## [1.3.0](https://github.com/isyuricunha/yumusic/compare/v1.2.0...v1.3.0) (2026-03-31)

### ✨ Features

* **desktop:** implement native download system with tauri and fix build errors ([88a8512](https://github.com/isyuricunha/yumusic/commit/88a851216ba44dab15560d7eafe31dd3774eac99))
* **download:** add disk usage and open folder support with scoped permissions ([ad1b89f](https://github.com/isyuricunha/yumusic/commit/ad1b89fd2983e6bea99dde1e2b8c3394098e0354))
* implement music library pages, download service, and Tauri file system capabilities ([ebf6f1c](https://github.com/isyuricunha/yumusic/commit/ebf6f1ca46b224ce618e7bf98bc91aca676f6945))

## [1.2.0](https://github.com/isyuricunha/yumusic/compare/v1.1.2...v1.2.0) (2026-03-31)

### ✨ Features

* **settings:** add download preferences (quality, format, folder) and auto-download toggles ([b262bc2](https://github.com/isyuricunha/yumusic/commit/b262bc23c0ceced22c8b003158050988386ab43f))

## [1.1.2](https://github.com/isyuricunha/yumusic/compare/v1.1.1...v1.1.2) (2026-03-31)

### 🐛 Bug Fixes

* **config:** remove invalid icon field from app.windows config ([1ce959e](https://github.com/isyuricunha/yumusic/commit/1ce959e370bc1644fad3029bcf45e56ccf2252ac))

## [1.1.1](https://github.com/isyuricunha/yumusic/compare/v1.1.0...v1.1.1) (2026-03-31)

### 🐛 Bug Fixes

* **tray:** replace Image::from_bytes with app.default_window_icon() ([e84a573](https://github.com/isyuricunha/yumusic/commit/e84a5736093b7e56447080a0388b904d1a4d48d8))

## [1.1.0](https://github.com/isyuricunha/yumusic/compare/v1.0.2...v1.1.0) (2026-03-31)

### ✨ Features

* **app:** add system tray, auto-updater, autostart, and spotify theme ([fca2d7d](https://github.com/isyuricunha/yumusic/commit/fca2d7d0e8f7585d4575510ec061518cc0a61369)), closes [#1DB954](https://github.com/isyuricunha/yumusic/issues/1DB954)

## [1.0.2](https://github.com/isyuricunha/yumusic/compare/v1.0.1...v1.0.2) (2026-03-31)

### 🐛 Bug Fixes

* **ci:** force node 24, sync app version with semantic-release via exec plugin ([8542252](https://github.com/isyuricunha/yumusic/commit/854225202a983d65782620693ac0165b16194f36))
* **ci:** rename update-version to .cjs to avoid esm require error ([72d06aa](https://github.com/isyuricunha/yumusic/commit/72d06aac0b79297127c526602f72c57985e1520b))

## [1.0.1](https://github.com/isyuricunha/yumusic/compare/v1.0.0...v1.0.1) (2026-03-31)

### 🐛 Bug Fixes

* **ci:** use cycjimmy/semantic-release-action for proper outputs, upgrade to node 24 ([d83a337](https://github.com/isyuricunha/yumusic/commit/d83a33772aaaba177b38df9582e26d4bcb44eccc))

## 1.0.0 (2026-03-31)

### ✨ Features

* **api:** add playlist hooks and tauri web fallback ([8832cdf](https://github.com/isyuricunha/yumusic/commit/8832cdf98750e0526a25e25606f4842c862ddd1d))
* **api:** handle 501 Not Implemented errors and show message in Podcasts page ([93ae228](https://github.com/isyuricunha/yumusic/commit/93ae2282ea3c40325b43dca0f8cc0972f2959b71))
* Complete package migration from com.cappielloantonio.tempo to com.yuricunha.yumusic ([45b4877](https://github.com/isyuricunha/yumusic/commit/45b487778b03c84269cd765547abd5fb53f34c84))
* **core:** setup config store, api client and routing layouts ([04c1a1b](https://github.com/isyuricunha/yumusic/commit/04c1a1b54064a262b54130096ead934230c93192))
* **i18n:** finalize localization and add podcast/radio support ([6e65059](https://github.com/isyuricunha/yumusic/commit/6e65059082cfbddb14a53800cd10a18099791fec))
* initial commit ([2e9b6a2](https://github.com/isyuricunha/yumusic/commit/2e9b6a27a4a041ead34475523551fc743ad297e1))
* initialize Tauri project configuration and dependencies ([14d5afa](https://github.com/isyuricunha/yumusic/commit/14d5afa35008f1a66e2c3970b940eeb333d0c62f))
* **library:** build library, search, and favorites pages with api bindings ([6d7d24d](https://github.com/isyuricunha/yumusic/commit/6d7d24d4078d6a8e5c87730431ca16eb2cfe8831))
* **player:** implement global audio engine and playback integration ([24f97f5](https://github.com/isyuricunha/yumusic/commit/24f97f568826053d5cd8145e6bdd4a59b95b8fe0))
* **player:** implement professional scrobbling at 50 percent mark ([4ff4829](https://github.com/isyuricunha/yumusic/commit/4ff48290b4b333f25d7d9ed986eef79d2f3bdc09))
* **podcast:** add external stream support and optimize subsonic hooks ([df09b87](https://github.com/isyuricunha/yumusic/commit/df09b87964356eac46011b04f7fa14f38bff1cfb))
* **podcast:** implement podcast ui with pagination and rss support ([0fe6b75](https://github.com/isyuricunha/yumusic/commit/0fe6b757049204a23814ed594a5f887974c46b4c))
* **podcast:** implement rss service and local podcast storage ([1ff9e46](https://github.com/isyuricunha/yumusic/commit/1ff9e464836dd6468d2e7307449578c033228822))
* **podcast:** setup tauri http and store plugins for local rss support ([e673117](https://github.com/isyuricunha/yumusic/commit/e673117763d04567cbd8bb719fc66960aba0a5f8))
* **radio:** implement local radio station support using tauri store ([4f36fcd](https://github.com/isyuricunha/yumusic/commit/4f36fcdd2da7caa8e23014f32bd6540f8db70f45))
* **setup:** initialize tauri, vite, shadcn and themes ([d5061cc](https://github.com/isyuricunha/yumusic/commit/d5061cc572b8cce46e4a4f891881b0bb1b001b99))
* **ui:** add artist profiles, navigation links, and fix settings visibility ([f653ad7](https://github.com/isyuricunha/yumusic/commit/f653ad79fd9f3b8e7dd58556743354805789beaa))
* **ui:** add artist songs fallback using search when top songs are missing ([58cf9ab](https://github.com/isyuricunha/yumusic/commit/58cf9ab84cb620624d34b34a708831d3c36627f2))
* **ui:** add artist top songs catalog and translate missing keys ([ee18012](https://github.com/isyuricunha/yumusic/commit/ee180128ec4fee4e7a34df07c4f0b353e9fc2736))
* **ui:** add Popular tracks section to Artist profile ([49640fc](https://github.com/isyuricunha/yumusic/commit/49640fcb88342d3cca684f5fbad4f4b8db63bc29))
* **ui:** aggregate and deduplicate albums from both primary data and song search results ([ad712e9](https://github.com/isyuricunha/yumusic/commit/ad712e94a2d9df8d898c4e2483ded697ca0ac501))
* **ui:** custom titlebar, scrollbars, dialogs and podcast duration fixes ([a0709b9](https://github.com/isyuricunha/yumusic/commit/a0709b9a31e8ec028d1bf79befbebae39c36532e))
* **ui:** implement home page, player controls, and enhanced search/podcasts ([4c1ca5c](https://github.com/isyuricunha/yumusic/commit/4c1ca5c57723c80682e2fa5d3e1ded34824b8174))
* **ui:** implement official logo branding across sidebar and login ([49ab63b](https://github.com/isyuricunha/yumusic/commit/49ab63be0a2439ded9d6383cba998e4dfaaa2841))
* **ui:** implement settings page and dynamic playlist management ([9353629](https://github.com/isyuricunha/yumusic/commit/935362924984a724e20becb1adc52b215a04d11a))
* **ui:** improve artist catalog aggregation and add missing translations ([bea9db9](https://github.com/isyuricunha/yumusic/commit/bea9db936f8ac7301195332d301217469d3bf1e5))
* **ui:** ultra-dense home grid and interactive biographies/reviews ([899b3b6](https://github.com/isyuricunha/yumusic/commit/899b3b6aa0bd9624a88be2cc6549fa354fff6b70))
* update app icons with new launcher icons ([95d2a4c](https://github.com/isyuricunha/yumusic/commit/95d2a4c3396e36f71df4e96ebca04ff3a518aa73))

### 🐛 Bug Fixes

* **api:** handle non-json responses and prevent undefined query data ([5ff2cb9](https://github.com/isyuricunha/yumusic/commit/5ff2cb94b2a9af95597939f584a2152a0330d3cb))
* **ci:** add missing conventional-changelog-conventionalcommits package ([f1d0a17](https://github.com/isyuricunha/yumusic/commit/f1d0a1768d9c0c08608cbb8dffe262351ee2a39e))
* **home:** stabilize featured artists and harden api calls ([2476783](https://github.com/isyuricunha/yumusic/commit/24767838d059e0fc10992f0ace1d7a9b778e4d39))
* **library:** add click navigation to artists in library pag ([1ff6636](https://github.com/isyuricunha/yumusic/commit/1ff6636d54638f0d5815d9384210b6ff7cb41377))
* **player:** implement two-step scrobbling for reliable last.fm integration ([e775e53](https://github.com/isyuricunha/yumusic/commit/e775e53d95ea47a85853d7e13f216682974a09ce))
* **player:** resolve Rules of Hooks violation in cover art generation ([f2c8034](https://github.com/isyuricunha/yumusic/commit/f2c80344fa61a606fe0b82ef451098099e3b3bb5))
* **podcast:** add validation to reject non-podcast rss feeds ([6a89a9c](https://github.com/isyuricunha/yumusic/commit/6a89a9c76fd77b2a474d8c8c9b1007c6c3b79766))
* **podcast:** allow http plugin to fetch external urls in tauri v2 capabilities ([1f239c1](https://github.com/isyuricunha/yumusic/commit/1f239c1270d99c54f0d11e6de726a5102c21c580))
* **podcast:** properly detect tauri environment to prevent cors errors in production ([76130a2](https://github.com/isyuricunha/yumusic/commit/76130a2c3a289f4d8feace16d4fde9f3dabfdd2e))
* **podcast:** support individual episode thumbnails and direct urls ([7fefa7d](https://github.com/isyuricunha/yumusic/commit/7fefa7dcad2b4d8fe3fee319660fe21ee6ca9e5d))
* **settings:** correct theme values and ensure dark mode persistence ([6b90e57](https://github.com/isyuricunha/yumusic/commit/6b90e57be9385e00dfbffea436ca67a71f10b9ee))
* **ui:** add core:window:default permission to fix custom titlebar buttons and drag ([9307678](https://github.com/isyuricunha/yumusic/commit/930767846769e663afccc22e5ce1d2e9f2d98013))
* **ui:** isolate tauri-drag-region and expand specific window capabilities to fix titlebar ([3453d9d](https://github.com/isyuricunha/yumusic/commit/3453d9d6daeda0a1ffcf32384c646375abfe7b33))
