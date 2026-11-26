CIVIL EXAM ATLAS 19.0 — SWIPE CARD ENTRY / VERCEL + SUPABASE

1. SUPABASE (one-time)
Create a Free project at https://supabase.com/dashboard. Under Authentication,
make sure Email provider and Confirm email are enabled, and new signups allowed.
Set email OTP length to 6 and password minimum length to at least 8.
In Authentication > Email Templates, replace Confirm signup and Reset password
with the matching templates in OTP-EMAIL-TEMPLATES.txt (must include {{ .Token }}).
Configure custom SMTP under Authentication > SMTP Settings for public users;
Supabase's default mail only works for preauthorized team addresses. Your mail
provider may require a verified sender/domain and may have charges/limits.
Set the Site URL under Authentication > URL Configuration to the actual
Vercel production origin. Email OTP flow does not require a redirect callback.
Find the Project URL and publishable key (or legacy anon key) under Connect/API Keys.
Do not use a service_role key or a secret key.

2. GITHUB + VERCEL (existing project)
Extract this ZIP. Upload all contents to the existing repository root, replacing
same-path files; retain folders. Make the repo PRIVATE to prevent unauthenticated
access to source content. The original site/ folder is intentionally NOT public;
Vercel serves it only via authenticated functions. vercel.json sets the build
command and output folder automatically. Existing build command with the Vercel
URL argument also works. Output Directory must be dist, not site or public.
In Vercel Project > Settings > Environment Variables, create these two variables
for Production (and Preview if needed):
  SUPABASE_URL = https://YOUR-PROJECT-REF.supabase.co
  SUPABASE_ANON_KEY = your publishable or legacy anon key
Redeploy the latest commit after saving variables. No npm packages required.
Do not paste keys into GitHub or chat. Use Vercel's environment variable fields.

3. LIVE TEST
Open production URL in a private browser window. Sign up with your real email,
receive six digit OTP, verify, open a subject and PDF. Reload to verify persistent
session. Test sign out, sign in with password, forgot password and recovery OTP.
Test /atlas/subjects/cem.html and /papers/cem.pdf while logged out: must redirect
back to sign in. Check that an old deployment URL is not still public; disable or
protect outdated deployments and remove the old public version as appropriate.

NOTES
Email OTP only (no SMS or Google login); no payment was enabled by this package.
Sessions use server-issued HttpOnly Secure SameSite cookies with a 30-day cookie
lifetime, refreshed through Supabase; actual session length depends on provider
settings, browser cookies and inactivity. Signing out revokes the local session.
Private content is not indexed by search engines; the login page retains SEO.
Old site/_headers and site/robots.txt are not published by the new build.
For a public rollout configure Supabase CAPTCHA/rate limits and review logs,
SMTP sending limits, provider and hosting quotas. Auth is not yet live-tested
with your real Supabase project. Never publish copyrighted material without rights.
