import { createEffect, createMemo } from "solid-js";
import { projectAspectRatio, updateProjectFrame } from "../state/project";
import styles from "./SwivelScene.module.scss";
import FramePreviewer from "./FramePreviewer";
import SceneControls from "./SceneControls";
import { drawFrameToCanvas, getFramePreviewUrl } from "../utilities/canvas";
import { currentFrame, currentFrameIndex } from "../state/app";
import ObjectNode from "../models/ObjectNode";
import { MouseDownValues, mouseDownInitialValues, selectedNode, setCanvasCursor, setMouseDownInitialValues, setSelectedNode, setTargetNode, targetNode } from "../state/canvas";
import { clamp, debounce } from "../utils";
import Vec2 from "../models/Vec2";

const SwivelScene = () => {
  let canvasContainerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;

  const controllableNodes = createMemo(() => {
    const frame = currentFrame();
    const nodes: ObjectNode[] = [];

    frame.objects.forEach((ao) => {
      nodes.push(ao.root);
    });

    return nodes;
  });

  const setCanvasSize = () => {
    if (!canvasContainerRef || !canvasRef) return;
    const {
      width: containerWidth,
      height: containerHeight
    } = canvasContainerRef.getBoundingClientRect();
    const containerPadding = 20;
    const maxContainerWidth = containerWidth - (containerPadding * 2);
    const maxContainerHeight = containerHeight - (containerPadding * 2);

    let width = 50;
    let height = 50;
    if (projectAspectRatio() > 1) {
      width = maxContainerWidth;
      height = maxContainerWidth / projectAspectRatio();
    } else {
      height = maxContainerHeight;
      width = maxContainerHeight * projectAspectRatio();
    }
    canvasRef.width = width;
    canvasRef.height = height;
  }

  const repaintCanvas = () => {
    if (!canvasRef) return;
    drawFrameToCanvas(canvasRef, currentFrame(), {});
  }

  const updateCurrentFramePreview = debounce(() => {
    const previewImage = getFramePreviewUrl(currentFrame());
    updateProjectFrame(currentFrameIndex(), { previewImage })
  }, 500);

  const handleMouseMove = (event: MouseEvent) => {
    if (event.target !== canvasRef || !canvasRef) return;
    const currentSelectedNode = selectedNode();
    if (!currentSelectedNode) {
      // No interaction has been initiated by selecting a node so we're just
      // checking interactables and setting the hover states.
      const { offsetX, offsetY } = event;
      const { width, height } = canvasRef;
      const allControlNodes = controllableNodes();
      let nextTargetNode = null;
      let clickable = false;
      for (let i = 0; i < allControlNodes.length; i++) {
        const node = allControlNodes[i];
        const { x, y } = node.position.getRenderedPosition(width, height);
        const xDiff = Math.abs(x - offsetX);
        const yDiff = Math.abs(y - offsetY);
        const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        if (distance <= 10) {
          clickable = true;
          nextTargetNode = node;
          break;
        }
      }

      if (clickable) {
        setTargetNode(nextTargetNode);
        setCanvasCursor("grab");
      } else {
        setCanvasCursor(null);
      }
    } else if (currentSelectedNode.isRoot) {
      const { offsetX, offsetY } = event;
      const { width, height } = canvasRef;
      // Need to clamp here because fast mouse movement can still result in
      // out-of-bounds canvas positions
      const mouseX = clamp(offsetX, 0, width);
      const mouseY = clamp(offsetY, 0, height);
      const initialValues = mouseDownInitialValues();
      if (!initialValues) throw new Error("No initial values for the mouse");
      const { x: originalX, y: originalY, originalNodeRoot } = initialValues;
      const deltaX = mouseX - originalX;
      const deltaY = mouseY - originalY;
      const moveWithChildren = (node: ObjectNode, originalNode: ObjectNode) => {
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
      moveWithChildren(currentSelectedNode, originalNodeRoot);
      repaintCanvas();
      updateCurrentFramePreview();
    }
  }

  const handleMouseDown = (event: MouseEvent) => {
    const node = targetNode();
    if (
      event.target !== canvasRef ||
      !node
    ) return;
    const mouseDownValues: MouseDownValues = {
      x: event.offsetX,
      y: event.offsetY,
      originalParentNode: null,
      originalNodeRoot: node.objectRootNode.clone(),
    }
    if (node.parent)
      mouseDownValues.originalParentNode = node.parent.clone();
    setCanvasCursor("grabbing");
    setSelectedNode(node);
    setMouseDownInitialValues(mouseDownValues);
  }

  const handleMouseUp = (event: MouseEvent) => {
    if (
      !selectedNode()
    ) return;

    const cursor = event.target === canvasRef
      ? "grab"
      : null;
    setCanvasCursor(cursor);
    setSelectedNode(null);
    setTargetNode(null);
    setMouseDownInitialValues(null);
  }

  createEffect(setCanvasSize);
  createEffect(repaintCanvas);
  window.addEventListener("resize", setCanvasSize);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);

  return (
    <div
      class={styles.container}
    >
      <FramePreviewer />
      <SceneControls />
      <div
        ref={canvasContainerRef}
        class={styles.canvasContainer}
      >
        <canvas
          class={styles.canvas}
          ref={canvasRef}
        />
      </div>
    </div>
  )
}

export default SwivelScene;