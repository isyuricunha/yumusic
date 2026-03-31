use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, WindowEvent,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // ── Autostart (desktop only) ────────────────────────────────────
            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_autostart::init(
                    tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                    None,
                ))?;

            // ── Auto-updater (desktop only) ─────────────────────────────────
            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())?;

            // ── System Tray ─────────────────────────────────────────────────
            let show_item = MenuItem::with_id(app, "show", "Show YuMusic", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            // Use the icon already configured in tauri.conf.json rather than
            // decoding PNG bytes manually (Image::from_bytes is not available
            // in tauri 2.x; default_window_icon() is the correct API).
            let icon = app
                .default_window_icon()
                .cloned()
                .expect("no window icon configured in tauri.conf.json");

            TrayIconBuilder::new()
                .icon(icon)
                .menu(&menu)
                .tooltip("YuMusic")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click {
                        button: tauri::tray::MouseButton::Left,
                        button_state: tauri::tray::MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        // ── Close-to-tray behavior ──────────────────────────────────────────
        // Always intercept CloseRequested and hide the window. The only true
        // exit path is the "Quit" option in the tray icon menu — same behavior
        // as Spotify, Discord, etc.
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
