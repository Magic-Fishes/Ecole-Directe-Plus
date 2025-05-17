use include_flate::flate;
use tauri::{App, WebviewUrl, WebviewWindowBuilder};
use url::Url;

flate!(pub static INJECTION: str from "./injection/index.js");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_url = Url::parse("https://ecole-directe.plus/login").unwrap();
    let app_url_external = WebviewUrl::External(app_url);
    let injection = INJECTION.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![])
        .setup(move |app: &mut App| {
          // NOTE: will trigger a warning on mobile builds since `mut` is unused.
          let mut win = WebviewWindowBuilder::new(app, "main", app_url_external)
                .disable_drag_drop_handler()
                .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36")
                .initialization_script(
                    format!(
                        r#"
                          if (!window.__EDP_APP_INIT__) {{
                            window.__EDP_APP_INIT__ = true;
                            {injection}
                          }}
                        "#
                    )
                    .as_str(),
                );

            #[cfg(not(any(target_os = "ios", target_os = "android")))]
            {
                win = win
                  .title("Ecole Directe Plus")
                  .resizable(true)
                  .decorations(true)
                  .shadow(true)
                  .inner_size(1280.0, 720.0);
            }

            win.build()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
