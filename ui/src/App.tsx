import { onMount } from "solid-js";
import FullscreenLoader from "./components/FullscreenLoader";
import SwivelAnimator from "./components/SwivelAnimator";
import { stopFullscreenLoading } from "./state/loader";

export const App = () => {
  // For now, we're just stubbing out some loading that take time at startup
  onMount(() => stopFullscreenLoading({ delayMs: 1000 }));

  return (
    <>
      <FullscreenLoader />
      <SwivelAnimator />
    </>
  )
}

export default App;
