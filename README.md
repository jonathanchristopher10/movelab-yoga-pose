# MoveLab — Balance Challenge (Booth App)

A self-service **event-activation booth** for the MoveLab brand. A customer walks up to a screen with a camera, picks a yoga pose, holds it for 8 seconds, and gets a fun "balance score" — plus a branded photo of their attempt they can snap with their own phone. It runs unattended as a **kiosk** and auto-resets for the next person.

This README is the design + build brief. Feed it to claude design to generate the frontend.

---

## 1. Goal & context

- **Audience:** event/expo walk-ups, zero instructions needed.
- **Session length:** ~30–40 seconds end to end.
- **Environment:** unattended kiosk. Must be idiot-proof, always look good, never dead-end, and reset itself.
- **Cost constraint:** no cloud, no server, no per-use cost. All processing runs **in the browser, offline**.

---

## 2. Tech stack

- **React + Vite + TypeScript**
- **Tailwind CSS** for styling
- **@mediapipe/tasks-vision** (`PoseLandmarker`) for in-browser body tracking — WASM + model bundled locally so it works with no internet
- No router, no backend, no database. Single-page state machine.

---

## 3. Screen flow

State machine (no URLs):

```
landing → howToPlay → choosePose → capture → score → (auto-reset) → landing
```

The whole app lives inside a centered, full-height **rounded "phone card"** panel (portrait), so it looks right on a tablet, a vertical monitor, or a laptop.

### Page 1 — Landing
- Full-bleed background: `BACKGROUND_PAGE1.png` (yoga figure in a bright studio).
- MoveLab logo top-left.
- Big display heading: **BALANCE CHALLENGE**, subhead **Find Your Balance.**
- Bottom: solid black pill button **TOUCH TO START** → `howToPlay`.

### Page 2 — How to Play
- Heading: **HOW TO PLAY**.
- Three stacked rules, each with an icon:
  1. `POSE ICON` — **Choose your pose**
  2. `TIME ICON` — **Hold the pose for 8 seconds**
  3. `TROPHY ICON` — **Get your score and win rewards**
- Bottom: black pill **NEXT** → `choosePose`.

### Page 3 — Choose Your Pose
- Heading: **CHOOSE YOUR POSE**, small subhead "Select a pose to begin".
- Three tappable cards (thumbnail + name + difficulty + chevron):
  - **Tree Pose** — *Easy* (`ICON/TREEPOSE.png`)
  - **Warrior II** — *Medium* (`ICON/WARRIOR 2 POSE.png`)
  - **Chair Pose** — *Hard* (`ICON/CHAIRPOSE.png`)
- Tapping a card selects that pose → `capture`.

### Page 4 — Capture (camera)
- Live camera fills the card, portrait, **mirrored** (selfie feel).
- Semi-transparent **pose outline overlay** guides positioning:
  - Tree → `OUTLINE/TREEPOSE OUTLINE.png`
  - Warrior → `OUTLINE/WARRIOR OUTLINE.png`
  - Chair → `OUTLINE/CHAIR OUTLINE.png`
- Header shows pose name (e.g. **TREE POSE**) + "Hold steady".
- **Phase 1 — Prep (3s):** big centered countdown "3… 2… 1", copy "Get ready". No scoring.
- **Phase 2 — Hold (8s):** countdown bar / "8 sec remaining…". Body tracking runs; app measures stability and grabs a still photo at the steadiest moment.
- On completion → `score`. (If no person is detected most of the time → friendly retry.)
- First entry requests camera permission; denied → clear, friendly message.

### Page 5 — Score
- Heading: **GREAT BALANCE!**
- Animated sage-green **progress ring** with the big **% score** in the center + "SCORE".
- Encouraging copy ("Amazing! You did it.").
- **The captured photo** in a branded frame (MoveLab logo + pose name + score) so the customer can photograph it with their phone.
- MoveLab logo at the bottom.
- **Auto-returns to Landing** after ~6s (and any screen resets to Landing after ~45s idle).

> Note: there is **no** QR/reward screen. The flow ends on the Score page.

---

## 4. Design system

Derived from the reference flow — clean, editorial, calm, premium.

| Token | Value | Use |
|---|---|---|
| Background | `#F4F2EE` (warm off-white) | screen / card background |
| Ink | `#111111` | text, buttons |
| Sage | `#A9B99A` → `#8FA37E` | accent, progress ring |
| Card border | `#E6E3DD` | hairline borders |
| Card | `#FFFFFF` | pose cards, panels |

