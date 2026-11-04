import { authenticatedUser, consumeAiBudget } from '../lib/auth.js';
import { cloudflareAiConfigured, cloudflareChat } from '../lib/cloudflare-ai.js';

const ALLOWED_CLASSES=new Set(['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12']);

export default async function handler(request,response){
  response.setHeader('Cache-Control','no-store');
  response.setHeader('X-Content-Type-Options','nosniff');
  if(request.method!=='POST'){response.setHeader('Allow','POST');return response.status(405).json({error:'Use POST for study questions.'})}
  const user=await authenticatedUser(request);
  if(!user)return response.status(401).json({error:'Sign in to use the study AI.'});
  if(!cloudflareAiConfigured())return response.status(503).json({error:'The free AI connection is not configured yet. Add the Cloudflare account ID and private API token in Vercel settings.'});
  try{
    const body=typeof request.body==='string'?JSON.parse(request.body):request.body||{};
    const message=String(body.message||'').trim();
    const grade=ALLOWED_CLASSES.has(body.class)?body.class:'school';
    const subject=String(body.subject||'general').slice(0,60);
    const language=body.language==='Malayalam'?'Malayalam':'English';
    const board=String(body.board||'general curriculum').slice(0,60);
    const chapter=String(body.chapter||'').slice(0,100);
    const noteRequest=body.noteRequest===true;
    if(message.length<2||message.length>1500)return response.status(400).json({error:'Enter a question between 2 and 1500 characters.'});
    if(!await consumeAiBudget(request))return response.status(429).json({error:'Daily AI limit reached, or the Supabase usage-limit setup is missing. Try again tomorrow or ask the site owner to check setup.'});
    const previous=Array.isArray(body.history)?body.history.slice(-8).filter(item=>['user','assistant'].includes(item.role)&&typeof item.content==='string').map(item=>({role:item.role,content:item.content.slice(0,1500)})):[];
    const task=noteRequest
      ?'Create original study notes in your own words. Include learning goals, key ideas, key terms or formulas, one worked example, five self-check questions with answers, and a short revision summary. You cannot browse the live web in this service. Do not invent citations, links, or claims that you checked a source. Tell the learner to compare chapter coverage with their own textbook.'
      :`Explain the requested topic clearly and patiently. You cannot browse the live web in this service. Do not invent sources, citations, or claims that you checked an official textbook.`;
    const system=`You are Nirvo Study AI, a friendly school study partner for ${grade}, ${board}, in ${subject}${chapter?`, chapter ${chapter}`:''}. Reply in ${language}. Use age-appropriate explanations, show steps for calculations, and encourage learning. Be honest about uncertainty and ask the student to check important facts against the current textbook and teacher guidance. Never diagnose intelligence or a learning disability. Never ask for personal information. ${task}`;
    const answer=await cloudflareChat([{role:'system',content:system},...previous,{role:'user',content:message}],{maxTokens:noteRequest?1800:900});
    return response.status(200).json({answer,sources:[],provider:'Cloudflare Workers AI'});
  }catch(error){
    console.error('Nirvo Cloudflare AI error',error.message);
    return response.status(error.message.includes('not configured')?503:502).json({error:error.message||'Could not contact the study AI. Try again.'});
  }
}

