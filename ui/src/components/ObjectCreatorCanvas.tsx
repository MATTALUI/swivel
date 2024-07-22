import { createEffect, onCleanup, onMount } from "solid-js";
import styles from "./ObjectCreatorCanvas.module.scss";
import { drawAnimationObjectToCanvas } from "../utilities/canvas.util";
import { clamp } from "../utilities/calculations.util";
import ObjectNode from "../models/ObjectNode";
import { CreatorToolNames, ErasorCursor, SelectionType } from "../types";
import type { MouseDownValues, CursorOption } from "../types";
import globalState from "../state";
import { buildVec2, getRenderedPosition } from "../utilities/vec2.util";

const ObjectCreatorCanvas = () => {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let newNode: ObjectNode | null = null;

  const redrawCanvas = () => {
    const obj = globalState.creator.object;
    if (!canvasRef || !obj) return;
    drawAnimationObjectToCanvas(obj, canvasRef);
  };

  const resizeCanvas = () => {
    if (!canvasRef || !containerRef) return;
    const {
      height: maxHeight,
      width: maxWidth,
    } = containerRef.getBoundingClientRect();
    const padding = 16; // 1 rem
    const totalPadding = padding * 2; // for both sides
    const constrainingDimenstion = Math.min(
      maxHeight - totalPadding,
      maxWidth - totalPadding,
    );
    canvasRef.height = constrainingDimenstion;
    canvasRef.width = constrainingDimenstion;
    redrawCanvas();
  };

  const handleMouseDown = (event: MouseEvent) => {
    const isGroupTool = globalState.creator.currentTool === CreatorToolNames.GROUP;
    if (isGroupTool) {
      // were doing something else here
      return;
    }
    if (globalState.creator.currentTool === CreatorToolNames.ADD) {
      const parent = globalState.ui.canvas.targetNode;
      if (!parent) return;
      newNode = new ObjectNode();
      newNode.setPosition(parent?.position);
      parent.appendChild(newNode);
      globalState.creator.controllableNodes =
        [...globalState.creator.controllableNodes, newNode];
      globalState.ui.canvas.targetNode = newNode;
      globalState.ui.canvas.selectedNode = newNode;
      redrawCanvas();
      return;
    }
    if (globalState.creator.currentTool === CreatorToolNames.ERASE) {
      const node = globalState.ui.canvas.targetNode;
      if (!node || node?.isRoot || !node.parent) return;
      globalState.ui.canvas.targetNode = null;
      node.parent.detach(node);
      redrawCanvas();
      return;
    }
    const node = globalState.ui.canvas.targetNode;
    if (event.target !== canvasRef || !node) {
      globalState.animator.selectedObjects = null;
      return;
    }

    const mouseDownValues: MouseDownValues = {
      x: event.offsetX,
      y: event.offsetY,
      originalParentNode: null,
      originalNodeRoot: node.objectRootNode.clone(),
      originalNode: node.clone(),
    };
    if (globalState.creator.currentTool === CreatorToolNames.SELECT)
      globalState.ui.cursor = "grabbing";
    globalState.ui.canvas.selectedNode = node;
    globalState.ui.canvas.mouseDownInitialValues = mouseDownValues;
    globalState.animator.selectedObjects = {
      type: SelectionType.NODE,
      objectIds: [node.id],
    };
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!globalState.ui.canvas.selectedNode) return;

    // For now we can assume that if the user is still on the canvas they're
    // going to be hovering over the same point that they were initially on.
    const stillOnTarget = event.target === canvasRef;
    let cursor: CursorOption = null;
    if (stillOnTarget && globalState.creator.currentTool === CreatorToolNames.SELECT)
      cursor = "grab";
    if (stillOnTarget && globalState.creator.currentTool === CreatorToolNames.ADD)
      cursor = "crosshair";
    globalState.ui.canvas.selectedNode = null;
    globalState.ui.canvas.mouseDownInitialValues = null;
    globalState.ui.cursor = cursor;
    if (!stillOnTarget) globalState.ui.canvas.targetNode = null;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!canvasRef) return;
    const currentSelectedNode = globalState.ui.canvas.selectedNode;
    const isGroupTool = globalState.creator.currentTool === CreatorToolNames.GROUP;
    if (isGroupTool && event.target === canvasRef) {
      globalState.ui.cursor = "crosshair";
      return;
    } else if (isGroupTool) {
      globalState.ui.cursor = null;
      return;
    }

    if (!currentSelectedNode) {
      // No interaction has been initiated by selecting a node so we're just
      // checking interactables and setting the hover states.
      const { offsetX, offsetY } = event;
      const allControlNodes = globalState.creator.controllableNodes;
      let nextTargetNode = null;
      let clickable = false;
      for (let i = 0; i < allControlNodes.length; i++) {
        const node = allControlNodes[i];
        const { x, y } = getRenderedPosition(node.position, canvasRef);
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
        const cursorMap: Record<CreatorToolNames, CursorOption> = {
          [CreatorToolNames.SELECT]: "grab",
          [CreatorToolNames.ADD]: "crosshair",
          [CreatorToolNames.GROUP]: "crosshair",
          [CreatorToolNames.ERASE]: ErasorCursor,
        };
        let cursor = cursorMap[globalState.creator.currentTool];
        if (
          globalState.creator.currentTool === CreatorToolNames.ERASE &&
          nextTargetNode?.isRoot
        ) cursor = "not-allowed";
        globalState.ui.canvas.targetNode = nextTargetNode;
        globalState.ui.cursor = cursor;
      } else {
        globalState.ui.canvas.targetNode = null;
        globalState.ui.cursor = null;
      }
    } else if (globalState.creator.currentTool === CreatorToolNames.SELECT) {
      if (event.target !== canvasRef) return;
      const { offsetX, offsetY } = event;
      const { width, height } = canvasRef;
      // Need to clamp here because fast mouse movement can still result in
      // out-of-bounds canvas positions
      const mouseX = clamp(offsetX, 0, width);
      const mouseY = clamp(offsetY, 0, height);
      const initialValues = globalState.ui.canvas.mouseDownInitialValues;
      if (!initialValues) throw new Error("No initial values for the mouse");
      const { x: originalX, y: originalY, originalNode } = initialValues;
      const deltaX = mouseX - originalX;
      const deltaY = mouseY - originalY;

      const { x: originalNodeX, y: originalNodeY } =
        getRenderedPosition(originalNode.position, canvasRef);
      const newX = originalNodeX + deltaX;
      const newY = originalNodeY + deltaY;
      currentSelectedNode.setPosition(buildVec2(
        newX / width,
        newY / height
      ));

      redrawCanvas();
    } else if (globalState.creator.currentTool === CreatorToolNames.ADD) {
      if (event.target !== canvasRef) return;
      const { offsetX, offsetY } = event;
      const { width, height } = canvasRef;
      currentSelectedNode.setPosition(buildVec2(
        offsetX / width,
        offsetY / height
      ));

      redrawCanvas();
    }
  };

  createEffect(redrawCanvas);
  onMount(redrawCanvas);
  onMount(resizeCanvas);
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  onMount(() => {
    if (!canvasRef)
      throw new Error("No canvas available for event listeners");
    canvasRef.addEventListener("contextmenu", (e) => e.preventDefault());
  });
  onCleanup(() => {
    window.removeEventListener("resize", resizeCanvas);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  });

  return (
    <div
      ref={containerRef}
      class={styles.container}
    >
      <canvas
        ref={canvasRef}
        class={styles.canvas}
        onMouseDown={handleMouseDown}
      >
      </canvas>
    </div>
  );
};

export default ObjectCreatorCanvas;