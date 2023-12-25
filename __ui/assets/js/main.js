// ui/__src/ElementBuilder.ts
var buildFramePreview = (frame, index = 0, selectedIndex = null) => {
  const template = document.querySelector("#framePreviewTemplate");
  if (!template) {
    throw new Error(`Cannot find template: #framePreviewTemplate`);
  }
  const node = template.content.cloneNode(true);
  const container = node.querySelector(".framePreviewContainer");
  const framePreview = node.querySelector(".framePreview");
  const noPreview = node.querySelector(".noPreview");
  const isSelected = index === selectedIndex;
  if (!container || !framePreview || !noPreview) {
    throw new Error("Cannot build frame preview: missing template components");
  }
  const setFrameIndex = (e) => {
    window.dispatchEvent(new CustomEvent("SWIVEL::framechange", {
      detail: { index }
    }));
  };
  container.setAttribute("data-frame-index", index.toString());
  if (frame.previewImage) {
    framePreview.src = frame.previewImage;
    framePreview.alt = `Frame ${index + 1}`;
    framePreview.addEventListener("click", setFrameIndex);
    noPreview.remove();
    if (isSelected) {
      framePreview.style.borderBottom = `5px solid green`;
      framePreview.style.borderTop = `5px solid green`;
    }
  } else {
    noPreview.addEventListener("click", setFrameIndex);
    framePreview.remove();
  }
  return node;
};

// ui/__src/Vec2.ts
class Vec2 {
  x;
  y;
  constructor(x = 0.5, y = 0.5) {
    this.x = x;
    this.y = y;
  }
  getRenderedPosition(width, height) {
    return {
      x: this.x * width,
      y: this.y * height
    };
  }
  getRenderedPositionTuple(width, height) {
    const { x, y } = this.getRenderedPosition(width, height);
    return [x, y];
  }
  toSerializableObject() {
    return {
      x: this.x,
      y: this.y
    };
  }
  clone() {
    const clone = new Vec2(this.x, this.y);
    return clone;
  }
}

// ui/__src/ObjectNode.ts
class ObjectNode {
  parent;
  position;
  children;
  size;
  constructor() {
    this.parent = null;
    this.position = new Vec2;
    this.children = [];
    this.size = 5;
  }
  get isRoot() {
    return !this.parent;
  }
  get objectRootNode() {
    let root = this;
    while (root.parent) {
      root = root.parent;
    }
    return root;
  }
  appendChild(child) {
    child.parent = this;
    this.children.push(child);
  }
  setPosition(pos) {
    this.position = pos;
  }
  toSerializableObject() {
    return {
      position: this.position.toSerializableObject(),
      size: this.size,
      children: this.children.map((c) => c.toSerializableObject())
    };
  }
  clone() {
    const clone = new ObjectNode;
    clone.size = this.size;
    clone.setPosition(this.position.clone());
    this.children.forEach((c) => clone.appendChild(c.clone()));
    return clone;
  }
}

// ui/__src/AnimationObject.ts
class AnimationObject {
  root;
  constructor() {
    this.root = new ObjectNode;
  }
  toSerializableObject() {
    return {
      root: this.root.toSerializableObject()
    };
  }
  clone() {
    const clone = new AnimationObject;
    clone.root = this.root.clone();
    return clone;
  }
}

// ui/__src/Frame.ts
var buildDefaultObjects = () => {
  let child, newestChild;
  const objects = [];
  const m = new AnimationObject;
  m.root.setPosition(new Vec2(0.1, 0.69));
  child = new ObjectNode;
  m.root.appendChild(child);
  child.setPosition(new Vec2(0.1, 0.5));
  newestChild = new ObjectNode;
  child.appendChild(newestChild);
  child = newestChild;
  child.setPosition(new Vec2(0.15, 0.58));
  newestChild = new ObjectNode;
  child.appendChild(newestChild);
  child = newestChild;
  child.setPosition(new Vec2(0.2, 0.5));
  newestChild = new ObjectNode;
  child.appendChild(newestChild);
  child = newestChild;
  child.setPosition(new Vec2(0.2, 0.69));
  const a = new AnimationObject;
  a.root.setPosition(new Vec2(0.25, 0.69));
  child = new ObjectNode;
  a.root.appendChild(child);
  child.setPosition(new Vec2(0.275, 0.5));
  newestChild = new ObjectNode;
  child.appendChild(newestChild);
  child = newestChild;
  child.setPosition(new Vec2(0.3, 0.69));
  const t1 = new AnimationObject;
  t1.root.setPosition(new Vec2(0.375, 0.69));
  child = new ObjectNode;
  t1.root.appendChild(child);
  child.setPosition(new Vec2(0.375, 0.5));
  newestChild = new ObjectNode;
  child.appendChild(newestChild);
  newestChild.setPosition(new Vec2(0.35, 0.5));
  newestChild = new ObjectNode;
  child.appendChild(newestChild);
  newestChild.setPosition(new Vec2(0.4, 0.5));
  const t2 = new AnimationObject;
  t2.root.setPosition(new Vec2(0.475, 0.5));
  child = new ObjectNode;
  t2.root.appendChild(child);
  child.setPosition(new Vec2(0.45, 0.5));
  child = new ObjectNode;
  t2.root.appendChild(child);
  child.setPosition(new Vec2(0.5, 0.5));
  child = new ObjectNode;
  t2.root.appendChild(child);
  child.setPosition(new Vec2(0.475, 0.69));
  objects.push(m, a, t1, t2);
  return objects;
};

