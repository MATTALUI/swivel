import { currentFrame, currentFrameIndex } from "../state/app";
import { projectBackgroundColor, updateProjectFrame } from "../state/project";
import type { JSX } from "solid-js";
import styles from "./Settings.module.scss";
import { drawFrameToCanvas, getMainCanvas } from "../utilities/canvas";

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const FrameSettings = () => {
  const updateFrameBackgroundColor: InputHandler = (event) => {
    updateProjectFrame(currentFrameIndex(), { backgroundColor: event.target.value });
    drawFrameToCanvas(getMainCanvas(), currentFrame(), {});
  };

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
};

export default FrameSettings;