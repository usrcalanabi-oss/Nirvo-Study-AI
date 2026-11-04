import { authenticatedUser } from '../lib/auth.js';
export default async function handler(request,response){response.setHeader('Cache-Control','no-store');const user=await authenticatedUser(request);response.status(200).json({configured:Boolean(user&&process.env.OPENAI_API_KEY),authenticated:Boolean(user)});}
