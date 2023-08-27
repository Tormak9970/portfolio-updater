#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::path::PathBuf;

use tauri::{
  AppHandle,
  FsScope, Manager
};

#[tauri::command]
/// Adds the provided path to Tauri FS and Asset scope.
async fn add_path_to_scope(app_handle: AppHandle, target_path: String) -> bool {
  let path_as_buf: PathBuf = PathBuf::from(&target_path);

  let fs_scope = app_handle.fs_scope();
  let asset_scope = app_handle.asset_protocol_scope();

  let fs_res = FsScope::allow_directory(&fs_scope, &path_as_buf, true);
  let asset_res = FsScope::allow_directory(&asset_scope, &path_as_buf, true);

  if fs_res.is_ok() && asset_res.is_ok() {
    println!("Added {} to scope.", &target_path);
    return true;
  } else if fs_res.is_err() {
    let err = fs_res.err().unwrap();
    println!("Error adding {} to scope. FS Scope Error: {}", &target_path, err.to_string());
  } else if asset_res.is_err() {
    let err = asset_res.err().unwrap();
    println!("Error adding {} to scope. Asset Scope Error: {}", &target_path, err.to_string());
  } else {
    let fs_err = fs_res.err().unwrap();
    let asset_err = asset_res.err().unwrap();
    println!("Error adding {} to scope. FS Scope Error: {}. Asset Scope Error: {}", &target_path, fs_err.to_string(), asset_err.to_string());
  }

  return false;
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      add_path_to_scope
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
