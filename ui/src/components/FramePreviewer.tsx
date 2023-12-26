import { onMount } from "solid-js";
import styles from "./FramePreviewer.module.scss";
import { projectFrames } from "../state/project";
import FramePreview from "./FramePreview";

const FramePreviewer = () => {
  let containerRef: HTMLDivElement | undefined;
  let framesContainerRef: HTMLDivElement | undefined;

  const resizeFramesContainer = () => {
    if (!containerRef || !framesContainerRef) return;
    const { width } = containerRef.getBoundingClientRect();
    framesContainerRef.style.width = `${width}px`;
  }
  onMount(resizeFramesContainer);
  window.addEventListener("resize", resizeFramesContainer);

  return (
    <div
      ref={containerRef}
      class={styles.container}
    >
      <div
        ref={framesContainerRef}
        class={styles.framesContainer}
      >
        <div class={styles.scroller}>
          {projectFrames().map(frame => (
            <FramePreview frame={frame} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default FramePreviewer;