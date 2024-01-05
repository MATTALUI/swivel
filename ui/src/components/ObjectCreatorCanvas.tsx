import { createEffect, onCleanup, onMount } from "solid-js";
import styles from "./ObjectCreatorCanvas.module.scss";
import { CreatorToolNames, creationObject, creatorControllableNodes, currentCreatorTool } from "../state/objectCreator";
import { drawAnimationObjectToCanvas } from "../utilities/canvas";
import { CursorOption, selectedNode, setCanvasCursor, setTargetNode, targetNode } from "../state/canvas";

const ObjectCreatorCanvas = () => {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;

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
  }

  const handleMouseDown = () => {
    console.log(targetNode());
  }

  const handleMouseUp = () => {
    console.log("handleMouseUp");
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