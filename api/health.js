import { authenticatedUser } from '../lib/auth.js';
import { cloudflareAiConfigured } from '../lib/cloudflare-ai.js';
export default async function handler(request,response){response.setHeader('Cache-Control','no-store');const user=await authenticatedUser(request);response.status(200).json({configured:Boolean(user&&cloudflareAiConfigured()),authenticated:Boolean(user),provider:'Cloudflare Workers AI'});}

