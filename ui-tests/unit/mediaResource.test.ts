import { MediaResourceType } from "../../ui/src/types";
import {
  buildMediaResource,
  hydrateMediaResource,
} from "../../ui/src/utilities/mediaResource.util";

describe("buildMediaResource", () => {
  it("builds a resource with provided properties", () => {
    const base = {
      type: MediaResourceType.IMAGE,
      url: "example.com",
      width: 69,
    };
    const resource = buildMediaResource(base);

    expect(resource.id).toBeDefined();
    expect(resource).toMatchObject({
      element: null,
      height: 0,
      name: "Unnamed Resource",
      type: "IMAGE",
      url: "example.com",
      width: 69,
    });
  });
});

describe("hydrateMediaResource", () => {
  it.skip("properly hydrates image resources", async () => {
    const resource = buildMediaResource({
      type: MediaResourceType.IMAGE,
      url: "example.com",
    });

    expect(resource.element).toBeNull();

    const _hydrationPromise = hydrateMediaResource(resource);

    expect(resource.element).toBeDefined();
  });
});