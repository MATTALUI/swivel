import { buildFramePreview } from "./ElementBuilder";
import ObjectNode from "./ObjectNode";
import SwivelProject from "./SwivelProject";
import Tauri from "./Tauri";
import { startFullscreenLoading, stopFullscreenLoading } from "./UIManager";
import { clamp, debounce, degToRad, getAngleOfChange, getPositionDistance } from "./Utils";
import Vec2 from "./Vec2";

export default class SwivelAnimator {
  allControlNodes: ObjectNode[];
  targetNode: ObjectNode | null;
  targetNodeActive: boolean;
  mouseDownInitialValues: {
    x: number;
    y: number;
    originalParentNode: ObjectNode | null;
    originalNodeRoot: ObjectNode;
  } | null;

  registerEventListeners() {
    this.playButton.addEventListener("click", (e) => this.togglePlayback(e))
    window.addEventListener("SWIVEL::framechange", (e) => this.handleFrameChange(e));
  }

  registerTauriEventListeners() {
    if (!window.__TAURI__) {
      console.log("Non-Tauri instance. Running in webmode.");
      this.webmode = true;
      return;
    }
    const { listen } = window.__TAURI__.event;
    listen("SWIVEL::INIT_SAVE", (e) => this.handleInitSave(e));
    listen("SWIVEL::INIT_NEW", (e) => this.handleInitNew(e));
    listen("SWIVEL::INIT_EXPORT", (e) => this.handleInitExport(e));
  }

  playAnimation() {
    if (!this.playing) return;
    window.requestAnimationFrame(() => this.playAnimation());
    const currentTime = new Date();
    if (this.lastFrameTime) {
      const msInSecond = 1000;
      const frameDifferential = msInSecond / this.project.fps;
      const timeSinceLastFrame = Number(currentTime) - frameDifferential;
      if (timeSinceLastFrame < Number(this.lastFrameTime))
        return;
    }
    this.lastFrameTime = currentTime;
    this.currentFrameIndex++;
    if (this.currentFrameIndex === this.project.frames.length)
      this.currentFrameIndex = 0;
    this.repaint();
  }

  async handleInitSave(event) {
    if (!Tauri) {
      throw new Error("cant save yet");
    }
    startFullscreenLoading("Saving");
    await new Promise(res => setTimeout(res, 1000));
    const projectData = this.project.serialize();
    const { invoke } = Tauri.tauri;
    const saveSuccess = await invoke("save_project", { projectData });
    stopFullscreenLoading();
  }

  async handleInitExport(event) {
    if (!Tauri) {
      throw new Error("cant save yet");
    }
    startFullscreenLoading("Exporting");
    await new Promise(res => setTimeout(res, 1000));
    const projectData = this.project.serialize();
    const { invoke } = Tauri.tauri;
    const saveSuccess = await invoke("export_project", { projectData });
    stopFullscreenLoading();
  }

  async handleInitNew(event) {
    startFullscreenLoading("Setting Up New Project");
    await new Promise(res => setTimeout(res, 1000));
    this.setupNewProject();
    stopFullscreenLoading();
  }
}