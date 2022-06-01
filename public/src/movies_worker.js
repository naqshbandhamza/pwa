let searchTerm = null;

self.addEventListener(
  "message",
  function (e) {
    // the passed-in data is available via e.data
    searchTerm = e.data;
    importScripts("movieObj.js");
  },
  false
);

function itsoffline(data) {
  postMessage("offline");
}

let results = [];

function processFilms(data) {
  if (searchTerm !== null) {
    let entries = Object.entries(data);
    let total_data = entries.length;
    let count = 0;
    for (const [key, value] of entries) {
      let n = value.title.toLowerCase().includes(searchTerm.toLowerCase());
      if (n) {
        //console.log(value.title);
        postMessage((count + 1).toString() + " / " + total_data.toString());
        count++;
        results.push({ title: value.title, url: value.link });
      }
    }
    postMessage(results);
  }
}
