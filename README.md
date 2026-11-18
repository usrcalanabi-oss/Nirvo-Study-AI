# Nirvo Study AI

Nirvo is a study-planning website with a Cloudflare Workers AI connection. The planner and PDF downloads work without an AI account. With Supabase and Cloudflare configured, signed-in students can ask study questions, generate five-question practice quizzes, and request feedback on a selected image.

## Honest feature notes

- The AI generates explanations and questions; it does not certify syllabus accuracy. Check answers against the current textbook and teacher guidance.
- Live web search is an optional feature in the Study AI chat. It uses Cloudflare Web Search API through AI Gateway, not the free Workers AI daily allocation. It requires AI Gateway credits or a search-provider key configured on the gateway; searches may incur separate charges. Students should leave the switch off unless the account owner has configured and approved this service. Automatic chapter-name lookup is separate; students should enter the chapter title from their textbook. Nirvo must not present model-generated chapter names as verified facts.
- Image feedback can misread handwriting or marks. It is not official grading or a verified progress-card assessment. The selected image is sent to Cloudflare for analysis and is not saved by Nirvo.
- Cloudflare Workers AI has a free daily allocation of 10,000 Neurons. When the daily allowance or service capacity is exhausted, AI requests can fail until availability returns. Do not upgrade to a paid plan if you need to keep this free.
- AI requests are also capped at 20 per signed-in account per UTC day through the Supabase SQL setup.

Because this project is made by a Class 10 student, ask a parent or guardian to help create and manage provider accounts, review service terms, and configure secrets. Never put a Cloudflare API token, OpenAI key, or Supabase secret/service-role key in browser code, GitHub, or chat.

## 1. Configure Cloudflare Workers AI

1. In Cloudflare, open **Workers AI** and choose **Use REST API**.
2. Choose **Create a Workers AI API Token** and copy the token privately. If creating a custom token, Cloudflare's REST setup guide says it needs **Workers AI Read** and **Workers AI Edit** permissions.
3. Copy the Cloudflare **Account ID** from the Workers AI page.
4. In Vercel, open the Nirvo project → **Settings → Environment Variables**. Add these server-side variables (do not use a `NEXT_PUBLIC_` prefix):

   - `CLOUDFLARE_ACCOUNT_ID` = the Cloudflare Account ID
   - `CLOUDFLARE_API_TOKEN` = the private token
   - `CLOUDFLARE_AI_MODEL` = `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

   Set the environment to **Production and Preview**. Keep the token private. Never put it in `supabase-config.js`.

5. Keep the existing Supabase server variables in Vercel:

   - `SUPABASE_URL` = your Supabase project URL, without `/rest/v1/`
   - `SUPABASE_ANON_KEY` = your public `sb_publishable_...` key

6. Redeploy the Vercel project so the new server variables take effect.

The site uses Cloudflare's OpenAI-compatible chat-completions endpoint for study chat and quizzes, and its Llama Vision model endpoint for image feedback. The first use of the vision model may require the account owner to accept Meta's model terms in Cloudflare. Do that with a parent/guardian before using image feedback.

### Optional: enable Internet Search

1. In Cloudflare, open AI Gateway and use the `default` gateway (or set `CLOUDFLARE_AI_GATEWAY_ID`).
2. Ensure the account has AI Gateway credits, or add a supported Ceramic.ai, Exa or Linkup provider key to the gateway. The search API is separately billed; it is not covered by the Workers AI free daily Neurons allocation.
3. The existing `CLOUDFLARE_API_TOKEN` must include **Account → Workers AI → Read** and **Account → AI Gateway → Read** permissions. Keep it server-side in Vercel.
4. Optional Vercel variables: `CLOUDFLARE_AI_GATEWAY_ID` (defaults to `default`), `CLOUDFLARE_WEB_SEARCH_PROVIDER` (`ceramic`, `exa` or `linkup`; defaults to `ceramic`), and `CLOUDFLARE_WEB_SEARCH_BYOK_ALIAS` if you configured a provider key alias.
5. Redeploy. In the Study AI chat, turn on **Search the internet** when you want current web sources. The answer will show source links. If the search service is not configured, the site will display an error rather than pretending it searched.

## 2. Finish Supabase sign-in and AI usage limits

1. In the Supabase SQL Editor, run all of [`supabase-profiles.sql`](./supabase-profiles.sql). This creates private student-profile policies and the daily AI request limit.
2. In Supabase Authentication → URL Configuration, add the production Vercel URL as the Site URL and as an allowed Redirect URL.
3. Create an account on Nirvo, confirm the email if requested, and sign in. The default Supabase email service may have sending limits.

## 3. Run locally

Install Node.js 20+, open PowerShell in the project folder, and run:

```powershell
npm install --global vercel
Copy-Item .env.example .env.local
# Edit .env.local with the Cloudflare and Supabase values. Keep this file private.
npm run dev
```

Open the localhost URL printed by Vercel. Press `Ctrl+C` to stop the local server.

## Deployment

Vercel is used because this project has server-side `/api` routes. GitHub Pages cannot run those routes. Vercel automatically deploys commits from the connected GitHub repository; environment-variable changes require a new deployment.

