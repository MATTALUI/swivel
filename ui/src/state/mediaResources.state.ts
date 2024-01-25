import { createResource } from "solid-js";
import MediaResource from "../models/MediaResource";
import { MediaResourceType } from "../types";

const builtinResources = [
  {
    id: "default-dino",
    type: MediaResourceType.IMAGE,
    url: "/dino.png",
    width: 672,
    height: 384,
  },
  {
    id: "default-logo",
    type: MediaResourceType.IMAGE,
    url: "/original.png",
    width: 2048,
    height: 2048,
  },
];

const [signal] = createResource(async () => {
  const hydratedBuiltingResources = Promise.all(
    builtinResources.map(r => new MediaResource(r).hydrate())
  );
  const allResourceSets: MediaResource[][] = await Promise.all([hydratedBuiltingResources]);
  return allResourceSets.flat().reduce((byId: Record<string, MediaResource>, res) => {
    byId[res.id] = res;
    return byId;
  }, {});
});

const mediaResourceState = {
  get byId() { return signal(); },
};

export default mediaResourceState;