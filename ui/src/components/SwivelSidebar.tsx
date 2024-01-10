import { Match, Switch } from "solid-js";
import FrameObjectsManager from "./FrameObjectsManager";
import styles from "./SwivelSidebar.module.scss";
import { CanvasMode } from "../state/animator.state";
import ObjectCreationTools from "./ObjectCreationTools";
import globalState from "../state";

const SwivelSidebar = () => {
  return (
    <div class={styles.container}>
      <Switch>
        <Match when={globalState.animator.canvasMode === CanvasMode.ANIMATOR}>
          <FrameObjectsManager />
        </Match>
        <Match when={globalState.animator.canvasMode === CanvasMode.OBJECT_CREATOR}>
          <ObjectCreationTools />
        </Match>
      </Switch>
    </div>
  );
};

export default SwivelSidebar;