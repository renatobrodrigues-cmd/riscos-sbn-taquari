/* Vereda · guarda o site e os dados no navegador para as próximas visitas abrirem rápido e sem internet.
   Cada versão do site pede os arquivos com ?v=versão: versão nova = arquivos novos; os caches antigos são apagados. */
const C='vereda-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
const put=async(req,res)=>{try{if(res&&res.ok&&res.type!=='opaqueredirect'){const c=await caches.open(C);await c.put(req,res.clone())}}catch(e){}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 /* dados e camadas com versão no endereço: do cache primeiro (a versão muda o endereço) */
 if(u.origin===location.origin&&/\/(data|lay)\//.test(u.pathname)&&u.search){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))));return}
 /* a página: sempre da rede (sem cache do navegador); cache só sem internet */
 if(r.mode==='navigate'){e.respondWith(fetch(r,{cache:'no-store'}).then(x=>put(r,x)).catch(()=>caches.match(r)));return}
 /* o resto (atlas, bibliotecas, fontes, camadas sem versão): rede primeiro, cache se estiver sem internet */
 if(u.origin===location.origin||/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host)){e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r)))}
});
