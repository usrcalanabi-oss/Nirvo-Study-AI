import { authenticatedUser } from '../lib/auth.js';

export default async function handler(request,response){
  response.setHeader('Cache-Control','no-store');
  if(request.method!=='POST'){response.setHeader('Allow','POST');return response.status(405).json({error:'Use POST to look up chapter titles.'})}
  if(!await authenticatedUser(request))return response.status(401).json({error:'Sign in to use chapter tools.'});
  return response.status(200).json({
    chapters:[],
    sources:[],
    liveSearchAvailable:false,
    message:'Automatic online chapter search is not connected to the free AI service yet. Type the chapter title exactly as it appears in your textbook so questions and notes use your selected topic.'
  });
}

