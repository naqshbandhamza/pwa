if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registeration) => {
      console.log("SW registered!!!");
      //console.log(registeration);
    })
    .catch((error) => {
      console.log("SW registeration failed");
      console.log(error);
    });
}
