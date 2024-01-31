import type { JSX } from "solid-js";
import styles from "./Settings.module.scss";
import globalState from "../state";
import { updateFramePreviews } from "../utilities/project.util";

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const ProjectSettings = () => {
  const updateProjectName: InputHandler = (event) => {
    globalState.project.name = event.target.value;
  };

  const updateProjectWidth: InputHandler = (event) => {
    globalState.project.width = +event.target.value;
    updateFramePreviews();
  };

  const updateProjectHeight: InputHandler = (event) => {
    globalState.project.height = +event.target.value;
    updateFramePreviews();
  };

  const updateProjectBackgroundColor: InputHandler = (event) => {
    globalState.project.backgroundColor = event.target.value;
    updateFramePreviews();
  };

  const updateProjectFPS: InputHandler = (event) => {
    globalState.project.fps = +event.target.value;
  };

  return (
    <>
      <h2 class={styles.title}>Project</h2>
      <div class={styles.settingContainer}>
        <label>Name</label>
        <input
          type="text"
          value={globalState.project.name}
          onChange={updateProjectName}
        />
      </div>
      <div class={styles.settingContainer}>
        <label>Dimensions</label>
        <div class={styles.split}>
          <div>
            <label>Width</label>
            <input
              type="text"
              value={globalState.project.width}
              onChange={updateProjectWidth}
            />
          </div>
          <div>
            <label>Height</label>
            <input
              type="text"
              value={globalState.project.height}
              onchange={updateProjectHeight}
            />
          </div>
        </div>
      </div>
      <div class={styles.settingContainer}>
        <label>Background Color</label>
        <input
          type="color"
          value={globalState.project.backgroundColor}
          onChange={updateProjectBackgroundColor}
        />
      </div>
      <div class={styles.settingContainer}>
        <div class={styles.splitHeader}>
          <label>Frame Rate</label>
          <span>{globalState.project.fps} FPS</span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={globalState.project.fps}
          onInput={updateProjectFPS}
        />
      </div>
    </>
  );
};

export default ProjectSettings;