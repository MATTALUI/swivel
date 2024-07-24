import ObjectNode from "../../ui/src/models/ObjectNode";
import { ObjectNodeTypes } from "../../ui/src/types";
import {
  buildAnimationObject,
  setAnimationObjectRoot,
} from "../../ui/src/utilities/animationObject.util";

describe("buildAnimationObject", () => {
  it("builds a default animation object", () => {
    const ao = buildAnimationObject();
    expect(ao.id).toBeDefined();
    expect(ao.root).toBeDefined();
    expect(ao.root.object).toEqual(ao);
  });
});

describe("setAnimationObjectRoot", () => {
  it("properly connects an object and a target root node", () => {
    const ao = buildAnimationObject();
    const oldRoot = ao.root;
    const root = {} as ObjectNode;

    setAnimationObjectRoot(ao, root);

    expect(ao.root).not.toEqual(oldRoot);
    expect(ao.root).toEqual(root);
    expect(ao.root.type).toEqual(ObjectNodeTypes.ROOT);
    expect(ao.root.object).toEqual(ao);
  });
});