import PrefabAnimationObject from "../models/PrefabAnimationObject";
import styles from "./ObjectThumbnail.module.scss";

interface IObjectThumbnailProps {
  prefab: PrefabAnimationObject;
}

const ObjectThumbnail = (props: IObjectThumbnailProps) => {
  const addObjectToFrame = () => {
    console.log("addObjectToFrame");
  }

  return (
    <div
      onClick={addObjectToFrame}
      class={styles.thumbnail}
    >
      <img src={props.prefab.previewImage || "/original.png"} />
      <span class={styles.name}>{props.prefab.name}</span>
    </div>
  );
}

export default ObjectThumbnail;