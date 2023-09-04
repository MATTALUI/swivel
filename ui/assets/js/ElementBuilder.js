class ElementBuilder { }

ElementBuilder.buildFramePreview = (frame, index = 0) => {
  const template = document.querySelector("#framePreviewTemplate");
  const node = template.content.cloneNode(true);

  const container = node.querySelector(".framePreviewContainer");
  const framePreview = node.querySelector(".framePreview");
  const noPreview = node.querySelector(".noPreview");

  container.setAttribute('data-frame-index', index.toString());
  if (frame.previewImage) {
    framePreview.src = frame.previewImage;
    framePreview.alt = `Frame ${index + 1}`
    noPreview.remove();
  } else {
    framePreview.remove();
  }

  return node;
};