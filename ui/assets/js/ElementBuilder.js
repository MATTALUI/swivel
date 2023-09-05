class ElementBuilder { }

ElementBuilder.buildFramePreview = (frame, index = 0, selectedIndex = null) => {
  const template = document.querySelector("#framePreviewTemplate");
  const node = template.content.cloneNode(true);

  const container = node.querySelector(".framePreviewContainer");
  const framePreview = node.querySelector(".framePreview");
  const noPreview = node.querySelector(".noPreview");
  const isSelected = index === selectedIndex;

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