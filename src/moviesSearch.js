var w;

function itsoffline() {
  document.getElementById("tempid2").style.display = "block";
  document.getElementById("tempid2").innerHTML = "offline";
}

const searchMovies = () => {
  if (event.key === "Enter") {
    document.getElementById("tempid2").style.display = "none";
    let inputemp = document.getElementById("search-id");
    let filter;
    filter = inputemp.value;
    if (false) {
      document.getElementById("tempid2").style.display = "block";
      document.getElementById("tempid2").innerHTML = "offline";
    } else {
      //console.log(filter);
      if (typeof Worker !== "undefined") {
        // Yes! Web worker support!
        if (typeof w !== "undefined") {
          stopWorker();
        }
        w = new Worker("src/movies_worker.js");
        w.postMessage(filter);
        w.onmessage = function (e) {
          if (typeof e.data === "string") {
            document.getElementById("scriptmid").innerHTML = e.data;
            if (e.data.includes(" / ")) {
              const mynums = e.data.split(" / ");
              document.getElementById("progress").style.width =
                parseInt(
                  (parseFloat(mynums[0]) / parseFloat(mynums[1])) * 100.0
                ).toString() + "%";
            }
          } else if (e.data === "offline") {
            itsoffline();
          } else {
            console.log("Message received from worker");
            console.log(document.getElementById("progress").style.width);
            document.getElementById("movie-id").innerHTML =
              '<div class="scripts-num" id="scriptmid">' +
              document.getElementById("scriptmid").innerHTML +
              "</div>" +
              '<div class="meter"> <div id="progress" style="width:' +
              document.getElementById("progress").style.width +
              '"></div> </div> <p id="tempid2"></p>';
            for (var k = 0; k < e.data.length; k++) {
              let myb = document.createElement("button");

              myb.value = e.data[k].title;
              var regex = new RegExp(filter, "ig");
              var text = e.data[k].title;
              var newtext = text.replace(regex, "<b>$&</b>");
              //console.log(newtext);
              myb.innerHTML = newtext;
              myb.value = e.data[k].url;

              myb.addEventListener("click", () => {
                console.log("click");
                window.open(myb.value);
              });
              document.getElementById("movie-id").appendChild(myb);
            }
          }
          //console.log(e.data);
        };
      } else {
        console.log("Sorry! No Web Worker support..");
      }
    }
  }
};

function stopWorker() {
  w.terminate();
  w = undefined;
}

function processFilms(data) {
  console.log(data);
}
