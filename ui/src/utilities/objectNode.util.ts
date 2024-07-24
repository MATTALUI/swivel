import { ObjectNode, ObjectNodeTypes } from "../types";
import { buildVec2 } from "./vec2.util";

export const buildObjectNode = (): ObjectNode => {
  return {
    id: crypto.randomUUID(),
    object: null,
    parent: null,
    position: buildVec2(),
    children: [],
    size: 5,
    width: null,
    height: null,
    type: ObjectNodeTypes.DEFAULT,
  };
};

export const nodeIsRoot = (
  node: ObjectNode
): boolean => {
  return !node.parent;
};

export const appendChildNode = (
  parent: ObjectNode,
  child: ObjectNode,
) => {
  child.object = parent.object;
  child.parent = parent;
  parent.children.push(child);
};

export const getNodeRoot = (node: ObjectNode) => {
  let root: ObjectNode = node;
  while (root.parent) {
    root = root.parent;
  }
  return root;
};

export const detachNode = (
  node: ObjectNode
) => {
  if (nodeIsRoot(node) || !node.parent) return;
  node.parent.children =
    node.parent.children.filter(c => c.id !== node.id);
  node.parent = null;
  node.object = null;
};