import { selectedObjects } from "../state/app";
import styles from "./Controls.module.scss";

const Controls = () => {
  return (
    <div class={styles.container}>
      {selectedObjects().length ? (
        <span>Object Controls</span>
      ): (
        <span>Scene Controls</span>
      )}
    </div>
  )
}

export default Controls;