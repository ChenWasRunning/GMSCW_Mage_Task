const allowedOrigins = new Set(['https://chenwasrunning.github.io','https://gmscw-mage-task.ran1997pld.chatgpt.site']);
const validIds = new Set(["a001", "a002", "a003", "a004", "a005", "a006", "a007", "a008", "a009", "a010", "a011", "a012", "a013", "a014", "a015", "a016", "a017", "a018", "a019", "a020", "a021", "a022", "a023", "a024", "a025", "a026", "a027", "a028", "a029", "a030", "a031", "a032", "a033", "a034", "a035", "a036", "a037", "a038", "a039", "a040", "a041", "a042", "a043", "a044", "a045", "a046", "a047", "a048", "a049", "a050", "a051", "a052", "a053", "a054", "a055", "a056", "a057", "a058", "a059", "a060", "a061", "a062", "a063", "a064", "a065", "a066", "a067", "a068", "a069", "a070", "a071", "a072", "a073", "a074", "a075", "a076", "a077", "a078", "a079", "a080", "a081", "a082", "a083", "a084", "a085", "a086", "a087", "a088", "a089", "a090", "a091", "a092", "a093", "a094", "w001", "w002", "w003", "w004", "w005", "w006", "w007", "w008", "w009", "w010", "w011", "w012", "w013", "w014", "w015", "w016", "w017", "w018", "w019", "w020", "w021", "w022", "w023", "w024", "w025", "w026", "w027", "w028", "w029", "w030", "w031", "w032", "w033", "w034", "w035", "w036", "w037", "w038", "w039", "w040", "w041", "w042", "w043", "w044", "w045", "w046", "w047", "w048", "w049", "w050", "w051", "w052", "w053", "w054", "w055", "w056", "w057", "w058", "w059", "w060", "w061", "w062", "w063", "w064", "w065", "w066", "w067", "w068", "w069", "w070", "w071", "w072", "w073", "w074", "w075", "w076", "w077", "w078", "w079", "w080", "w081", "w082", "w083", "w084", "w085", "w086", "t001", "t002", "t003", "t004", "t005", "t006", "t007", "t008", "t009", "t010", "t011", "t012", "t013", "t014", "t015", "t016", "t017", "t018", "t019", "t020", "t021", "t022", "t023", "t024", "t025", "t026", "t027", "t028", "t029", "t030", "t031", "t032", "t033", "t034", "t035", "t036", "t037", "t038", "t039", "t040", "t041", "t042", "t043", "t044", "t045", "t046", "t047", "t048", "t049", "t050", "t051", "t052", "t053", "t054", "t055", "t056", "t057", "t058", "t059", "t060", "t061", "t062", "t063", "t064", "t065", "t066", "t067", "t068", "t069", "t070", "t071", "t072", "t073", "t074", "t075", "t076", "t077", "t078", "t079", "t080", "t081", "t082", "t083", "t084", "t085", "t086", "t087", "t088", "t089", "q001", "q002", "q003", "q004", "q005", "q006", "q007", "q008", "q009", "q010", "q011", "q012", "q013", "q014", "q015", "q016", "q017", "q018", "q019", "q020", "q021", "q022", "q023", "q024", "q025", "q026", "q027", "q028", "q029", "q030", "q031", "q032", "q033", "q034", "q035", "q036", "q037", "q038", "q039", "q040", "q041", "q042", "q043", "q044", "q045", "q046", "q047", "q048", "q049", "q050", "q051", "q052", "q053", "q054", "q055", "q056", "q057", "q058", "q059", "q060", "q061", "q062", "q063", "q064", "q065", "q066", "q067", "q068", "q069", "q070", "q071", "q072", "q073", "q074", "q075", "q076", "q077", "q078", "q079", "q080", "q081", "q082", "q083", "q084", "q085", "q086", "q087", "q088", "q089", "q090", "q091", "q092"]);
export function validateState(value) {
  if (!Array.isArray(value) || value.length > validIds.size || value.some(id => typeof id !== 'string' || !validIds.has(id))) throw new Error('invalid_state');
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
