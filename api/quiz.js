import { authenticatedUser, consumeAiBudget } from '../lib/auth.js';
import { cloudflareAiConfigured, cloudflareChat } from '../lib/cloudflare-ai.js';
import { parseJson } from './_education.js';

const CLASSES=new Set(['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12']);
const SUBJECTS=['Mathematics','Science','Physics','Chemistry','Biology','English','Social Science','Malayalam','Hindi','Computer Science','Economics'];

export default async function handler(request,response){
  response.setHeader('Cache-Control','no-store');
  if(request.method!=='POST'){response.setHeader('Allow','POST');return response.status(405).json({error:'Use POST to create a quiz.'})}
  if(!await authenticatedUser(request))return response.status(401).json({error:'Sign in before generating an AI quiz.'});
  if(!cloudflareAiConfigured())return response.status(503).json({error:'The free AI connection is not configured yet.'});
  try{
    const body=typeof request.body==='string'?JSON.parse(request.body):request.body||{};
    const grade=CLASSES.has(body.class)?body.class:null;
    const board=String(body.board||'').slice(0,40);
    const subject=SUBJECTS.includes(body.subject)?body.subject:null;
    const chapter=String(body.chapter||'').trim().slice(0,100);
    const language=body.language==='Malayalam'?'Malayalam':'English';
    if(!grade||!subject||!board)return response.status(400).json({error:'Choose a valid class, board and subject.'});
    if(!await consumeAiBudget(request))return response.status(429).json({error:'Daily AI limit reached or the Supabase usage setup is missing.'});
    const prompt=`Create exactly five original multiple-choice learning questions for ${grade}, ${board}, subject ${subject}${chapter?`, chapter/topic ${chapter}`:''}. Reply in ${language}. Do not copy existing question banks. Match the requested school level, use four distinct short options per question, set answer to the zero-based correct option index (0–3), and include a concise teaching explanation. This service cannot browse live sources, so do not claim the questions are verified against a current textbook or syllabus. Return only valid JSON in this shape: {"questions":[{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"..."}]} with exactly five questions.`;
    const text=await cloudflareChat([
      {role:'system',content:'You are Nirvo, a careful school quiz author. Create new educational questions. Do not claim official syllabus verification. Output only the requested JSON object.'},
      {role:'user',content:prompt}
    ],{maxTokens:1800});
    const parsed=parseJson(text);
    if(!Array.isArray(parsed.questions)||parsed.questions.length!==5)return response.status(502).json({error:'The AI did not return exactly five questions. Please try again.'});
    for(const question of parsed.questions){
      if(typeof question.question!=='string'||!Array.isArray(question.options)||question.options.length!==4||!Number.isInteger(question.answer)||question.answer<0||question.answer>3||typeof question.explanation!=='string')return response.status(502).json({error:'The AI returned an invalid quiz. Please try again.'});
    }
    return response.status(200).json({questions:parsed.questions,sources:[],board,grade,subject,chapter,verified:false});
  }catch(error){
    console.error('Cloudflare AI quiz error',error.message);
    return response.status(error.message.includes('not configured')?503:502).json({error:error.message||'Could not create the quiz. Please try again.'});
  }
}

