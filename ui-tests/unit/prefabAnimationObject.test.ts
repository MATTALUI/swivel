import { buildAnimationObject } from "../../ui/src/utilities/animationObject.util";
import {
  buildPrefabAnimationObject,
} from "../../ui/src/utilities/prefabAnimationObject.util";

describe("buildPrefabAnimationObject", () => {
  it("builds a base prefab animation object from an animation object", () => {
    const ao = buildAnimationObject();
    const prefab = buildPrefabAnimationObject(ao);

    expect(prefab.object).toEqual(ao);
    expect(prefab.id).toBeDefined();
    expect(prefab).toMatchObject({
      name: "Unnamed Object",
      previewImage: "",
    });
  });
});