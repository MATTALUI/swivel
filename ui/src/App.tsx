import { onMount } from "solid-js";
import { Router, Route } from "@solidjs/router";
import FullscreenLoader from "./components/FullscreenLoader";
import SwivelAnimator from "./components/SwivelAnimator";
import { shortPollUntil, stopFullscreenLoading } from "./utilities/ui.util";
import MapPainter from "./components/MapPainter";
import globalState from "./state";

export const App = () => {
  // For now, we're just stubbing out some loading that take time at startup
  onMount(async () => {
    await Promise.all([
      shortPollUntil(() => !!globalState.mediaResources.byId),
      new Promise(res => setTimeout(res, 1000)), // Min 1s
    ]);
    stopFullscreenLoading();
  });

  return (
    <>
      <FullscreenLoader />
      <Router>
        <Route path="/" component={SwivelAnimator} />
        <Route path="/mappainter" component={MapPainter} />
      </Router>
    </>
  );
};

export default App;
