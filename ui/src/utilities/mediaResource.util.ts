import {
  MediaResourceType,
  type MediaResource,
  type MediaResourceConstructorArgs,
} from "../types";

/**
 * Builds a base media resource object
 * 
 * @param properties requires `type` and `url` as well as provides a means of \
 * overriding default properties
 * 
 * @returns created media resource with properties applied
 */
export const buildMediaResource = (
  properties: MediaResourceConstructorArgs
): MediaResource => {
  return {
    id: crypto.randomUUID(),
    name: "Unnamed Resource",
    width: 0,
    height: 0,
    element: null,
    ...properties,
  };
};

/**
 * Nondestructively removes all non-cloneable data from a media--like \
 * references to loaded media elements--in order to aid in resource object \
 * serialization.
 * 
 * @param resource the media resource to strip
 * 
 * @returns a clone of the provided media resource with data removed
 */
export const stripResource = (resource: MediaResource): MediaResource => {
  return {
    ...resource,
    element: null,
  };
};

/**
 * populates the media dependencies and data needed in order to make use of the\
 * media resource that is provided
 * 
 * @param resource The base resource that should be hydrates
 * 
 * @returns a hydrated version of the resource provided
 */
export const hydrateMediaResource = async (
  resource: MediaResource
): Promise<MediaResource> => {
  if (resource.element) resource;
  return new Promise((resolve) => {
    switch (resource.type) {
    case MediaResourceType.IMAGE: {
      resource.element = new Image() as HTMLImageElement;
      resource.element.src = resource.url;
      const onload = () => {
        resource.element?.removeEventListener("load", onload);
        if (!resource.height) resource.height = resource.element?.height || 0;
        if (!resource.width) resource.width = resource.element?.width || 0;
        resolve(resource);
      };
      resource.element.addEventListener("load", onload);
    }
    }
  });
};