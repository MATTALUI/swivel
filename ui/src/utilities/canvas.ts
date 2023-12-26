import Frame from "../models/Frame"
import ObjectNode from "../models/ObjectNode";
import { isPlaying } from "../state/app";
import { projectBackgroundColor, projectFrames, projectHeight, projectWidth } from "../state/project";

interface IDrawFrameToCanvasOptions {
  preview?: boolean;
}
export const drawFrameToCanvas = (
  canvas: HTMLCanvasElement,
  frame: Frame,
  options: IDrawFrameToCanvasOptions = {},
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error("Context unavailable");
  }
  // These checks simply help subscribe to these changes
  projectWidth();
  projectHeight();
  // Clear it out
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw in the background color
  ctx.fillStyle = projectBackgroundColor();
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Create a registry of just the points that we can build as we go so that
  // we can draw the control points on top of all the lines at the end without having to recurse again
  const allControlNodes:ObjectNode[] = [];
  const connectNodeToChildren = (node: ObjectNode, controllable = true) => {
    node.children.forEach((child) => {
      if (child.children.length) connectNodeToChildren(child, controllable);
      if (controllable) allControlNodes.push(child);
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
  if (!isPlaying() && frame.index && !options.preview) {
    const allFrames = projectFrames();
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
    allControlNodes.push(root);
  });
  if (!isPlaying() && !options.preview) {
    allControlNodes.forEach(({ position, isRoot }) => {
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