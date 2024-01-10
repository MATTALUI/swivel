import globalState from "../state";
import { SelectionType } from "../state/animator.state";
import { getCurrentFrame } from "../utilities/animator.utils";
import { drawFrameToCanvas, getMainCanvas } from "../utilities/canvas";
import { updateFrame } from "../utilities/project.util";
import styles from "./Settings.module.scss";

const AnimationObjectSettings = () => {
  const removeObjects = () => {
    const selection = globalState.animator.selectedObjects;
    if (selection?.type !== SelectionType.ANIMATION_OBJECT)
      throw new Error("Non AnimationObject is selected");
    const { objectIds } = selection;
    const cf = getCurrentFrame();
    cf.objects = cf.objects.filter(o => !objectIds.includes(o.id));
    updateFrame(globalState.animator.currentFrameIndex);
    drawFrameToCanvas(getMainCanvas(), getCurrentFrame(), {});
    globalState.animator.selectedObjects = null; // You've just deleted everything selected
  };

  return (
    <>
      <h2 class={styles.title}>Object</h2>
      <div class={styles.settingContainer}>
        <button
          onClick={removeObjects}
          class={styles.danger}
        >
          Remove
        </button>
      </div>
    </>
  );
};

export default AnimationObjectSettings;