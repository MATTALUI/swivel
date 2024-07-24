import { buildFrame } from "../../ui/src/utilities/frame.util";

describe("buildFrame", () => {
  it("builds a default frame", () => {
    const frame = buildFrame();

    expect(frame.id).toBeDefined();
    expect(frame).toMatchObject({
      index: null,
      previewImage: null,
      backgroundColor: null,
    });
    expect(frame.objects).toHaveLength(2);
  });
});