// use tauri::{Manager, Window};
// use specta::Type;


use tauri_specta::{collect_commands, Builder};
mod api;
mod dir;
mod models;
mod path_ext;
mod system_time_ext;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::collections::HashMap;
// use serde::{Serialize, Deserialize};
use crate::api::get_instance;
use crate::models::{OrdItem, OrderAsc, OrderBy, MetaType, OptParams, Params, ApiError, TextContent, Folder, HomeType, DiskInfo};


#[tauri::command]
#[specta::specta]
async fn read_text(path_str: String) -> Result<TextContent, ApiError> {
    get_instance().read_txt(&path_str).await
    // Ok(TextContent{
    //     path: "abc".to_string(),
    //     mimetype: "".to_string(),
    //     text: Some("".to_string()),
    //     enc: Some("".to_string())
    // })
}

#[tauri::command]
#[specta::specta]
async fn read_folder(params: OptParams) -> Result<Folder, ApiError> {
    let new_params = Params {
        meta_types: params.meta_types.unwrap_or(vec![MetaType::Sz, MetaType::Tm]),
        ordering: params.ordering.unwrap_or(vec![OrdItem { nm: OrderBy::Dir, asc: OrderAsc::Asc }, OrdItem { nm: OrderBy::Nm, asc: OrderAsc::Asc }]),
        is_pretty: params.is_pretty.unwrap_or(false),
        path_str: params.path_str.unwrap_or(String::from(".")),
        cache_nm: params.cache_nm,
        skip_n: params.skip_n,
        take_n: params.take_n,
    };
    get_instance().get_folder(&new_params).await
}

///
/// set state
///
/// # arg
/// - key
/// - opt_val: if `None` then delete cache
///
/// # Examples
/// ```
/// ```
#[tauri::command]
#[specta::specta]
async fn set_state(key: String, val: Option<String>) -> Result<Option<String>, ApiError> {
    get_instance().set_state(key, val).await
}

///
/// get state
///
/// # arg
/// - key
/// - default_val: If the key does not exist in the cache, insert the default value and return it.
#[tauri::command]
#[specta::specta]
async fn get_state(key: String, default_val: Option<String>) -> Result<Option<String>, ApiError> {
    get_instance().get_state(&key, default_val).await
}

#[tauri::command]
#[specta::specta]
async fn get_home_dir() ->Result<HashMap<HomeType, String>, ApiError> {
    get_instance().get_home_dir().await
}

#[tauri::command]
#[specta::specta]
async fn get_disks() -> Result<Vec<DiskInfo>, ApiError> {
    get_instance().get_disks().await
}

#[tauri::command]
#[specta::specta]
async fn get_arg_path() -> Result<Option<String>, ApiError> {
    get_instance().get_arg_path().await
}

#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![greet, read_text, read_folder, set_state, get_state, get_home_dir, get_disks, get_arg_path]);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    {
        use specta_typescript::BigIntExportBehavior;
        use specta_typescript::Typescript;
        let ts = Typescript::default()
            .bigint(BigIntExportBehavior::Number);
        builder
            .export(ts, "../src/bindings.ts")
            .expect("Failed to export typescript bindings");
    }


    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // .invoke_handler(tauri::generate_handler![greet, read_text, read_folder, set_state, get_state, get_home_dir, get_disks])
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            // match app.get_window("main") {
            //     Some(window) => {
            //         match window.get_webview("main") {
            //             Some(webview) => {
            //                 webview.on_webview_event(|event| {
            //                 })
            //             }
            //             None => {}
            //         }
            //     }
            //     None => {}
            // }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
