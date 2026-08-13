/* @ds-bundle: {"format":4,"namespace":"MoveLabDesignSystem_668814","components":[{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"PillButton","sourcePath":"components/core/PillButton.jsx"},{"name":"PoseCard","sourcePath":"components/core/PoseCard.jsx"},{"name":"Countdown","sourcePath":"components/feedback/Countdown.jsx"},{"name":"ProgressRing","sourcePath":"components/feedback/ProgressRing.jsx"},{"name":"IconRow","sourcePath":"components/layout/IconRow.jsx"},{"name":"PhotoFrame","sourcePath":"components/media/PhotoFrame.jsx"}],"sourceHashes":{"components/core/Card.jsx":"bc7d23612295","components/core/PillButton.jsx":"367749161237","components/core/PoseCard.jsx":"93571fae0832","components/feedback/Countdown.jsx":"050589a4312a","components/feedback/ProgressRing.jsx":"7f0fd969584a","components/layout/IconRow.jsx":"ceb6a13f86af","components/media/PhotoFrame.jsx":"91b9249d3204","ui_kits/balance-challenge/Capture.jsx":"e6a6adf876ea","ui_kits/balance-challenge/ChoosePose.jsx":"72be97a17be9","ui_kits/balance-challenge/HowToPlay.jsx":"31191866f9df","ui_kits/balance-challenge/Landing.jsx":"d3c3e04f80aa","ui_kits/balance-challenge/Score.jsx":"4183d7d7fd15"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MoveLabDesignSystem_668814 = window.MoveLabDesignSystem_668814 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  padding = 'var(--card-padding)',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      boxSizing: 'border-box',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-l)',
      boxShadow: 'var(--shadow-card)',
      padding,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/PillButton.jsx
try { (() => {
function PillButton({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
  icon = null
}) {
  const isDark = variant === 'primary';
  const style = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: fullWidth ? '100%' : 'auto',
    padding: '18px 28px',
    borderRadius: 'var(--radius-pill)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 'var(--tracking-label)',
    textTransform: 'uppercase',
    border: isDark ? 'none' : '1.5px solid var(--ink)',
    background: disabled ? 'var(--border-hairline)' : isDark ? 'var(--ink)' : 'transparent',
    color: disabled ? 'var(--text-secondary)' : isDark ? 'var(--white)' : 'var(--ink)',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'transform var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard)',
    opacity: disabled ? 0.6 : 1
  };
  return /*#__PURE__*/React.createElement("button", {
    style: style,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, icon, label);
}
Object.assign(__ds_scope, { PillButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PillButton.jsx", error: String((e && e.message) || e) }); }

// components/core/PoseCard.jsx
try { (() => {
function PoseCard({
  name,
  difficulty,
  thumbnail,
  onClick,
  selected = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      height: 135,
      textAlign: 'left',
      padding: '10px 16px',
      background: 'var(--panel-grey)',
      border: selected ? '2px solid var(--ink)' : '2px solid transparent',
      borderRadius: 'var(--radius-s)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      transition: 'transform var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)'
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.98)',
    onMouseUp: e => e.currentTarget.style.transform = 'scale(1)',
    onMouseLeave: e => e.currentTarget.style.transform = 'scale(1)'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 118,
      height: 132,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: thumbnail,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      objectPosition: 'center'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      letterSpacing: 'var(--tracking-display)',
      textTransform: 'uppercase',
      color: 'var(--ink)',
      lineHeight: 1.1
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'var(--ink)',
      marginTop: 4
    }
  }, "(", difficulty, ")")));
}
Object.assign(__ds_scope, { PoseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PoseCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Countdown.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
function Countdown({
  mode = 'number',
  value,
  total = 8,
  caption = ''
}) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    setDisplay(value);
  }, [value]);
  if (mode === 'bar') {
    const pct = Math.max(0, Math.min(100, value / total * 100));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        fontFamily: 'var(--font-body)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        background: 'rgba(255,255,255,0.25)',
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        width: pct + '%',
        background: 'var(--accent)',
        transition: 'width 900ms linear'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        fontSize: 13,
        color: 'var(--text-on-dark-muted)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase'
      }
    }, caption || `${value} sec remaining`));
  }
  return /*#__PURE__*/React.createElement("div", {
    key: display,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 96,
      color: 'var(--white)',
      textAlign: 'center',
      animation: 'moveLabCountdownPop var(--duration-standard) var(--ease-bounce)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes moveLabCountdownPop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}`), display, caption && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      marginTop: 8,
      color: 'var(--text-on-dark-muted)',
      textTransform: 'none',
      letterSpacing: 0
    }
  }, caption));
}
Object.assign(__ds_scope, { Countdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Countdown.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressRing.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
function ProgressRing({
  value = 0,
  size = 200,
  label = 'SCORE',
  animate = true
}) {
  const [display, setDisplay] = useState(animate ? 0 : value);
  useEffect(() => {
    if (!animate) {
      setDisplay(value);
      return;
    }
    let raf, start;
    const duration = 900;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, animate]);
  const stroke = size * 0.07;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - display / 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--score-track)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: offset,
    style: {
      transition: animate ? 'none' : 'stroke-dashoffset 480ms var(--ease-standard)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: size * 0.24,
      fontWeight: 800,
      color: 'var(--ink)',
      lineHeight: 1
    }
  }, display, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, label)));
}
Object.assign(__ds_scope, { ProgressRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressRing.jsx", error: String((e && e.message) || e) }); }

// components/layout/IconRow.jsx
try { (() => {
function IconRow({
  icon,
  title,
  index
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      height: 78,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: icon,
    alt: "",
    style: {
      width: 78,
      height: 78,
      objectFit: 'contain',
      transform: 'scale(3.4)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 20,
      fontWeight: 400,
      color: 'var(--ink)',
      lineHeight: 1.35
    }
  }, typeof index === 'number' && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      marginRight: 6
    }
  }, index, "."), title));
}
Object.assign(__ds_scope, { IconRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/IconRow.jsx", error: String((e && e.message) || e) }); }

// components/media/PhotoFrame.jsx
try { (() => {
function PhotoFrame({
  photo,
  score,
  logo = '../../assets/movelab-wordmark.png',
  poseName
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '3/4',
      borderRadius: 4,
      overflow: 'hidden',
      background: 'var(--ink)'
    }
  }, photo && /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'scaleX(-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 18,
      right: 18,
      bottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "MoveLab",
    style: {
      height: 22,
      filter: 'invert(1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 62,
      height: 62,
      borderRadius: '50%',
      border: '3px solid var(--accent-soft)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 22,
      fontWeight: 700,
      color: '#fff'
    }
  }, score)));
}
Object.assign(__ds_scope, { PhotoFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/PhotoFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/balance-challenge/Capture.jsx
try { (() => {
function Capture({
  pose,
  phase,
  seconds,
  Countdown
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: pose.thumb,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 20%',
      transform: 'scaleX(-1)',
      opacity: 0.7,
      filter: 'grayscale(0.2)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg,rgba(17,17,17,0.75) 0%,rgba(17,17,17,0.25) 30%,rgba(17,17,17,0.25) 70%,rgba(17,17,17,0.85) 100%)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: pose.outline,
    alt: "",
    style: {
      position: 'absolute',
      inset: '12% 8% 12%',
      width: '84%',
      height: '76%',
      objectFit: 'contain',
      opacity: 0.9,
      margin: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '24px 24px 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      letterSpacing: 'var(--tracking-display)',
      textTransform: 'uppercase',
      color: '#fff'
    }
  }, pose.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--body-m)',
      color: 'var(--text-on-dark-muted)',
      marginTop: 2
    }
  }, "Hold steady")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 24
    }
  }, phase === 'prep' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Countdown, {
    mode: "number",
    value: seconds,
    caption: "Get ready"
  })), phase === 'hold' && /*#__PURE__*/React.createElement(Countdown, {
    mode: "bar",
    value: seconds,
    total: 8
  })));
}
Object.assign(window, {
  Capture
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/balance-challenge/Capture.jsx", error: String((e && e.message) || e) }); }

// ui_kits/balance-challenge/ChoosePose.jsx
try { (() => {
const POSES = [{
  id: 'tree',
  name: 'Tree Pose',
  difficulty: 'Easy',
  thumb: '../../assets/thumb-tree.png',
  card: '../../assets/pose-tree.png',
  outline: '../../assets/outline-tree.png'
}, {
  id: 'warrior',
  name: 'Warrior II',
  difficulty: 'Medium',
  thumb: '../../assets/thumb-warrior.png',
  card: '../../assets/pose-warrior.png',
  outline: '../../assets/outline-warrior.png'
}, {
  id: 'chair',
  name: 'Chair Pose',
  difficulty: 'Hard',
  thumb: '../../assets/thumb-chair.png',
  card: '../../assets/pose-chair.png',
  outline: '../../assets/outline-chair.png'
}];
function ChoosePose({
  onNext,
  PoseCard,
  PillButton
}) {
  const [sel, setSel] = React.useState(POSES[0]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '46px 30px 36px',
      background: 'var(--bg-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 42,
      lineHeight: 1.05,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      color: 'var(--ink)',
      textAlign: 'center'
    }
  }, "Choose", /*#__PURE__*/React.createElement("br", null), "Your Pose"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 18
    }
  }, POSES.map(p => /*#__PURE__*/React.createElement(PoseCard, {
    key: p.id,
    name: p.name,
    difficulty: p.difficulty,
    thumbnail: p.card,
    selected: sel.id === p.id,
    onClick: () => setSel(p)
  }))), /*#__PURE__*/React.createElement(PillButton, {
    label: "Next",
    onClick: () => onNext(sel)
  }));
}
Object.assign(window, {
  ChoosePose,
  POSES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/balance-challenge/ChoosePose.jsx", error: String((e && e.message) || e) }); }

// ui_kits/balance-challenge/HowToPlay.jsx
try { (() => {
function HowToPlay({
  onNext,
  IconRow,
  PillButton
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '52px 34px 36px',
      background: 'var(--bg-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 44,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      color: 'var(--ink)',
      textAlign: 'center'
    }
  }, "How to Play"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 34
    }
  }, /*#__PURE__*/React.createElement(IconRow, {
    icon: "../../assets/icon-pose.png",
    title: "Choose your pose"
  }), /*#__PURE__*/React.createElement(IconRow, {
    icon: "../../assets/icon-time.png",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Hold the pose", /*#__PURE__*/React.createElement("br", null), "for 8 seconds")
  }), /*#__PURE__*/React.createElement(IconRow, {
    icon: "../../assets/icon-trophy.png",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Get your score", /*#__PURE__*/React.createElement("br", null), "and get free merchandise")
  })), /*#__PURE__*/React.createElement(PillButton, {
    label: "Next",
    onClick: onNext
  }));
}
Object.assign(window, {
  HowToPlay
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/balance-challenge/HowToPlay.jsx", error: String((e && e.message) || e) }); }

// ui_kits/balance-challenge/Landing.jsx
try { (() => {
function Landing({
  onStart
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/background-landing.png",
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg,rgba(244,242,238,0.15) 0%,rgba(244,242,238,0.75) 78%,rgba(244,242,238,0.95) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '32px 28px 0',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/movelab-wordmark.png",
    alt: "MoveLab",
    style: {
      height: 32,
      width: 146
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 'auto',
      padding: '0 28px 36px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 46,
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-display)',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, "Balance", /*#__PURE__*/React.createElement("br", null), "Challenge"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--body-l)',
      color: 'var(--text-secondary)',
      marginTop: 8,
      marginBottom: 28
    }
  }, "Find Your Balance."), /*#__PURE__*/React.createElement("button", {
    onClick: onStart,
    style: {
      width: '100%',
      padding: '18px 28px',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      background: 'var(--ink)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      cursor: 'pointer'
    }
  }, "Touch to Start")));
}
Object.assign(window, {
  Landing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/balance-challenge/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/balance-challenge/Score.jsx
try { (() => {
function Score({
  pose,
  score,
  PhotoFrame
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 30px 32px',
      background: 'var(--bg-warm)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 42,
      lineHeight: 1.05,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, "Great", /*#__PURE__*/React.createElement("br", null), "Balance!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 19,
      color: 'var(--ink)',
      marginTop: 8,
      marginBottom: 22
    }
  }, "Amazing! You did it."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    photo: pose.thumb,
    score: score,
    logo: "../../assets/movelab-wordmark.png"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      marginTop: 'auto',
      paddingTop: 24,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink)',
      textAlign: 'left',
      lineHeight: 1.4
    }
  }, "Please scan the QR code to download the photo."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      background: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '0.04em',
      flexShrink: 0
    }
  }, "QR")));
}
Object.assign(window, {
  Score
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/balance-challenge/Score.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Card = __ds_scope.Card;

__ds_ns.PillButton = __ds_scope.PillButton;

__ds_ns.PoseCard = __ds_scope.PoseCard;

__ds_ns.Countdown = __ds_scope.Countdown;

__ds_ns.ProgressRing = __ds_scope.ProgressRing;

__ds_ns.IconRow = __ds_scope.IconRow;

__ds_ns.PhotoFrame = __ds_scope.PhotoFrame;

})();
