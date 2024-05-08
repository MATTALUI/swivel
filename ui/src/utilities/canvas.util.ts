import Color from "color";
import Frame from "../models/Frame";
import ObjectNode from "../models/ObjectNode";
import { ObjectNodeTypes, SelectionType } from "../types";
import AnimationObject from "../models/AnimationObject";
import globalState from "../state";
import { degToRad, getAngleOfChange, getPositionDistance, radToDeg } from "./calculations.util";

const ROOT_NODE_COLOR = "#ff8000";
const NODE_COLOR = "#bf0404";
interface IDrawFrameToCanvasOptions {
  /** set to true when canvas should be drawn without controls or helpers, like
   * nodes and guidelines */
  preview?: boolean;
  /** the amount of pixels to adjust all nodes that get drawn to the canvas */
  pixelOffset?: { x: number; y: number; };
  /** The dimensions to use for canvas calculations when a shift is needed */
  canvasDimensions?: { width: number; height: number; };
}
export const drawFrameToCanvas = (
  canvas: HTMLCanvasElement,
  frame: Frame,
  options: IDrawFrameToCanvasOptions = {},
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Context unavailable");
  }
  const resourcesById = globalState.mediaResources.byId;
  const shouldDrawHelpers = !globalState.animator.isPlaying && !options.preview;
  // These checks simply will mark these pieces of state as dependencies
  globalState.project.width;
  globalState.project.height;
  // Clear it out
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw in the background color
  ctx.fillStyle = frame.backgroundColor || globalState.project.backgroundColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Create a registry of just the points that we can build as we go so that
  // we can draw the control points on top of all the lines at the end without having to recurse again
  const allControlNodes: ObjectNode[] = [];
  const connectNodeToChildren = (node: ObjectNode, controllable = true) => {
    node.children.forEach((child) => {
      if (child.children.length) connectNodeToChildren(child, controllable);
      if (controllable) allControlNodes.push(child); // Children nodes
      switch (child.type) {
      case ObjectNodeTypes.IMAGE: {
        if (!resourcesById) return; // Still waiting on resources
        const { x: parentX, y: parentY } = node.position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
        const { x: controllerX, y: controllerY } = child.position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
        const imageResource = resourcesById[child.image || "🦖"];
        if (!imageResource || !imageResource.element) {
          console.error("Image resource is missing or unloaded: ", child.image);
          if (!child.width || !child.height) {
            console.error("Missing a dimension; child can not be drawn");
            return;
          }
        }

        const imageWidth = imageResource?.width || child.width || 1;
        const imageHeight = imageResource?.height || child.height || 1;
        const imageDiagonal = getPositionDistance(0, 0, imageWidth, imageHeight);
        const renderedDiagonal = getPositionDistance(parentX, parentY, controllerX, controllerY);
        const renderedWidth = imageWidth * renderedDiagonal / imageDiagonal;
        const renderedHeight = imageHeight * renderedDiagonal / imageDiagonal;
        const naturalRotation = 360 - radToDeg(Math.atan(imageHeight / imageWidth));
        const actualRotation = 360 - getAngleOfChange(parentX, parentY, controllerX, controllerY);
        const angleDifferential = naturalRotation - actualRotation;

        if (!controllable) ctx.globalAlpha = 0.5;
        // Move to the parent node for easier drawing
        ctx.translate(parentX, parentY);
        ctx.rotate(degToRad(angleDifferential));
        ctx.fillStyle = "#3E2F5B33";
        ctx.rect(0, 0, renderedWidth, renderedHeight);
        if (imageResource?.element)
          ctx.drawImage(imageResource.element, 0, 0, renderedWidth, renderedHeight);
        ctx.fill();
        // Move back to origin
        ctx.rotate(-degToRad(angleDifferential));
        ctx.translate(-parentX, -parentY);
        ctx.globalAlpha = 1.0;
        break;
      }
      default: {
        const alpha = controllable ? 1 : 0.5;
        const { x: _startX, y: _startY } = child.position.getRenderedPosition(
          options.canvasDimensions?.width ?? ctx.canvas.width,
          options.canvasDimensions?.height ?? ctx.canvas.height
        );
        const { x: _endX, y: _endY } = node.position.getRenderedPosition(
          options.canvasDimensions?.width ?? ctx.canvas.width,
          options.canvasDimensions?.height ?? ctx.canvas.height
        );

        const startX = _startX + (options.pixelOffset?.x || 0);
        const startY = _startY + (options.pixelOffset?.y || 0);
        const endX = _endX + (options.pixelOffset?.x || 0);
        const endY = _endY + (options.pixelOffset?.y || 0);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = child.size;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      }
    });
  };
  // Draw the onion skins
  if (shouldDrawHelpers && frame.index) {
    const allFrames = globalState.project.frames;
    const prevFrame = allFrames[frame.index - 1];
    prevFrame.objects.forEach((object) => {
      const { root } = object;
      connectNodeToChildren(root, false);
    });
  }
  // Draw the scene objects
  frame.objects.forEach((object) => {
    const { root } = object;
    connectNodeToChildren(root);
    // We're adding the roots to this list, but I suspect there might come a
    // time when we might want these to be separate
    allControlNodes.push(root); // Root nodes
  });
  if (shouldDrawHelpers) {
    allControlNodes.forEach(({ position, isRoot }) => {
      if (!ctx) {
        throw new Error("Context unavailable");
      }
      const { x, y } = position.getRenderedPosition(
        options.canvasDimensions?.width ?? ctx.canvas.width,
        options.canvasDimensions?.height ?? ctx.canvas.height
      );
      ctx.beginPath();
      ctx.arc(
        x + (options.pixelOffset?.x || 0),
        y + (options.pixelOffset?.y || 0),
        6.9,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = isRoot ? ROOT_NODE_COLOR : NODE_COLOR;
      ctx.fill();
    });
    const selection = globalState.animator.selectedObjects;
    if (selection?.type === SelectionType.ANIMATION_OBJECT) {
      const drawNodes = (node: ObjectNode) => {
        const { x, y } = node.position.getRenderedPosition(
          options.canvasDimensions?.width ?? ctx.canvas.width,
          options.canvasDimensions?.height ?? ctx.canvas.height
        );
        ctx.beginPath();
        ctx.arc(
          x + (options.pixelOffset?.x || 0),
          y + (options.pixelOffset?.y || 0),
          2.9,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = node.isRoot
          ? Color(ROOT_NODE_COLOR).negate().hex()
          : Color(NODE_COLOR).negate().hex();
        ctx.fill();
        node.children.forEach(n => drawNodes(n));
      };

      selection.objectIds.forEach((id) => {
        const object = frame.objects.find(o => o.id === id);
        if (object) drawNodes(object.root);
      });
    }

  }
};

export const getFramePreviewUrl = (frame: Frame) => {
  const canvas = document.createElement("canvas");
  canvas.width = globalState.project.width;
  canvas.height = globalState.project.height;
  drawFrameToCanvas(canvas, frame, {
    preview: true,
  });

  return canvas.toDataURL();
};

export const getMainCanvas = () => {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas");
  if (!canvas) throw new Error("Can't find the main canvas!");

  return canvas;
};

export const drawAnimationObjectToCanvas = (
  object: AnimationObject,
  canvas: HTMLCanvasElement,
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Context unavailable");
  // Clear it out
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const resourcesById = globalState.mediaResources.byId || {};

  const allControlNodes: ObjectNode[] = [];
  const connectNodeToChildren = (node: ObjectNode, controllable = true) => {
    node.children.forEach((child) => {
      if (child.children.length) connectNodeToChildren(child, controllable);
      if (controllable) allControlNodes.push(child); // Children nodes
      const { x: parentX, y: parentY } = child.position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
      const { x: childX, y: childY } = node.position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
      switch (child.type) {
      case ObjectNodeTypes.IMAGE: {
        if (!resourcesById) return; // Still waiting on resources
        const imageResource = resourcesById[child.image || "🦖"];
        if (!imageResource || !imageResource.element) {
          if (!child.width || !child.height) {
            ctx.fillStyle = "#3E2F5B33";
            ctx.rect(parentX, parentY, childX - parentX, childY - parentY);
            ctx.fill();
            return;
          }
        }

        const imageWidth = imageResource?.width || child.width || 1;
        const imageHeight = imageResource?.height || child.height || 1;
        const imageDiagonal = getPositionDistance(0, 0, imageWidth, imageHeight);
        const renderedDiagonal = getPositionDistance(parentX, parentY, childX, childY);
        const renderedWidth = imageWidth * renderedDiagonal / imageDiagonal;
        const renderedHeight = imageHeight * renderedDiagonal / imageDiagonal;
        const naturalRotation = 360 - radToDeg(Math.atan(imageHeight / imageWidth));
        const actualRotation = 360 - getAngleOfChange(parentX, parentY, childX, childY);
        const angleDifferential = naturalRotation - actualRotation;

        if (!controllable) ctx.globalAlpha = 0.5;
        // Move to the parent node for easier drawing
        ctx.translate(parentX, parentY);
        ctx.rotate(degToRad(angleDifferential));
        ctx.fillStyle = "#3E2F5B33";
        ctx.rect(0, 0, renderedWidth, renderedHeight);
        ctx.fill();
        if (imageResource?.element)
          ctx.drawImage(imageResource.element, 0, 0, renderedWidth, renderedHeight);
          // Move back to origin
        ctx.rotate(-degToRad(angleDifferential));
        ctx.translate(-parentX, -parentY);
        ctx.globalAlpha = 1.0;
        break;
      }
      default: {
        const alpha = controllable ? 1 : 0.5;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.moveTo(parentX, parentY);
        ctx.lineTo(childX, childY);
        ctx.lineWidth = child.size;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      }

    });
  };
  const { root } = object;
  connectNodeToChildren(root);
  // We're adding the roots to this list, but I suspect there might come a
  // time when we might want these to be separate
  allControlNodes.push(root); // Root nodes
  allControlNodes.forEach((node) => {
    if (!ctx) {
      throw new Error("Context unavailable");
    }
    const { position, isRoot, id } = node;
    const { x, y } = position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 6.9, 0, 2 * Math.PI);
    ctx.fillStyle = isRoot ? ROOT_NODE_COLOR : NODE_COLOR;
    ctx.fill();

    if (
      globalState.animator.selectedObjects &&
      globalState.animator.selectedObjects.type === SelectionType.NODE &&
      globalState.animator.selectedObjects.objectIds.includes(id)
    ) {
      ctx.beginPath();
      ctx.arc(x, y, 2.9, 0, 2 * Math.PI);
      ctx.fillStyle = isRoot
        ? Color(ROOT_NODE_COLOR).negate().hex()
        : Color(NODE_COLOR).negate().hex();
      ctx.fill();
    }
  });
};