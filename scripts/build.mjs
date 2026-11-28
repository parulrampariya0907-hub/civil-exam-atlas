import {makeHistogram} from "./histogram.mjs";
import {cpSync,rmSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {inflateSync,deflateSync} from 'node:zlib';
const raw=process.argv[2]||process.env.SITE_URL||process.env.URL;
rmSync('dist',{recursive:true,force:true});cpSync('site','dist',{recursive:true});
// Permanent creator credit on each public HTML page, before optional SEO processing.
const creditPages=['index.html','subjects/cem.html','subjects/dhs.html','subjects/eeec.html','subjects/phe.html'];
writeFileSync(join('dist','assets','69.webp'),Buffer.from('UklGRiQFAABXRUJQVlA4IBgFAADQGACdASpAAEAAPjEWiEMiISEWCq00IAMEsoBjxmVYWrsDHS/pf469Ab6tbpFe3/Vfyc8zPwB2qP79+Tf5O8fhyj+r/338ruYDvPfzT/M/lHzV0zD+w/6r7jPiC/yfu09o/zN/u/cH/lP9E/xv51f4D5sPXv+2HshfsUv60SyBxMhpmdltVJDs1Ab++0QH4/Dd2DjXZzsWczelv9ifXMafRv79WHyzrpxB7Ont12lYXj7Dysg3zywaQkC40HocpCFs6/m79Z6MIAET7Ax/jQgA/v/+bdcppRqw24ciF0kOddvYTnPHC3jQsg4QYhUAxVDKp///EOf1t/3KcPZ9/I7CG7ChfMl/xnYc3+K/49gUcCLsZ634Ol0DXg19S85Awx4iSPvQz9ffe9oEmf/YuxHnWCHbQp/621yRU7Do1TYymHppQn3ucdnTZ353dUQQaUK7c7T5aW/7gbrWGGQPx9uC8bqfFZY6P2np6999v4LhY8q83ZXiTrk3ogJuuPUZ9UbN8pEYgzKtu63CujUnm6l5SlvL825j4ye/XOWSACWMq/hAIDpXR8Gx0IUcADaAaR6525oS3vrv93d5GZYyv85PuC2rk2Vr14pe7n8QHIobizRXtCiCG0/+4nzPv/TgIDROUdJbTDQNc79NuAUKBOkzDooSqMW0vsiDw0X7j8fzzo+WsWv1g09jZmbgh5HRHZY+F/eERg//EARp2EwBfaxwxte1tFzfZ9Ce6on9Dff/Q7IH67WcN3MyGKYvZ4Xozw7QASzOx9UoVe7hXhTNt8SfdtcyE6elWMuuRqu9OuMxUpy87VX/ZSddRl0XY3i5PmHA3CrFenN8Le04IHvjg8wZgOFRjxH8UyPX9GT9m8rlscOkQUe8O6Bkc3brtqVeRPokOWmZDE4v++EIM/Nhn41+lZiIDy5SnZ1zBCzjg2aqJU9cstEsO7vxg3df9JEUNIfrHx20D9Uy37788WWw4nZNQ7ZJDJp20KoWedF34j5fSjK0ZDCnJIQXuuJ50LiZT9U5mPK8DVzhHZkt6b9tatEXdHtOJz00svL+ZjcMhPIX9BbN059Sofh4RYX/8dEy0fuRv4ua5Q2rcKRHvQQRHnBVnhe4kPBcVgrEm4t5sxJ9H/7hxq48zeOWOXSpPgw5vWv9jFn/KDDscODM+1A8EKIk4apx7g/A4ZQgdnPSex4fROIIaaQwNuK8Hq/3Im1OZtekXAS13LkU2R3X5JckEnRQOpvXQJBkYDGwpllb1I+5PMYTfGyc+Yl1wgKPg3CL96GcuE0ZrVetOgolobiOeOyuw0HISKzd3zaYieHZXvPH/yDMstfyPZvK5KfFg/xYuitJ8WkEhCWftnCxSMNRLi4DSycOvJw+dCzvmsywMZtrI8U4R0ZtUy/Yz3/4qV384aRlNtoacBXf089Ly5IpMxfT1FvI/Mtxa0bH7oQNbKcLmc8PkgPq/uK3Gj3U7d2x1X9orhcYJMGjCeEksy3JXjcQXWX/DXbgr92Z4E+DBtG+OIsn8OppzJX/vBw1xqUBTbjg928JThOmnm+ggKyPdlZ8RLtkn+DC/LVGbEAumMKrHbzQNjzXK5ppHtJEfDhgrpFWm+fVJSwI4aiIjKufJn03pjYgPljiIvUu+SFhgM+fDuiHEWTgpFU6G0haVZ5L4fuom292Pb1tguAERaofaPJKoBEQQLA8FrR8ifvK3zMhmtONT+H9+kHQQLG4Qifk56NZdmNK0nEAAA==','base64'));
const creditLogo=true;
for(const page of creditPages){
  const file=join('dist',page);
  let html=readFileSync(file,'utf8');
  const assetPrefix=page==='index.html'?'./':'../';
  const credit='<style>#atlas-creator-credit{position:fixed;right:max(10px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:6px;padding:4px 7px;border-radius:8px;background:transparent;color:#536477;font:500 10px/1.3 system-ui,sans-serif;white-space:nowrap;z-index:9999;pointer-events:none}#atlas-creator-credit img{width:22px;height:22px;border-radius:4px;object-fit:contain;display:block}#atlas-creator-credit strong{font-weight:650;color:inherit}@media print{#atlas-creator-credit{display:none!important}}</style><div id="atlas-creator-credit" hidden style="display:none" aria-label="Powered by 230170106069">'+(creditLogo?'<img src="'+assetPrefix+'assets/69.webp" alt="" width="22" height="22">':'')+'<span>Powered by <strong>230170106069</strong></span></div><script>if(window.self===window.top){const el=document.getElementById("atlas-creator-credit");el.hidden=false;el.style.removeProperty("display");}</script>';
  if(!/<\/body\s*>/i.test(html)) throw new Error('Creator credit: missing body in '+page);
  html=html.replace(/<\/body\s*>/i, match=>credit+match);
  writeFileSync(file,html);
}

// Installable app and browser identity, derived from the uploaded 69 logo.
const originalLogo=readFileSync(join('dist','assets','69.webp')).toString('base64');
writeFileSync(join('dist','assets','69-icon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><image width="64" height="64" href="data:image/webp;base64,'+originalLogo+'"/></svg>');
const iconSource=inflateSync(Buffer.from('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','base64'));
if(iconSource.length!==24+96*96)throw new Error('Invalid creator icon data');
function pngChunk(type,data){
  const content=Buffer.concat([Buffer.from(type),data]);let crc=0xffffffff;
  for(const byte of content){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
  const head=Buffer.alloc(4),tail=Buffer.alloc(4);head.writeUInt32BE(data.length);tail.writeUInt32BE((crc^0xffffffff)>>>0);
  return Buffer.concat([head,content,tail]);
}
function makeIcon(size){
  const header=Buffer.alloc(13);header.writeUInt32BE(size,0);header.writeUInt32BE(size,4);header[8]=8;header[9]=2;
  const rows=Buffer.alloc(size*(1+size*3));
  const pixel=(x,y,c)=>iconSource[iconSource[24+y*96+x]*3+c];
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=x*95/(size-1),v=y*95/(size-1),x0=Math.floor(u),y0=Math.floor(v),x1=Math.min(x0+1,95),y1=Math.min(y0+1,95),a=u-x0,b=v-y0;
    for(let c=0;c<3;c++)rows[y*(size*3+1)+1+x*3+c]=Math.round((1-b)*((1-a)*pixel(x0,y0,c)+a*pixel(x1,y0,c))+b*((1-a)*pixel(x0,y1,c)+a*pixel(x1,y1,c)));
  }
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk('IHDR',header),pngChunk('IDAT',deflateSync(rows)),pngChunk('IEND',Buffer.alloc(0))]);
}
for(const size of [48,180,192,512])writeFileSync(join('dist','assets','69-'+size+'.png'),makeIcon(size));
const faviconPNG=makeIcon(32);
const icoHeader=Buffer.alloc(22);
icoHeader.writeUInt16LE(1,2);icoHeader.writeUInt16LE(1,4);
icoHeader[6]=32;icoHeader[7]=32;icoHeader.writeUInt16LE(1,10);icoHeader.writeUInt16LE(24,12);
icoHeader.writeUInt32LE(faviconPNG.length,14);icoHeader.writeUInt32LE(22,18);
const faviconICO=Buffer.concat([icoHeader,faviconPNG]);
writeFileSync(join('dist','favicon.ico'),faviconICO);
writeFileSync(join('dist','assets','favicon.ico'),faviconICO);
writeFileSync(join('dist','assets','favicon.png'),makeIcon(48));

