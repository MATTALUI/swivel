import type {
  AnimationObject,
  PrefabAnimationObject,
} from "../types";

/**
 * Creates a base prefab animation object from a provided animation object
 * 
 * @param object The object that the prefab object will represent and hydrate
 * 
 * @returns a prefab animation object
 */
export const buildPrefabAnimationObject = (
  object: AnimationObject
): PrefabAnimationObject => {
  return {
    id: crypto.randomUUID(),
    name: "Unnamed Object",
    previewImage: "",
    object,
    createdAt: new Date(),
  };
};