CIVIL EXAM ATLAS 18.0 — NETLIFY DEPLOYMENT

Recommended: upload this project to a Git repository and import into Netlify. netlify.toml sets the build command and publish directory. No npm install or backend required. Netlify's URL environment variable supplies the primary site address. Optionally set SITE_URL to the final HTTPS custom domain. Build creates dist/ with canonical URLs, absolute social preview image URLs, sitemap.xml and robots.txt.

Manual drag and drop: extract this archive, upload the site/ folder to Netlify Drop. All content works; social image uses a relative URL and the sitemap is not yet generated. Once your actual domain is known, from this project folder run:
  node scripts/build.mjs https://YOUR-ACTUAL-SITE.netlify.app
Then upload dist/ instead of site/. Do not type the example domain literally.

Google: after public deployment verify your property in Google Search Console, submit https://YOUR-ACTUAL-SITE/sitemap.xml and request indexing. Search engines decide whether to index. No ownership verification token is fabricated. Test WhatsApp preview by sending the deployed URL to yourself; cached previews may lag.

Existing #cem, #dhs, #eeec, #phe navigation is preserved. Subject HTML files can also be opened directly and indexed. Four original PDF bundles are included, fetched only when opened. Book references are preserved, not books. This is a deployment/UI packaging update, not a fresh academic content audit.

Validation: desktop 1440px, mobile 390px and 360px local Chromium rendering passed, including search, question expansion and source dialogs. Hosted browser navigation and actual social crawler preview are not yet tested.
