import { selectedObjects } from "../state/app";
import { Match, Switch } from "solid-js";
import styles from "./Controls.module.scss";
import ProjectSettings from "./ProjectSettings";
import FrameSettings from "./FrameSettings";
import AnimationObjectSettings from "./AnimationObjectSettings";

const Controls = () => {
  return (
    <div class={styles.container}>
      <Switch fallback={<ProjectSettings />}>
        <Match when={selectedObjects()?.type === "frame"}>
          <FrameSettings />
        </Match>
        <Match when={selectedObjects()?.type === "animationObject"}>
          <AnimationObjectSettings />
        </Match>
      </Switch>
    </div>
  )
}

export default Controls;