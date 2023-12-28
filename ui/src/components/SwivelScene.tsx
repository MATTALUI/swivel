import { createEffect, createMemo } from "solid-js";
import { projectAspectRatio } from "../state/project";
import styles from "./SwivelScene.module.scss";
import FramePreviewer from "./FramePreviewer";
import SceneControls from "./SceneControls";
import { drawFrameToCanvas } from "../utilities/canvas";
import { currentFrame } from "../state/app";
import ObjectNode from "../models/ObjectNode";
import { selectedNode, setCanvasCursor, setSelectedNode, setTargetNode, targetNode } from "../state/canvas";

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

  const handleMouseMove = (event: MouseEvent) => {
    if (event.target !== canvasRef || !canvasRef) return;
    if (!selectedNode()) {
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
    }
  }

  const handleMouseDown = (event: MouseEvent) => {
    if (
      event.target !== canvasRef ||
      !targetNode()
    ) return;
    setCanvasCursor("grabbing");
    setSelectedNode(targetNode());
  }

  const handleMouseUp = (event: MouseEvent) => {
    if (
      !selectedNode()
    ) return;
    const cursor = event.target === canvasRef
      ? "grab"
      : null;
    setSelectedNode(null);
    setCanvasCursor(cursor);
    setTargetNode(null);
    console.log("handleMouseUp");
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