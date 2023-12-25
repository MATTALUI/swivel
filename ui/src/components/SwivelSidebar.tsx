import styles from "./SwivelSidebar.module.scss";
import ProjectSettings from "./projectSettings";

const SwivelSidebar = () => {
  return (
    <div class={styles.container}>
      <ProjectSettings />
    </div>
  );
}

export default SwivelSidebar;