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
