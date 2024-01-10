import globalState from "../state";
import { addFrame } from "../utilities/project.util";
import styles from "./SceneControls.module.scss";

const SceneControls = () => {
  const togglePlayback = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    globalState.animator.isPlaying = !globalState.animator.isPlaying;
    globalState.animator.selectedObjects = null;
  };

  const addAndSelectFrame = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    addFrame();
    const previewFrames = document.querySelectorAll(".preview-frame");
    previewFrames[previewFrames.length - 1].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class={styles.container}>
      <div>
        <button onClick={togglePlayback}>{globalState.animator.isPlaying ? "Stop" : "Start"}</button>
      </div>
      <div>
        <button onClick={addAndSelectFrame}>Add Frame</button>
      </div>
    </div>
  );
};

export default SceneControls;