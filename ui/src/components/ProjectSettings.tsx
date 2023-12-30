import type { JSX } from 'solid-js';
import styles from "./Settings.module.scss";
import {
  projectBackgroundColor,
  projectFPS,
  projectHeight,
  projectName,
  projectWidth,
  setProjectBackgroundColor,
  setProjectFPS,
  setProjectHeight,
  setProjectName,
  setProjectWidth,
  updateFramePreviews,
} from '../state/project';

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const ProjectSettings = () => {
  const updateProjectName: InputHandler = (event) => {
    setProjectName(event.target.value);
  }

  const updateProjectWidth: InputHandler = (event) => {
    setProjectWidth(+event.target.value);
    updateFramePreviews();
  }

  const updateProjectHeight: InputHandler = (event) => {
    setProjectHeight(+event.target.value);
    updateFramePreviews();
  }

  const updateProjectBackgroundColor: InputHandler = (event) => {
    setProjectBackgroundColor(event.target.value);
    updateFramePreviews();
  }

  const updateProjectFPS:InputHandler = (event) => {
    setProjectFPS(+event.target.value);
  }

  return (
    <>
      <h2 class={styles.title}>Project</h2>
      <div class={styles.settingContainer}>
        <label>Name</label>
        <input
          type="text"
          value={projectName()}
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
              value={projectWidth()}
              onChange={updateProjectWidth}
            />
          </div>
          <div>
            <label>Height</label>
            <input
              type="text"
              value={projectHeight()}
              onchange={updateProjectHeight}
            />
          </div>
        </div>
      </div>
      <div class={styles.settingContainer}>
        <label>Background Color</label>
        <input
          type="color"
          value={projectBackgroundColor()}
          onChange={updateProjectBackgroundColor}
        />
      </div>
      <div class={styles.settingContainer}>
        <label>Frame Rate</label>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={projectFPS()}
          onChange={updateProjectFPS}
        />
      </div>
    </>
  );
}

export default ProjectSettings;