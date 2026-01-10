'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "baeeb634ba420db9eb34f51dbf2b2296",
"version.json": "e349d55f479ab39e7a66d724a8f92b18",
"index.html": "164423f1f767fceb21edcc0aca7dfbb7",
"/": "164423f1f767fceb21edcc0aca7dfbb7",
"main.dart.js": "233847093ce9e3f238d8e020725550bd",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"favicon.png": "430c75a7955bf0dc0d18c857ed442a59",
"icons/Icon-192.png": "da0ececf2d4e86ceae6cc200dc07d00b",
"icons/Icon-maskable-192.png": "da0ececf2d4e86ceae6cc200dc07d00b",
"icons/Icon-maskable-512.png": "36e9c4068d3e889d5697618cad88a829",
"icons/Icon-512.png": "36e9c4068d3e889d5697618cad88a829",
"manifest.json": "187cb665c9db80a3735603f844cbd840",
"assets/NOTICES": "ffb95225fa7131229a5b3aa86b997b2a",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "8a4b8440b2a5263dfdcfad9ed0c2e53f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b93248a553f9e8bc17f1065929d5934b",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"assets/AssetManifest.bin": "118d7fc8456020c9513182a33258badc",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/images/news.png": "8b383cd0b83bbf1766d8623a72b12b75",
"assets/assets/images/events_logo.png": "9af4c24a463fdf5777bb446cb0d90885",
"assets/assets/images/channelhub.png": "5e8e6ed7a0d7f75253b4402f061bb047",
"assets/assets/images/events_bg.jpg": "175fb437d9a814166ebbd082e4fc500e",
"assets/assets/images/channelhub_logo.png": "d3face69e4c74224ff9ba338b909e304",
"assets/assets/images/social/telegram.png": "ae783caed527d0f3d4724a3b6c3d46ca",
"assets/assets/images/social/telegram-color.png": "1a9b1610f3c497f49969292036ef923e",
"assets/assets/images/social/instagram.png": "a3ad25922faebae6d3a470645978cdc3",
"assets/assets/images/social/instagram-color.png": "994cf685d0a2872f6dc660b328305cf8",
"assets/assets/images/social/apple.png": "efb09afdf246e59011dd54198570fde9",
"assets/assets/images/social/whatsapp-color.png": "f447d08ec580e1c4841352abc5cac405",
"assets/assets/images/social/twitter.png": "ce01c741b0eee710ad2c103f867382e8",
"assets/assets/images/social/linkedin.png": "33ec538eb7974c9ae920ee69a5fa74ce",
"assets/assets/images/social/twitter-color.png": "f8c4fbcb535c6fdf199b4be9f998898d",
"assets/assets/images/social/facebook-color.png": "b63e48e4b019ff48d1b26ae91e7c9425",
"assets/assets/images/social/whatsapp.png": "e05b63f7342a669eda772dfe3083fe7b",
"assets/assets/images/social/google.png": "56ff94e4a6f7006d87650c58fb4189db",
"assets/assets/images/social/facebook.png": "201cc2e905ee185cce11c39cf593a87e",
"assets/assets/images/logo3.png": "e3b329cd17daeaa02ac1276eadc16926",
"assets/assets/images/logo@3x.png": "7542b6ba1f00bcd5b1fd1d3c75b027d8",
"assets/assets/images/logo.png": "7f4029acdbddf1e6469cb242e99d1441",
"assets/assets/images/icons/world.png": "6de23857f4a859ddbc12b8ec90230d6c",
"assets/assets/images/icons/place.png": "ab6e6ec486809306e4c22262a4aea925",
"assets/assets/images/icons/%2523.png": "052deccb20357b9ad30398a1a4056516",
"assets/assets/images/icons/duplicate.png": "78af123b39e69d1b1962a59af92032e5",
"assets/assets/images/icons/eye-hide.png": "c4fe8c42ef67483b43954317f8da6716",
"assets/assets/images/icons/charts.png": "41ba3ff5a2551419887fc83834a5d289",
"assets/assets/images/icons/sign.png": "5c1824599e0ea4560f6d5ba471e3b4f0",
"assets/assets/images/icons/list.png": "85caa9c01a26126fef19edf2b85b42b7",
"assets/assets/images/icons/grid.png": "232abd55563eac89bfe2f07754c081ed",
"assets/assets/images/icons/menu.png": "621d6d64fe8dadf0402467c586a7afc4",
"assets/assets/images/icons/filter.png": "628dc94afbcf2aa09ef4b7443d210efb",
"assets/assets/images/icons/view.png": "ffe2970b8106e1b1598edbdf154bb1ea",
"assets/assets/images/icons/compagny.png": "e7f70afe2fcb71742919532afd3743a7",
"assets/assets/images/icons/eye.png": "59c6b756db95a66694c17a3528666e15",
"assets/assets/images/icons/edit.png": "8745e71088f2914b54c3c0dbe1ea2fdd",
"assets/assets/images/icons/trash.png": "b5eaec95a3c7c757a1ccd80f6fe1c2f8",
"assets/assets/images/icons/close.png": "fe195ecf0a2b53dac54a74d890c3f0b1",
"assets/assets/images/logo@2x.png": "d124230cb9e0401ed7f6b06fa6b1c11c",
"assets/assets/images/image.png": "cf1d20058de08cce71fec1d8bdbdf0e3",
"assets/assets/env/staging.env": "7c3836bbdc8f03260b15e11b0c6fdc5c",
"assets/assets/env/local.env": "5ba4d8e1d4e88ff76e56f63eb805b927",
"assets/assets/env/production.env": "fdd523e8d570ab5eb38720ee619552c0",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