class Frame {
  previewImage;
  objects;
  constructor() {
    this.previewImage = null;
    this.objects = buildDefaultObjects();
  }
  toSerializableObject() {
    return {
      previewImage: this.previewImage,
      objects: this.objects.map((o) => o.toSerializableObject())
    };
  }
  clone() {
    const clone = new Frame;
    clone.objects = this.objects.map((o) => o.clone());
    return clone;
  }
}

// ui/__src/SwivelProject.ts
class SwivelProject {
  id;
  name;
  width;
  height;
  frames;
  fps;
  backgroundColor;
  constructor() {
    this.id = crypto.randomUUID();
    this.frames = new Array(1).fill(new Frame);
    this.width = 1920;
    this.height = 1080;
    this.fps = 10;
    this.name = "Untitled Project";
    this.backgroundColor = "#ffffff";
  }
  get aspectRatio() {
    return this.width / this.height;
  }
  serialize() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      fps: this.fps,
      frames: this.frames.map((f) => f.toSerializableObject())
    });
  }
}

// ui/__src/Tauri.ts
var Tauri_default = window.__TAURI__ || null;

// ui/__src/UIManager.ts
var startFullscreenLoading = (message = "", skipAnimation = false) => {
  let loader = document.querySelector("#fullscreenLoader");
  if (loader)
    return;
  loader = document.createElement("div");
  loader.id = "fullscreenLoader";
  loader.classList.add("off");
  document.body.appendChild(loader);
  const spinner = document.createElement("div");
  spinner.classList.add("loader");
  loader.appendChild(spinner);
  loader.addEventListener("click", (e) => e.stopPropagation());
  if (message) {
    const msg = document.createElement("div");
    msg.innerHTML = message;
    msg.classList.add("loadingMessage");
    loader.appendChild(msg);
  }
  if (skipAnimation) {
    loader.classList.remove("off");
    loader.classList.add("on");
    return;
  }
  setTimeout(() => {
    if (!loader)
      return;
    loader.classList.remove("off");
    loader.classList.add("on");
  }, 10);
};
var stopFullscreenLoading = () => {
  const loader = document.querySelector("#fullscreenLoader");
  if (!loader)
    return;
  loader.classList.remove("on");
  loader.classList.add("off");
  setTimeout(() => {
    loader.remove();
  }, 255);
};

// ui/__src/Utils.ts
var debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, timeout);
  };
};
var clamp = (val, min, max) => Math.min(Math.max(val, min), max);
var degToRad = (deg) => deg * (Math.PI / 180);
var radToDeg = (rad) => rad * (180 / Math.PI);
var getPositionDistance = (x1, y1, x2, y2) => {
  const deltaX = Math.abs(x2 - x1);
  const deltaY = Math.abs(y2 - y1);
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
};
var getAngleOfChange = (x1, y1, x2, y2) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  let angle = radToDeg(Math.atan(Math.abs(deltaY) / Math.abs(deltaX)));
  let quadrantOffset = 0;
  let quadrant = 1;
  if (deltaX < 0 && deltaY > 0) {
    quadrant = 2;
    quadrantOffset = 90;
  }
  if (deltaX <= 0 && deltaY <= 0) {
    quadrant = 3;
    quadrantOffset = 180;
  }
  if (deltaX > 0 && deltaY < 0) {
    quadrant = 4;
    quadrantOffset = 270;
  }
  if (quadrant === 2 || quadrant === 4) {
    angle = 90 - angle;
  }
  return angle + quadrantOffset;
};
var calculateAdjacentIndices = (index, width, height) => {
  const map = {
    top: null,
    left: null,
    right: null,
    bottom: null
  };
  if (index % width !== 0)
    map.left = index - 1;
  if (index % width !== width - 1)
    map.right = index + 1;
  if (index >= width)
    map.top = index - width;
  if (index < width * height - 1 - width)
    map.bottom = index + width;
  return map;
};

