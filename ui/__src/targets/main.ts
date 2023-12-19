import SwivelAnimator from "../SwivelAnimator";
import Tauri from "../Tauri";
import { stopFullscreenLoading } from "../UIManager";

(async () => {
  setTimeout(stopFullscreenLoading, 1000);
  const animator = new SwivelAnimator();

  if (Tauri) {
    const { listen } = Tauri.event;
    listen("SWIVEL::SWITCH_TOOLS", (e) => {
      const { name } = e.payload;
      console.log(name);
      window.location.href = name === "index" ? "/" : `/${name}.html`;
    });
  }
})();