import { currentFrame, currentFrameIndex } from "../state/app";
import { projectBackgroundColor } from "../state/project";
import type { JSX } from 'solid-js';
import styles from "./Settings.module.scss";
import { drawFrameToCanvas, getFramePreviewUrl } from "../utilities/canvas";

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const FrameSettings = () => {
  // Most of this is based on logic found elsewhere. We should unify it and make
  // sure things belong to where their concerns are.
  const updateFrameBackgroundColor: InputHandler = (event) => {
    currentFrame().backgroundColor = event.target.value;
    const previewImage = getFramePreviewUrl(currentFrame());
    currentFrame().previewImage = previewImage;
    const imgEle = document.querySelector<HTMLImageElement>(`[data-frame-preview="${currentFrameIndex()}"]`);
    if (!imgEle) throw new Error("No image preview to update!");
    imgEle.src = previewImage;
    const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
    if (!canvas) throw new Error("Can't find the real canvas!");
    drawFrameToCanvas(canvas, currentFrame(), {});
  }

  return (
    <>
      <h2 class={styles.title}>Frame</h2>
      <div class={styles.settingContainer}>
        <label>Background Color</label>
        <input
          type="color"
          value={currentFrame().backgroundColor || projectBackgroundColor()}
          onChange={updateFrameBackgroundColor}
        />
      </div>
    </>
  );
}

export default FrameSettings;