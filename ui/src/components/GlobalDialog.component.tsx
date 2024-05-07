import { Show } from "solid-js";
import styles from "./GlobalDialog.module.scss";
import cx from "classnames";
import globalState from "../state";
import { AiOutlineCloseCircle } from "solid-icons/ai";
import { closeGlobalDialog } from "../utilities/ui.util";

const GlobalDialog = () => {
  return (
    <Show when={globalState.ui.dialog.isRendered}>
      <div
        onClick={() => closeGlobalDialog()}
        data-testid="dialog-container"
        class={cx(
          styles.container,
          {
            [styles.on]: globalState.ui.dialog.isOpaque,
            [styles.off]: !globalState.ui.dialog.isOpaque,
          }
        )}
      >
        <div
          class={styles.dialog}
          onClick={(e) => e.stopPropagation()}
        >
          <div class={styles.header}>
            <div class={styles.title}>{globalState.ui.dialog.title}</div>
            <div class={styles.close}>
              <AiOutlineCloseCircle onClick={() => closeGlobalDialog()} />
            </div>
          </div>
          <div class={styles.text}>{globalState.ui.dialog.text}</div>
          <Show when={globalState.ui.dialog.hasCBRegistered}>
            <div class={styles.actions}>
              <Show when={!!globalState.ui.dialog.affirmativeCB}>
                <button
                  onClick={globalState.ui.dialog.affirmativeCB}
                  class={styles.affirmative}
                >
                  Yes
                </button>
              </Show>
              <Show when={!!globalState.ui.dialog.negativeCB}>
                <button
                  onClick={globalState.ui.dialog.negativeCB}
                >
                  No
                </button>
              </Show>
              <Show when={!!globalState.ui.dialog.neutralCB}>
                <button
                  onClick={globalState.ui.dialog.neutralCB}
                >
                  Okay
                </button>
              </Show>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};

export default GlobalDialog;