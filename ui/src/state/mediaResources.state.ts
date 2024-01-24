import { createResource } from "solid-js";
import MediaResource from "../models/MediaResource";
import { MediaResourceType } from "../types";

const builtinResources = [
  {
    id: "ae31a31d-b26d-4ba1-90be-3f49b9f2334f",
    type: MediaResourceType.IMAGE,
    url: "/dino.png",
    width: 672,
    height: 384,
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