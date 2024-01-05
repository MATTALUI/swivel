import { createEffect, onCleanup, onMount } from "solid-js";
import styles from "./ObjectCreatorCanvas.module.scss";
import { CreatorToolNames, creationObject, creatorControllableNodes, currentCreatorTool, setCreatorControllableNodes } from "../state/objectCreator";
import { drawAnimationObjectToCanvas } from "../utilities/canvas";
import { CursorOption, selectedNode, setCanvasCursor, setTargetNode, targetNode, MouseDownValues, setSelectedNode, setMouseDownInitialValues, mouseDownInitialValues } from "../state/canvas";
import { clamp } from "../utils";
import Vec2 from "../models/Vec2";
import ObjectNode from "../models/ObjectNode";

const ObjectCreatorCanvas = () => {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let newNode: ObjectNode | null = null;

  const redrawCanvas = () => {
    const obj = creationObject()
    if (!canvasRef || !obj) return;
    drawAnimationObjectToCanvas(obj, canvasRef);
  }

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
  }

  const handleMouseDown = (event: MouseEvent) => {
    const isGroupTool = currentCreatorTool() === CreatorToolNames.GROUP;
    if (isGroupTool) {
      console.log("were doing something else here");
      return;
    }
    if (currentCreatorTool() === CreatorToolNames.ADD) {
      const parent = targetNode();
      if (!parent) return;
      newNode = new ObjectNode();
      newNode.setPosition(parent?.position.clone());
      parent.appendChild(newNode);
      setCreatorControllableNodes([...creatorControllableNodes(), newNode]);
      setTargetNode(newNode);
      setSelectedNode(newNode);
      redrawCanvas();
      return;
    }
    const node = targetNode();
    if (event.target !== canvasRef || !node) return;

    const mouseDownValues: MouseDownValues = {
      x: event.offsetX,
      y: event.offsetY,
      originalParentNode: null,
      originalNodeRoot: node.objectRootNode.clone(),
      originalNode: node.clone(),
    }
    if (currentCreatorTool() === CreatorToolNames.SELECT)
      setCanvasCursor("grabbing");
    setSelectedNode(node);
    setMouseDownInitialValues(mouseDownValues);
  }

  const handleMouseUp = (event: MouseEvent) => {
    if (!selectedNode()) return;

    // For now we can assume that if the user is still on the canvas they're
    // going to be hovering over the same point that they were initially on.
    const stillOnTarget = event.target === canvasRef;
    let cursor: CursorOption = null;
    if (stillOnTarget && currentCreatorTool() === CreatorToolNames.SELECT)
      cursor = "grab";
    if (stillOnTarget && currentCreatorTool() === CreatorToolNames.ADD)
      cursor = "crosshair";
    setSelectedNode(null);
    setMouseDownInitialValues(null);
    setCanvasCursor(cursor);
    if (!stillOnTarget) setTargetNode(null);
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!canvasRef) return;
    const currentSelectedNode = selectedNode();
    const isGroupTool = currentCreatorTool() === CreatorToolNames.GROUP;
    if (isGroupTool && event.target === canvasRef) {
      setCanvasCursor("crosshair");
      return;
    } else if (isGroupTool) {
      setCanvasCursor(null);
      return;
    }

    if (!currentSelectedNode) {
      // No interaction has been initiated by selecting a node so we're just
      // checking interactables and setting the hover states.
      const { offsetX, offsetY } = event;
      const { width, height } = canvasRef;
      const allControlNodes = creatorControllableNodes();
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
        const cursorMap: Record<CreatorToolNames, CursorOption> = {
          [CreatorToolNames.SELECT]: "grab",
          [CreatorToolNames.ADD]: "crosshair",
          [CreatorToolNames.GROUP]: "crosshair",
        }
        const cursor = cursorMap[currentCreatorTool()];
        setTargetNode(nextTargetNode);
        setCanvasCursor(cursor);
      } else {
        setTargetNode(null);
        setCanvasCursor(null);
      }
    } else if (currentCreatorTool() === CreatorToolNames.SELECT) {
      if (event.target !== canvasRef) return;
      let { offsetX, offsetY } = event;
      const { width, height } = canvasRef;
      // Need to clamp here because fast mouse movement can still result in
      // out-of-bounds canvas positions
      const mouseX = clamp(offsetX, 0, width);
      const mouseY = clamp(offsetY, 0, height);
      const initialValues = mouseDownInitialValues();
      if (!initialValues) throw new Error("No initial values for the mouse");
      const { x: originalX, y: originalY, originalNode } = initialValues;
      const deltaX = mouseX - originalX;
      const deltaY = mouseY - originalY;

      const { x: originalNodeX, y: originalNodeY } =
        originalNode.position.getRenderedPosition(width, height);
      const newX = originalNodeX + deltaX;
      const newY = originalNodeY + deltaY;
      currentSelectedNode.setPosition(new Vec2(
        newX / width,
        newY / height
      ));

      redrawCanvas();
    } else if (currentCreatorTool() === CreatorToolNames.ADD) {
      if (event.target !== canvasRef) return;
      const { offsetX, offsetY } = event;
      const { width, height } = canvasRef;
      currentSelectedNode.setPosition(new Vec2(
        offsetX / width,
        offsetY / height
      ));

      redrawCanvas();
    }
  }

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
}

export default ObjectCreatorCanvas;