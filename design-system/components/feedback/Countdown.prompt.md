Drives the two timed moments in the Capture flow.

```jsx
<Countdown mode="number" value={3} caption="Get ready" />
<Countdown mode="bar" value={5} total={8} />
```

`number` mode pops in with a bounce on every value change (key the parent's state to value so React remounts it). `bar` mode is a thin sage progress bar over dark camera video, with a small caption below.