- **Display type:** bold condensed sans (e.g. **Anton** / **Archivo Black**), UPPERCASE, wide letter-spacing — for page headings.
- **Body type:** clean sans (e.g. **Inter**) for labels and copy.
- **Cards/panels:** ~24px radius, subtle soft shadow, generous whitespace.
- **Buttons:** solid black **pill**, white uppercase label, full-width at the bottom of the card.
- **Motion:** gentle fades between screens; the score ring animates from 0 → score; countdown numbers scale-in.

---

## 5. Asset map

Assets live in `assets/`. Note several filenames/folders contain **spaces** — copy them into `public/assets/` with kebab-case names before importing.

| Purpose | Source file | Suggested public name |
|---|---|---|
| Landing background | `assets/BACKGROUND_PAGE1.png` | `background-landing.png` |
| Logo | `assets/MOVELABLOGO.png` | `movelab-logo.png` |
| Rule icon — pose | `assets/ICON/POSE ICON.png` | `icon-pose.png` |
| Rule icon — time | `assets/ICON/TIME ICON.png` | `icon-time.png` |
| Rule icon — trophy | `assets/ICON/TROPHY ICON.png` | `icon-trophy.png` |
| Pose thumb — tree | `assets/ICON/TREEPOSE.png` | `thumb-tree.png` |
| Pose thumb — warrior | `assets/ICON/WARRIOR 2 POSE.png` | `thumb-warrior.png` |
| Pose thumb — chair | `assets/ICON/CHAIRPOSE.png` | `thumb-chair.png` |
| Outline — tree | `assets/OUTLINE/TREEPOSE OUTLINE.png` | `outline-tree.png` |
| Outline — warrior | `assets/OUTLINE/WARRIOR OUTLINE.png` | `outline-warrior.png` |
| Outline — chair | `assets/OUTLINE/CHAIR OUTLINE.png` | `outline-chair.png` |
| Pose hero (optional) | `assets/POSE/*.png` | `hero-*.png` |

---

## 6. Pose detection & scoring

**Tracking:** `PoseLandmarker` reads 33 body landmarks per frame from the camera during the 8s hold.

**Score = stability only** (how still they held):
- Each frame, measure movement of key landmarks (shoulders, hips, knees, ankles) vs. the previous frame, **normalized by torso length** so distance from the camera doesn't matter.
- Average that movement over the hold window → map to a feel-good score: `score = clamp(99 − k · movement, 85, 99)`. Very still → ~99; wobbly → ~85.
- Keep the mapping in one small pure, unit-tested function (`lib/score.ts`) so `k` is easy to calibrate on the real device.
- No person detected for most of the window → friendly retry instead of a low score.

**Photo capture:** during the hold, grab the frame at the steadiest moment (lowest instantaneous movement) to an offscreen canvas, composite the MoveLab brand frame + pose name + score, and hold it as a data URL for Page 5. **Everything stays client-side — no upload, no storage, cleared on reset.**

---

## 7. Kiosk behavior

- Central `useReducer` state machine drives screen transitions.
- Auto-reset: Score screen → Landing after ~6s; global inactivity timer (~45s) → Landing from any screen.
- Fullscreen-friendly: hide cursor, disable text selection, block pinch-zoom / long-press menus.
- Responsive/portrait so hardware can be decided later (tablet, laptop + webcam, or vertical monitor).

---

## 8. Suggested project structure

```
src/
  App.tsx                 # state machine + screen switch
  hooks/usePoseTracker.ts # MediaPipe load, camera, landmark stream, stability metric, frame grab
  lib/score.ts            # pure stability → score mapping (unit-tested)
  lib/poses.ts            # pose config: id, label, difficulty, thumb/outline paths
  screens/{Landing,HowToPlay,ChoosePose,Capture,Score}.tsx
  components/{PillButton,ProgressRing,Countdown,Card,PhotoFrame}.tsx
public/assets/…           # copied from assets/ with kebab-case names
```

---

## 9. Getting started (once implementing)

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install @mediapipe/tasks-vision
# add Tailwind per its Vite guide
npm run dev
```

Bundle the MediaPipe WASM + pose model into `public/` so the booth runs offline.

---

## 10. Acceptance checklist

- [ ] Full flow works on a laptop + webcam: Landing → How to Play → Choose (each pose) → 3s prep + 8s hold with outline overlay → Score ring animates.
- [ ] Holding still vs. wobbling produces a visibly different score, always within 85–99.
- [ ] A clear, correctly-oriented branded photo shows on Page 5 and is cleared on reset.
- [ ] Camera covered / person out of frame → friendly retry, not a broken score.
- [ ] Idle on any screen → auto-resets to Landing; Score screen auto-returns.
- [ ] Camera-permission-denied shows a clear message.
- [ ] `lib/score.ts` unit tests pass (still → high, wobbly → low, clamped).
