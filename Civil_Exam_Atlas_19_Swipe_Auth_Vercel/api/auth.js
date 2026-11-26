const {sb,session,setSession,clear,privateHeaders}=require('../lib/session');
function reply(res,status,obj){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(obj));}
function validEmail(s){return typeof s==='string'&&s.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);}
module.exports=async function(req,res){privateHeaders(res);try{
 if(req.method==='GET'){const s=await session(req,res);return reply(res,200,{authenticated:!!s});}
 if(req.method!=='POST')return reply(res,405,{error:'Method not allowed.'});
 const origin=req.headers.origin; if(origin&&new URL(origin).host!==req.headers.host)return reply(res,403,{error:'Invalid origin.'});
 if(!String(req.headers['content-type']||'').includes('application/json'))return reply(res,415,{error:'JSON required.'});
 let b=req.body;if(typeof b==='string')b=JSON.parse(b);if(!b||typeof b!=='object')return reply(res,400,{error:'Invalid request.'});
 const {action}=b, email=typeof b.email==='string'?b.email.trim().toLowerCase():'', password=b.password, token=b.code;
 if(action==='logout'){try{const s=await session(req,res);if(s)await sb('logout?scope=local',{token:s.token});}catch{}clear(res);return reply(res,200,{ok:true});}
 if(!validEmail(email))return reply(res,400,{error:'Enter a valid email address.'});
 if(['signup','login','reset'].includes(action)&& (typeof password!=='string'||password.length>128||(action==='login'?password.length<1:password.length<8)))return reply(res,400,{error:'Use a password of at least 8 characters (maximum 128).'});
 if(action==='signup'){const name=typeof b.name==='string'?b.name.trim():'';if(!name||name.length>100)return reply(res,400,{error:'Enter your full name.'});const d=await sb('signup',{body:{email,password,data:{full_name:name}}});if(d.access_token)return reply(res,503,{error:'Email confirmation must be enabled in Supabase. Contact the administrator.'});return reply(res,200,{ok:true});}
 if(action==='resend'){await sb('resend',{body:{email,type:'signup'}});return reply(res,200,{ok:true});}
 if(action==='forgot'){await sb('recover',{body:{email}});return reply(res,200,{ok:true});}
 if(action==='verify'||action==='reset'){
  if(typeof token!=='string'||!/^\d{6}$/.test(token))return reply(res,400,{error:'Enter the 6-digit email code.'});
  const d=await sb('verify',{body:{email,token,type:action==='reset'?'recovery':'signup'}});
  if(action==='reset')await sb('user',{method:'PUT',token:d.access_token,body:{password}});
  if(!d.user?.email_confirmed_at)return reply(res,403,{error:'Email verification is required.'});setSession(res,d);return reply(res,200,{ok:true,authenticated:true});
 }
 if(action==='login'){const d=await sb('token?grant_type=password',{body:{email,password}});if(!d.user?.email_confirmed_at)return reply(res,403,{error:'Verify your email before signing in.'});setSession(res,d);return reply(res,200,{ok:true,authenticated:true});}
 return reply(res,400,{error:'Unknown action.'});
 }catch(e){let msg=e.status===429?'Too many attempts. Please try again later.':e.status===503?e.message:e.status&&e.status<500?'Unable to complete this request. Check your details, email verification or code.':'Authentication service unavailable. Please try again.';return reply(res,e.status&&e.status<500?e.status:503,{error:msg});}};
