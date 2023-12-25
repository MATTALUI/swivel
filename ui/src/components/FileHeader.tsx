import Tauri from "../Tauri";
import styles from "./FileHeader.module.scss";

const FileHeader = () => {
  if (Tauri) return null;
  return (
    <header class={styles.container}>
      <a href="/">
        <img src="/original.png" />
      </a>
      <a>
        File
      </a>
      <a>
        Tools
      </a>
    </header>
  )
}

export default FileHeader;