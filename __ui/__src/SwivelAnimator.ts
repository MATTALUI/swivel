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

  constructor() {
    this.setupNewProject();
    this.registerEventListeners();
    this.registerTauriEventListeners();
  }

  setupNewProject() {
    this.initializeData();
    this.repaint();
  }

  initializeData() {
    // App Data
    this.project = new SwivelProject();
    this.currentFrameIndex = 0;
    this.allControlNodes = [];
    this.targetNode = null;
    this.targetNodeActive = false;
    this.mouseDownInitialValues = null;
    this.playing = false;
    this.lastFrameTime = null;
    this.webmode = false;
  }

  repaint() {
    this.buildCanvas();
    this.renderFramePreviews();
  }

  registerEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMovement(e));
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
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

  updateFramePreview(index:number) {
    const canvas = document.createElement('canvas');
    const frame = this.project.frames[index];
    canvas.width = this.project.width;
    canvas.height = this.project.height;
    this.drawCurrentFrameToCanvas(canvas, true);
    const url = canvas.toDataURL();

    const container = document.querySelector(`.framePreviewContainer[data-frame-index="${index}"]`);
    if (!container) {
      console.log("Could not find preview frame container");
      return;
    }
    const noPreview = container.querySelector(".noPreview");
    frame.previewImage = url;
    if (noPreview) {
      container.replaceWith(buildFramePreview(frame, index, index));
    } else {
      container.querySelector(".framePreview")?.setAttribute("src", url);
    }
  }

  _updateCurrentFramePreview() {
    this.updateFramePreview(this.currentFrameIndex);
  }
  updateCurrentFramePreview = debounce(() => this._updateCurrentFramePreview(), 500);

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

  handleMouseMovement(event) {
    if (this.playing) return;
    if (!this.targetNodeActive) {
      // No interaction has been initiated so we're pretty much just checking
      // interactables and setting the hover states.
      let clickable = false;
      const { offsetX, offsetY } = event;
      const { width, height } = this.canvas;
      // Check all control nodes to see if we're hovering
      for (let i = 0; i < this.allControlNodes.length; i++) {
        const node = this.allControlNodes[i];
        const { x, y } = node.position.getRenderedPosition(width, height);
        const xDiff = Math.abs(x - offsetX);
        const yDiff = Math.abs(y - offsetY);
        const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        if (distance <= 10) {
          clickable = true;
          this.targetNode = node;
          break;
        }
      }

      // Right now we set clickability every move event. So far it hasn't
      // mattered in terms of performance, but if it does become an issue we can
      // add some logic to only change it when the value is different than what
      // is reflected.
      if (clickable) {
        this.canvas.classList.add("clickable");
      } else {
        this.canvas.classList.remove("clickable");
        this.targetNode = null;
      }
    } else if (this.targetNode?.isRoot) {
      const { offsetX, offsetY } = event;
      const { width, height } = this.canvas.getBoundingClientRect();
      // You'd think I wouldn't need to clamp here, but I was seeing events come
      // out where fast mouse movements could over/undershoot bounds.
      const mouseX = clamp(offsetX, 0, width);
      const mouseY = clamp(offsetY, 0, height);
      if (!this.mouseDownInitialValues) throw new Error("No initial values for the mouse");
      const { x: originalX, y: originalY, originalNodeRoot } = this.mouseDownInitialValues;
      const deltaX = mouseX - originalX;
      const deltaY = mouseY - originalY;
      const moveWithChildren = (node, originalNode) => {
        node.children.forEach((child, index) => {
          moveWithChildren(child, originalNode.children[index]);
        });
        const { x: originalNodeX, y: originalNodeY } = originalNode.position.getRenderedPosition(width, height);
        const newX = originalNodeX + deltaX;
        const newY = originalNodeY + deltaY;
        node.setPosition(new Vec2(
          newX / width,
          newY / height
        ));
      }
      moveWithChildren(this.targetNode, originalNodeRoot);
      this.repaint();
    } else {
      const { width, height } = this.canvas;
      const swivelPoint = this.targetNode?.parent || undefined;
      if (!swivelPoint) throw new Error("No valid swivel point");
      const [swivelX, swivelY] =
        swivelPoint.position.getRenderedPositionTuple(width, height);
      // This logic assumes only two types of movment should come from a node.
      // If we want to have more types of movement that are differentiated by
      // more than root and not root we will have to update this here.
      const rotateWithChildren = (deltaDeg, node, originalNode) => {
        node.children.forEach((child, index) => {
          rotateWithChildren(deltaDeg, child, originalNode.children[index]);
        });
        const [originalX, originalY] =
          originalNode.position.getRenderedPositionTuple(width, height);
        const distance = getPositionDistance(swivelX, swivelY, originalX, originalY);
        const originalAngle = getAngleOfChange(
          swivelX,
          swivelY,
          originalX,
          originalY
        );
        const newAngle = originalAngle + deltaDeg;
        const newX = swivelX + (Math.cos(degToRad(newAngle)) * distance);
        const newY = swivelY + (Math.sin(degToRad(newAngle)) * distance);
        node.setPosition(new Vec2(
          newX / width,
          newY / height
        ));
      }
      const { offsetX, offsetY } = event;
      const originalNode = this.targetNode?.clone();
      if (!originalNode) throw new Error("No original node");
      const [originalX, originalY] =
        originalNode.position.getRenderedPositionTuple(width, height);
      const originalAngle = getAngleOfChange(
        swivelX,
        swivelY,
        originalX,
        originalY
      );
      const newAngle = getAngleOfChange(
        swivelX,
        swivelY,
        offsetX,
        offsetY
      );
      const deltaAngle = newAngle - originalAngle;
      rotateWithChildren(deltaAngle, this.targetNode, originalNode);
      this.repaint();
    }
  }

  handleMouseDown(event) {
    if (!this.targetNode) return;
    if (event.button === 0) {
      this.targetNodeActive = true;
      this.mouseDownInitialValues = {
        x: event.offsetX,
        y: event.offsetY,
        originalParentNode: null,
        originalNodeRoot: this.targetNode.objectRootNode.clone(),
      };
      if (this.targetNode.parent)
        this.mouseDownInitialValues.originalParentNode = this.targetNode.parent.clone();
    }
  }

  handleMouseUp(event) {
    if (!this.targetNodeActive) return;
    this.targetNodeActive = false;
    this.mouseDownInitialValues = null;
    this.updateCurrentFramePreview();
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