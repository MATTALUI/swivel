import { onMount } from "solid-js";
import styles from "./FramePreviewer.module.scss";
import { projectFrames } from "../state/project";
import FramePreview from "./FramePreview";

const FramePreviewer = () => {
  let containerRef: HTMLDivElement | undefined;
  let framesContainerRef: HTMLDivElement | undefined;

  const resizeFramesContainer = () => {
    if (!containerRef || !framesContainerRef) return;
    // Set the size of the frame container to 0 before getting the size of the
    // parent container otherwise the size of the child will force the parent to
    // be bigger than it should be and break the style reactivity.
    framesContainerRef.style.width = `0px`;
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
          {projectFrames().map((frame, index) => (
            <FramePreview
              frame={frame}
              frameIndex={index}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default FramePreviewer;