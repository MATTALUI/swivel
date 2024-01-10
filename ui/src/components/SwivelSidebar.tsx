import { Match, Switch } from "solid-js";
import FrameObjectsManager from "./FrameObjectsManager";
import styles from "./SwivelSidebar.module.scss";
import { CanvasMode } from "../types";
import ObjectCreationTools from "./ObjectCreationTools";
import globalState from "../state";

const SwivelSidebar = () => {
  return (
    <div class={styles.container}>
      <Switch>
        <Match when={globalState.canvasMode === CanvasMode.ANIMATOR}>
          <FrameObjectsManager />
        </Match>
        <Match when={globalState.canvasMode === CanvasMode.OBJECT_CREATOR}>
          <ObjectCreationTools />
        </Match>
      </Switch>
    </div>
  );
};

export default SwivelSidebar;