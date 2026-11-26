// Cache only the public, self-contained student workbook. The private progress
// service and parent dashboard use their own online connections.
const prefix = 'study-arcade-workbook-' + self.registration.scope + '-';
const edition = prefix + '18d7e141fccbf439';
const workbook = new URL('index.html',self.registration.scope).href;
self.addEventListener('install',event => {
  event.waitUntil((async () => {
    const cache = await caches.open(edition);
    await cache.add(new Request(workbook,{cache:'reload'}));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event => {
  event.waitUntil((async () => {
    for(const name of await caches.keys()){
      if(name.startsWith(prefix) && name!==edition)await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event => {
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET' || request.mode!=='navigate' ||
      ![self.registration.scope,workbook].includes(url.origin+url.pathname))return;
  event.respondWith((async () => {
    try{
      const response=await fetch(request);
      if(response.ok)return response;
      if(response.status<500)return response;
    }catch{/* A previous online visit prepared the complete workbook. */}
    return await caches.match(workbook,{cacheName:edition}) || Response.error();
  })());
});
