import { For, onMount } from "solid-js";
import styles from "./FrameObjectsManager.module.scss";
import controlStyles from "./Settings.module.scss";
import ObjectThumbnail from "./ObjectThumbnail";
import AnimationObject from "../models/AnimationObject";
import globalState from "../state";
import { CanvasMode } from "../types";

const FrameObjectsManager = () => {
  let container: HTMLDivElement | undefined;
  let scroller: HTMLDivElement | undefined;

  const startCreateCanvas = () => {
    globalState.canvasMode = CanvasMode.OBJECT_CREATOR;
    const newObject = new AnimationObject();
    globalState.creator.object = newObject;
    globalState.creator.controllableNodes = [newObject.root];
  };

  const setScrollerHeight = () => {
    if (!container || !scroller) return;
    scroller.style.height = "0px";
    const height = container.getBoundingClientRect().height;
    scroller.style.height = `${height}px`;
  };
  onMount(setScrollerHeight);
  window.addEventListener("resize", setScrollerHeight);

  return (
    <>
      <h2 class={controlStyles.title}>Objects</h2>
      <div>
        <button
          onClick={startCreateCanvas}
          class={styles.newButton}
        >
          Create New
        </button>
      </div>
      <div ref={container} class={styles.objectsListContainer}>
        <div ref={scroller} class={styles.scroller}>
          <For each={globalState.animator.savedObjects}>
            {(prefab) => (<ObjectThumbnail prefab={prefab}/>)}
          </For>
        </div>
      </div>
    </>
  );
};

export default FrameObjectsManager;