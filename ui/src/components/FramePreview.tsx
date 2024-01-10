import Frame from "../models/Frame";
import globalState from "../state";
import { SelectionType } from "../state/animator.state";
import { getFramePreviewUrl } from "../utilities/canvas";
import { updateFrame } from "../utilities/project.util";
import styles from "./FramePreview.module.scss";
import cx from "classnames";

interface IFramePreviewProps {
  frame: Frame;
  frameIndex: number;
}

const FramePreview = (props: IFramePreviewProps) => {
  const changeFrame = (e: Event) => {
    e.stopPropagation();
    globalState.animator.currentFrameIndex = props.frameIndex;
    globalState.animator.selectedObjects = {
      type: SelectionType.FRAME,
      objectIds: [props.frame.id],
    };
  };

  if (!props.frame.previewImage && props.frame.index !== null) {
    const previewImage = getFramePreviewUrl(props.frame);
    updateFrame(props.frame.index, { previewImage });
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
            [styles.selected]: globalState.animator.currentFrameIndex === props.frameIndex,
          },
        )}
        src={props.frame.previewImage || "/original.png"}
      />
    </div>
  );
};

export default FramePreview;