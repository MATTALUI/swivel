import Frame from "../models/Frame";
import { currentFrameIndex, setCurrentFrameIndex } from "../state/app";
import style from "./FramePreview.module.scss";
import cx from "classnames";

interface IFramePreviewProps {
  frame: Frame;
  frameIndex: number;
}

const FramePreview = (props: IFramePreviewProps) => {
  const changeFrame = () => {
    setCurrentFrameIndex(props.frameIndex);
  }

  return (
    <div
      onClick={changeFrame}
      class={cx(
        "preview-frame",
        style.framePreviewContainer
      )}
    >
      <img
        class={cx(
          style.frameImage,
          {
            [style.selected]: currentFrameIndex() === props.frameIndex,
          },
        )}
        src={props.frame.previewImage || "/original.png"}
      />
    </div>
  );
}

export default FramePreview;