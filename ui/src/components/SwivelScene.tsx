import { createEffect } from "solid-js";
import { projectAspectRatio } from "../state/project";
import styles from "./SwivelScene.module.scss";

const SwivelScene = () => {
  let canvasContainerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;


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

  createEffect(setCanvasSize);
  window.addEventListener("resize", setCanvasSize);

  return (
    <div
      ref={canvasContainerRef}
      class={styles.container}
    >
      <canvas
        class={styles.canvas}
        ref={canvasRef}
      />
    </div>
  )
}

export default SwivelScene;