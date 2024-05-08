import { createEffect, createMemo, onCleanup, onMount } from "solid-js";
import styles from "./SwivelScene.module.scss";
import FramePreviewer from "./FramePreviewer";
import SceneControls from "./SceneControls";
import { drawFrameToCanvas } from "../utilities/canvas.util";
import ObjectNode from "../models/ObjectNode";
import { clamp, debounce, degToRad, getAngleOfChange, getPositionDistance } from "../utilities/calculations.util";
import Vec2 from "../models/Vec2";
import globalState from "../state";
import { deselectObjects, getCurrentFrame } from "../utilities/animator.util";
import { updateFrame } from "../utilities/project.util";
import {
  type MouseDownValues,
  SelectionType,
} from "../types";

const SwivelScene = () => {
  let canvasContainerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let shadowCanvasRef: HTMLCanvasElement | undefined;
  let skipDeselect = false;

  const tryDeselect = () => {
    if (!skipDeselect) deselectObjects();
    skipDeselect = false;
  };

  const controllableNodes = createMemo(() => {
    const frame = getCurrentFrame();
    const nodes: ObjectNode[] = [];
    const addNodeControls = (node: ObjectNode) => {
      nodes.push(node);
      node.children.forEach(n => addNodeControls(n));
    };

    frame.objects.forEach((ao) => {
      addNodeControls(ao.root);
    });

    return nodes;
  });

  const repaintCanvas = () => {
    if (!canvasRef) return;
    drawFrameToCanvas(canvasRef, getCurrentFrame());

    if (!canvasContainerRef || !shadowCanvasRef) return;
    const {
      x: containerX,
      y: containerY,
    } = canvasContainerRef.getBoundingClientRect();
    const {
      x: canvasX,
      y: canvasY,
      width,
      height,
    } = canvasRef.getBoundingClientRect();
    const canvasBorderWidth = parseFloat(getComputedStyle(canvasRef).borderWidth);
    const x = canvasX - containerX + canvasBorderWidth;
    const y = canvasY - containerY + canvasBorderWidth;

    drawFrameToCanvas(shadowCanvasRef, getCurrentFrame(), {
      pixelOffset: { x, y },
      canvasDimensions: { width, height },
    });
  };

  const setCanvasSize = () => {
    if (!canvasContainerRef || !canvasRef || !shadowCanvasRef) return;
    const {
      width: containerWidth,
      height: containerHeight
    } = canvasContainerRef.getBoundingClientRect();
    const containerPadding = 20;
    const maxContainerWidth = containerWidth - (containerPadding * 2);
    const maxContainerHeight = containerHeight - (containerPadding * 2);

    shadowCanvasRef.width = containerWidth;
    shadowCanvasRef.height = containerHeight;

    let width = 10;
    let height = 10;
    if (globalState.project.aspectRatio > 1) {
      width = maxContainerWidth;
      height = maxContainerWidth / globalState.project.aspectRatio;
    } else {
      height = maxContainerHeight;
      width = maxContainerHeight * globalState.project.aspectRatio;
    }
    canvasRef.width = width;
    canvasRef.height = height;
    repaintCanvas();
  };

  const playAnimationFrame = () => {
    if (!globalState.animator.isPlaying) return;
    window.requestAnimationFrame(playAnimationFrame);
    const currentTime = new Date();
    if (globalState.animator.lastFrameTime) {
      const msInSecond = 1000;
      const frameDifferential = msInSecond / globalState.project.fps;
      const timeSinceLastFrame = Number(currentTime) - frameDifferential;
      if (timeSinceLastFrame < Number(globalState.animator.lastFrameTime))
        return;
    }
    let nextIndex = globalState.animator.currentFrameIndex + 1;
    if (nextIndex === globalState.project.frames.length) nextIndex = 0;

    globalState.animator.lastFrameTime = currentTime;
    globalState.animator.currentFrameIndex = nextIndex;
  };

  const updateCurrentFramePreview = debounce(() => {
    updateFrame(globalState.animator.currentFrameIndex);
  }, 500);

  const handleMouseMove = (event: MouseEvent) => {
    if (event.target !== canvasRef || !canvasRef) return;
    const currentSelectedNode = globalState.ui.canvas.selectedNode;
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
        globalState.ui.canvas.targetNode = nextTargetNode;
        globalState.ui.cursor = "grab";
      } else {
        globalState.ui.canvas.targetNode = null;
        globalState.ui.cursor = null;
      }
    } else if (currentSelectedNode.isRoot) {
      const { offsetX, offsetY } = event;
      const { width, height } = canvasRef;
      // Need to clamp here because fast mouse movement can still result in
      // out-of-bounds canvas positions
      const mouseX = clamp(offsetX, 0, width);
      const mouseY = clamp(offsetY, 0, height);
      const initialValues = globalState.ui.canvas.mouseDownInitialValues;
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
      };
      moveWithChildren(currentSelectedNode, originalNodeRoot);
      repaintCanvas();
      updateCurrentFramePreview();
    } else {
      const { width, height } = canvasRef;
      const swivelPoint = currentSelectedNode?.parent || undefined;
      if (!swivelPoint) throw new Error("No valid swivel point");
      const [swivelX, swivelY] =
        swivelPoint.position.getRenderedPositionTuple(width, height);
      // This logic assumes only two types of movment should come from a node.
      // If we want to have more types of movement that are differentiated by
      // more than root and not root we will have to update this here.
      const rotateWithChildren = (deltaDeg: number, node: ObjectNode, originalNode: ObjectNode) => {
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
      };
      const { offsetX, offsetY } = event;
      const originalNode = currentSelectedNode?.clone();
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
      rotateWithChildren(deltaAngle, currentSelectedNode, originalNode);
      repaintCanvas();
      updateCurrentFramePreview();
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    const node = globalState.ui.canvas.targetNode;
    if (
      event.target !== canvasRef ||
      !node
    ) return;
    skipDeselect = true;
    const clickedObject = node.object;
    const mouseDownValues: MouseDownValues = {
      x: event.offsetX,
      y: event.offsetY,
      originalParentNode: null,
      originalNodeRoot: node.objectRootNode.clone(),
      originalNode: node.clone(),
    };
    if (node.parent)
      mouseDownValues.originalParentNode = node.parent.clone();
    globalState.ui.cursor = "grabbing";
    globalState.ui.canvas.selectedNode = node;
    globalState.ui.canvas.mouseDownInitialValues = mouseDownValues;
    if (clickedObject) {
      const selection = globalState.animator.selectedObjects;
      let selectedIds: string[] =
        selection?.type === SelectionType.ANIMATION_OBJECT && event.shiftKey
          ? [...selection.objectIds]
          : [];
      if (selectedIds.includes(clickedObject.id)) {
        selectedIds = selectedIds.filter(id => id !== clickedObject.id);
      } else {
        selectedIds.push(clickedObject.id);
      }

      globalState.animator.selectedObjects = {
        type: SelectionType.ANIMATION_OBJECT,
        objectIds: selectedIds,
      };
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (
      !globalState.ui.canvas.selectedNode
    ) return;

    // For now we can assume that if the user is still on the canvas they're
    // going to be hovering over the same point that they were initially on.
    const stillOnTarget = event.target === canvasRef;
    const cursor = stillOnTarget ? "grab" : null;
    globalState.ui.canvas.selectedNode = null;
    globalState.ui.canvas.mouseDownInitialValues = null;
    globalState.ui.cursor = cursor;
    if (!stillOnTarget) globalState.ui.canvas.targetNode = null;
  };

  createEffect(setCanvasSize);
  createEffect(repaintCanvas);
  createEffect(playAnimationFrame);
  window.addEventListener("resize", setCanvasSize);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  onMount(() => {
    if (!canvasRef)
      throw new Error("No canvas available for event listeners");
    canvasRef.addEventListener("contextmenu", (e) => e.preventDefault());
  });
  onCleanup(() => {
    window.removeEventListener("resize", setCanvasSize);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  });

  return (
    <div
      class={styles.container}
    >
      <FramePreviewer />
      <SceneControls />
      <div
        ref={canvasContainerRef}
        class={styles.canvasContainer}
        onClick={tryDeselect}
      >
        <canvas
          id="shadow-canvas"
          ref={shadowCanvasRef}
          class={styles.shadowCanvas}
        />
        <canvas
          id="canvas"
          class={styles.canvas}
          ref={canvasRef}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default SwivelScene;