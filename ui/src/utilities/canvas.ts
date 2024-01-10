import Color from "color";
import Frame from "../models/Frame";
import ObjectNode from "../models/ObjectNode";
import { SelectionType } from "../state/animator.state";
import AnimationObject from "../models/AnimationObject";
import globalState from "../state";

const ROOT_NODE_COLOR = "#ff8000";
const NODE_COLOR = "#bf0404";
interface IDrawFrameToCanvasOptions {
  preview?: boolean;
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
      const { x, y } = position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, 6.9, 0, 2 * Math.PI);
      ctx.fillStyle = isRoot ? ROOT_NODE_COLOR : NODE_COLOR;
      ctx.fill();
    });
    const selection = globalState.animator.selectedObjects;
    if (selection?.type === SelectionType.ANIMATION_OBJECT) {
      const drawNodes = (node: ObjectNode) => {
        const { x, y } = node.position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.arc(x, y, 2.9, 0, 2 * Math.PI);
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
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
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

  const allControlNodes: ObjectNode[] = [];
  const connectNodeToChildren = (node: ObjectNode, controllable = true) => {
    node.children.forEach((child) => {
      if (child.children.length) connectNodeToChildren(child, controllable);
      if (controllable) allControlNodes.push(child); // Children nodes
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
  const { root } = object;
  connectNodeToChildren(root);
  // We're adding the roots to this list, but I suspect there might come a
  // time when we might want these to be separate
  allControlNodes.push(root); // Root nodes
  allControlNodes.forEach(({ position, isRoot }) => {
    if (!ctx) {
      throw new Error("Context unavailable");
    }
    const { x, y } = position.getRenderedPosition(ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 6.9, 0, 2 * Math.PI);
    ctx.fillStyle = isRoot ? ROOT_NODE_COLOR : NODE_COLOR;
    ctx.fill();
  });
};