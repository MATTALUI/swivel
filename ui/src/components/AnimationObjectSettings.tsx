import globalState from "../state";
import { SelectionType, currentFrame, currentFrameIndex, selectedObjects, setSelectedObjects } from "../state/app";
import { drawFrameToCanvas, getMainCanvas } from "../utilities/canvas";
import styles from "./Settings.module.scss";

const AnimationObjectSettings = () => {
  const removeObjects = () => {
    const selection = selectedObjects();
    if (selection?.type !== SelectionType.ANIMATION_OBJECT)
      throw new Error("Non AnimationObject is selected");
    const { objectIds } = selection;
    const cf = currentFrame();
    cf.objects = cf.objects.filter(o => !objectIds.includes(o.id));
    globalState.project.updateFrame(currentFrameIndex());
    drawFrameToCanvas(getMainCanvas(), currentFrame(), {});
    setSelectedObjects(null); // You've just deleted everything selected
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