import { projectName } from "../state/project";
import styles from "./SwivelScene.module.scss";

const SwivelScene = () => {
  return (
    <div class={styles.container}>
      Swivel Scene: {projectName()}
    </div>
  )
}

export default SwivelScene;