import globalState from "../state";
import type {
  SerializableObjectNode,
  SerializablePrefabAnimationObject,
  ObjectNode,
} from "../types";
import { buildAnimationObject, setAnimationObjectRoot } from "../utilities/animationObject.util";
import { getCurrentFrame } from "../utilities/animator.util";
import { getMainCanvas } from "../utilities/canvas.util";
import {
  buildObjectNode,
  appendChildNode,
} from "../utilities/objectNode.util";
import { buildVec2 } from "../utilities/vec2.util";
import styles from "./ObjectThumbnail.module.scss";

interface IObjectThumbnailProps {
  prefab: SerializablePrefabAnimationObject;
}

const ObjectThumbnail = (props: IObjectThumbnailProps) => {
  const addObjectToFrame = () => {
    // REHYDRATE THE PREFAB
    // The prefab in props is just going to be a raw object so it'll need to be
    // instantiated in the proper classes and ids shifted
    const hydratedObject = buildAnimationObject();
    let newRoot: ObjectNode | null = null;
    hydratedObject.id = crypto.randomUUID();
    const hydrateNode = (parent: ObjectNode | null, serialNode: SerializableObjectNode) => {
      const node = buildObjectNode();
      node.object = hydratedObject;
      node.size = serialNode.size;
      node.type = serialNode.type;
      if (serialNode.image) node.image = serialNode.image;
      node.position = buildVec2(
        serialNode.position.x,
        serialNode.position.y,
      );
      if (parent) appendChildNode(parent, node);
      if (!parent) newRoot = node;
      serialNode.children.forEach(sn => hydrateNode(node, sn));
    };
    hydrateNode(null, props.prefab.object.root);
    if (!newRoot) throw new Error("The root is missing.");
    setAnimationObjectRoot(hydratedObject, newRoot);
    // CALCULATE THE CANVAS POSITION
    // When a prefab is created, the creator uses a 1:1 canvas so we'l need to 
    // find an inner "crop" position within the current canvas that is 1:1 so
    // that we can recalculate the positions for each of the nodes
    const canvas = getMainCanvas();
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
    getCurrentFrame().objects.push(hydratedObject);
    // This is a little hack to trigger rerender explicitly. I'll investigate a
    // better way to do this later
    const cfi = globalState.animator.currentFrameIndex;
    globalState.animator.currentFrameIndex = cfi;
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