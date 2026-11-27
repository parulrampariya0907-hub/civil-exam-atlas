/* Keep displayed frequency aligned with direct-only priority and filters. */
(function(){
  'use strict';
  function apply(){
    for(const row of document.querySelectorAll('.topic[data-n]')){
      const badge=row.querySelector('.frequency');
      if(!badge) continue;
      const direct=new Set(), related=new Set();
      for(const q of row.querySelectorAll('.question')){
        const session=q.querySelector('.session')?.textContent.trim();
        if(!session)continue;
        const isRelated=q.dataset.related==='1'||q.closest('.related')||/^related/i.test(q.querySelector('.match-audit-label')?.textContent.trim()||'');
        (isRelated?related:direct).add(session);
      }
      const count=Number(row.dataset.n);
      const extra=[...related].filter(p=>!direct.has(p)).length;
      const bars=badge.querySelector('.bars');
      if(bars) [...bars.children].forEach((bar,i)=>{bar.classList.toggle('hit',i<count);});
      const label=badge.querySelector('span:not(.bars)');
      if(label){
        const value=document.createElement('b');value.textContent=String(count);
        const note=document.createElement('small');note.textContent=extra?' · '+extra+' related-only '+(extra===1?'paper':'papers'):' · direct only';
        label.replaceChildren(value,' of 5 papers',note);
      }
      badge.title='Direct matches in '+count+' of 5 papers. Related questions are excluded from priority and frequency filters.';
      badge.setAttribute('aria-label',count+' direct papers out of 5'+(extra?', '+extra+' additional related-only papers':''));
    }
    const freq=document.querySelector('#freq');
    if(freq){freq.textContent='3+ direct papers';freq.title='Count direct matches only';}
    for(const row of document.querySelectorAll('.topic')){
      const box=row.querySelector('.book-box');if(!box)continue;
      if(/not confirmed|unconfirmed|unverified|not located|not found/i.test(box.textContent)){
        const status=document.createElement('small');status.className='atlas-reference-warning';status.textContent='Exact reading location not fully verified';box.append(status);
      }
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();