// ui/__src/SwivelAnimator.ts
class SwivelAnimator {
  project;
  currentFrameIndex;
  allControlNodes;
  targetNode;
  targetNodeActive;
  mouseDownInitialValues;
  playing;
  lastFrameTime;
  webmode;
  canvas;
  playButton;
  addFrameButton;
  canvasContainer;
  framesEle;
  projectNameInput;
  projectWidthInput;
  projectHeightInput;
  backgroundColorInput;
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
    this.registerElements();
    this.updateForms();
    this.repaint();
  }
  initializeData() {
    this.project = new SwivelProject;
    this.currentFrameIndex = 0;
    this.allControlNodes = [];
    this.targetNode = null;
    this.targetNodeActive = false;
    this.mouseDownInitialValues = null;
    this.playing = false;
    this.lastFrameTime = null;
    this.webmode = false;
  }
  registerElements() {
    Object.entries({
      canvas: "canvas",
      playButton: "#play",
      addFrameButton: "#addFrame",
      canvasContainer: "#canvasContainer",
      framesEle: "#frames",
      projectNameInput: "#projectName",
      projectWidthInput: "#projectWidth",
      projectHeightInput: "#projectHeight",
      backgroundColorInput: "#backgroundColor"
    }).forEach(([propertyName, elementSelector]) => {
      const ele = document.querySelector(elementSelector);
      if (!ele)
        throw new Error(`SwivelAnimator is missing critical elements: ${propertyName} - ${elementSelector} `);
      this[propertyName] = ele;
    });
  }
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
    this.playButton.addEventListener("click", (e) => this.togglePlayback(e));
    this.projectNameInput.addEventListener("change", (e) => this.handleProjectNameChange(e));
    this.projectWidthInput.addEventListener("change", (e) => this.handleProjectDimensionChange(e));
    this.projectHeightInput.addEventListener("change", (e) => this.handleProjectDimensionChange(e));
    this.backgroundColorInput.addEventListener("change", (e) => this.updateBackgroundColor(e));
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
  drawCurrentFrameToCanvas(canvas, previewMode = false) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Context unavailable");
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = this.project.backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.allControlNodes = [];
    const connectNodeToChildren = (node, controllable = true) => {
      node.children.forEach((child) => {
        if (child.children.length)
          connectNodeToChildren(child, controllable);
        if (controllable)
          this.allControlNodes.push(child);
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
    };
    if (!this.playing && this.currentFrameIndex && !previewMode) {
      const prevFrame = this.project.frames[this.currentFrameIndex - 1];
      prevFrame.objects.forEach((object) => {
        const { root } = object;
        connectNodeToChildren(root, false);
      });
    }
    const frame = this.currentFrame;
    frame.objects.forEach((object) => {
      const { root } = object;
      connectNodeToChildren(root);
      this.allControlNodes.push(root);
    });
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
  buildCanvas() {
    const {
      width: containerWidth,
      height: containerHeight
    } = this.canvasContainer.getBoundingClientRect();
    const containerPadding = 20;
    const maxContainerWidth = containerWidth - containerPadding * 2;
    const maxContainerHeight = containerHeight - containerPadding * 2;
    let width = 50;
    let height = 50;
    if (this.project.aspectRatio > 1) {
      width = maxContainerWidth;
      height = maxContainerWidth / this.project.aspectRatio;
    } else {
      height = maxContainerHeight;
      width = maxContainerHeight * this.project.aspectRatio;
    }
    this.canvas.width = width;
    this.canvas.height = height;
    this.drawCurrentFrameToCanvas(this.canvas);
  }
  renderFramePreviews() {
    this.framesEle.innerHTML = "";
    this.project.frames.forEach((frame, index) => {
      this.framesEle.appendChild(buildFramePreview(frame, index, this.currentFrameIndex));
    });
    if (!this.currentFrame.previewImage)
      this._updateCurrentFramePreview();
  }
  addFrame(event) {
    this.playing = false;
    this.project.frames.push(this.currentFrame.clone());
    this.currentFrameIndex = this.project.frames.length - 1;
    this.repaint();
  }
  updateFramePreview(index) {
    const canvas = document.createElement("canvas");
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
    if (!this.playing)
      return;
    window.requestAnimationFrame(() => this.playAnimation());
    const currentTime = new Date;
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
    if (this.playing)
      return;
    if (!this.targetNodeActive) {
      let clickable = false;
      const { offsetX, offsetY } = event;
      const { width, height } = this.canvas;
      for (let i = 0;i < this.allControlNodes.length; i++) {
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
      if (clickable) {
        this.canvas.classList.add("clickable");
      } else {
        this.canvas.classList.remove("clickable");
        this.targetNode = null;
      }
    } else if (this.targetNode?.isRoot) {
      const { offsetX, offsetY } = event;
      const { width, height } = this.canvas.getBoundingClientRect();
      const mouseX = clamp(offsetX, 0, width);
      const mouseY = clamp(offsetY, 0, height);
      if (!this.mouseDownInitialValues)
        throw new Error("No initial values for the mouse");
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
        node.setPosition(new Vec2(newX / width, newY / height));
      };
      moveWithChildren(this.targetNode, originalNodeRoot);
      this.repaint();
    } else {
      const { width, height } = this.canvas;
      const swivelPoint = this.targetNode?.parent || undefined;
      if (!swivelPoint)
        throw new Error("No valid swivel point");
      const [swivelX, swivelY] = swivelPoint.position.getRenderedPositionTuple(width, height);
      const rotateWithChildren = (deltaDeg, node, originalNode2) => {
        node.children.forEach((child, index) => {
          rotateWithChildren(deltaDeg, child, originalNode2.children[index]);
        });
        const [originalX2, originalY2] = originalNode2.position.getRenderedPositionTuple(width, height);
        const distance = getPositionDistance(swivelX, swivelY, originalX2, originalY2);
        const originalAngle2 = getAngleOfChange(swivelX, swivelY, originalX2, originalY2);
        const newAngle2 = originalAngle2 + deltaDeg;
        const newX = swivelX + Math.cos(degToRad(newAngle2)) * distance;
        const newY = swivelY + Math.sin(degToRad(newAngle2)) * distance;
        node.setPosition(new Vec2(newX / width, newY / height));
      };
      const { offsetX, offsetY } = event;
      const originalNode = this.targetNode?.clone();
      if (!originalNode)
        throw new Error("No original node");
      const [originalX, originalY] = originalNode.position.getRenderedPositionTuple(width, height);
      const originalAngle = getAngleOfChange(swivelX, swivelY, originalX, originalY);
      const newAngle = getAngleOfChange(swivelX, swivelY, offsetX, offsetY);
      const deltaAngle = newAngle - originalAngle;
      rotateWithChildren(deltaAngle, this.targetNode, originalNode);
      this.repaint();
    }
  }
  handleMouseDown(event) {
    if (!this.targetNode)
      return;
    if (event.button === 0) {
      this.targetNodeActive = true;
      this.mouseDownInitialValues = {
        x: event.offsetX,
        y: event.offsetY,
        originalParentNode: null,
        originalNodeRoot: this.targetNode.objectRootNode.clone()
      };
      if (this.targetNode.parent)
        this.mouseDownInitialValues.originalParentNode = this.targetNode.parent.clone();
    }
  }
  handleMouseUp(event) {
    if (!this.targetNodeActive)
      return;
    this.targetNodeActive = false;
    this.mouseDownInitialValues = null;
    this.updateCurrentFramePreview();
  }
  handleResize(event) {
    this.repaint();
  }
  async handleInitSave(event) {
    if (!Tauri_default) {
      throw new Error("cant save yet");
    }
    startFullscreenLoading("Saving");
    await new Promise((res) => setTimeout(res, 1000));
    const projectData = this.project.serialize();
    const { invoke } = Tauri_default.tauri;
    const saveSuccess = await invoke("save_project", { projectData });
    stopFullscreenLoading();
  }
  async handleInitExport(event) {
    if (!Tauri_default) {
      throw new Error("cant save yet");
    }
    startFullscreenLoading("Exporting");
    await new Promise((res) => setTimeout(res, 1000));
    const projectData = this.project.serialize();
    const { invoke } = Tauri_default.tauri;
    const saveSuccess = await invoke("export_project", { projectData });
    stopFullscreenLoading();
  }
  async handleInitNew(event) {
    startFullscreenLoading("Setting Up New Project");
    await new Promise((res) => setTimeout(res, 1000));
    this.setupNewProject();
    stopFullscreenLoading();
  }
  handleFrameChange(event) {
    const { index } = event.detail;
    this.currentFrameIndex = index;
    this.repaint();
  }
}

// ui/__src/targets/main.ts
(async () => {
  setTimeout(stopFullscreenLoading, 1000);
  const animator = new SwivelAnimator;
  if (Tauri_default) {
    const { listen } = Tauri_default.event;
    listen("SWIVEL::SWITCH_TOOLS", (e) => {
      const { name } = e.payload;
      console.log(name);
      window.location.href = name === "index" ? "/" : `/${name}.html`;
    });
  }
})();
