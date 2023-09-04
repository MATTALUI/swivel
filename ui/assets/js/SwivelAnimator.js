function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

class SwivelAnimator {
  constructor() {
    this.initializeData();
    this.registerElements();
    this.buildCanvas();
    this.renderFramePreviews();
    this.registerEventListeners();
  }

  get aspectRatio() {
    return this.width / this.height;
  }

  get currentFrame() {
    return this.frames[this.currentFrameIndex];
  }

  initializeData() {
    this.frames = new Array(1).fill(new Frame());
    this.currentFrameIndex = 0;
    this.width = 1920;
    this.height = 1080;
    this.allControlNodes = [];
    this.targetNode = null;
    this.targetNodeActive = false;
    this.mouseDownInitialValues = null;
  }

  registerElements() {
    this.canvas = document.querySelector("canvas");
    this.canvasContainer = document.querySelector("#canvasContainer");
    this.framesEle = document.querySelector("#frames");
  }

  registerEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMovement(e));
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    window.addEventListener("resize", (e) => this.handleResize(e));
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
    const connectNodeToChildren = (node) => {
      node.children.forEach((child) => {
        if (child.children.length) connectNodeToChildren(child);
        this.allControlNodes.push(child);
        const { x: startX, y: startY } = child.position.getRenderedPosition(width, height);
        const { x: endX, y: endY } = node.position.getRenderedPosition(width, height);


        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = child.size;
        ctx.lineCap = "round";
        ctx.stroke();

      });
    }
    frame.objects.forEach((object) => {
      const { root } = object;
      connectNodeToChildren(root);
      // We're adding the roots to this list, but I suspect there might come a
      // time when we might want these to be separate
      this.allControlNodes.push(root);
    });

    this.allControlNodes.forEach(({ position, isRoot }) => {
      const { x, y } = position.getRenderedPosition(width, height);
      ctx.beginPath();
      ctx.arc(x, y, 6.9, 0, 2 * Math.PI);
      ctx.fillStyle = isRoot ? "#ff8000" : "#bf0404";
      ctx.fill();
    });
  }

  renderFramePreviews() {
    this.frames.forEach((frame, index) => {
      this.framesEle.appendChild(ElementBuilder.buildFramePreview(frame, index));
    });
    if (!this.currentFrame.previewImage) this._updateCurrentFramePreview();
  }

  _updateCurrentFramePreview() {
    const url = this.canvas.toDataURL();
    const container = document.querySelector(`.framePreviewContainer[data-frame-index="${this.currentFrameIndex}"]`);
    const noPreview = container.querySelector(".noPreview");
    this.currentFrame.previewImage = url;
    if (noPreview) {
      container.replaceWith(ElementBuilder.buildFramePreview(this.currentFrame, this.currentFrameIndex));
    } else {
      container.querySelector(".framePreview").setAttribute("src", url);
    }
  }

  updateCurrentFramePreview = debounce(() => this._updateCurrentFramePreview(), 500);

  handleMouseMovement(event) {
    // Interactions are currently just and FSM controlled by a nullable string.
    // In order to determine what we should do with the mouse movement we check
    // the `interactionState`. I suspect that this could do with some more
    // in-depth engineering when needs get more complex.

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

  handleResize(e) {
    this.buildCanvas();
  }
}