import Tauri from "../Tauri";
import { gotoAnimator, gotoMapPainter } from "../utilities/navigation.util";
import { restartProject, saveProject } from "../utilities/project.util";
import styles from "./FileHeader.module.scss";

const FileHeader = () => {
  if (Tauri) return null;
  return (
    <header class={styles.container}>
      <a href="/" class={styles.navItem}>
        <img src="/original.png" />
      </a>
      <div class={styles.navItem}>
        File
        <div class={styles.dropdown}>
          <a onClick={restartProject}>New</a>
          <a onClick={saveProject}>Save</a>
          <a onClick={() => console.log("Open")}>Open</a>
        </div>
      </div>
      <div class={styles.navItem}>
        Tools
        <div class={styles.dropdown}>
          <a onClick={gotoAnimator}>Animator</a>
          <a onClick={gotoMapPainter}>Map Painter</a>
        </div>
      </div>
    </header>
  );
};

export default FileHeader;