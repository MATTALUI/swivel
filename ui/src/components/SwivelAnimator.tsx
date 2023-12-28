import { createMemo } from "solid-js";
import Controls from "./Controls";
import FileHeader from "./FileHeader";
import styles from "./SwivelAnimator.module.scss";
import SwivelScene from "./SwivelScene";
import SwivelSidebar from "./SwivelSidebar";
import { canvasCursor } from "../state/canvas";

type GlobalStyleSet = {
  cursor?: string;
}

const SwivelAnimator = () => {
  const globalStyle = createMemo(() => {
    const style: GlobalStyleSet = {};
    const cursor = canvasCursor();
    if (cursor) style.cursor = cursor;

    return style;
  });

  return (
    <div
      style={globalStyle()}
      class={styles.container}
    >
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