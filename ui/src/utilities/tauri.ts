import Tauri from "../Tauri";
import { TauriClientEvents } from "../types";
import { exportProject, restartProject, saveProject } from "./project.util";
import { switchTools } from "./navigation.util";

export const mountSwivelTauriListeners = () => {
  if (!Tauri) return;
  const { listen } = Tauri.event;

  listen(TauriClientEvents.SWITCH_TOOLS, switchTools);
  listen(TauriClientEvents.SAVE, saveProject);
  listen(TauriClientEvents.NEW, restartProject);
  listen(TauriClientEvents.EXPORT, exportProject);
};

export const mountMappainterTauriListeners = () => {
  if (!Tauri) return;
  const { listen } = Tauri.event;
  listen(TauriClientEvents.SWITCH_TOOLS, switchTools);
  listen(TauriClientEvents.SAVE, mappainterSave);
  listen(TauriClientEvents.NEW, mappainterNew);
};

const mappainterSave = async () => {
  if (!Tauri) return;
  // These will need to be updated if the grid changes
  const width = 40;
  const height = 30;
  const { invoke } = Tauri.tauri;
  const activeIndices = Array
    .from(document.querySelectorAll("[data-active=true]"))
    .map(e => Number(e.getAttribute("data-index")));
  await invoke("save_painted_map", {
    activeIndices,
    width,
    height,
  });
};

const mappainterNew = () => {
  console.log("Create new map painter!");
};