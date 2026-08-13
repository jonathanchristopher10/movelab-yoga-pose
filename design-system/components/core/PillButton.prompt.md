A solid black pill button — the only button shape in the MoveLab kiosk flow — for full-width CTAs at the bottom of a card.

```jsx
<PillButton label="Touch to Start" onClick={handleStart} />
<PillButton label="Next" variant="ghost" />
<PillButton label="Continue" disabled />
```

Variants: `primary` (solid ink, white label) is the default and used for every kiosk CTA; `ghost` (outlined) is for a secondary/back action. Always uppercase, always a full pill — never square corners, never a size variant.
