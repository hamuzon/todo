const CACHE_NAME = "todo-pwa-cache-v1";
const URLS_TO_CACHE = [
  ".",
  "index.html",
  "style.css",
  "script.js",
  "icon.svg"
  // もし他に必要なファイルがあればここに追加してください
];

// インストール時にキャッシュを保存
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ネットワーク優先でキャッシュフォールバック
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
