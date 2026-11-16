/* Vereda · guarda o site e os dados no navegador para as próximas visitas abrirem rápido e sem internet.
   Cada arquivo de dados é pedido com ?v=impressão do conteúdo: só muda quando o arquivo muda, então uma versão nova do site não obriga a baixar de novo o que é igual. */
const C='vereda-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
const put=async(req,res,prune)=>{try{if(res&&res.ok&&res.type!=='opaqueredirect'){const c=await caches.open(C);
 /* versão nova de um arquivo de dados: apaga as versões antigas do mesmo arquivo, para o cache não crescer a cada atualização */
 if(prune){const old=await c.keys(req,{ignoreSearch:true});await Promise.all(old.filter(k=>k.url!==req.url).map(k=>c.delete(k)))}
 await c.put(req,res.clone())}}catch(e){}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 /* dados e camadas com versão no endereço: do cache primeiro (a versão muda o endereço) */
 if(u.origin===location.origin&&/\/(data|lay)\//.test(u.pathname)&&u.search){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x,1))));return}
 /* a página: sempre confere com o servidor (se não mudou, usa a cópia do navegador sem baixar de novo); cache próprio só sem internet */
 if(r.mode==='navigate'){e.respondWith(fetch(r,{cache:'no-cache'}).then(x=>put(r,x)).catch(()=>caches.match(r)));return}
 /* o resto (atlas, bibliotecas, fontes, camadas sem versão): rede primeiro, cache se estiver sem internet */
 if(u.origin===location.origin||/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host)){e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r)))}
});
