import { selectedObjects } from "../state/app";
import { JSX } from "solid-js";
import { SelectionType } from "../state/app";
import styles from "./Controls.module.scss";
import ProjectSettings from "./ProjectSettings";
import FrameSettings from "./FrameSettings";

const DEFAULT = "DEFAULT";
type MapKey = SelectionType | "DEFAULT";
const selectedControlsMap: Record<MapKey, JSX.Element | null> = {
  frame: <FrameSettings />,
  animationObject: null,
  [DEFAULT]: <ProjectSettings />,
};

const Controls = () => {
  return (
    <div class={styles.container}>
      {selectedControlsMap[selectedObjects()?.type || DEFAULT]}
    </div>
  )
}

export default Controls;