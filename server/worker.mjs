const allowedOrigins = new Set(['https://chenwasrunning.github.io','https://gmscw-mage-task.ran1997pld.chatgpt.site']);
const validId = /^q(?:00[1-9]|0[1-8][0-9]|09[0-2])$/;
export function validateState(value) {
  if (!Array.isArray(value) || value.length > 92 || value.some(id => typeof id !== 'string' || !validId.test(id))) throw new Error('invalid_state');
  return [...new Set(value)].sort();
}
async function hashIdentifier(identifier) {
  if(typeof identifier !== 'string' || !identifier.trim() || identifier.length > 200) throw new Error('invalid_identifier');
  const bytes = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identifier.normalize('NFC').trim()));
  return Array.from(new Uint8Array(bytes), b=>b.toString(16).padStart(2,'0')).join('');
}
export default {
 async fetch(request,env) {
  const url = new URL(request.url), origin = request.headers.get('Origin');
  const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin'};
  if(origin && allowedOrigins.has(origin)) headers['Access-Control-Allow-Origin']=origin;
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  if(!url.pathname.startsWith('/api/')) return env.ASSETS ? env.ASSETS.fetch(request) : new Response('GMSCW progress API');
  if(origin && !allowedOrigins.has(origin)) return json({error:'origin_not_allowed'},403);
  if(request.method==='OPTIONS') return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400'}});
  if(request.method!=='POST') return json({error:'method_not_allowed'},405);
  if(!['/api/progress/create','/api/progress/load','/api/progress/save'].includes(url.pathname)) return json({error:'not_found'},404);
  if(!request.headers.get('Content-Type')?.startsWith('application/json')) return json({error:'invalid_content_type'},415);
  try {
   const raw=await request.text();
   if(raw.length>8192) return json({error:'too_large'},413);
   let body;try{body=JSON.parse(raw);}catch{return json({error:'invalid_json'},400);}
   if(!body || typeof body!=='object') return json({error:'invalid_request'},400);
   let hash,completed;
   try {hash=await hashIdentifier(body.identifier);if(!url.pathname.endsWith('/load')) completed=validateState(body.completed);}catch(e){return json({error:e.message},400);}
   const db=env.DB;
   if(url.pathname.endsWith('/create')) {
    const result=await db.prepare('INSERT INTO progress (identifier_hash,completed,revision,updated_at) VALUES (?,?,1,?) ON CONFLICT(identifier_hash) DO NOTHING').bind(hash,JSON.stringify(completed),new Date().toISOString()).run();
    if(!result.meta.changes) return json({error:'identifier_taken'},409);
    return json({completed,revision:1},201);
   }
   if(url.pathname.endsWith('/save')) {
    if(!Number.isSafeInteger(body.revision)||body.revision<1) return json({error:'invalid_revision'},400);
    const result=await db.prepare('UPDATE progress SET completed=?, revision=revision+1, updated_at=? WHERE identifier_hash=? AND revision=?').bind(JSON.stringify(completed),new Date().toISOString(),hash,body.revision).run();
    if(result.meta.changes) return json({completed,revision:body.revision+1});
    return json({error:'revision_conflict'},409);
   }
   const row=await db.prepare('SELECT completed,revision FROM progress WHERE identifier_hash=?').bind(hash).first();
   if(!row) return json({error:'not_found'},404);
   return json({completed:JSON.parse(row.completed),revision:row.revision});
  } catch(e) {console.error('Progress storage unavailable',e.message);return json({error:'unavailable'},503);}
 }
};
