# Nirvo Study AI — run and publish guide

## Current connection status

This copy is **not connected to live sign-in or AI yet**: `supabase-config.js` still contains `YOUR-PROJECT` and `YOUR-PUBLIC-ANON-KEY`, and the server needs a real `OPENAI_API_KEY`. The website now disables account entry until Supabase is configured, so it will not accept a password that it cannot securely send. Add the service values using the steps below, then publish on Vercel. GitHub Pages cannot run this project's `/api` AI routes.

Nirvo includes the exam planner, class-based AI quizzes, live chapter lookup, chapter-specific downloadable notes, English/Malayalam AI replies, PDF downloads, email/password sign-in and reset, private profile sync, source-linked web search, and image-based study-paper feedback. Account, database, and AI features require the owner setup below; they cannot work with placeholder keys. The planner, general offline practice quizzes, and PDF template downloads work without those services. Live chapter-verified quizzes, account sync and AI notes require the owner setup.

The **Shared Study Resources** section includes the six second-term revision-plan PDFs supplied in the shared [MS SOLUTIONS Drive folder](https://drive.google.com/drive/folders/1GHQRiZmAeblHZoHsnBTq_sR3KG9k0CGb?usp=sharing), for Classes 5–9 and SSLC/Class 10. They are downloadable locally from `downloads/`. The Class 10 source describes a fixed three-hour daily plan; students should compare each plan with their current school syllabus and routine. These files are identified as shared source material, not Nirvo-authored or personalized plans.

## 1. Set up accounts with a parent/guardian

Because this project is made by a Class 10 student, have a parent/guardian help create and manage GitHub, Supabase, Vercel and AI-provider accounts. AI requests, especially web search and image review, can incur charges. Never publish a provider secret key.

## 2. Run the website locally

1. Install Node.js 20+ from [nodejs.org](https://nodejs.org/).
2. Open PowerShell in the project folder `C:\money` (File Explorer → open the folder → address bar → type `powershell` → Enter).
3. Install Vercel CLI:

   ```powershell
   npm install --global vercel
   ```

4. Start the app:

   ```powershell
   npm run dev
   ```

5. Open the localhost URL printed in PowerShell, usually `http://localhost:3000`. Press `Ctrl+C` in PowerShell to stop.

Without service setup, sign-in is disabled before credentials can be entered. The planner, offline general practice and PDF templates remain available; live chapter search, AI questions and AI-generated notes require the configured services and remain inside the Nirvo page.

## 3. Configure email sign-in and private profiles with Supabase

1. A parent/guardian creates a Supabase project.
2. In Supabase **Project Settings → API**, copy the project URL and **publishable/anon key**. These two values are allowed in browser code. Never use a `service_role` or secret key in the website.
3. Edit `supabase-config.js`: replace `https://YOUR-PROJECT.supabase.co` and `YOUR-PUBLIC-ANON-KEY` with those values.
4. In Supabase **SQL Editor**, run all of `supabase-profiles.sql`. This creates the student-profile table, row-level access policies, and an atomic cap of 20 AI requests per account per UTC day. Do not skip the SQL setup; the AI stays blocked if the usage limit cannot be checked.
5. In Supabase **Authentication → URL Configuration**, set the Site URL to your local URL while testing (for example, `http://localhost:3000`) and add it to Redirect URLs. Before public deployment, add the Vercel URL there too.
6. In **Authentication → Providers → Email**, leave email confirmation enabled for real accounts. Supabase's default testing email service has low sending limits; if confirmation messages fail, the project owner must set up an email sender in Supabase.
7. Open the local site, choose **Sign in → Create an account**, enter an email and password, and check the guardian-permission box. Confirm the email if asked, then sign in. Create a planner profile and confirm it appears after reloading.

Profiles are stored in Supabase so they can sync across visits. The SQL policies limit each user to their own profile. The site does not request age or school name. User password handling is delegated to Supabase Auth; Nirvo never stores a password.

## 4. Configure the real AI service

1. The project owner creates an OpenAI API account and sets a spending limit before creating a key. API access and ChatGPT plans are separate. Search and image requests have additional model usage costs.
2. For local development, create `.env.local` in `C:\money` (this file is Git-ignored) with:

   ```text
   OPENAI_API_KEY=your-secret-key
   OPENAI_MODEL=gpt-4.1-mini
   OPENAI_VISION_MODEL=gpt-4.1-mini
   SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   SUPABASE_ANON_KEY=your-project-publishable-or-anon-key
   ```

3. Never paste the OpenAI key into `supabase-config.js`, `app.js`, HTML, GitHub, or a message. The Supabase public key belongs in `supabase-config.js`; the same project values are server variables so the API can validate signed-in users.
4. Restart `npm run dev`. Sign in. Nirvo Study AI can answer study questions. Check **Search the web** when you want an internet search; this spends AI provider usage and results include source links. Without that option, the AI must not claim it searched online.
5. Choose a clear JPG/PNG/WebP image under 2.3 MB, remove personal details, sign in, and tick the sharing/guardian confirmation before requesting image feedback. The server sends the image to the configured model for analysis and does not save it. The AI may misread handwriting or marks. It does not support PDF OCR, official grading, or verified progress-card evaluation.

AI questions contain five multiple-choice questions for the selected class, board and subject, with explanations and source links. Chapter suggestions are searched live from official SCERT/CBSE pages and public BioVision/HSSLive Guru pages; links are returned so a student can check the textbook edition. The in-page “Make notes & download” action sends an original-notes request through that same authenticated AI route with web search enabled, then offers the answer as a local download. Search results can be incomplete or use a different edition; they are not a guarantee of textbook-perfect coverage. The server checks the Supabase access token on every AI request. The database RPC caps each account at 20 AI requests per UTC day. Provider keys stay in server environment variables. AI answers and image readings can be wrong; check textbooks and teacher guidance.

## 5. Publish with GitHub and Vercel

Vercel is the recommended host because this project has `/api` serverless routes.

1. Create a **private** GitHub repository named `nirvo-study-ai` and upload the project files, including `api`, `lib`, `assets`, `index.html`, `styles.css`, `app.js`, `curriculum.js`, `language.js`, `downloads.js`, `auth.js`, `supabase-config.js`, `supabase-profiles.sql`, `package.json`, and `vercel.json`.
2. Do not upload `.env.local` or any OpenAI secret key. `.gitignore` excludes them.
3. A parent/guardian creates/signs in to Vercel, imports the GitHub repository and deploys it.
4. In Vercel **Project Settings → Environment Variables**, add `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_VISION_MODEL`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`. Set the values described above. Keep them server-side; don't add browser-public prefixes.
5. Redeploy after adding variables. Add your deployment URL to the Supabase Auth redirect URL list and set it as the Supabase Site URL.
6. Open the website and test account creation, email confirmation, sign-in, saving a planner profile, one AI response, web search (if enabled), and an image review using a sample page with no personal details.
7. Share the resulting `https://...vercel.app` website link. Future GitHub updates deploy automatically.

Free hosting does not guarantee 24×7 uptime. AI usage is billed separately by its provider and is not made free by a free hosting tier. A public image review sends the selected image to the provider, so keep the confirmation prompt and privacy explanation.

## What is and isn't implemented

- **Implemented once configured:** email/password auth, email confirmation and password reset flows, profile sync, user-isolated database policies, per-user AI request limit, Responses API chat, downloadable AI answers, opt-in web search with returned sources, and vision feedback from one image.
- **Included and works offline:** timetable suggestion, exam countdown, original printable PDF templates and local image preview. AI quizzes and live chapter lookup require sign-in and the configured AI service.
- **Not included:** PDF text extraction, automatic marks storage, a locally owned official CBSE/Kerala syllabus database, guaranteed syllabus-perfect notes, guaranteed Malayalam translation quality, a deployed site, or working provider credentials. Live search may find public SCERT, Bio-vision, and HSSLive Guru pages, but verify chapters and answers against the exact school textbook edition. The AI is instructed to respond in the selected English or Malayalam language. Quiz scores describe only that practice attempt, never intelligence or overall ability.
- Do not upload real student answer sheets or progress cards until the student and guardian understand that an image sent for review is processed by the configured AI provider. The example footer shows the owner contact details supplied for the site; remove them if you do not want them public.

## Project files

- `index.html`, `styles.css`, `app.js`: interface and study planner.
- `auth.js`, `supabase-config.js`, `supabase-profiles.sql`: sign-in, profile sync and database access rules.
- `api/chat.js`, `api/quiz.js`, `api/chapters.js`, `api/review-image.js`, `api/health.js`, `api/_education.js`, `lib/auth.js`: authenticated AI endpoints.
- `curriculum.js`, `downloads.js`, `language.js`: class subject choices, AI quizzes/chapter search, PDF downloads and language toggle.
