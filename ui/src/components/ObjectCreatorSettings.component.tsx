import { JSX } from "solid-js";
import controlStyles from "./Settings.module.scss";
import { creationObject, newObjectName, setCreationObject, setNewObjectName } from "../state/objectCreator";
import { saveSwivelObject } from "../utilities/tauri";
import { CanvasMode } from "../state/animator.state";
import PrefabAnimationObject from "../models/PrefabAnimationObject";
import globalState from "../state";

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const ObjectCreatorSettings = () => {
  const updateNewObjectName:InputHandler = (event) => {
    setNewObjectName(event.target.value);
  };

  const saveObject = async () => {
    const object = creationObject();
    if (!object) throw new Error("Trying to save nonexistant object?");
    const prefab = new PrefabAnimationObject(object);
    prefab.name = newObjectName();
    prefab.previewImage = document.querySelector("canvas")?.toDataURL() || "";
    await saveSwivelObject(prefab);
    await globalState.animator.refetchSavedObjects();
    setCreationObject(null);
    globalState.animator.canvasMode = CanvasMode.ANIMATOR;
  };

  return (
    <>
      <h2 class={controlStyles.title}>New Object</h2>
      <div class={controlStyles.settingContainer}>
        <label>Object Name</label>
        <input
          type="text"
          value={newObjectName()}
          onChange={updateNewObjectName}
        />
      </div>
      <div class={controlStyles.settingContainer}>
        <button
          onClick={saveObject}
          class={controlStyles.primary}
        >
          Save Object
        </button>
      </div>
    </>
  );
};

export default ObjectCreatorSettings;