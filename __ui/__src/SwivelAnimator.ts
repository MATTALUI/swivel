import { buildFramePreview } from "./ElementBuilder";
import ObjectNode from "./ObjectNode";
import SwivelProject from "./SwivelProject";
import Tauri from "./Tauri";
import { startFullscreenLoading, stopFullscreenLoading } from "./UIManager";
import { clamp, debounce, degToRad, getAngleOfChange, getPositionDistance } from "./Utils";
import Vec2 from "./Vec2";

export default class SwivelAnimator {
  // App Data
  project: SwivelProject;
  currentFrameIndex: number;
  allControlNodes: ObjectNode[];
  targetNode: ObjectNode | null;
  targetNodeActive: boolean;
  mouseDownInitialValues: {
    x: number;
    y: number;
    originalParentNode: ObjectNode | null;
    originalNodeRoot: ObjectNode;
  } | null;
  playing: boolean;
  lastFrameTime: Date | null;
  webmode: boolean;
  // UI Elements
  canvas: HTMLCanvasElement;
  playButton: HTMLButtonElement;
  addFrameButton: HTMLButtonElement;
  canvasContainer: HTMLDivElement;
  framesEle: HTMLDivElement;
  projectNameInput: HTMLInputElement;
  projectWidthInput: HTMLInputElement;
  projectHeightInput: HTMLInputElement;
  backgroundColorInput: HTMLInputElement;

  constructor() {
    this.setupNewProject();
    this.registerEventListeners();
    this.registerTauriEventListeners();
  }

  get currentFrame() {
    return this.project.frames[this.currentFrameIndex];
  }

  setupNewProject() {
    this.initializeData();
    // this.registerElements();
    this.updateForms();
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

  // registerElements() {
  //   Object.entries({
  //     canvas: "canvas",
  //     playButton: "#play",
  //     addFrameButton: "#addFrame",
  //     canvasContainer: "#canvasContainer",
  //     framesEle: "#frames",
  //     projectNameInput: "#projectName",
  //     projectWidthInput: "#projectWidth",
  //     projectHeightInput: "#projectHeight",
  //     backgroundColorInput: "#backgroundColor",
  //   }).forEach(([propertyName, elementSelector]) => {
  //     const ele = document.querySelector(elementSelector);
  //     if (!ele) throw new Error(`SwivelAnimator is missing critical elements: ${propertyName} - ${elementSelector} `);
  //     this[propertyName] = ele;
  //   });
  // }

  repaint() {
    this.buildCanvas();
    this.renderFramePreviews();
  }

  updateForms() {
    this.projectNameInput.value = this.project.name || "Untitled Project";
    this.projectWidthInput.value = (this.project.width || 1920).toString();
    this.projectHeightInput.value = (this.project.height || 1080).toString();
    this.backgroundColorInput.value = this.project.backgroundColor || "#ffffff";
  }

  registerEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMovement(e));
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    this.addFrameButton.addEventListener("click", (e) => this.addFrame(e));
    this.playButton.addEventListener("click", (e) => this.togglePlayback(e))
    this.projectNameInput.addEventListener("change", (e) => this.handleProjectNameChange(e));
    this.projectWidthInput.addEventListener("change", (e) => this.handleProjectDimensionChange(e));
    this.projectHeightInput.addEventListener("change", (e) => this.handleProjectDimensionChange(e));
    this.backgroundColorInput.addEventListener("change", (e) => this.updateBackgroundColor(e))
    window.addEventListener("resize", (e) => this.handleResize(e));
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

