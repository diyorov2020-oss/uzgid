// UZGID minimal service worker — o'rnatish (installability) uchun.
// Kesh QILMAYDI: har doim tarmoqdan (sayt tez-tez yangilanadi, eskirmasin).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => { /* default tarmoq — interceptsiz */ });
