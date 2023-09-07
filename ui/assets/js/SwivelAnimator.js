class SwivelAnimator {
  constructor() {
    this.setupNewProject();
    this.registerEventListeners();
    this.registerTauriEventListeners();
  }

  get aspectRatio() {
    return this.width / this.height;
  }

  get currentFrame() {
    return this.frames[this.currentFrameIndex];
  }

  get isNewProject() {
    return !this.id;
  }

  setupNewProject () {
    this.initializeData();
    this.registerElements();
    this.repaint();
    this.updateForms();
  }

  initializeData() {
    // Project Data
    this.id = null;
    this.frames = new Array(1).fill(new Frame());
    this.width = 1920;
    this.height = 1080;
    this.fps = 10;
    this.name = "Untitled Project";
    // App Data
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
    this.canvas = document.querySelector("canvas");
    this.playButton = document.querySelector("#play");
    this.addFrameButton = document.querySelector("#addFrame");
    this.canvasContainer = document.querySelector("#canvasContainer");
    this.framesEle = document.querySelector("#frames");
    this.projectNameInput = document.querySelector("#projectName");
    this.projectWidthInput = document.querySelector("#projectWidth");
    this.projectHeightInput = document.querySelector("#projectHeight");
  }

  repaint() {
    this.buildCanvas();
    this.renderFramePreviews();
  }

  updateForms() {
    this.projectNameInput.value = this.name || "Untitled Project";
    this.projectWidthInput.value = this.width || 1920;
    this.projectHeightInput.value = this.height || 1080;
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
  }

  buildCanvas() {
    // Set canvas size
    const {
      width: containerWidth,
      height: containerHeight
    } = this.canvasContainer.getBoundingClientRect();
    const containerPadding = 20;
    const maxContainerWidth = containerWidth - (containerPadding * 2);
    const maxContainerHeight = containerHeight - (containerPadding * 2);

    let width = 50;
    let height = 50;
    if (this.aspectRatio > 1) {
      width = maxContainerWidth;
      height = maxContainerWidth / this.aspectRatio;
    } else {
      height = maxContainerHeight;
      width = maxContainerHeight * this.aspectRatio;
    }
    this.canvas.width = width;
    this.canvas.height = height;

    // Draw all points
    const frame = this.currentFrame;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Create a registry of just the points that we can build as we go so that
    // we can draw the control points on top of all the lines at the end without having to recurse again
    this.allControlNodes = [];
    const connectNodeToChildren = (node, controllable = true) => {
      node.children.forEach((child) => {
        if (child.children.length) connectNodeToChildren(child, controllable);
        if (controllable) this.allControlNodes.push(child);
        const { x: startX, y: startY } = child.position.getRenderedPosition(width, height);
        const { x: endX, y: endY } = node.position.getRenderedPosition(width, height);
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
    if (!this.playing && this.currentFrameIndex) {
      const prevFrame = this.frames[this.currentFrameIndex - 1];
      prevFrame.objects.forEach((object) => {
        const { root } = object;
        connectNodeToChildren(root, false);
      });
    }
    frame.objects.forEach((object) => {
      const { root } = object;
      connectNodeToChildren(root);
      // We're adding the roots to this list, but I suspect there might come a
      // time when we might want these to be separate
      this.allControlNodes.push(root);
    });

    if (!this.playing) {
      this.allControlNodes.forEach(({ position, isRoot }) => {
        const { x, y } = position.getRenderedPosition(width, height);
        ctx.beginPath();
        ctx.arc(x, y, 6.9, 0, 2 * Math.PI);
        ctx.fillStyle = isRoot ? "#ff8000" : "#bf0404";
        ctx.fill();
      });
    }
  }

  renderFramePreviews() {
    this.framesEle.innerHTML = "";
    this.frames.forEach((frame, index) => {
      this.framesEle.appendChild(ElementBuilder.buildFramePreview(frame, index, this.currentFrameIndex));
    });
    if (!this.currentFrame.previewImage) this._updateCurrentFramePreview();
  }

  addFrame(event) {
    this.playing = false;
    this.frames.push(this.currentFrame.clone());
    this.currentFrameIndex = this.frames.length - 1;
    this.repaint();
  }

  _updateCurrentFramePreview() {
    const url = this.canvas.toDataURL();
    const container = document.querySelector(`.framePreviewContainer[data-frame-index="${this.currentFrameIndex}"]`);
    const noPreview = container.querySelector(".noPreview");
    this.currentFrame.previewImage = url;
    if (noPreview) {
      container.replaceWith(ElementBuilder.buildFramePreview(this.currentFrame, this.currentFrameIndex, this.currentFrameIndex));
    } else {
      container.querySelector(".framePreview").setAttribute("src", url);
    }
  }

  updateCurrentFramePreview = Utils.debounce(() => this._updateCurrentFramePreview(), 500);

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
      const frameDifferential = msInSecond / this.fps;
      if (currentTime - frameDifferential < this.lastFrameTime)
        return;
    }
    this.lastFrameTime = currentTime;
    this.currentFrameIndex++;
    if (this.currentFrameIndex === this.frames.length)
      this.currentFrameIndex = 0;
    this.repaint();
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      fps: this.fps,
      frames: this.frames.map(f => f.toSerializableObject()),
    });
  }

  handleProjectNameChange(event) {
    const newVal = event.target.value;
    this.name = newVal;
    this.updateForms();
  }

  handleProjectDimensionChange(event) {
    const widthRawVal = +this.projectWidthInput.value;
    const heightRawVal = +this.projectHeightInput.value;
    const widthVal = isNaN(widthRawVal) ? this.width : widthRawVal;
    const heightVal = isNaN(heightRawVal) ? this.height : heightRawVal;
    this.width = widthVal;
    this.height = heightVal;
    this.updateForms();
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
    } else if (this.targetNode.isRoot) {
      // This implementation uses deltas because it means we can calculate
      // movement for all of the nodes without having to know the initial
      // position for the whole object. There are some limitations to this (like
      // location getting slightly lost if the user leaves the canvas). A full
      // absolute implementation would lead to a better experience long term but
      // will require keeping an original copy of the node tree. I want to avoid
      // that until it's worth the effort.
      this.mouseDownInitialValues;
      const moveWithChildren = (node, deltaXPx, deltaYPx) => {
        node.children.forEach(child => moveWithChildren(child, deltaXPx, deltaYPx));
        const { width, height } = this.canvas;
        const deltaX = deltaXPx / width;
        const deltaY = deltaYPx / height;
        node.position.x += deltaX;
        node.position.y += deltaY;
      }
      moveWithChildren(this.targetNode, event.movementX, event.movementY);
      this.buildCanvas();
    }
  }

  handleMouseDown(event) {
    if (!this.targetNode) return;
    if (event.button === 0) {
      this.targetNodeActive = true;
      this.mouseDownInitialValues = {
        x: event.offsetX,
        y: event.offsetY,
        nodeX: this.targetNode.position.x,
        nodeY: this.targetNode.position.y,
      };
    }
  }

  handleMouseUp(event) {
    if (!this.targetNodeActive) return;
    this.targetNodeActive = false;
    this.mouseDownInitialValues = null;
    this.updateCurrentFramePreview();
  }

  handleResize(event) {
    this.buildCanvas();
  }

  async handleInitSave(event) {
    console.log(event.payload);
    UIManager.startFullscreenLoading("Saving");
    await new Promise(res => setTimeout(res, 1000));
    if (this.isNewProject) this.id = crypto.randomUUID();
    const projectData = this.serialize();
    console.log(projectData);
    const { invoke } = window.__TAURI__.tauri;
    const saveSuccess = await invoke("save_project", { projectData });
    console.log(saveSuccess);
    UIManager.stopFullscreenLoading();
  }

  async handleInitNew(event) {
    UIManager.startFullscreenLoading("Setting Up New Project");
    await new Promise(res => setTimeout(res, 1000));
    this.setupNewProject();
    UIManager.stopFullscreenLoading();
  }

  handleFrameChange(event) {
    const { index } = event.detail;
    this.currentFrameIndex = index;
    this.repaint();
  }
}