# Deployment Guide

## Quick Start (Local Preview)

```bash
# Navigate to the project folder
cd "/Users/tejusrmeda/Downloads/AI Projects/Doc Manager"

# Start a local server (Python 3)
python3 -m http.server 8000

# Or with Node.js
npx serve .
```

Then open http://localhost:8000 in your browser.

---

## Generate App Icons (Required for PWA)

1. Open `generate-icons.html` in your browser
2. Click "Download Both"
3. Save the files as `icon-192.png` and `icon-512.png` in this folder

---

## Deployment Options

### Option 1: Vercel (Recommended - Free)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this folder
3. Follow the prompts
4. Your site will be live at `https://your-project.vercel.app`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop this folder to deploy
3. Or connect your GitHub repo for auto-deploys

### Option 3: GitHub Pages (Free)

1. Create a GitHub repository
2. Push this folder to the repo
3. Go to Settings > Pages
4. Select "Deploy from a branch" > main
5. Your site will be at `https://username.github.io/repo-name`

### Option 4: Cloudflare Pages (Free)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repo
3. Set build output directory to `/` (root)
4. Deploy

---

## File Structure

```
Doc Manager/
├── index.html          # Landing page (SEO-optimized)
├── app.html            # Main application
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline support)
├── favicon.svg         # Vector favicon
├── icon-192.png        # PWA icon (generate from generate-icons.html)
├── icon-512.png        # PWA icon (generate from generate-icons.html)
├── generate-icons.html # Icon generator utility
├── LAUNCH_STRATEGY.md  # Go-to-market strategy
├── DEPLOY.md           # This file
└── resources/          # Original prototype files
    ├── README.md
    └── schengen-collator.html
```

---

## Custom Domain Setup

### For Vercel:
1. Go to your project settings
2. Add your domain under "Domains"
3. Update DNS records as instructed

### For Netlify:
1. Go to Site settings > Domain management
2. Add custom domain
3. Update DNS records

### DNS Records Needed:
- **A Record**: `@` → IP provided by host
- **CNAME**: `www` → your-site.vercel.app (or netlify equivalent)

---

## Post-Deployment Checklist

- [ ] Icons generated and uploaded (`icon-192.png`, `icon-512.png`)
- [ ] Test PWA installation (should show "Add to Home Screen" on mobile)
- [ ] Test offline functionality (disconnect internet, app should still work)
- [ ] Verify all links work (landing page → app)
- [ ] Test country selector (all 6 countries)
- [ ] Test PDF export functionality
- [ ] Submit sitemap to Google Search Console
- [ ] Set up analytics (optional: connect to Plausible or similar)

---

## Analytics Setup (Optional)

To connect privacy-respecting analytics:

### Plausible Analytics:
1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Add this script to both `index.html` and `app.html`:

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Simple Analytics:
1. Sign up at [simpleanalytics.com](https://simpleanalytics.com)
2. Add this script:

```html
<script async defer src="https://scripts.simpleanalytics.com/latest.js"></script>
```

---

## Feedback Collection

The app stores feedback locally in `localStorage`. To collect it externally:

### Option 1: Formspree (Free)
Replace the `submitFeedback()` function to POST to Formspree.

### Option 2: Google Forms
Create a Google Form and POST data to it.

### Option 3: Airtable
Use Airtable's API to store feedback.

---

## SEO Checklist

- [x] Meta title and description
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured data (Schema.org)
- [ ] Submit to Google Search Console
- [ ] Create and submit sitemap.xml
- [ ] Add to Bing Webmaster Tools
- [ ] Create blog content for target keywords

---

## Support

For issues or questions, check the LAUNCH_STRATEGY.md for next steps and growth tactics.
