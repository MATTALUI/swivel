(async () => {
  // Wrap in a try catch until I can separate these concerns
  try {
    setTimeout(UIManager.stopFullscreenLoading, 1000);
    UIManager.initGenericEventHandlers();
    const animator = new SwivelAnimator();  
  } catch (e) {}

  if (window.__TAURI__) {
    const { listen } = window.__TAURI__.event;
    listen("SWIVEL::SWITCH_TOOLS", (e) => {
      const { name } = e.payload;
      console.log(name);
      window.location = name === "index" ? "/" : `/${name}.html`;
    });
  }
})();