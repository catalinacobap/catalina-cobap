import {test} from 'node:test';
import assert from 'node:assert/strict';
import contact from '../api/contact.js';

const valid = {name:'Test Visitor',email:'visitor@example.com',need:'new',message:'A new website for my business.',website:'example.com',language:'en'};
async function request(body, method='POST') {
 let result;
 const req={method,headers:{'content-type':'application/json'},body};
 const res={statusCode:200,setHeader(){},end(value){result={status:this.statusCode,body:JSON.parse(value)}}};
 await contact(req,res);
 return result;
}
test('contact validates requests and only reports success after provider acceptance', async () => {
 const oldFetch=globalThis.fetch;
 const oldKey=process.env.RESEND_API_KEY;
 const oldFrom=process.env.CONTACT_FROM_EMAIL;
 try {
  assert.equal((await request(valid,'GET')).status,405);
  for (const invalid of [{...valid,email:'bad'}, {...valid,message:''}, {...valid,name:'\r\nInjected'}, {...valid,need:'other'}, {...valid,company:'bot'}, {...valid,message:'x'.repeat(5001)}]) assert.equal((await request(invalid)).status,400);
  assert.equal((await request('{invalid')).status,400);
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  assert.equal((await request(valid)).status,503);
  process.env.RESEND_API_KEY='test-key';
  process.env.CONTACT_FROM_EMAIL='Test <sender@example.com>';
  let sent;
  globalThis.fetch=async (url, options)=>{sent=JSON.parse(options.body);return {ok:true,json:async()=>({id:'mock-id'})}};
  assert.deepEqual(await request(valid),{status:200,body:{ok:true}});
  assert.equal(sent.reply_to,valid.email);
  assert.deepEqual(sent.to,['catalinaciphone@gmail.com']);
  globalThis.fetch=async()=>({ok:false});
  assert.equal((await request(valid)).status,502);
  globalThis.fetch=async()=>{throw Error('timeout')};
  assert.equal((await request(valid)).status,502);
 } finally {
  globalThis.fetch=oldFetch;
  if(oldKey===undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY=oldKey;
  if(oldFrom===undefined) delete process.env.CONTACT_FROM_EMAIL; else process.env.CONTACT_FROM_EMAIL=oldFrom;
 }
});
