import { Match, Switch, createMemo } from "solid-js";
import Controls from "./Controls";
import FileHeader from "./FileHeader";
import styles from "./SwivelAnimator.module.scss";
import SwivelScene from "./SwivelScene";
import SwivelSidebar from "./SwivelSidebar";
import { mountSwivelTauriListeners } from "../utilities/tauri";
import { CanvasMode } from "../types";
import ObjectCreatorCanvas from "./ObjectCreatorCanvas";
import globalState from "../state";
import APIService from "../services";

type GlobalStyleSet = {
  cursor?: string;
}

const SwivelAnimator = () => {
  APIService.displayServiceInformation();
  mountSwivelTauriListeners();

  const globalStyle = createMemo(() => {
    const style: GlobalStyleSet = {};
    const cursor = globalState.ui.cursor;
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
          <Match when={globalState.canvasMode === CanvasMode.ANIMATOR}>
            <SwivelScene />
          </Match>
          <Match when={globalState.canvasMode === CanvasMode.OBJECT_CREATOR}>
            <ObjectCreatorCanvas />
          </Match>
        </Switch>
        <Controls />
      </div>
    </div>
  );
};

export default SwivelAnimator;