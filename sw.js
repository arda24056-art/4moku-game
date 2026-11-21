const SHELL='4moku-shell-result-undo-v10', CUSTOM='4moku-palette-assets-v1';
const ASSETS=['./','./index.html','./install.html','./ios-install.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('4moku-')&&k!==SHELL&&k!==CUSTOM).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.includes('/personal-icon/')||u.pathname.includes('/personal-manifest/')){
  e.respondWith(caches.open(CUSTOM).then(c=>c.match(r)).then(v=>v||new Response('Not found',{status:404})));return;
 }
 if(r.mode==='navigate'){e.respondWith(fetch(r,{cache:'no-store'}).catch(()=>caches.match(u.pathname.endsWith('/install.html')?'./install.html':u.pathname.endsWith('/ios-install.html')?'./ios-install.html':'./index.html')));return}
 e.respondWith(fetch(r,{cache:'no-store'}).then(v=>{if(v.ok){const copy=v.clone();caches.open(SHELL).then(c=>c.put(r,copy)).catch(()=>{})}return v}).catch(()=>caches.match(r)));
});
