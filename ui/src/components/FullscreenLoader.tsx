import { Show } from "solid-js";
import styles from "./FullscreenLoader.module.scss";
import cx from "classnames";
import globalState from "../state";

export const FullscreenLoader = () => (
  <Show when={globalState.ui.loader.isRendered}>
    <div
      class={cx(
        styles.container,
        {
          [styles.on]: globalState.ui.loader.isOpaque,
          [styles.off]: !globalState.ui.loader.isOpaque,
        }
      )}
    >
      <div class={styles.loader}></div>
      <div class={styles.loadingMessage}>{globalState.ui.loader.message}</div>
    </div>
  </Show>
);

export default FullscreenLoader;