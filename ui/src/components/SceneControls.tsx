import { RiMediaPlayFill, RiMediaRewindFill, RiMediaSkipBackFill, RiMediaSkipForwardFill, RiMediaSpeedFill, RiMediaStopFill } from "solid-icons/ri";
import globalState from "../state";
import { addFrame } from "../utilities/project.util";
import styles from "./SceneControls.module.scss";
import { Match, Switch } from "solid-js";
import { FaSolidPlus } from "solid-icons/fa";

const SceneControls = () => {
  const togglePlayback = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    globalState.animator.isPlaying = !globalState.animator.isPlaying;
    globalState.animator.selectedObjects = null;
  };

  const scrollToActive = () => {
    const previewFrames = document.querySelectorAll(".preview-frame");
    previewFrames[globalState.animator.currentFrameIndex].scrollIntoView({ behavior: "smooth" });
  };

  const addAndSelectFrame = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    addFrame();
    scrollToActive();
  };

  const goToStart = () => {
    globalState.animator.currentFrameIndex = 0;
    scrollToActive();
  };

  const goToPrevFrame = () => {
    globalState.animator.currentFrameIndex = Math.max(0, globalState.animator.currentFrameIndex - 1);
    scrollToActive();
  };

  const goToNextFrame = () => {
    globalState.animator.currentFrameIndex = Math.min(globalState.project.frames.length - 1, globalState.animator.currentFrameIndex + 1);
    scrollToActive();
  };

  const goToLastFrame = () => {
    globalState.animator.currentFrameIndex = globalState.project.frames.length - 1;
    scrollToActive();
  };

  return (
    <div class={styles.container}>
      <div>
        <button
          onClick={goToStart}
          class={styles.mediaButton}
        >
          <RiMediaSkipBackFill />
        </button>
        <button
          onClick={goToPrevFrame}
          class={styles.mediaButton}
        >
          <RiMediaRewindFill />
        </button>
        <button class={styles.mediaButton} onClick={togglePlayback}>
          <Switch >
            <Match when={!globalState.animator.isPlaying}>
              <RiMediaPlayFill />
            </Match>
            <Match when={globalState.animator.isPlaying}>
              <RiMediaStopFill />
            </Match>
          </Switch>
        </button>
        <button
          onClick={goToNextFrame}
          class={styles.mediaButton}
        >
          <RiMediaSpeedFill />
        </button>
        <button
          onClick={goToLastFrame}
          class={styles.mediaButton}
        >
          <RiMediaSkipForwardFill />
        </button>
      </div>
      <div>
        <button class={styles.mediaButton} onClick={addAndSelectFrame}>
          <FaSolidPlus />
        </button>
      </div>
    </div>
  );
};

export default SceneControls;