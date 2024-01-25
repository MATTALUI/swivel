import { Match, Switch } from "solid-js";
import styles from "./Controls.module.scss";
import ProjectSettings from "./ProjectSettings";
import FrameSettings from "./FrameSettings";
import AnimationObjectSettings from "./AnimationObjectSettings";
import ObjectCreatorSettings from "./ObjectCreatorSettings.component";
import ObjectNodeSettings from "./ObjectNodeSettings.component";
import globalState from "../state";
import { CanvasMode, SelectionType } from "../types";

const AnimatorControls = () => (
  <Switch fallback={<ProjectSettings />}>
    <Match when={globalState.animator.selectedObjects?.type === SelectionType.FRAME}>
      <FrameSettings />
    </Match>
    <Match when={globalState.animator.selectedObjects?.type === SelectionType.ANIMATION_OBJECT}>
      <AnimationObjectSettings />
    </Match>
  </Switch>
);

const CreatorControls = () => (
  <Switch fallback={<ObjectCreatorSettings />}>
    <Match when={globalState.animator.selectedObjects?.type === SelectionType.NODE}>
      <ObjectNodeSettings />
    </Match>
  </Switch>
);

const Controls = () => {
  return (
    <div class={styles.container}>
      <Switch>
        <Match when={globalState.canvasMode === CanvasMode.ANIMATOR}>
          <AnimatorControls />
        </Match>
        <Match when={globalState.canvasMode === CanvasMode.OBJECT_CREATOR}>
          <CreatorControls />
        </Match>
      </Switch>
    </div>
  );
};

export default Controls;