import styles from "./SwivelSidebar.module.scss";
import ProjectSettings from "./ProjectSettings";

const SwivelSidebar = () => {
  return (
    <div class={styles.container}>
      <ProjectSettings />
    </div>
  );
}

export default SwivelSidebar;