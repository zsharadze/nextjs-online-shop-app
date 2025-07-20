export const showLoader = (show: boolean) => {
  let overlayElement = document?.getElementById("loading-overlay");
  if (show) {
    overlayElement?.classList?.remove("d-none");
    overlayElement?.classList?.add("d-block");
  } else {
    overlayElement?.classList?.remove("d-block");
    overlayElement?.classList?.add("d-none");
  }
};
