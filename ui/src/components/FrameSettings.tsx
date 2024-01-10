import type { JSX } from "solid-js";
import styles from "./Settings.module.scss";
import { drawFrameToCanvas, getMainCanvas } from "../utilities/canvas";
import globalState from "../state";
import { updateFrame } from "../utilities/project.util";
import { getCurrentFrame } from "../utilities/animator.utils";

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const FrameSettings = () => {
  const updateFrameBackgroundColor: InputHandler = (event) => {
    updateFrame(globalState.animator.currentFrameIndex, { backgroundColor: event.target.value });
    drawFrameToCanvas(getMainCanvas(), getCurrentFrame(), {});
  };

  return (
    <>
      <h2 class={styles.title}>Frame</h2>
      <div class={styles.settingContainer}>
        <label>Background Color</label>
        <input
          type="color"
          value={getCurrentFrame().backgroundColor || globalState.project.backgroundColor}
          onChange={updateFrameBackgroundColor}
        />
      </div>
    </>
  );
};

export default FrameSettings;