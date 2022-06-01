let listItems = [];

function clearcahce() {
  localStorage.clear();
}

var searchTerms = [
  "Ivan Aivazovsky",
  "Henry Pether",
  "Robin Jacques",
  "lion",
  "cats",
  "pelican",
  "aot",
  "japan",
  "kdramas",
];

const getpagedata = () => {
  //console.log("in load");
  for (var i = 0; i < searchTerms.length; i++) {
    let element = document.createElement("button");
    element.innerHTML = searchTerms[i];
    element.value = searchTerms[i];
    element.addEventListener("click", (element) => {
      searchFlickr(element);
    });
    document.getElementById("sidebar-id").append(element);
  }

  if (localStorage.length > 0) {
    for (var y = 0; y < localStorage.length; y++) {
      let myjson_obj = JSON.parse(localStorage.getItem(y.toString()));
      let imgdiv = document.createElement("div");
      imgdiv.className = "imgd";
      let myimg = document.createElement("img");
      myimg.title = myjson_obj.img_title;
      myimg.src = myjson_obj.img_url;
      imgdiv.appendChild(myimg);
      myimg.onclick = () => {
        document.body.style.overflow = "hidden";
        document.getElementById("overscreen-inside").innerHTML = myimg.title;
        document.getElementById("overscreen-outside").style.display = "block";
        document.getElementById("overscreen-outside").style.top = scrollY;
      };
      document.getElementById("picdivid").appendChild(imgdiv);
    }
  }
};

/***************************************************************/

function loadImage(src, myimg) {
  return new Promise(function (resolve, reject) {
    myimg.src = "./images/icon/loader.gif";
    myimg.addEventListener(
      "load",
      function () {
        myimg.src = src;
      },
      false
    );
    myimg.addEventListener(
      "error",
      function () {
        myimg.src = "./images/icon/error.png";
        //reject("image could not load");
      },
      false
    );
  });
}

var allbtns;

const jsonFlickrFeed = (data) => {
  //console.log(data);
  if (data.hasOwnProperty("offline")) {
    setTimeout(() => {
      for (var i = 0; i < allbtns.length; i++) {
        allbtns[i].style.backgroundColor = "gray";
        allbtns[i].disabled = false;
      }
      document.getElementById("tempid1").style.display = "block";
      document.getElementById("tempid1").innerHTML = "sorry cant access flickr";
    }, 1000);
  } else {
    if (data.items.length <= 10) {
      localStorage.clear();
      for (var y = 0; y < data.items.length; y++) {
        addItem(data.items[y]);
        localStorage.setItem(
          y.toString(),
          JSON.stringify({
            img_url: data.items[y].media.m.replace("_m.jpg", "_c.jpg"),
            img_title: data.items[y].title,
          })
        );
      }
    } else {
      localStorage.clear();
      for (var y = 0; y < 10; y++) {
        addItem(data.items[y]);
        localStorage.setItem(
          y.toString(),
          JSON.stringify({
            img_url: data.items[y].media.m.replace("_m.jpg", "_c.jpg"),
            img_title: data.items[y].title,
          })
        );
      }
    }

    document.getElementById("picdivid").innerHTML =
      '<p id="tempid">Searching Flicker</p> <p id="tempid1"></p>';

    for (var i = 0; i < listItems.length; i++) {
      document.getElementById("picdivid").appendChild(listItems[i]);
    }
    Promise.all(listItems).then(() => {
      for (var i = 0; i < allbtns.length; i++) {
        allbtns[i].style.backgroundColor = "gray";
        allbtns[i].disabled = false;
      }
    });
  }
};

function jsonp(uri) {
  return new Promise(function (resolve, reject) {
    var id = "_" + Math.round(10000 * Math.random());
    var callbackName = "jsonp_callback_" + id;
    window[callbackName] = function (data) {
      delete window[callbackName];
      var ele = document.getElementById(id);
      ele.parentNode.removeChild(ele);
      resolve(data);
    };

    var src = uri + "&callback=" + callbackName;
    var script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.addEventListener("error", reject);
    (
      document.getElementsByTagName("head")[0] ||
      document.body ||
      document.documentElement
    ).appendChild(script);
  }).catch((error) => {
    setTimeout(() => {
      for (var i = 0; i < allbtns.length; i++) {
        allbtns[i].style.backgroundColor = "gray";
        allbtns[i].disabled = false;
      }
      document.getElementById("tempid1").style.display = "block";
      document.getElementById("tempid1").innerHTML = "sorry cant access flickr";
    }, 1000);
  });
}

const addItem = function (item) {
  var img = item.media.m.replace("_m.jpg", "_c.jpg");
  let imgdiv = document.createElement("div");
  imgdiv.className = "imgd";
  //a.href = item.link;
  //a.target = "_blank";
  //imgdiv.appendChild(a);
  let myimg = document.createElement("img");
  myimg.title = item.title;
  imgdiv.appendChild(myimg);
  myimg.onclick = () => {
    document.body.style.overflow = "hidden";
    document.getElementById("overscreen-inside").innerHTML = myimg.title;
    document.getElementById("overscreen-outside").style.display = "block";
    document.getElementById("overscreen-outside").style.top = scrollY;
  };

  loadImage(img, myimg);
  /*
myimg.src = "./images/icon/loader.gif";
myimg.addEventListener("load", function () {
  myimg.src = img;
});
myimg.onerror = () => {
  myimg.src = "./images/icon/error.png";
};
*/
  listItems.push(imgdiv);
};

function searchFlickr(e) {
  document.getElementById("tempid").innerHTML = "searching flicker";
  document.getElementById("tempid1").style.display = "none";
  document.getElementById("tempid").style.display = "block";
  setTimeout(() => {
    document.getElementById("tempid").style.display = "none";
  }, 1000);

  allbtns = document
    .getElementById("sidebar-id")
    .getElementsByTagName("button");

  for (var i = 0; i < allbtns.length; i++) {
    allbtns[i].style.backgroundColor = "lightgray";
    allbtns[i].disabled = true;
  }

  //console.log("in search");
  listItems = [];

  // callback to display returned image data

  jsonp(
    "https://api.flickr.com/services/feeds/photos_public.gne?tags=" +
      e.target.value +
      "&lang=en-us&format=json&jsoncallback=jsonFlickrFeed"
  );
}

function disappear() {
  document.body.style.overflow = "visible";
  document.getElementById("overscreen-outside").style.display = "none";
}
