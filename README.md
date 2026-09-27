<div align="center">
  <a href="https://veridalehealth.com">
    <img src="assets/veridale-logo-288.png" alt="Veridale Health" width="220" />
  </a>

  <h1>Veridale Health</h1>

  <p><strong>Compassionate Psychiatric Care. Grounded in Evidence. Centered on You.</strong></p>

  <p>
    The website for Veridale Health, an outpatient psychiatric practice in Modesto, California.
  </p>

  <p>
    <a href="https://veridalehealth.com"><strong>veridalehealth.com</strong></a>
    ·
    <a href="https://www.zocdoc.com/booking-link/doctor/elizabeth-bristow-pmhnp-865870">Book on Zocdoc</a>
    ·
    <a href="#contact">Contact</a>
  </p>
</div>

<br/>

<img src="assets/og-image.jpg" alt="Veridale Health website preview" width="100%" />

<br/>

## About the practice

Veridale Health provides psychiatric evaluation, diagnosis and medication management. Visits are held in person and through secure telehealth. Care is led by **Elizabeth Bristow, MSN, APRN, PMHNP-BC**. She is the founder and a board-certified Psychiatric-Mental Health Nurse Practitioner licensed in California.

The practice sees children, adolescents, adults and older adults when outpatient care is clinically appropriate.

> *Helping you move toward greater stability, understanding, and well-being.*

### Services

| # | Service area |
|---|---|
| 01 | Depression and mood disorders |
| 02 | Anxiety and trauma-related conditions |
| 03 | Attention and behavioral conditions |
| 04 | Obsessive-compulsive and related disorders |
| 05 | Psychotic disorders |
| 06 | Personality disorders |
| 07 | Sleep-related concerns |
| 08 | Substance use and co-occurring mental health conditions |

> **Not an emergency service.** Veridale Health does not provide emergency psychiatric care. Anyone in crisis should call **911** or go to the nearest emergency department. This message appears on every page of the site.

## The website

A fast, accessible, static multi-page site built with hand-written HTML, CSS and JavaScript. It has no framework and no build step.

### Pages

| Page | File | What it contains |
|---|---|---|
| Home | `index.html` | Intro animation, hero, Zocdoc booking strip, "who we are", provider introduction, services index, "A safe space to begin" band, testimonials, contact call to action |
| About | `about.html` | Practice story, meet-your-provider profile and founder signature, values |
| Services | `services.html` | Full list of conditions treated, with jump links and scope notices |
| Contact | `contact.html` | Contact details, map link, request form and FAQ (`contact.html#faq`) |
| Not found | `404.html` | Custom error page that uses the site's styling |

### Features

- **Online booking:** every booking button links to the practice's Zocdoc page and opens in a new tab.
- **Light and dark themes:** the site follows the device setting and has a manual toggle with a circular reveal. The theme is applied before first paint, so the page doesn't flash the wrong theme.
- **WhatsApp chat widget** for non-urgent enquiries.
- **Contact and review forms** sent through FormSubmit. Each form includes a hidden spam trap and tells visitors not to include health information.
- **Testimonials** in a stacked-card slider with autoplay, pause, swipe and keyboard controls. On phones it becomes a carousel.
- **FAQ accordion** with arrow, Home and End key navigation.
- **Motion:** a 5-second home intro, scroll reveals, page cross-fades (View Transitions), a header that hides on scroll, and a reading-progress line. Decorative motion stops when the device has reduce-motion turned on.
- **Mobile booking bar:** a sticky "Book on Zocdoc / Call" bar on phones.
- **Accessibility:** skip link, focus trapping in the menu and modals, `aria-current` navigation, 44 px minimum touch targets, and AA-contrast colour tokens.
- **SEO:** canonical and Open Graph tags, `MedicalClinic` JSON-LD with address and booking action, `sitemap.xml`, `robots.txt` and a web app manifest.

## Design system

The full visual language is documented in [`DESIGN.md`](DESIGN.md). The tokens themselves are defined in `styles.css`, and **if the two disagree, the CSS wins**.

**Look and feel:** calm, literate and human, like a thoughtfully printed practice brochure. The page uses a warm cream canvas, regular-weight serif headlines, colour blocks and hairline rules instead of shadowed cards, and a faint grain texture.

### Colour

