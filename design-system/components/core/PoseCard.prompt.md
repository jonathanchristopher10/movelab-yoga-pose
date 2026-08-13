A tappable list row for the "Choose Your Pose" screen: cutout thumbnail, pose name, a difficulty pill, and a trailing chevron.

```jsx
<PoseCard name="Tree Pose" difficulty="Easy" thumbnail="assets/thumb-tree.png" onClick={selectTree} />
```

**Intentional addition** — not named explicitly in the source README's component list, but the "Choose Your Pose" screen composition (thumbnail + name + difficulty + chevron) recurs three times and deserves its own primitive rather than being hand-built inline each time.
