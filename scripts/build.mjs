import {cpSync,rmSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const raw=process.argv[2]||process.env.SITE_URL||process.env.URL;
rmSync('dist',{recursive:true,force:true});cpSync('site','dist',{recursive:true});
// Permanent creator credit on each public HTML page, before optional SEO processing.
const creditPages=['index.html','subjects/cem.html','subjects/dhs.html','subjects/eeec.html','subjects/phe.html'];
const creditLogo=existsSync(join('dist','assets','69.png'));
for(const page of creditPages){
  const file=join('dist',page);
  let html=readFileSync(file,'utf8');
  const assetPrefix=page==='index.html'?'./':'../';
  const credit='<style>#atlas-creator-credit{position:fixed;right:max(10px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:6px;padding:4px 7px;border-radius:8px;background:rgba(245,248,252,.9);color:#536477;font:500 10px/1.3 system-ui,sans-serif;white-space:nowrap;z-index:9999;pointer-events:none}#atlas-creator-credit img{width:20px;height:20px;border-radius:4px;object-fit:contain;display:block}#atlas-creator-credit strong{font-weight:650}@media print{#atlas-creator-credit{display:none!important}}</style><div id="atlas-creator-credit" hidden style="display:none" aria-label="Powered by 230170106069">'+(creditLogo?'<img src="'+assetPrefix+'assets/69.png" alt="" width="20" height="20">':'')+'<span>Powered by <strong>230170106069</strong></span></div><script>if(window.self===window.top){const el=document.getElementById("atlas-creator-credit");el.hidden=false;el.style.removeProperty("display");}</script>';
  if(!/<\/body\s*>/i.test(html)) throw new Error('Creator credit: missing body in '+page);
  html=html.replace(/<\/body\s*>/i,credit+'if(!raw){');
  writeFileSync(file,html);
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
