import Frame from "../models/Frame";
import { SelectionType, currentFrameIndex, setCurrentFrameIndex, setSelectedObjects } from "../state/app";
import { updateProjectFrame } from "../state/project";
import { getFramePreviewUrl } from "../utilities/canvas";
import styles from "./FramePreview.module.scss";
import cx from "classnames";

interface IFramePreviewProps {
  frame: Frame;
  frameIndex: number;
}

const FramePreview = (props: IFramePreviewProps) => {
  const changeFrame = (e: Event) => {
    e.stopPropagation();
    setCurrentFrameIndex(props.frameIndex);
    setSelectedObjects({
      type: SelectionType.FRAME,
      objectIds: [props.frame.id],
    });
  }

  if (!props.frame.previewImage && props.frame.index !== null) {
    const previewImage = getFramePreviewUrl(props.frame);
    updateProjectFrame(props.frame.index, { previewImage })
  }

  return (
    <div
      onClick={changeFrame}
      class={cx(
        "preview-frame",
        styles.framePreviewContainer
      )}
    >
      <img
        data-frame-preview={props.frameIndex}
        class={cx(
          styles.frameImage,
          {
            [styles.selected]: currentFrameIndex() === props.frameIndex,
          },
        )}
        src={props.frame.previewImage || "/original.png"}
      />
    </div>
  );
}

export default FramePreview;