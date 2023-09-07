(async () => {
  setTimeout(UIManager.stopFullscreenLoading, 1000);
  UIManager.initGenericEventHandlers();
  const animator = new SwivelAnimator();
  
  // console.log("hello!");
  // const { invoke } = window.__TAURI__.tauri
  // const response = await invoke("greet", { name: "Matt!" })
  // const msg = document.createElement('p');
  // msg.innerHTML = response;

  // document.querySelector("body").appendChild(msg);
})();