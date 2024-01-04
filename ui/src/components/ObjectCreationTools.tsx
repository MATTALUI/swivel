import { For } from "solid-js";
import styles from "./ObjectCreationTools.module.scss";
import { AiOutlinePlus } from "solid-icons/ai";
import { TbHandGrab } from "solid-icons/tb";
import { BiRegularBorderOuter } from "solid-icons/bi";

const ObjectCreationTools = () => {
  const tools = [
    { Icon: TbHandGrab },
    { Icon: AiOutlinePlus },
    { Icon: BiRegularBorderOuter },
  ];
  return (
    <>
      <h2 class={styles.title}>Tools</h2>
      <div class={styles.toolsContainer}>
        <For each={tools}>
          {(tool) => (
            <button
              class={styles.toolButton}
            >
              <tool.Icon />
            </button>
          )}
        </For>
      </div>
    </>
  )
}

export default ObjectCreationTools;