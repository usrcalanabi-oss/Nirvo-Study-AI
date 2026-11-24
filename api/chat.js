import { authenticatedUser, consumeAiBudget } from '../lib/auth.js';
import { cloudflareAiConfigured, cloudflareChat, cloudflareWebSearch } from '../lib/cloudflare-ai.js';
import { buildNirvoMessages, getNirvoMode } from '../lib/nirvo-engine.js';

const ALLOWED_CLASSES=new Set(['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12']);

export default async function handler(request,response){
  response.setHeader('Cache-Control','no-store');
  response.setHeader('X-Content-Type-Options','nosniff');
  if(request.method!=='POST'){response.setHeader('Allow','POST');return response.status(405).json({error:'Use POST for study questions.'})}
  const user=await authenticatedUser(request);
  if(!user)return response.status(401).json({error:'Your private student space is not connected. Refresh the page to reconnect.'});
  if(!cloudflareAiConfigured())return response.status(503).json({error:'The NIRVO AI model service is not configured. The site cannot generate answers until its model host is connected.'});
  try{
    const body=typeof request.body==='string'?JSON.parse(request.body):request.body||{};
    const message=String(body.message||'').trim();
    const grade=ALLOWED_CLASSES.has(body.class)?body.class:'school';
    const subject=String(body.subject||'general').slice(0,60);
    const language=['Malayalam','Hindi','English'].includes(body.language)?body.language:'English';
    const board=String(body.board||'general curriculum').slice(0,60);
    const chapter=String(body.chapter||'').slice(0,100);
    const mode=getNirvoMode(body);
    const webSearch=body.webSearch===true;
    if(message.length<2||message.length>1500)return response.status(400).json({error:'Enter a question between 2 and 1500 characters.'});
    if(!await consumeAiBudget(request))return response.status(429).json({error:'Daily AI limit reached, or the Supabase usage-limit setup is missing. Try again tomorrow or ask the site owner to check setup.'});
    let sources=[];
    if(webSearch){
      const search=await cloudflareWebSearch(message);
      sources=search.items;
    }
    const messages=buildNirvoMessages({message,grade,subject,language,board,chapter,mode,webSearch,sources,history:body.history});
    const answer=await cloudflareChat(messages,{maxTokens:mode==='notes'?1800:mode==='quiz'?1400:mode==='check'?1200:900});
    return response.status(200).json({answer,sources,provider:'NIRVO AI Engine',model:process.env.CLOUDFLARE_AI_MODEL||'@cf/meta/llama-3.3-70b-instruct-fp8-fast'});
  }catch(error){
    console.error('NIRVO AI engine error',error.message);
    return response.status(error.message.includes('not configured')?503:502).json({error:error.message||'Could not contact the NIRVO AI engine. Try again.'});
  }
}
