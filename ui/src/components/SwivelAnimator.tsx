import { Match, Switch, createMemo } from "solid-js";
import Controls from "./Controls";
import FileHeader from "./FileHeader";
import styles from "./SwivelAnimator.module.scss";
import SwivelScene from "./SwivelScene";
import SwivelSidebar from "./SwivelSidebar";
import { canvasCursor } from "../state/canvas";
import { mountSwivelTauriListeners } from "../utilities/tauri";
import { CanvasMode, canvasMode } from "../state/app";
import ObjectCreatorCanvas from "./ObjectCreatorCanvas";

type GlobalStyleSet = {
  cursor?: string;
}

const SwivelAnimator = () => {
  mountSwivelTauriListeners();

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
        <Switch>
          <Match when={canvasMode() === CanvasMode.ANIMATOR}>
            <SwivelScene />
          </Match>
          <Match when={canvasMode() === CanvasMode.OBJECT_CREATOR}>
            <ObjectCreatorCanvas />
          </Match>
        </Switch>
        <Controls />
      </div>
    </div>
  );
}

export default SwivelAnimator;