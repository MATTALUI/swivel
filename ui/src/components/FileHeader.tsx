import Tauri from "../Tauri";
import { gotoAnimator, gotoMapPainter } from "../utilities/navigation.util";
import { restartProject, saveProject } from "../utilities/project.util";
import styles from "./FileHeader.module.scss";

const FileHeader = () => {
  if (Tauri) return null;
  return (
    <header
      class={styles.container}
      data-testid="file-header__header"
    >
      <a href="/" class={styles.navItem}>
        <img src="/original.png" />
      </a>
      <div
        class={styles.navItem}
        data-testid="file-header__file"
      >
        File
        <div class={styles.dropdown}>
          <a
            onClick={restartProject}
            data-testid="file-header__new"
          >
            New
          </a>
          <a
            onClick={saveProject}
            data-testid="file-header__save"
          >
            Save
          </a>
          <a
            onClick={() => console.log("Open")}
            data-testid="file-header__open"
          >
            Open
          </a>
        </div>
      </div>
      <div
        class={styles.navItem}
        data-testid="file-header__tools"
      >
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