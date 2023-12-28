import Tauri from "../Tauri";
import { startFullscreenLoading, stopFullscreenLoading } from "../state/loader";
import { getCurrentStateProject, resetProject } from "../state/project";

enum TauriClientEvents {
  SWITCH_TOOLS = "SWIVEL::SWITCH_TOOLS",
  SAVE = "SWIVEL::INIT_SAVE",
  NEW = "SWIVEL::INIT_NEW",
  EXPORT = "SWIVEL::INIT_EXPORT",
}

enum TauriServerEvents {
  SAVE = "save_project",
  EXPORT = "export_project",
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

type TauriPayload = {
  payload: {
    name: string;
  }
}

const switchTools = (e: TauriPayload) => {
  const { name } = e.payload;
  window.location.href = name === "index" ? "/" : `/${name}.html`;
}

const swivelSave = async () => {
  if (!Tauri) {
    // Add a web service call here
    return;
  }
  startFullscreenLoading({ message: "Saving" });
  await new Promise(res => setTimeout(res, 1000));
  const project = getCurrentStateProject();
  const projectData = project.serialize();
  const { invoke } = Tauri.tauri;
  await invoke(TauriServerEvents.SAVE, { projectData });
  stopFullscreenLoading();
}

const swivelExport = async () => {
  if (!Tauri) {
    // Add a web service call here
    return;
  }
  startFullscreenLoading({ message: "Exporting" });
  await new Promise(res => setTimeout(res, 1000));
  const project = getCurrentStateProject();
  const projectData = project.serialize();
  const { invoke } = Tauri.tauri;
  await invoke(TauriServerEvents.EXPORT, { projectData });
  stopFullscreenLoading();
}

const swivelNew = async () => {
  if (!Tauri) {
    // Add a web service call here
    return;
  }
  startFullscreenLoading({ message: "Setting Up New Project" });
  await new Promise(res => setTimeout(res, 1000));
  resetProject();
  stopFullscreenLoading();
}