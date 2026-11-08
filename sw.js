const CACHE = 'tutor-v4';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'qr.png', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  'fonts/thsarabunnew-webfont.ttf', 'fonts/thsarabunnew_bold-webfont.ttf'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin === location.origin) {
    // หน้าแอป: ใช้เวอร์ชันล่าสุดจากเน็ตก่อน ถ้าออฟไลน์ใช้ที่เก็บไว้
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else if (u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/')) {
    // ไลบรารี Firebase: เก็บไว้ใช้ตอนออฟไลน์
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })));
  }
});
