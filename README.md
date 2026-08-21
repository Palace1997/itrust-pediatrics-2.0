# itrust Pediatrics — Website

A warm, family-centered marketing site for **itrust Pediatrics**, a child &
adolescent **psychiatric** practice (psychiatric evaluation and medication
management) serving children and teens **ages 5–17** — anxiety, ADHD,
depression, mood, and behavioral concerns.

## Tech
- Static **HTML / CSS / JS** — no framework, no build step
- Fonts: **GT Super Display** (headlines, self-hosted) + **Plus Jakarta Sans** (body)
- Palette: cream / green / coral / sage

## Pages
| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About Us |
| `services.html` | Services |
| `team.html` | Our Team |
| `contact.html` | Contact |

Shared styles live in `styles.css`; shared behavior (nav, accordions, team
filter, clinic status, the scroll-aware guide assistant, etc.) in `script.js`.
Images, logos, and fonts are in `assets/`.

## Run locally
```bash
python3 -m http.server 4400
```
Then open <http://localhost:4400/index.html>.

## Note
Some content is still **placeholder** pending launch — provider names, clinic
address, phone/email, hours, and self-pay rates. Replace these with real values
before going live.
