import { onMount } from "solid-js";
import styles from "./ObjectCreatorCanvas.module.scss";

const ObjectCreatorCanvas = () => {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;

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
  onMount(resizeCanvas);
  window.addEventListener("resize", resizeCanvas);

  return (
    <div
      ref={containerRef}
      class={styles.container}
    >
      <canvas
        ref={canvasRef}
        class={styles.canvas}
      >
      </canvas>
    </div>
  );
}

export default ObjectCreatorCanvas;