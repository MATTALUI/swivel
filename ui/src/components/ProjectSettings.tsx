import type { JSX } from 'solid-js';
import styles from "./ProjectSettings.module.scss";

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const ProjectSettings = () => {
  const updateProjectName: InputHandler = (event) => {
    console.log("updateProjectName", event.target.value);
  }

  const updateProjectWidth: InputHandler = (event) => {
    console.log("updateProjectWidth", event.target.value);
  }

  const updateProjectHeight: InputHandler = (event) => {
    console.log("updateProjectHeight", event.target.value);
  }

  const updateProjectBackgroundColor: InputHandler = (event) => {
    console.log("updateProjectBackgroundColor", event.target.value);
  }

  return (
    <>
      <div class={styles.settingContainer}>
        <label>Project Name</label>
        <input
          type="text"
          value={"Untitled Project"}
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
              value={1920}
              onChange={updateProjectWidth}
            />
          </div>
          <div>
            <label>Height</label>
            <input
              type="text"
              value={1080}
              onchange={updateProjectHeight}
            />
          </div>
        </div>
      </div>
      <div class={styles.settingContainer}>
        <label>Background Color</label>
        <input
          type="color"
          value={"#ffffff"}
          onChange={updateProjectBackgroundColor}
        />
      </div>
    </>
  );
}

export default ProjectSettings;