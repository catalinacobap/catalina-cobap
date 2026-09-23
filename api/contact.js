const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const respond = (res, status, body) => {
 res.statusCode = status;
 res.setHeader('Content-Type', 'application/json; charset=utf-8');
 res.setHeader('Cache-Control', 'no-store');
 res.end(JSON.stringify(body));
};

export default async function contact(req, res) {
 if (req.method !== 'POST') {
  res.setHeader('Allow', 'POST');
  return respond(res, 405, {ok:false});
 }
 if (!String(req.headers['content-type'] || '').startsWith('application/json')) return respond(res,415,{ok:false});
 try {
  let body = req.body;
  if (body === undefined) {
   let raw = '';
   for await (const chunk of req) {
    raw += chunk.toString();
    if (Buffer.byteLength(raw) > 20000) return respond(res,413,{ok:false});
   }
   body = JSON.parse(raw);
  } else if (typeof body === 'string') {
   if (Buffer.byteLength(body) > 20000) return respond(res,413,{ok:false});
   body = JSON.parse(body);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return respond(res,400,{ok:false});
  const {name, email, need, message, website = '', company = '', language = 'es'} = body;
  const validString = (value, max, required = true) => typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0);
  if (!validString(name,100) || !validString(email,254) || !EMAIL.test(email) || /[\r\n]/.test(name + email) || !['new','redesign','unsure'].includes(need) || !validString(message,5000) || !validString(website,500,false) || company !== '' || !['es','en'].includes(language)) {
   return respond(res,400,{ok:false});
  }
  if (website && !/^https?:\/\//i.test(website) && !/^[^\s]+\.[^\s]+$/.test(website)) return respond(res,400,{ok:false});
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) return respond(res,503,{ok:false});
  const needs = {new:'Sitio nuevo',redesign:'Rediseño',unsure:'Todavía no sé'};
  const response = await fetch('https://api.resend.com/emails', {
   method:'POST',
   headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
   body:JSON.stringify({
    from:process.env.CONTACT_FROM_EMAIL,
    to:['catalinacobap@gmail.com'],
    reply_to:email.trim(),
    subject:`Consulta web: ${needs[need]}`,
    text:`Nombre: ${name.trim()}\nCorreo: ${email.trim()}\nNecesita: ${needs[need]}\nSitio actual: ${website || 'No indicado'}\nIdioma: ${language}\n\n${message.trim()}`,
   }),
   signal:AbortSignal.timeout(15000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
   console.error('Resend rejected contact email', { status: response.status, message: result?.message, name: result?.name });
   return respond(res,502,{ok:false});
  }
  if (!result.id) {
   console.error('Resend returned no email id');
   return respond(res,502,{ok:false});
  }
  return respond(res,200,{ok:true});
 } catch (error) {
  console.error('Contact email request failed', { message: error instanceof Error ? error.message : 'Unknown error' });
  return respond(res,error instanceof SyntaxError ? 400 : 502,{ok:false});
 }
}
