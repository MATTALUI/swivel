import { createResource } from "solid-js";
import { MediaResourceType, MediaResource, } from "../types";
import APIService from "../services";
import { buildMediaResource, hydrateMediaResource } from "../utilities/mediaResource.util";

const builtinResources = [
  {
    id: "default-dino",
    type: MediaResourceType.IMAGE,
    name: "Dino Party",
    url: "/dino.png",
    width: 672,
    height: 384,
  },
  {
    id: "default-logo",
    type: MediaResourceType.IMAGE,
    name: "Swivel Logo",
    url: "/original.png",
    width: 2048,
    height: 2048,
  },
];

const [signal, { mutate }] = createResource<Record<string, MediaResource>>(async () => {
  const { data: savedResources } = await APIService.getMediaResources();
  const hydratedBuiltingResources = Promise.all(
    builtinResources.map(r => hydrateMediaResource(buildMediaResource(r)))
  );
  const hydratedSavedResources = Promise.all(
    (savedResources || []).map(r => hydrateMediaResource(buildMediaResource(r)))
  );
  const allResourceSets: MediaResource[][] = await Promise.all([
    hydratedBuiltingResources,
    hydratedSavedResources,
  ]);
  return allResourceSets.flat().reduce((byId: Record<string, MediaResource>, res) => {
    byId[res.id] = res;
    return byId;
  }, {});
});

const mediaResourceState = {
  get byId() { return signal(); },
  set new(mr: MediaResource) {
    mutate({
      ...signal(),
      [mr.id]: mr,
    });
  }
};

export default mediaResourceState;