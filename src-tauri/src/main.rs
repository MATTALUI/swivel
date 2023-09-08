// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::ser::{Serialize, Serializer, SerializeStruct};

fn main() {
  // File
  let new = tauri::CustomMenuItem::new("new", "New");
  let save = tauri::CustomMenuItem::new("save", "Save");
  let open = tauri::CustomMenuItem::new("open", "Open...").disabled();
  let file_contents = tauri::Menu::new()
    .add_item(new)
    .add_item(save)
    .add_item(open);
  let file_submenu = tauri::Submenu::new("File", file_contents);
  // Edit
  // View

  let menu = tauri::Menu::new()
    .add_native_item(tauri::MenuItem::Copy)
    // .add_item(tauri::CustomMenuItem::new("hide", "Hide"))
    .add_submenu(file_submenu);

  tauri::Builder::default()
    .menu(menu)
    .on_menu_event(manage_menu_event)
    .invoke_handler(tauri::generate_handler![greet])
    .invoke_handler(tauri::generate_handler![save_project])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
  return format!("Hello, {}!", name);
}

#[tauri::command]
fn save_project(project_data: &str) -> bool {
  // TODO: create a registry here in order to index some of these files for the loading featre
  let project: AnimationProject = serde_json::from_str(project_data).unwrap();
  let file_name = format!("./saves/{}.swivel", project.id);
  let _ = std::fs::create_dir("./saves");
  let _ = std::fs::write(file_name, project_data);
  return true;
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
    "new" => {
      let _ = event.window().emit("SWIVEL::INIT_NEW", {});
    }
    "save" => {
      let _ = event.window().emit("SWIVEL::INIT_SAVE", CustomSaveTestPayload { message: "yeah boy!".to_string(), custom: "cats".to_string()});
    }
    _ => {}
  }
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct Vec2 {
  x: f32,
  y: f32,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct AnimationObjectNode {
  position: Vec2,
  children: Vec<AnimationObjectNode>,
  size: u8,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct AnimationObject {
  root: AnimationObjectNode,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct AnimationFrame {
  previewImage: String,
  objects: Vec<AnimationObject>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct AnimationProject {
  id: String,
  frames: Vec<AnimationFrame>,
  width: u16,
  height: u16,
  fps: u8,
  name: String,
}