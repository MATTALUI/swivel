import { currentFrame, currentFrameIndex } from "../state/app";
import type { JSX } from "solid-js";
import styles from "./Settings.module.scss";
import { drawFrameToCanvas, getMainCanvas } from "../utilities/canvas";
import globalState from "../state";

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const FrameSettings = () => {
  const updateFrameBackgroundColor: InputHandler = (event) => {
    globalState.project.updateFrame(currentFrameIndex(), { backgroundColor: event.target.value });
    drawFrameToCanvas(getMainCanvas(), currentFrame(), {});
  };

  return (
    <>
      <h2 class={styles.title}>Frame</h2>
      <div class={styles.settingContainer}>
        <label>Background Color</label>
        <input
          type="color"
          value={currentFrame().backgroundColor || globalState.project.backgroundColor}
          onChange={updateFrameBackgroundColor}
        />
      </div>
    </>
  );
};

export default FrameSettings;