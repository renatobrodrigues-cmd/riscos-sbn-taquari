/* Varredura do site: abre cada módulo, aba e subaba e falha se aparecer erro de página.
   Uso: python3 -m http.server 8000 &  node tests/varredura.js http://localhost:8000/index.html */
const {chromium}=require('playwright');
(async()=>{const url=process.argv[2]||'http://localhost:8000/index.html';const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:900}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.setItem('vereda-guia-off','1');localStorage.setItem('vereda_cs2intro','0')}catch(e){}});
await p.goto(url,{waitUntil:'load'});await p.waitForFunction(()=>!document.getElementById('vboot')&&typeof render==='function',null,{timeout:60000});
await p.evaluate(()=>{try{LAND.stop();document.getElementById('land').hidden=true}catch(e){}window.__termoOk=true});
const L=await p.evaluate(()=>{const o=[];for(const e of VORD){if(e==='mapa')continue;const V=typeof VTAB==='function'?VTAB(e):null;if(!V){(tabsFor(e)||[]).forEach(t=>o.push([e,t[0],null]));continue}V.forEach(g=>{if(g[3]||!g[2]||g[2].length<2)o.push([e,g[0],null]);else g[2].forEach(s=>o.push([e,g[0],s[0]+':'+s[1]]))})}return o});
let n=0;const t0=Date.now();
for(const [e,g,s] of L){const k=errs.length;await p.evaluate(async([e,g,s])=>{EX=e;ST=g;if(s)VSUB[e+'-'+g]=s;await Promise.race([render(),new Promise(r=>setTimeout(r,6000))])},[e,g,s]).catch(x=>errs.push(String(x)));await p.waitForTimeout(250);n++;if(errs.length>k)console.log('erro em',e,g,s||'',errs.slice(k).join(' | '))}
console.log('páginas',n,'tempo',Math.round((Date.now()-t0)/1000),'s','erros',errs.length);await b.close();process.exit(errs.length?1:0)})();
