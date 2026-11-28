export function makeHistogram(html,sub){
 const names={cem:["Construction Engineering and Management","3170614",125,25],dhs:["Design of Hydraulic Structures","3170621",115,26],eeec:["Engineering Economics, Estimation and Costing","3170615",125,26],phe:["Port and Harbour Engineering","3170623",117,26]};
 const [name,code,expected,rowCount]=names[sub],sessions=["Summer 2024","Winter 2024","Summer 2025","Winter 2025","Summer 2026"];
 const attr=(s,k)=>s.match(new RegExp('(?:^|\\s)'+k+'="([^"]*)"'))?.[1];
 const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const plain=s=>s.replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();
 const questions=new Map();
 for(const a of html.matchAll(/<article\b([^>]*class="topic"[^>]*)>([\s\S]*?)<\/article>/g)){
  const chapter=Number(attr(a[1],"data-ch"));
  for(const q of a[2].matchAll(/<li\b([^>]*class="question"[^>]*)>([\s\S]*?)<\/li>/g)){
   const k=attr(q[1],"data-key");if(!k)throw Error("Missing question key");
   const related=attr(q[1],"data-related")==="1"||/class="match-audit-label">Related/i.test(q[2]);
   const mark=Number(attr(q[1],"data-m"));
   const question=plain(q[2].match(/<p>([\s\S]*?)<\/p>/)?.[1]||"");
   const link=q[2].match(/href="(\.\.\/papers\/[a-z]+\.pdf#page=\d+)"/)?.[1];
   if(!question||!link||!mark)throw Error("Incomplete question "+k);
   let z=questions.get(k);if(!z){z={mark,question,link,d:new Set(),r:new Set()};questions.set(k,z)}
   if(z.mark!==mark)throw Error("Inconsistent marks "+k);
   (related?z.r:z.d).add(chapter);
  }
 }
 if(questions.size!==expected)throw Error("Question total mismatch "+sub+" "+questions.size);
 const rows=new Map();
 for(const [key,v] of questions){
  let y,pos;
  if(sub==="dhs"){const m=key.match(/^([SW])(\d\d)\.(\d)(o?)([abc])$/);if(!m)throw Error(key);y=(m[1]==="S"?"Summer":"Winter")+" 20"+m[2];pos=m[3]+m[5].toUpperCase()+(m[4]?" OR":"");}
  else {const m=key.match(/^(Summer|Winter) (20\d\d) Q(\d)\(([abc])\)/);if(!m)throw Error(key);y=m[1]+" "+m[2];pos=m[3]+m[4].toUpperCase()+(key.includes("OR")?" OR":"");}
  const provisional=!v.d.size;const ch=[...(provisional?v.r:v.d)].sort((a,b)=>a-b);
  if(!ch.length||!sessions.includes(y))throw Error(key);
  if(!rows.has(pos))rows.set(pos,new Map());const r=rows.get(pos);if(r.has(y))throw Error("Duplicate "+key);
  r.set(y,{...v,ch,provisional});
 }
 if(rows.size!==rowCount)throw Error("Wrong row count "+sub);
 for(const y of sessions){let marks=0;for(const [pos,r] of rows)if(!pos.includes("OR")&&r.has(y))marks+=r.get(y).mark;if(marks!==70)throw Error("Marks "+sub+" "+y+" "+marks)}
 const chapterLabel=v=>v?"CH "+v.ch.join("+")+(v.provisional?"†":""):"Not Asked";
 const order=[];for(let i=1;i<=5;i++)for(const s of ["A","B","C","A OR","B OR","C OR"])if(rows.has(i+s))order.push(i+s);
 let content="";
 for(const pos of order){
  const r=rows.get(pos),vals=sessions.map(y=>r.get(y)),groups=new Map(),marks=new Map(),coverage=new Map();
  for(const v of vals){const k=chapterLabel(v);groups.set(k,(groups.get(k)||0)+1);if(v){marks.set(v.mark,(marks.get(v.mark)||0)+1);for(const c of v.ch)coverage.set(c,(coverage.get(c)||0)+1)}}
  if([...groups.values()].reduce((a,b)=>a+b,0)!==5)throw Error("Five paper audit failed");
  const bins=[...groups].sort((a,b)=>a[0]==="Not Asked"?1:b[0]==="Not Asked"?-1:b[1]-a[1]||a[0].localeCompare(b[0],undefined,{numeric:true})).map(([c,n])=>`<span class="hist-bin${c==="Not Asked"?" na":n===5?" full":n>=3?" high":""}" title="${esc(c)}: ${n} of 5 papers"><b>${esc(c)}</b><span class="hist-count">${n}/5</span></span>`).join("");
  const markList=[...marks].sort((a,b)=>a[0]-b[0]);
  const markLabel=markList.map(x=>x[0]).join("/");
  const cov=[...coverage].sort((a,b)=>b[1]-a[1]||a[0]-b[0]).map(([ch,n])=>`CH ${ch}: ${n}/5`).join(" · ");
  const proof=sessions.map((y,i)=>{const v=vals[i];return `<tr><td>${y}</td><td>${esc(chapterLabel(v))}</td><td>${v?v.mark:"—"}</td><td>${v?v.question+' <a href="'+v.link+'" rel="noopener" target="_blank">Paper ↗</a>':"This question position was not present."}</td></tr>`}).join("");
  content+=`<details class="hist-row" data-question="Question ${pos}" data-total="5"><summary><span class="hist-q">Q${pos}</span><span class="hist-groups">${bins}</span><span class="hist-mark">${markLabel} M</span><span aria-hidden="true" class="hist-chevron">⌄</span></summary><div class="hist-proof"><p><b>Five-paper audit:</b> ${r.size} asked, ${5-r.size} not asked. ${markList.map(([m,n])=>m+" marks in "+n+" paper"+(n===1?"":"s")).join("; ")}.</p><p><b>Individual chapter coverage:</b> ${cov}. Shared questions count once in the graph, but contribute to each applicable chapter here.</p><table><thead><tr><th>Exam</th><th>Chapter</th><th>Marks</th><th>Actual question</th></tr></thead><tbody>${proof}</tbody></table></div></details>`;
 }
 const index=[...html.matchAll(/<a\b[^>]*class="chap-tab"[^>]*data-ch="(\d+)"[^>]*>([\s\S]*?)<\/a>/g)].filter(x=>+x[1]>0).map(x=>`<div><b>CH ${x[1].padStart(2,"0")}</b> · ${x[2].match(/<\/span><span>([\s\S]*?)<\/span>/)?.[1]||"Chapter "+x[1]}</div>`).join("");
 const special={eeec:"Winter 2024 printed the 7-mark Q2 OR as B instead of C.",dhs:"Winter 2024 used 7+7 or 14 marks. Its missing positions are explicitly shown.",phe:"Summer 2025 used 7+7 marks. Winter 2024 and Winter 2025 repeated the same questions. † One provisional chapter classification."};
 const dialog=`<dialog aria-labelledby="hist-title" id="atlas-histogram"><div class="hist-head"><div><p class="hist-kicker">Civil Exam Atlas · Histogram</p><h2 id="hist-title">${name}</h2><p class="hist-sub">${code} · 5 GTU papers · Summer 2024–Summer 2026</p></div><button aria-label="Close histogram" class="hist-close" type="button">Close ×</button></div><div class="hist-content"><p class="hist-note">Five papers per row, highest frequency first. Mixed marks are shown together; Not Asked = absent position. Tap any row for five-paper proof and chapter coverage. Past frequency is not a guarantee.</p>${special[sub]?'<p class="hist-note">'+special[sub]+'</p>':""}<div class="hist-grid">${content}</div><h3 class="hist-key-title">Book chapter key</h3><div class="hist-index">${index}</div><p class="hist-foot">Source: five GTU papers and existing Atlas chapter mapping. Shared chapter mappings are kept together in the five-paper count; provisional classifications are marked †.</p></div></dialog>`;
 const button='<button aria-controls="atlas-histogram" aria-haspopup="dialog" class="tool hist-open" type="button"><svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 3v18h18M7 17v-5m5 5V7m5 10V4"/></svg><span>Histogram</span></button>';
 if(!/<nav aria-label="Guide tools">[\s\S]*?<\/nav>/.test(html)||!/<\/body\s*>/i.test(html)||!/<\/head\s*>/i.test(html))throw Error("Missing insertion point "+sub);
 const out=html.replace(/<nav aria-label="Guide tools">[\s\S]*?<\/nav>/,m=>m.replace("</nav>",button+"</nav>")).replace(/<\/body\s*>/i,m=>dialog+m).replace(/<\/head\s*>/i,m=>'<link rel="stylesheet" href="../assets/atlas-histogram.css"><script defer src="../assets/atlas-histogram.js"></script>'+m);
 return {html:out,rows:rows.size,records:rows.size*5,actual:questions.size};
}
