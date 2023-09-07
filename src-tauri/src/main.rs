// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::ser::{Serialize, Serializer, SerializeStruct};

fn main() {
  let save = tauri::CustomMenuItem::new("save", "Save");
  let submenu = tauri::Submenu::new("File", tauri::Menu::new().add_item(save));
  let menu = tauri::Menu::new()
    .add_native_item(tauri::MenuItem::Copy)
    .add_item(tauri::CustomMenuItem::new("hide", "Hide"))
    .add_submenu(submenu);

  tauri::Builder::default()
    .menu(menu)
    .on_menu_event(manage_menu_event)
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

#[derive(Clone)]
struct CustomSaveTestPayload {
  message: String,
  custom: String,
}
impl Serialize for CustomSaveTestPayload {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
      S: Serializer,
  {
      // 2 is the number of fields in the struct.
      let mut state = serializer.serialize_struct("CustomSaveTestPayload", 2)?;
      state.serialize_field("message", &self.message)?;
      state.serialize_field("custom", &self.custom)?;
      state.end()
  }
}

fn manage_menu_event(event:tauri::WindowMenuEvent) {
  println!("Menu event item: {}", event.menu_item_id());
  match event.menu_item_id() {
    "save" => {
      let _ = event.window().emit("SWIVEL::INIT_SAVE", CustomSaveTestPayload { message: "yeah boy!".to_string(), custom: "cats".to_string()});
    }
    _ => {}
  }
}