#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;

#[cfg(target_os = "macos")]
mod macos;

// mod api;

#[tauri::command(async)]
async fn app_ready(app_handle: tauri::AppHandle) {
    let window = app_handle.get_window("main").unwrap();

    window.show().unwrap();
}

#[tokio::main]
async fn main() {
    // let router = api::mount();
    tauri::Builder::default()
        // NOTE: enable this for rspc
        // .plugin(rspc::integrations::tauri::plugin(router, || ()))
        .invoke_handler(tauri::generate_handler![app_ready])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
