// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::ser::{Serialize, Serializer, SerializeStruct};
use std::collections::HashMap;
use std::fs::File;

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
  // Tools
  let animator = tauri::CustomMenuItem::new("tool-swivel-animator", "Swivel Animator");
  let map_painter = tauri::CustomMenuItem::new("tool-map-painter", "Map Painter");
  let tools_contents = tauri::Menu::new()
    .add_item(animator)
    .add_item(map_painter);
  let tools_submenu = tauri::Submenu::new("Tools", tools_contents);

  let menu = tauri::Menu::new()
    .add_native_item(tauri::MenuItem::Copy)
    .add_submenu(file_submenu)
    .add_submenu(tools_submenu);

  tauri::Builder::default()
    .menu(menu)
    .on_menu_event(manage_menu_event)
    .invoke_handler(tauri::generate_handler![greet])
    .invoke_handler(tauri::generate_handler![save_project])
    .invoke_handler(tauri::generate_handler![save_painted_map])
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

#[tauri::command]
fn save_painted_map(activeIndices: Vec<u16>, width: u16, height: u16) -> bool {
  if activeIndices.len() == 0 {
    return false;
  }
  // We start by translating all of the data so that it sits on the origin point.
  // In order to do this we have to find the minimum and
  let y_adjust = activeIndices[0] / width;
  let mut x_adjust = u16::MAX;
  for active_index in activeIndices.iter() {
    let x_offset = active_index % width;
    if x_offset < x_adjust {
      x_adjust = x_offset;
    }
  }

  let mut vertex_name_map:HashMap<String, u16> = HashMap::new();
  let mut vert_strings:Vec<String> = Vec::new();
  let mut face_strings:Vec<String> = Vec::new();
  let mut current_vert_number:u16 = 1;
  for active_index in activeIndices.iter() {
    // Adjust the face to sit on the origin
    let mut adjusted_index = *active_index;
    adjusted_index -= y_adjust * width;
    adjusted_index -= x_adjust;
    // Build map of vertices
    let face = calculate_face_for_index(adjusted_index, width);
    // The order the vertices are used to build the face matters
    let face_vertices = vec![face.tl, face.tr, face.br, face.bl];
    let mut face_vertex_numbers:Vec<u16> = Vec::new();
    for vert in face_vertices.iter() {
      let vert_string = format_vertex_string(vert);
      // See if the vertice is already registered
      match vertex_name_map.get(&vert_string) {
        Some(vert_number) => {
          face_vertex_numbers.push(*vert_number);
        }
        None => {
          let vert_string_copy = vert_string.clone();
          vertex_name_map.insert(vert_string, current_vert_number);
          face_vertex_numbers.push(current_vert_number.clone());
          vert_strings.push(vert_string_copy);
          current_vert_number += 1;
        }
      }
    }
    face_strings.push(format!("f {:?} {:?} {:?} {:?}", face_vertex_numbers[0], face_vertex_numbers[1], face_vertex_numbers[2], face_vertex_numbers[3]));

  }
  // Now write it to a file
  let mut output = "# Swivel OBJ file\n# www.mattalui.io\n".to_string();
  output = format!("{}{}", output, "o Painted.Map\n");
  for vert_string in vert_strings.iter() {
    output = format!("{}{}{}", output, vert_string, "\n");
  }
  output = format!("{}{}", output, "# Turn off smoothe shading\ns off\n");
  for face_string in face_strings.iter() {
    output = format!("{}{}{}", output, face_string, "\n");
  }
  let _ = std::fs::create_dir("./saves");
  let _ = std::fs::write("./saves/output.obj", output);

  return true;
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
    "tool-map-painter" => {
      let _ = event.window().emit("SWIVEL::SWITCH_TOOLS", SwivelToolView { name: "mappainter".to_string() });
    }
    "tool-swivel-animator" => {
      let _ = event.window().emit("SWIVEL::SWITCH_TOOLS", SwivelToolView { name: "index".to_string() });
    }
    _ => {}
  }
}

fn calculate_face_for_index(index: u16, width: u16) -> GeometricFace {
  const SIZE:u16 = 1;

  let tl = Vec2 { x: (index % width) * SIZE, y: (index / width) * SIZE };
  let bl = Vec2 { x: tl.x, y: tl.y + SIZE };
  let br = Vec2 { x: tl.x + SIZE, y: tl.y + SIZE };
  let tr = Vec2 { x: tl.x + SIZE, y: tl.y };

  return GeometricFace { tl: tl, bl: bl, br: br, tr: tr, };
}

fn format_vertex_string(vert:&Vec2<u16>) -> String {
  return format!("v {:?}.0 0.0 {:?}.0", vert.x, vert.y);
}

// This is certainly NOT the right way to allow a struct to be serializable, but
// I am going to leave this here as a reference of what can be done.
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

#[derive(Clone, Debug, serde::Deserialize, serde::Serialize)]
struct SwivelToolView {
  name: String,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct Vec2<T> {
  x: T,
  y: T,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct GeometricFace {
  tl: Vec2<u16>,
  bl: Vec2<u16>,
  tr: Vec2<u16>,
  br: Vec2<u16>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct AnimationObjectNode {
  position: Vec2<f32>,
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