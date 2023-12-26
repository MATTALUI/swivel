import { isPlaying, setIsPlaying } from "../state/app";
import { addProjectFrame } from "../state/project";
import styles from "./SceneControls.module.scss";

const SceneControls = () => {
  const togglePlayback = () => {
    setIsPlaying(!isPlaying());
  }

  return (
    <div class={styles.container}>
      <div>
        <button onClick={togglePlayback}>{isPlaying() ? "Stop" : "Start"}</button>
      </div>
      <div>
        <button onClick={addProjectFrame}>Add Frame</button>
      </div>
    </div>
  )
}

export default SceneControls;