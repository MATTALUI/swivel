import { Match, Switch } from "solid-js";
import styles from "./Controls.module.scss";
import ProjectSettings from "./ProjectSettings";
import FrameSettings from "./FrameSettings";
import AnimationObjectSettings from "./AnimationObjectSettings";
import ObjectCreatorSettings from "./ObjectCreatorSettings.component";
import globalState from "../state";
import { CanvasMode } from "../types";

const Controls = () => {
  return (
    <div class={styles.container}>
      <Switch>
        <Match when={!globalState.animator.selectedObjects && globalState.canvasMode === CanvasMode.ANIMATOR}>
          <ProjectSettings />
        </Match>
        <Match when={!globalState.animator.selectedObjects && globalState.canvasMode === CanvasMode.OBJECT_CREATOR}>
          <ObjectCreatorSettings />
        </Match>
        <Match when={globalState.animator.selectedObjects?.type === "frame"}>
          <FrameSettings />
        </Match>
        <Match when={globalState.animator.selectedObjects?.type === "animationObject"}>
          <AnimationObjectSettings />
        </Match>
      </Switch>
    </div>
  );
};

export default Controls;