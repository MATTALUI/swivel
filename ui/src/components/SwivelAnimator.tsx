import Controls from "./Controls";
import FileHeader from "./FileHeader";
import styles from "./SwivelAnimator.module.scss";
import SwivelScene from "./SwivelScene";
import SwivelSidebar from "./SwivelSidebar";

const SwivelAnimator = () => {
  return (
    <div class={styles.container}>
      <FileHeader />
      <div class={styles.main}>
        <SwivelSidebar />
        <SwivelScene />
        <Controls />
      </div>
    </div>
  );
}

export default SwivelAnimator;