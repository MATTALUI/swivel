import { CanvasMode, canvasMode, selectedObjects } from "../state/app";
import { Match, Switch } from "solid-js";
import styles from "./Controls.module.scss";
import ProjectSettings from "./ProjectSettings";
import FrameSettings from "./FrameSettings";
import AnimationObjectSettings from "./AnimationObjectSettings";
import ObjectCreatorSettings from "./ObjectCreatorSettings.component";

const Controls = () => {
  return (
    <div class={styles.container}>
      <Switch>
        <Match when={!selectedObjects() && canvasMode() === CanvasMode.ANIMATOR}>
          <ProjectSettings />
        </Match>
        <Match when={!selectedObjects() && canvasMode() === CanvasMode.OBJECT_CREATOR}>
          <ObjectCreatorSettings />
        </Match>
        <Match when={selectedObjects()?.type === "frame"}>
          <FrameSettings />
        </Match>
        <Match when={selectedObjects()?.type === "animationObject"}>
          <AnimationObjectSettings />
        </Match>
      </Switch>
    </div>
  );
};

export default Controls;