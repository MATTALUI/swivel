import styles from "./ObjectThumbnail.module.scss";

const ObjectThumbnail = () => {
  const addObjectToFrame = () => {
    console.log("addObjectToFrame");
  }

  return (
    <div
      onClick={addObjectToFrame}
      class={styles.thumbnail}
    >
      <img src="https://picsum.photos/200/200" />
    </div>
  );
}

export default ObjectThumbnail;