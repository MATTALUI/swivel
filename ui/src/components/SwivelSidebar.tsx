import { Match, Switch } from "solid-js";
import FrameObjectsManager from "./FrameObjectsManager";
import styles from "./SwivelSidebar.module.scss";
import { CanvasMode, canvasMode } from "../state/app";

const SwivelSidebar = () => {
  return (
    <div class={styles.container}>
      <Switch>
        <Match when={canvasMode() === CanvasMode.ANIMATOR}>
          <FrameObjectsManager />
        </Match>
        <Match when={canvasMode() === CanvasMode.OBJECT_CREATOR}>
          <span>creation tools here</span>
        </Match>
      </Switch>
    </div>
  );
}

export default SwivelSidebar;