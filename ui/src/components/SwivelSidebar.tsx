import { Match, Switch } from "solid-js";
import FrameObjectsManager from "./FrameObjectsManager";
import styles from "./SwivelSidebar.module.scss";
import { CanvasMode, canvasMode } from "../state/app";
import ObjectCreationTools from "./ObjectCreationTools";

const SwivelSidebar = () => {
  return (
    <div class={styles.container}>
      <Switch>
        <Match when={canvasMode() === CanvasMode.ANIMATOR}>
          <FrameObjectsManager />
        </Match>
        <Match when={canvasMode() === CanvasMode.OBJECT_CREATOR}>
          <ObjectCreationTools />
        </Match>
      </Switch>
    </div>
  );
}

export default SwivelSidebar;