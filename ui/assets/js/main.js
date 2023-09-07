(async () => {
  setTimeout(UIManager.stopFullscreenLoading, 1000);
  UIManager.initGenericEventHandlers();
  const animator = new SwivelAnimator();
})();