import Frame from "./Frame";

export const buildFramePreview = (frame: Frame, index = 0, selectedIndex: number | null = null) => {
  const template: HTMLTemplateElement | null = document.querySelector("#framePreviewTemplate");

  if (!template) {
    throw new Error(`Cannot find template: #framePreviewTemplate`);
  }

  const node = template.content.cloneNode(true) as HTMLDivElement;

  const container = node.querySelector<HTMLDivElement>(".framePreviewContainer");
  const framePreview = node.querySelector<HTMLImageElement>(".framePreview");
  const noPreview = node.querySelector<HTMLDivElement>(".noPreview");
  const isSelected = index === selectedIndex;

  if (!container || !framePreview || !noPreview) {
    throw new Error("Cannot build frame preview: missing template components");
  }

  const setFrameIndex = (e) => {
    window.dispatchEvent(new CustomEvent("SWIVEL::framechange", {
      detail: { index, }
    }));
  }

  container.setAttribute('data-frame-index', index.toString());
  if (frame.previewImage) {
    framePreview.src = frame.previewImage;
    framePreview.alt = `Frame ${index + 1}`
    framePreview.addEventListener("click", setFrameIndex);
    noPreview.remove();
    if (isSelected) {
      framePreview.style.borderBottom = `5px solid green`;
      framePreview.style.borderTop = `5px solid green`;
    }
  } else {
    noPreview.addEventListener("click", setFrameIndex);
    framePreview.remove();
  }

  return node;
};