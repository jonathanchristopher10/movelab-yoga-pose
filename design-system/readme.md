# MoveLab Design System

MoveLab is a fitness/wellness brand. The only product brief available is a single build: **Balance Challenge**, a self-service yoga-pose booth for events and expos — a customer holds a pose in front of a camera for 8 seconds and gets a fun balance score plus a branded photo. It's designed to run unattended, all in-browser, with zero cost per use.

There is no production codebase yet — the source repo contains only a design brief and brand assets. This system is built directly from that brief plus the reference mock it points to, so it can change as the real product takes shape.

**Sources**
- Repo: [jonathanchristopher10/movelab-yoga-pose](https://github.com/jonathanchristopher10/movelab-yoga-pose) — brief in `README.md`, assets in `assets/`, an early flow mock in `reference/reference_flow.jpeg`. Explore it directly for more detail than is captured here (it also has a full technical spec — state machine, pose-tracking approach, scoring formula — this system only covers the visual/product design side).

No Figma or other design file was provided.

**A UX note:** the brief's reference mock includes a final "scan this QR code" reward screen, but the brief's own written spec says explicitly there is *no* QR/reward screen — the flow ends on the Score screen. This system follows the written spec (Landing → How to Play → Choose Pose → Capture → Score, auto-reset), and drops the QR screen.

## Index

- `styles.css` — root stylesheet, imports everything under `tokens/`
- `tokens/` — colors, typography, spacing, effects (radius/shadow/motion), fonts
- `assets/` — logo, landing photo, pose icons, pose thumbnails, pose outlines (all from the source repo)
- `guidelines/` — foundation specimen cards (see the Design System tab)
- `components/`
  - `core/` — PillButton, Card, PoseCard
  - `feedback/` — ProgressRing, Countdown
  - `media/` — PhotoFrame
  - `layout/` — IconRow
- `ui_kits/balance-challenge/` — the full interactive booth flow (`index.html`), five screens (Landing, HowToPlay, ChoosePose, Capture, Score)

**Intentional additions** (not named as components in the source, added because the same composition repeats): `PoseCard` (thumbnail + name + difficulty + chevron, used 3× on the Choose Pose screen), `IconRow` (icon-in-circle + label, used 3× on the How to Play screen).

## Content fundamentals

Copy in the brief is sparse, functional, and upbeat — built for a 30-second unattended interaction, not for reading.

- **Voice:** direct instructions and short affirmations. No "you" vs "I" framing needed — there's no dialogue, just labels and encouragement. "Get ready." "Hold steady." "Amazing! You did it."
- **Casing:** headings are ALL CAPS (BALANCE CHALLENGE, HOW TO PLAY, GREAT BALANCE!). Body copy and button labels underneath are sentence case or a short phrase, but button labels are also uppercase (TOUCH TO START, NEXT). This caps/lowercase split is a deliberate signal: caps = the moment's headline, sentence case = supporting detail.
- **Length:** every line is short enough to read at a glance while walking up to a kiosk. No paragraph ever appears.
- **Numbers do the emotional work:** the score (a big %) and the countdown are themselves content — the design leans on them instead of explaining.
- **Emoji:** none. The trophy/pose/time concepts are conveyed through the hand-drawn icon set, not emoji.
- **Punctuation:** exclamation points are used sparingly but deliberately at emotional peaks ("Great Balance!", "Amazing! You did it.") — never in instructional copy ("Hold steady", "Select a pose to begin").

## Visual foundations

- **Palette:** warm off-white background (`#F4F2EE`), near-black ink (`#111111`) for text and buttons, and a single sage-green accent (`#A9B99A` → `#8FA37E`) reserved for the score ring and selection states. Two colors, one accent — nothing else competes with them. A small difficulty-tag palette (green/amber/red for Easy/Medium/Hard) is the only other color introduced, and it's confined to one spot.
- **Type:** two families only. **Anton** (condensed, bold, uppercase) for every heading and score number — it's the only place personality shows up. **Inter** for everything else: body copy, labels, button text. Headings always carry wide tracking and full uppercase; body text never does.
- **Backgrounds:** flat warm off-white for almost every screen. The one exception is the Landing screen, which is full-bleed photography (bright, sunlit studio, warm neutral tones) fading into the flat background via a soft gradient — the only full-bleed image in the flow. No patterns, textures, or gradients elsewhere except the sage progress-ring fill and the dark scrim behind the camera view.
- **Photography:** a single visual mood — bright, minimal studio light, one model in black activewear, calm and centered. No busy backgrounds, no outdoor/lifestyle shots, no grain or filter. Cutout pose thumbnails are the same photographic style, isolated on white.
- **Motion:** gentle and restrained. Screen transitions fade. The score ring counts up and fills on entry. Countdown numbers scale in with a slight bounce (overshoot then settle) rather than a hard cut — the one place motion gets playful, because it's the one moment kids/adults alike will watch closely.
- **Hover / press states:** buttons scale down slightly (~0.97×) on press — no color shift, no shadow change. This is a touch-kiosk interface, so "hover" states are largely irrelevant; press feedback is what matters and it's kept subtle.
- **Borders & shadows:** a single hairline border color (`#E6E3DD`) separates white cards from the warm background. Shadows are soft and low-contrast (`0 8px 24px rgba(0,0,0,.06)`) — never a hard drop shadow. No inner shadows, no colored shadows except the sage glow token reserved for the ring.
- **Corner radii:** cards and panels round generously (20–32px); buttons are always a full pill; small chips/thumbnails use a tighter 12px radius. Nothing in this system has a square or barely-rounded corner.
- **Layout rules:** the entire experience lives inside one centered, portrait "phone card" panel so it reads correctly whether the hardware ends up being a tablet, a vertical monitor, or a laptop webcam setup. Content inside that card is generously padded and vertically centered — never edge-to-edge except the Landing photo and the Capture camera view.
- **Transparency & blur:** used only for legibility overlays — the gradient scrim behind Landing headline text, the dark scrim behind the live camera view, and the semi-transparent pose-outline guide during Capture. Never decorative.
- **Difficulty color:** Easy/Medium/Hard tags borrow the sage green, an amber, and a warm red respectively — the only place a "traffic light" semantic system appears.

## Iconography

- **Source:** a small custom set of hand-drawn, single-weight line icons, each centered in a thin circle outline — see `assets/icon-pose.png`, `icon-time.png`, `icon-trophy.png`. These came directly from the source repo; nothing was substituted.
- **Style:** loose, sketchy line quality (not a rigid icon-font grid) — consistent with the brand feeling human and approachable rather than corporate.
- **Usage:** icons appear only on the How to Play screen, one per rule, at a consistent size inside `IconRow`. They are not used as decoration elsewhere.
- **Pose outlines:** a second, separate icon-like asset type — faint cream-on-transparent full-body outlines (`outline-tree.png`, `outline-warrior.png`, `outline-chair.png`) used as a semi-transparent positioning guide over the live camera view during Capture. These are illustrative guides, not UI icons, but they're the same "line art on transparency" visual language.
- **Emoji / unicode:** not used anywhere in the brief or mock. The one exception in this build is a plain unicode `›` chevron on `PoseCard` — flagged here as a substitution; swap in a proper icon-set glyph if MoveLab has one.
- **No icon font or SVG sprite exists in the source** — icons are flat PNGs. This system copies them as-is rather than converting or redrawing them.

## Fonts

**Anton** and **Inter** are exactly what the brief names (README §4: "Anton / Archivo Black" for display, "Inter" for body) — not substitutions. Neither is bundled as a font file in the source repo, so this system loads both as real woff2 binaries via the Fontsource CDN mirror of the same open-license Google Fonts files (`tokens/fonts.css`). If MoveLab licenses different weights or an alternate condensed display face later, swap the `@font-face` sources there.

## Caveats & ask

- **No logo files beyond the one wordmark PNG** — no icon-only mark, no favicon, no reversed/color variants. If MoveLab has those, send them over and I'll add a proper Brand section.
- **No real pose-detection or camera code exists yet** — the Capture screen here is a visual simulation (a still photo standing in for live video, a client-side timer standing in for the real 8-second hold + stability score). The actual scoring formula and camera plumbing are specified in the repo's README but are an engineering build, not a design-system concern.
- **I dropped the QR/reward screen** that appears in the reference mock, per the brief's own written spec. Flag if that was intentional on the mock's part and you want it back — it'd need a reward-claim screen designed from scratch since it isn't in this brief.
- **Difficulty tag colors (amber for Medium, red for Hard) are invented** — the brief doesn't specify them. If MoveLab has house semantic colors, swap them in.

Tell me what's off and I'll iterate — more real assets (extra poses, a second product surface, real photography) will make this sharper fast.
