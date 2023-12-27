import type { JSX } from 'solid-js';
import styles from "./ProjectSettings.module.scss";
import {
  projectBackgroundColor,
  projectHeight,
  projectName,
  projectWidth,
  setProjectBackgroundColor,
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

  return (
    <>
      <div class={styles.settingContainer}>
        <label>Project Name</label>
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
    </>
  );
}

export default ProjectSettings;