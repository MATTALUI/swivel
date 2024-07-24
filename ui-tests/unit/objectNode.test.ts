import { ObjectNodeTypes } from "../../ui/src/types";
import {
  buildAnimationObject,
} from "../../ui/src/utilities/animationObject.util";
import {
  buildObjectNode,
  nodeIsRoot,
  appendChildNode,
  getNodeRoot,
  detachNode,
} from "../../ui/src/utilities/objectNode.util";

describe("buildObjectNode", () => {
  it("builds a default object node", () => {
    const node = buildObjectNode();

    expect(node.id).toBeDefined();
    expect(node).toMatchObject({
      object: null,
      parent: null,
      position: { x: 0.5, y: 0.5 },
      children: [],
      size: 5,
      width: null,
      height: null,
      type: ObjectNodeTypes.DEFAULT,
    });
  });
});

describe("nodeIsRoot", () => {
  it("determines when a node is a root node", () => {
    const node = buildObjectNode();
    expect(nodeIsRoot(node)).toBeTruthy();
  });

  it("determines when a node is not a root node", () => {
    const node = buildObjectNode();
    const parent = buildObjectNode();

    appendChildNode(parent, node);

    expect(nodeIsRoot(node)).toBeFalsy();
  });
});

describe("appendChildNode", () => {
  it("correctly sets up relationship between parent and child nodes", () => {
    const node = buildObjectNode();
    const parent = buildObjectNode();
    parent.object = buildAnimationObject();

    appendChildNode(parent, node);

    expect(parent.object).toEqual(node.object);
    expect(node.parent).toEqual(parent);
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toEqual(node);
  });
});

describe("getNodeRoot", () => {
  it("returns the node when the node is the root", () => {
    const root = buildObjectNode();

    expect(getNodeRoot(root)).toEqual(root);
  });

  it("finds the root node when node is descendant", () => {
    const root = buildObjectNode();
    const parent = buildObjectNode();
    const child = buildObjectNode();

    appendChildNode(root, parent);
    appendChildNode(parent, child);


    expect(getNodeRoot(child)).toEqual(root);
  });
});

describe("detachNode", () => {
  it("does nothing for root nodes", () => {
    const root = buildObjectNode();
    const sibling = buildObjectNode();
    const child = buildObjectNode();

    appendChildNode(root, sibling);
    appendChildNode(root, child);

    expect(root.parent).toBeNull();
    expect(root.children).toHaveLength(2);

    detachNode(root);

    expect(root.parent).toBeNull();
    expect(root.children).toHaveLength(2);
  });

  it("removes node from parent", () => {
    const root = buildObjectNode();
    const sibling = buildObjectNode();
    const child = buildObjectNode();

    appendChildNode(root, sibling);
    appendChildNode(root, child);

    expect(child.parent).toEqual(root);

    detachNode(child);

    expect(child.parent).toBeNull();
    expect(root.children).toHaveLength(1);
    expect(root.children[0]).toEqual(sibling);
  });
});