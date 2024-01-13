import { For } from "solid-js";
import styles from "./ObjectCreationTools.module.scss";
import { AiOutlinePlus } from "solid-icons/ai";
import { TbHandGrab } from "solid-icons/tb";
import cx from "classnames";
import { CanvasMode, CreatorToolNames } from "../types";
import globalState from "../state";
// import { BiRegularBorderOuter } from "solid-icons/bi";

const ObjectCreationTools = () => {
  const tools = [
    { Icon: TbHandGrab, name: CreatorToolNames.SELECT },
    { Icon: AiOutlinePlus, name: CreatorToolNames.ADD },
    // { Icon: BiRegularBorderOuter, name: CreatorToolNames.GROUP },
  ];

  const cancelObjectCreation = () => {
    globalState.canvasMode = CanvasMode.ANIMATOR;
    globalState.creator.reset();
  }

  return (
    <>
      <h2 class={styles.title}>Tools</h2>
      <div class={styles.toolsContainer}>
        <For each={tools}>
          {(tool) => (
            <button
              onClick={() => globalState.creator.currentTool = tool.name}
              class={cx(styles.toolButton, {
                [styles.active]: tool.name === globalState.creator.currentTool
              })}
            >
              <tool.Icon />
            </button>
          )}
        </For>
      </div>
      <div>
        <button
          onClick={cancelObjectCreation}
          class={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ObjectCreationTools;