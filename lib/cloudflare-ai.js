const DEFAULT_TEXT_MODEL='@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const VISION_MODEL='@cf/meta/llama-3.2-11b-vision-instruct';

export function cloudflareAiConfigured(){
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID&&process.env.CLOUDFLARE_API_TOKEN);
}

function credentials(){
  const accountId=String(process.env.CLOUDFLARE_ACCOUNT_ID||'').trim();
  const token=String(process.env.CLOUDFLARE_API_TOKEN||'').trim();
  if(!accountId||!token)throw new Error('Cloudflare Workers AI is not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to the server environment.');
  if(!/^[a-f0-9]{32}$/i.test(accountId))throw new Error('Cloudflare account ID is invalid.');
  return{accountId,token};
}

async function post(path,body){
  const{accountId,token}=credentials();
  const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/${path}`,{
    method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body)
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok||data.success===false){
    const detail=Array.isArray(data.errors)?data.errors.map(item=>item.message).join('; '):'';
    console.error('Cloudflare AI request failed',response.status,detail.slice(0,300));
    const message=response.status===429?'Cloudflare Workers AI free daily limit or capacity is reached. Try again later.':'Cloudflare Workers AI could not complete this request. Check the account, token permissions and model access.';
    throw new Error(message);
  }
  return data.result||data;
}

export async function cloudflareChat(messages,{maxTokens=1200,model}={}){
  const result=await post('v1/chat/completions',{
    model:model||process.env.CLOUDFLARE_AI_MODEL||DEFAULT_TEXT_MODEL,
    messages,
    max_tokens:maxTokens,
    temperature:0.35
  });
  const answer=result.choices?.[0]?.message?.content;
  if(typeof answer!=='string'||!answer.trim())throw new Error('Cloudflare Workers AI returned an empty answer. Try again.');
  return answer.trim();
}

export async function cloudflareVision(messages,imageDataUri,{maxTokens=900}={}){
  const result=await post(`run/${VISION_MODEL}`,{messages,image:imageDataUri,max_tokens:maxTokens});
  const answer=result.response||result.text||result.choices?.[0]?.message?.content;
  if(typeof answer!=='string'||!answer.trim())throw new Error('Cloudflare vision model returned an empty answer. Check model access and try again.');
  return answer.trim();
}

