const {readFileSync}=require('node:fs');const {join}=require('node:path');const {session,privateHeaders}=require('../lib/session');
const allowed=new Set(['index.html',...['cem','dhs','eeec','phe'].flatMap(x=>['subjects/'+x+'.html','papers/'+x+'.pdf'])]);

const readers = {
  'index.html': () => readFileSync(join(__dirname,'..','site','index.html')),
  'subjects/cem.html': () => readFileSync(join(__dirname,'..','site','subjects/cem.html')),
  'subjects/dhs.html': () => readFileSync(join(__dirname,'..','site','subjects/dhs.html')),
  'subjects/eeec.html': () => readFileSync(join(__dirname,'..','site','subjects/eeec.html')),
  'subjects/phe.html': () => readFileSync(join(__dirname,'..','site','subjects/phe.html')),
  'papers/cem.pdf': () => readFileSync(join(__dirname,'..','site','papers/cem.pdf')),
  'papers/dhs.pdf': () => readFileSync(join(__dirname,'..','site','papers/dhs.pdf')),
  'papers/eeec.pdf': () => readFileSync(join(__dirname,'..','site','papers/eeec.pdf')),
  'papers/phe.pdf': () => readFileSync(join(__dirname,'..','site','papers/phe.pdf')),
};
function readContent(file){
  try { return readers[file](); } catch(e) { if(e.code!=='ENOENT'&&e.code!=='ENOTDIR') throw e; }
  for(const root of [process.cwd(),join(process.cwd(),'Civil_Exam_Atlas_19_Swipe_Auth_Vercel')]) {
    try { return readFileSync(join(root,'site',file)); } catch(e) { if(e.code!=='ENOENT'&&e.code!=='ENOTDIR') throw e; }
  }
  throw Object.assign(new Error('Protected content file missing'),{code:'ATLAS_FILE_MISSING'});
}
module.exports=async function(req,res){privateHeaders(res);if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;return res.end();}const file=req.query?.file||new URL(req.url,'http://localhost').searchParams.get('file');if(typeof file!=='string'||!allowed.has(file)){res.statusCode=404;return res.end('Not found');}try{const s=await session(req,res);if(!s){res.statusCode=302;res.setHeader('Location','/');return res.end();}let data=readContent(file);if(file==='index.html'){const logout=`<style>.atlas-account{position:fixed;top:12px;right:12px;z-index:9999;background:rgba(255,255,255,.88);border:1px solid #aab9cc;border-radius:12px;padding:8px 12px;font:600 13px system-ui;color:#20354d;cursor:pointer;box-shadow:0 2px 10px #0001}</style><button class="atlas-account" id="atlasLogout">Sign out</button><script>document.getElementById('atlasLogout').onclick=async()=>{try{const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logout'})});if(r.ok)location.replace('/');else alert('Unable to sign out. Try again.')}catch{alert('Unable to sign out. Try again.')}};</script>`;data=Buffer.from(data.toString().replace('</body>',logout+'</body>'));}const pdf=file.endsWith('.pdf');res.setHeader('Content-Type',pdf?'application/pdf':'text/html; charset=utf-8');res.setHeader('Content-Length',data.length);res.statusCode=200;return res.end(req.method==='HEAD'?undefined:data);}catch(e){console.error('Atlas content request failed',{file,code:e.code||'UNKNOWN',status:e.status||null,name:e.name});res.statusCode=503;return res.end('Atlas is temporarily unavailable.');}};
