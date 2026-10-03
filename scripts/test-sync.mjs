import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker from '../server/worker.mjs';
export function database(){const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('../drizzle/0000_tricky_micromacro.sql',import.meta.url),'utf8'));return {prepare(sql){return {bind(...values){const query=sqlite.prepare(sql);return {async run(){const result=query.run(...values);return {meta:{changes:result.changes}};},async first(){return query.get(...values)||null;}};}};}};}
const DB=database();
async function call(action,body,origin='https://chenwasrunning.github.io'){const response=await worker.fetch(new Request('https://backend.test/api/progress/'+action,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)}),{DB});return {status:response.status,data:await response.json(),headers:response.headers};}
test('create, duplicate, normalization, load, revision conflict, undo and input validation',async()=>{
 let result=await call('create',{identifier:' test-冒险者 ',completed:['q001']});assert.equal(result.status,201);assert.equal(result.headers.get('Access-Control-Allow-Origin'),'https://chenwasrunning.github.io');
 result=await call('create',{identifier:'test-冒险者',completed:[]});assert.equal(result.status,409);assert.equal(result.data.error,'identifier_taken');
 result=await call('load',{identifier:'test-冒险者'});assert.deepEqual(result.data,{completed:['q001'],revision:1});
 result=await call('save',{identifier:'test-冒险者',completed:['q001','q002'],revision:1});assert.equal(result.data.revision,2);
 result=await call('save',{identifier:'test-冒险者',completed:[],revision:1});assert.equal(result.status,409);
 result=await call('save',{identifier:'test-冒险者',completed:[],revision:2});assert.deepEqual(result.data.completed,[]);
 assert.equal((await call('load',{identifier:'missing'})).status,404);
 assert.equal((await call('create',{identifier:' ',completed:[]})).status,400);
 assert.equal((await call('create',{identifier:'invalid',completed:['q093']})).status,400);
 assert.equal((await call('create',{identifier:'invalid',completed:['<script>']})).status,400);
 assert.equal((await call('load',{identifier:'test-冒险者'},'https://other.example')).status,403);
 const results=await Promise.all([call('create',{identifier:'race',completed:[]}),call('create',{identifier:'race',completed:['q001']})]);assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);
});
