const staticCacheName = "static";

const assets = [
  "/",
  "/index.html",
  "/movies.html",
  "/src/master.css",
  "/src/index.js",
  "/src/flickr.js",
  "/src/moviesSearch.js",
  "/src/movies_worker.js",
  "/manifest.json",
  "/images/icon/polaroid-192.png",
  "/images/icon/polaroid-512.png",
  "/images/icon/white.png",
  "/images/icon/error.png",
  "/fonts/bessy.ttf",
  "/fonts/merry.ttf",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (e) => {
  //console.log("in fetch ");
  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(e.request).catch((error) => {
          if (
            e.request.url
              .toString()
              .includes(
                "https://api.flickr.com/services/feeds/photos_public.gne?tags="
              )
          ) {
            return new Response("jsonFlickrFeed({offline:true})", {
              headers: { "Content-type": "text/javascript" },
            });
          } else if (e.request.url.toString().includes("movieObj.js")) {
            return new Response("itsoffline({offline:true})", {
              headers: { "Content-type": "text/javascript" },
            });
          }
        })
      );
    })
  );
});
