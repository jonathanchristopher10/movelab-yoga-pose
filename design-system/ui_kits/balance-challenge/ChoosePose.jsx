const POSES = [
  { id: 'tree', name: 'Tree Pose', difficulty: 'Easy', thumb: '../../assets/thumb-tree.png', card: '../../assets/pose-tree.png', outline: '../../assets/outline-tree.png' },
  { id: 'warrior', name: 'Warrior II', difficulty: 'Medium', thumb: '../../assets/thumb-warrior.png', card: '../../assets/pose-warrior.png', outline: '../../assets/outline-warrior.png' },
  { id: 'chair', name: 'Chair Pose', difficulty: 'Hard', thumb: '../../assets/thumb-chair.png', card: '../../assets/pose-chair.png', outline: '../../assets/outline-chair.png' },
];
function ChoosePose({ onNext, PoseCard, PillButton }) {
  const [sel, setSel] = React.useState(POSES[0]);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '46px 30px 36px', background: 'var(--bg-warm)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 1.05, letterSpacing: '0.01em', textTransform: 'uppercase', color: 'var(--ink)', textAlign: 'center' }}>Choose<br />Your Pose</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        {POSES.map(p => (
          <PoseCard key={p.id} name={p.name} difficulty={p.difficulty} thumbnail={p.card} selected={sel.id === p.id} onClick={() => setSel(p)} />
        ))}
      </div>
      <PillButton label="Next" onClick={() => onNext(sel)} />
    </div>
  );
}
Object.assign(window, { ChoosePose, POSES });
