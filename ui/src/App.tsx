import { onMount } from "solid-js";
import { Router, Route } from "@solidjs/router";
import FullscreenLoader from "./components/FullscreenLoader";
import SwivelAnimator from "./components/SwivelAnimator";
import { stopFullscreenLoading } from "./state/loader";
import MapPainter from "./components/MapPainter";

export const App = () => {
  // For now, we're just stubbing out some loading that take time at startup
  onMount(() => stopFullscreenLoading({ delayMs: 1000 }));

  return (
    <>
      <FullscreenLoader />
      <Router>
        <Route path="/" component={SwivelAnimator} />
        <Route path="/mappainter" component={MapPainter} />
      </Router>
    </>
  )
}

export default App;
