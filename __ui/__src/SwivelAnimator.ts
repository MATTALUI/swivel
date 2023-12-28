export default class SwivelAnimator {registerTauriEventListeners() {
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