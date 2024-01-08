import globalState from "../state";
import { isPlaying, setIsPlaying, setSelectedObjects } from "../state/app";
import styles from "./SceneControls.module.scss";

const SceneControls = () => {
  const togglePlayback = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsPlaying(!isPlaying());
    setSelectedObjects(null);
  };

  const addFrame = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    globalState.project.addFrame();
    const previewFrames = document.querySelectorAll(".preview-frame");
    previewFrames[previewFrames.length - 1].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class={styles.container}>
      <div>
        <button onClick={togglePlayback}>{isPlaying() ? "Stop" : "Start"}</button>
      </div>
      <div>
        <button onClick={addFrame}>Add Frame</button>
      </div>
    </div>
  );
};

export default SceneControls;