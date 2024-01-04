import { For, onMount } from "solid-js";
import styles from "./FrameObjectsManager.module.scss";
import controlStyles from "./Settings.module.scss";
import ObjectThumbnail from "./ObjectThumbnail";
import { CanvasMode, setCanvasMode } from "../state/app";

const FrameObjectsManager = () => {
  let container: HTMLDivElement | undefined;
  let scroller: HTMLDivElement | undefined;

  const startCreateCanvas = () => {
    setCanvasMode(CanvasMode.OBJECT_CREATOR);
  }

  const setScrollerHeight = () => {
    if (!container || !scroller) return;
    scroller.style.height = '0px';
    const height = container.getBoundingClientRect().height;
    scroller.style.height = `${height}px`;
  }
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
          <For each={new Array(30)}>
            {() => (<ObjectThumbnail />)}
          </For>
        </div>
      </div>
    </>
  );
}

export default FrameObjectsManager;