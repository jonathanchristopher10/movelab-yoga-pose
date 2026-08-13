The base white panel — 24px radius, hairline border, soft shadow, generous padding. Wraps most content that isn't full-bleed.

```jsx
<Card><p>Any content</p></Card>
<Card padding="16px" style={{ background: 'var(--surface-dark)' }}>...</Card>
```

Everything sits on this same rounded panel — the "phone card" that holds the whole kiosk flow is just a large Card.
