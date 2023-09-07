class UIManager { }

UIManager.initGenericEventHandlers = () => {
  const loader = document.querySelector("#fullscreenLoader");
}

UIManager.startFullscreenLoading = (message="", skipAnimation=false) => {
  let loader = document.querySelector("#fullscreenLoader");
  if (loader) return;
  loader = document.createElement("div");
  loader.id = "fullscreenLoader";
  loader.classList.add("off");
  document.body.appendChild(loader);
  const spinner = document.createElement("div");
  spinner.classList.add("loader");
  loader.appendChild(spinner);
  loader.addEventListener("click", e => e.stopPropagation());

  if (message) {
    const msg = document.createElement("div");
    msg.innerHTML = message;
    msg.classList.add("loadingMessage");
    loader.appendChild(msg);
  }

  if (skipAnimation) {
    loader.classList.remove("off");
    loader.classList.add("on");
    return;
  }

  setTimeout(() => {
    loader.classList.remove("off");
    loader.classList.add("on");
  }, 10);
};

UIManager.stopFullscreenLoading = () => {
  const loader = document.querySelector("#fullscreenLoader");
  if (!loader) return;
  loader.classList.remove("on");
  loader.classList.add("off");
  setTimeout(() => {
    loader.remove();
  }, 255); // Enough time frot he animation to finish
};