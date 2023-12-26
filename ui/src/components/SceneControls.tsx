import { isPlaying, setIsPlaying } from "../state/app";
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
        <button>Add Frame</button>
      </div>
    </div>
  )
}

export default SceneControls;