| Token | Hex | Role |
|---|---|---|
| Wellness green | `#2A8362` | Main accent: every filled button and active state |
| Green dark | `#1F6B4F` | Links, section labels, green text on cream |
| Navy | `#0C2E64` | Headline ink, navy bands, footer, emergency bar |
| Teal | `#055A7E` | Secondary accent, icons, credential lines |
| Turquoise | `#099292` | Soft glows and icon accents |
| Healing purple | `#483785` | Used rarely, for select cards |
| Canvas | `#FAF7F0` | Page background (light theme) |
| Ink | `#0E1D33` | Headings |
| Danger | `#B42318` | Emergency and safety messaging only |

The dark theme uses `#0A1320` as its canvas. Its overrides live under `[data-theme="dark"]`.

### Typography

- **Fraunces** (Google Fonts) for headlines, section labels and pull quotes: always weight 400 with negative tracking, and italic for emphasis.
- **Satoshi** (Fontshare) for body text, navigation, buttons and forms.
- **Mrs Saint Delafield** for the founder signature on the About page only.

### Key rules

- Buttons are **green or white only**, and one of each is paired in a group.
- Content is laid out as editorial lists with hairline rules rather than grids of identical cards.
- Section labels are italic serif in sentence case, not spaced capitals.
- Every colour comes from a token, so dark mode keeps working.
- Emergency messaging appears on every page.

## Project structure

```
CC_Veridale/
├── index.html            # Home
├── about.html            # About / meet your provider
├── services.html         # Conditions and services
├── contact.html          # Contact, request form, FAQ
├── 404.html              # Custom error page
├── styles.css            # All styles and design tokens (light + dark)
├── script.js             # Navigation, theme, motion, slider, modals, forms
├── DESIGN.md             # Design system documentation
├── .htaccess             # Apache/cPanel: HTTPS, redirects, security headers
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
└── assets/
    ├── veridale-logo*.png / .webp      # Logo in several sizes
    ├── elizabeth-bristow*.jpg / .webp  # Provider photography
    ├── hero-*.jpg / .webp              # Hero images
    ├── zocdoc-logo.png, zocdoc-mark.png
    ├── og-image.jpg                    # Social sharing image
    └── icon-192.png, icon-512.png, apple-touch-icon.png, favicon.png
```

Images are provided as WebP with JPEG/PNG fallbacks.

## Running locally

The site needs no dependencies or build step. Serve the folder with any static server:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

> Opening the HTML files directly (`file://`) mostly works, but root-relative paths (such as `/script.js` on `404.html`) and form submission need a server.

## Deployment

The site is hosted on Apache/LiteSpeed (cPanel). Upload the whole folder to the document root, including `.htaccess`.

`.htaccess` handles:

- the custom `404.html` error page
- forcing HTTPS and the canonical host (`www.` → `veridalehealth.com`)
- redirecting `/index.html` → `/`
- security headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and `X-Frame-Options`
- the correct MIME type for `site.webmanifest`
- **staging protection:** any `test.*` host automatically sends `X-Robots-Tag: noindex, nofollow`, so the same file is safe on staging and production

Before each release, update the `<lastmod>` dates in `sitemap.xml`.

## Adding a new page

1. Copy `about.html`, the simplest inner page, so you inherit the head, the theme script, the header, the emergency bar, the footer, the WhatsApp widget and the legal modal.
2. Set `aria-current="page"` on the matching navigation link.
3. Build sections from the existing classes in `styles.css`, and add `data-reveal` to blocks that should animate in.
4. Add the page to `sitemap.xml`.
5. Test it in light and dark themes, at phone width (320 px or more) and with reduced motion turned on.

## Contact

**Veridale Health**
3430 Tully Road, Ste 20, Modesto, CA 95350

- Phone: [(209) 962-2081](tel:+12099622081)
- Email: [enquiries@veridalehealth.com](mailto:enquiries@veridalehealth.com)
- Booking: [Zocdoc](https://www.zocdoc.com/booking-link/doctor/elizabeth-bristow-pmhnp-865870)
- WhatsApp: [wa.me/12099622081](https://wa.me/12099622081) (non-urgent enquiries)
- Facebook: [Veridale Health](https://www.facebook.com/profile.php?id=61594596620007)

## Disclaimer

This website provides general information only and is not medical advice. Not every condition is appropriate for outpatient or telehealth treatment. Services are provided within the scope of practice of a California-licensed Psychiatric-Mental Health Nurse Practitioner.

Some photography is used under the [Creative Commons BY 2.0](https://creativecommons.org/licenses/by/2.0/) licence, with credits on the relevant pages.

---

<div align="center">
  <sub>© Veridale Health. All rights reserved.</sub>
</div>
