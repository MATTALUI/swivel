import Tauri from "../Tauri";
import PrefabAnimationObject, { SerializablePrefabAnimationObject } from "../models/PrefabAnimationObject";
import globalState from "../state";
import { resetAppState } from "../state/app";
import { startFullscreenLoading, stopFullscreenLoading } from "../state/loader";

enum TauriClientEvents {
  SWITCH_TOOLS = "SWIVEL::SWITCH_TOOLS",
  SAVE = "SWIVEL::INIT_SAVE",
  NEW = "SWIVEL::INIT_NEW",
  EXPORT = "SWIVEL::INIT_EXPORT",
}

enum TauriServerFunctions {
  SAVE = "save_project",
  SAVE_PREFAB = "save_prefab_object",
  LOAD_PREFABS = "load_prefab_objects",
  EXPORT = "export_project",
  SAVEMAPPAINTER = "save_painted_map",
}

export const mountSwivelTauriListeners = () => {
  if (!Tauri) {
    console.log("Non-Tauri instance. Running in webmode.");
    return;
  }
  const { listen } = Tauri.event;

  listen(TauriClientEvents.SWITCH_TOOLS, switchTools);
  listen(TauriClientEvents.SAVE, swivelSave);
  listen(TauriClientEvents.NEW, swivelNew);
  listen(TauriClientEvents.EXPORT, swivelExport);
};

export const mountMappainterTauriListeners = () => {
  if (!Tauri) {
    console.log("Non-Tauri instance. Running in webmode.");
    return;
  }
  const { listen } = Tauri.event;
  listen(TauriClientEvents.SWITCH_TOOLS, switchTools);
  listen(TauriClientEvents.SAVE, mappainterSave);
  listen(TauriClientEvents.NEW, mappainterNew);
};

type TauriPayload = {
  payload: {
    name: string;
  }
}

const switchTools = (e: TauriPayload) => {
  const { name } = e.payload;
  window.location.href = name === "index" ? "/" : `/${name}`;
};

const swivelSave = async () => {
  if (!Tauri) {
    // Add a web service call here
    return;
  }
  startFullscreenLoading({ message: "Saving" });
  await new Promise(res => setTimeout(res, 1000));
  const project = globalState.project.swivelProject;
  const projectData = project.serialize();
  const { invoke } = Tauri.tauri;
  await invoke(TauriServerFunctions.SAVE, { projectData });
  stopFullscreenLoading();
};

const swivelExport = async () => {
  if (!Tauri) {
    // Add a web service call here
    return;
  }
  startFullscreenLoading({ message: "Exporting" });
  await new Promise(res => setTimeout(res, 1000));
  const project = globalState.project.swivelProject;
  const projectData = project.serialize();
  const { invoke } = Tauri.tauri;
  await invoke(TauriServerFunctions.EXPORT, { projectData });
  stopFullscreenLoading();
};

const swivelNew = async () => {
  if (!Tauri) {
    // Add a web service call here
    return;
  }
  startFullscreenLoading({ message: "Setting Up New Project" });
  await new Promise(res => setTimeout(res, 1000));
  globalState.project.reset();
  resetAppState();
  stopFullscreenLoading();
};

const mappainterSave = async () => {
  if (!Tauri) {
    // Add a web service call here
    return;
  }
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

export const saveSwivelObject = async (prefab: PrefabAnimationObject): Promise<boolean> => {
  if (!Tauri) {
    // Add a web service call here
    return false;
  }
  const { invoke } = Tauri.tauri;
  // await new Promise(res => setTimeout(res, 1000));
  const saveData = JSON.stringify(prefab.toSerializableObject());
  await invoke(TauriServerFunctions.SAVE_PREFAB, { saveData });

  return true;
};

export const loadSwivelObjects = async (): Promise<SerializablePrefabAnimationObject[]> => {
  if (!Tauri) {
    // Add a web service call here
    return [];
  }
  const { invoke } = Tauri.tauri;
  const prefabs = await invoke<SerializablePrefabAnimationObject[]>(TauriServerFunctions.LOAD_PREFABS);

  return prefabs;
};