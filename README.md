# The Deal Girls — website

Plain HTML/CSS/JS. No build step. Hosted on Vercel from GitHub.

## What lives where

| File | What it does |
|---|---|
| `index.html` | All page text and sections |
| `styles.css` | Colours, fonts, layout |
| `config.js` | **Links you'll change often**: Apply form, newsletter, contact email, socials, testimonials |
| `main.js` | Interactions (menu, city tabs, partner chips, photo/logo loading). Don't need to touch |
| `assets/img/` | Photos. See the README in that folder for file names |
| `assets/logos/` | Logos. See the README in that folder for file names |

## Everyday changes

- **New link (Apply form, newsletter, email):** edit `config.js` on GitHub → Commit. Live in ~1 minute.
- **New photo or logo:** upload into `assets/img/` or `assets/logos/` with the exact file name from the folder README → Commit.
- **Text change:** edit `index.html` on GitHub (pencil icon), find the sentence, change it → Commit.

## Search engines (SEO)

- `robots.txt` lets every search engine crawl the site and points them to `sitemap.xml`.
- `sitemap.xml` lists every page. **When you add a new page, add its full URL here too**, otherwise Google may not find it.
- Each page has a `<link rel="canonical">` tag in its `<head>` with its own full URL. Copy that line into any new page and change the URL.
- The link preview image is `assets/img/og-image.jpg` (1200 × 630). Until that file is uploaded, links shared on LinkedIn or WhatsApp show no image.
- `index.html` has a `<script type="application/ld+json">` block in its `<head>`. It tells Google the site name is "The Deal Girls" and links the Instagram and LinkedIn accounts. If you change the Instagram or LinkedIn URL in `config.js`, change it in this block too.
- Keep the homepage `<meta name="description">` in line with the hero headline and under about 160 characters. When the two drift apart, Google tends to write its own snippet instead.
