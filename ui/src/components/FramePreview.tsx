import Frame from "../models/Frame";
import style from "./FramePreview.module.scss";

interface IFramePreviewProps {
  frame: Frame;
}

const FramePreview = (props: IFramePreviewProps) => {
  return (
    <div class={style.framePreviewContainer}>
      <img
        class={style.frameImage}
        src={props.frame.previewImage || "/original.png"}
      />
    </div>
  );
}

export default FramePreview;