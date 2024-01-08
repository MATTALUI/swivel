import AnimationObject from "../models/AnimationObject";
import ObjectNode, { SerializableObjectNode } from "../models/ObjectNode";
import { SerializablePrefabAnimationObject } from "../models/PrefabAnimationObject";
import Vec2 from "../models/Vec2";
import { currentFrame, setCurrentFrameIndex } from "../state/app";
import styles from "./ObjectThumbnail.module.scss";

interface IObjectThumbnailProps {
  prefab: SerializablePrefabAnimationObject;
}

const ObjectThumbnail = (props: IObjectThumbnailProps) => {
  const addObjectToFrame = () => {
    console.log("addObjectToFrame");
    // REHYDRATE THE PREFAB
    // The prefab in props is just going to be a raw object so it'll need to be
    // instantiated in the proper classes and ids shifted
    const hydratedObject = new AnimationObject();
    let newRoot: ObjectNode | null = null;
    hydratedObject.id = crypto.randomUUID();
    const hydrateNode = (parent: ObjectNode | null, serialNode: SerializableObjectNode) => {
      const node = new ObjectNode();
      node.object = hydratedObject;
      node.size = serialNode.size;
      node.setPosition(new Vec2(
        serialNode.position.x,
        serialNode.position.y,
      ));
      if (parent) parent.appendChild(node);
      if (!parent) newRoot = node;
      serialNode.children.forEach(sn => hydrateNode(node, sn));
    };
    hydrateNode(null, props.prefab.object.root);
    if (!newRoot) throw new Error("The root is missing.");
    hydratedObject.setRoot(newRoot);
    // CALCULATE THE CANVAS POSITION
    // When a prefab is created, the creator uses a 1:1 canvas so we'l need to 
    // find an inner "crop" position within the current canvas that is 1:1 so
    // that we can recalculate the positions for each of the nodes
    const canvas = document.querySelector<HTMLCanvasElement>("canvas");
    if (!canvas) throw new Error("Could not find the canvas");
    const cropPadding = 20; // Give some padding so nodes don't touch the edge
    const {
      width: canvasWidth,
      height: canvasHeight,
    } = canvas;
    const minSize = Math.min(canvasWidth, canvasHeight);
    const innerCanvasSize = minSize - (cropPadding * 2);
    // We want the inner canvas to be centered so we apply an offset
    const innerCanvasXOffset = (canvasWidth - innerCanvasSize) / 2;
    const innerCanvasYOffset = (canvasHeight - innerCanvasSize) / 2;
    // REPOSITION ALL NODES
    const repositionNode = (node: ObjectNode) => {
      node.children.forEach(repositionNode);
      // px position for inner canvas
      const innerXPX = node.position.x * innerCanvasSize;
      const innerYPX = node.position.y * innerCanvasSize;
      // px position for outer canvas
      const outerXPX = innerXPX + innerCanvasXOffset;
      const outerYPX = innerYPX + innerCanvasYOffset;
      // pct position for outer canvas
      const newX = outerXPX / canvasWidth;
      const newY = outerYPX / canvasHeight;


      node.position.x = newX;
      node.position.y = newY;
    };
    repositionNode(hydratedObject.root);
    // Update scene and retrigger rerender
    currentFrame().objects.push(hydratedObject);
    setCurrentFrameIndex(i => i);
  };

  return (
    <div
      onClick={addObjectToFrame}
      class={styles.thumbnail}
    >
      <img src={props.prefab.previewImage || "/original.png"} />
      <span class={styles.name}>{props.prefab.name}</span>
    </div>
  );
};

export default ObjectThumbnail;