  drawCurrentFrameToCanvas(canvas: HTMLCanvasElement, previewMode = false) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Context unavailable");
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw in the background color
    ctx.fillStyle = this.project.backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Create a registry of just the points that we can build as we go so that
    // we can draw the control points on top of all the lines at the end without having to recurse again
    this.allControlNodes = [];
    const connectNodeToChildren = (node, controllable = true) => {
      node.children.forEach((child) => {
        if (child.children.length) connectNodeToChildren(child, controllable);
        if (controllable) this.allControlNodes.push(child);
        const { x: startX, y: startY } = child.position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
        const { x: endX, y: endY } = node.position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
        const alpha = controllable ? 1 : 0.5;


        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = child.size;
        ctx.lineCap = "round";
        ctx.stroke();

      });
    }
    // Draw the onion skins
    if (!this.playing && this.currentFrameIndex && !previewMode) {
      const prevFrame = this.project.frames[this.currentFrameIndex - 1];
      prevFrame.objects.forEach((object) => {
        const { root } = object;
        connectNodeToChildren(root, false);
      });
    }
    // Draw the scene objects
    const frame = this.currentFrame;
    frame.objects.forEach((object) => {
      const { root } = object;
      connectNodeToChildren(root);
      // We're adding the roots to this list, but I suspect there might come a
      // time when we might want these to be separate
      this.allControlNodes.push(root);
    });
    // Draw control nodes
    if (!this.playing && !previewMode) {
      this.allControlNodes.forEach(({ position, isRoot }) => {
        if (!ctx) {
          throw new Error("Context unavailable");
        }
        const { x, y } = position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.arc(x, y, 6.9, 0, 2 * Math.PI);
        ctx.fillStyle = isRoot ? "#ff8000" : "#bf0404";
        ctx.fill();
      });
    }
  }

  // buildCanvas() {
  //   const {
  //     width: containerWidth,
  //     height: containerHeight
  //   } = this.canvasContainer.getBoundingClientRect();
  //   const containerPadding = 20;
  //   const maxContainerWidth = containerWidth - (containerPadding * 2);
  //   const maxContainerHeight = containerHeight - (containerPadding * 2);

  //   let width = 50;
  //   let height = 50;
  //   if (this.project.aspectRatio > 1) {
  //     width = maxContainerWidth;
  //     height = maxContainerWidth / this.project.aspectRatio;
  //   } else {
  //     height = maxContainerHeight;
  //     width = maxContainerHeight * this.project.aspectRatio;
  //   }
  //   this.canvas.width = width;
  //   this.canvas.height = height;

  //   this.drawCurrentFrameToCanvas(this.canvas);
  // }

  renderFramePreviews() {
    this.framesEle.innerHTML = "";
    this.project.frames.forEach((frame, index) => {
      this.framesEle.appendChild(buildFramePreview(frame, index, this.currentFrameIndex));
    });
    if (!this.currentFrame.previewImage) this._updateCurrentFramePreview();
  }

  addFrame(event) {
    this.playing = false;
    this.project.frames.push(this.currentFrame.clone());
    this.currentFrameIndex = this.project.frames.length - 1;
    this.repaint();
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

  togglePlayback(event) {
    this.playButton.innerHTML = this.playing ? "PLAY" : "STOP";
    this.playing = !this.playing;
    if (!this.playing)
      this.repaint();
    if (this.playing)
      window.requestAnimationFrame(() => this.playAnimation());
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

  handleProjectNameChange(event) {
    const newVal = event.target.value;
    this.project.name = newVal;
    this.updateForms();
  }

  handleProjectDimensionChange(event) {
    const widthRawVal = +this.projectWidthInput.value;
    const heightRawVal = +this.projectHeightInput.value;
    const widthVal = isNaN(widthRawVal) ? this.project.width : widthRawVal;
    const heightVal = isNaN(heightRawVal) ? this.project.height : heightRawVal;
    this.project.width = widthVal;
    this.project.height = heightVal;
    this.updateForms();
    this.repaint();
  }

  updateBackgroundColor(event) {
    this.project.backgroundColor = event.target.value;
    this.project.frames.forEach((_, i) => this.updateFramePreview(i));
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

  handleResize(event) {
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

  handleFrameChange(event) {
    const { index } = event.detail;
    this.currentFrameIndex = index;
    this.repaint();
  }
}