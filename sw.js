/* Vereda · guarda o site e os dados no navegador para as próximas visitas abrirem rápido e sem internet */
const C='vereda-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
const put=async(req,res)=>{try{if(res&&res.ok&&res.type!=='opaqueredirect'){const c=await caches.open(C);await c.put(req,res.clone())}}catch(e){}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 /* dados com versão no endereço: do cache primeiro */
 if(u.origin===location.origin&&/\/data\//.test(u.pathname)&&u.search){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))));return}
 /* camadas, imagens e bibliotecas: cache e atualiza por trás */
 if((u.origin===location.origin&&/\/(lay|atlas|libs)\//.test(u.pathname))||/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host)){e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(x=>put(r,x)).catch(()=>m);return m||f}));return}
 /* a página: rede primeiro, cache se estiver sem internet */
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r)))}
});