writeFileSync(join('dist','atlas.webmanifest'),JSON.stringify({id:'/',name:'Civil Exam Atlas',short_name:'Civil Atlas',description:'GTU Civil Engineering study atlas',start_url:'./',scope:'./',display:'standalone',background_color:'#eef1f6',theme_color:'#211a30',icons:[{src:'assets/69-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'assets/69-512.png',sizes:'512x512',type:'image/png',purpose:'any'}]},null,2));
writeFileSync(join('dist','sw.js'),"self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));self.addEventListener('fetch',event=>{if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>new Response('Civil Exam Atlas requires an internet connection. Please reconnect and reload.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));});");
for(const page of creditPages){
  const file=join('dist',page);let html=readFileSync(file,'utf8');const prefix=page==='index.html'?'./':'../';
  html=html.replace(/<link\b[^>]*\brel\s*=\s*["'](?:icon|alternate icon|shortcut icon|apple-touch-icon)["'][^>]*\/?>/gi,'');
  const metadata='<link rel="shortcut icon" type="image/x-icon" href="'+prefix+'favicon.ico?v=3"><link rel="icon" type="image/png" sizes="48x48" href="'+prefix+'assets/69-48.png?v=3"><link rel="apple-touch-icon" sizes="180x180" href="'+prefix+'assets/69-180.png"><link rel="manifest" href="'+prefix+'atlas.webmanifest"><meta name="theme-color" content="#211a30">';
  html=html.replace(/<meta\b[^>]*\bname\s*=\s*["']theme-color["'][^>]*>/gi,'');
  html=html.replace(/<\/head\s*>/i,m=>metadata+'<link rel="stylesheet" href="'+prefix+'assets/atlas-polish.css"><script defer src="'+prefix+'assets/atlas-integrity.js"></script>'+m);
  if(page==='index.html')html=html.replace(/<\/body\s*>/i,m=>'<script>if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}</script>'+m);
  writeFileSync(file,html);
}

for(const sub of ['cem','dhs','eeec','phe']){const file=join('dist','subjects',sub+'.html');const h=makeHistogram(readFileSync(file,'utf8'),sub);writeFileSync(file,h.html);console.log('Histogram '+sub+': '+h.rows+' rows, '+h.records+' records');}
const adsenseTag="<script async src=\"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5797877435051977\" crossorigin=\"anonymous\"></script>";
for(const page of creditPages){
  const file=join('dist',page);const h=readFileSync(file,'utf8');
  if(!h.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'))writeFileSync(file,h.replace(/<\/head\s*>/i,m=>adsenseTag+'\n'+m));
}
if(!raw){console.log('No public URL: relative previews retained; set SITE_URL to generate sitemap and absolute social metadata.');process.exit(0);}
const parsed=new URL(raw);if(!['https:','http:'].includes(parsed.protocol)||parsed.username||parsed.password||parsed.search||parsed.hash||parsed.pathname!=='/')throw new Error('SITE_URL must be a public origin, e.g. https://your-site.netlify.app');
const origin=parsed.origin;
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const pages=['index.html','subjects/cem.html','subjects/dhs.html','subjects/eeec.html','subjects/phe.html'];
const urls=[];
for(const page of pages){const f=join('dist',page);let h=readFileSync(f,'utf8');const url=origin+'/'+(page==='index.html'?'':page);urls.push(url);h=h.replace('<!-- ATLAS_ABSOLUTE_URLS -->',`<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}">`).replace(/(<meta[^>]*(?:property="og:image"|name="twitter:image")[^>]*content=")[^"]+("[^>]*>)/g,`$1${escape(origin+'/assets/social-preview.jpg')}$2`).replace(/(<meta[^>]*content=")[^"]+("[^>]*(?:property="og:image"|name="twitter:image")[^>]*>)/g,`$1${escape(origin+'/assets/social-preview.jpg')}$2`);writeFileSync(f,h);}
writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'  <url><loc>'+escape(u)+'</loc></url>').join('\n')+'\n</urlset>\n');
writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');console.log('Generated absolute SEO metadata and sitemap for '+origin);
