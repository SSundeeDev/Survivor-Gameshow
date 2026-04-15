import { useState, useMemo, useEffect, useRef } from 'react';

// ============================================================
// GAME DATA
// ============================================================
const DEFAULT_PROPERTY = {
  name: 'MORGAN BAY (PILOT)',
  units: 268,
  yearBuilt: 1983,
  submarket: 'Champions East',
  inPlaceRent: '$963',
  occupancy: '94%',
  budget: 1600000,
};

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'interior', label: 'INTERIOR' },
  { id: 'security', label: 'SECURITY' },
  { id: 'exterior', label: 'EXTERIOR' },
  { id: 'amenity', label: 'AMENITY' },
  { id: 'hvac', label: 'HVAC' },
  { id: 'infra', label: 'INFRA' },
];

const DEFAULT_ITEMS = [
  // INTERIOR
  { id: 'lvp',        name: 'LVP flooring (full unit)',        cost: 482400, unit: '$1,800/u', cat: 'interior' },
  { id: 'cab-refac',  name: 'Cabinet refacing + pulls',        cost: 160800, unit: '$600/u',   cat: 'interior' },
  { id: 'cab-full',   name: 'Full cabinet replacement',        cost: 589600, unit: '$2,200/u', cat: 'interior' },
  { id: 'quartz',     name: 'Quartz countertops',              cost: 321600, unit: '$1,200/u', cat: 'interior' },
  { id: 'resurface',  name: 'Resurfaced countertops',          cost: 67000,  unit: '$250/u',   cat: 'interior' },
  { id: 'stainless',  name: 'Stainless appliance package',     cost: 375200, unit: '$1,400/u', cat: 'interior' },
  { id: 'backsplash', name: 'Tile backsplash',                 cost: 107200, unit: '$400/u',   cat: 'interior' },
  { id: 'paint',      name: 'Two-tone accent paint',           cost: 93800,  unit: '$350/u',   cat: 'interior' },
  { id: 'hardware',   name: 'Brushed nickel hardware',         cost: 67000,  unit: '$250/u',   cat: 'interior' },
  { id: 'fixtures',   name: 'Light fixtures + ceiling fans',   cost: 128640, unit: '$480/u',   cat: 'interior' },
  { id: 'wd',         name: 'W/D connections',                 cost: 80000,  unit: '$800/u',   cat: 'interior' },
  // SECURITY
  { id: 'gates',      name: 'Controlled access gates',         cost: 85000,  unit: 'flat',     cat: 'security' },
  { id: 'cameras',    name: 'Camera system 24/7',              cost: 45000,  unit: 'flat',     cat: 'security' },
  { id: 'lighting',   name: 'LED site lighting',               cost: 30000,  unit: 'flat',     cat: 'security' },
  { id: 'officer',    name: 'Courtesy officer (annual)',       cost: 60000,  unit: '/yr',      cat: 'security' },
  { id: 'smartlock',  name: 'Smart locks all units',           cost: 93800,  unit: '$350/u',   cat: 'security' },
  // EXTERIOR
  { id: 'ext-paint',  name: 'Exterior paint + rebrand',        cost: 150000, unit: 'flat',     cat: 'exterior' },
  { id: 'signage',    name: 'New monument signage',            cost: 15000,  unit: 'flat',     cat: 'exterior' },
  { id: 'landscape',  name: 'Landscaping refresh',             cost: 40000,  unit: 'flat',     cat: 'exterior' },
  { id: 'playground', name: 'Playground replacement',          cost: 50000,  unit: 'flat',     cat: 'exterior' },
  { id: 'roof',       name: 'Roof replacement (storm-rated)',  cost: 400000, unit: 'flat',     cat: 'exterior' },
  { id: 'railing',    name: 'Railing + balcony repair',        cost: 40000,  unit: 'flat',     cat: 'exterior' },
  // AMENITY
  { id: 'parking',    name: 'Covered parking (100 spots)',     cost: 300000, unit: 'flat',     cat: 'amenity' },
  { id: 'pool',       name: 'Pool resurface + decking',        cost: 45000,  unit: 'flat',     cat: 'amenity' },
  { id: 'cabana',     name: 'Pool cabanas + shade',            cost: 35000,  unit: 'flat',     cat: 'amenity' },
  { id: 'gym',        name: 'Fitness center refresh',          cost: 35000,  unit: 'flat',     cat: 'amenity' },
  { id: 'dogpark',    name: 'Dog park + agility',              cost: 25000,  unit: 'flat',     cat: 'amenity' },
  { id: 'lockers',    name: 'Package lockers',                 cost: 40000,  unit: 'flat',     cat: 'amenity' },
  { id: 'clubhouse',  name: 'Clubhouse refresh',               cost: 55000,  unit: 'flat',     cat: 'amenity' },
  // INFRA
  { id: 'wifi',       name: 'Bulk Wi-Fi property-wide',        cost: 50000,  unit: 'flat',     cat: 'infra' },
  { id: 'plumbing',   name: 'Boiler/plumbing repairs',         cost: 95000,  unit: 'flat',     cat: 'infra' },
  { id: 'ev',         name: 'EV charging (4 stalls)',          cost: 28000,  unit: 'flat',     cat: 'infra' },
  // HVAC
  { id: 'hvac-turn',  name: 'Proactive HVAC on turnover',      cost: 140000, unit: '~40 units', cat: 'hvac' },
  { id: 'hvac-full',  name: 'Full HVAC replacement program',   cost: 750000, unit: 'flat',      cat: 'hvac' },
  { id: 'hvac-pm',    name: 'HVAC preventive-maintenance',     cost: 18000,  unit: '/yr',       cat: 'hvac' },
  { id: 'hvac-cage',  name: 'Condenser cage / anti-theft',     cost: 35000,  unit: 'flat',      cat: 'hvac' },
  { id: 'water-htr',  name: 'Water heater replacement',        cost: 45000,  unit: '~70 units', cat: 'hvac' },
];

// Theme colors
const NAVY = '#0F1E3C';
const NAVY_DARK = '#0A1529';
const NAVY_DEEP = '#050B18';
const LIGHT_BLUE = '#A8C5E8';
const MID_BLUE = '#5A7BA8';
const GOLD = '#C9B683';
const RED = '#C44D4D';
const GREEN = '#3DA97A';
const OFF_WHITE = '#F2F2F2';

// Text-size presets — a multiplier applied to all font sizes via CSS variable
const TEXT_SCALES = [
  { id: 's',  label: 'S',   mult: 0.85 },
  { id: 'm',  label: 'M',   mult: 1.00 },
  { id: 'l',  label: 'L',   mult: 1.18 },
  { id: 'xl', label: 'XL',  mult: 1.40 },
];

// ============================================================
// SOUND ENGINE — Web Audio API synthesized SFX
// ============================================================
// Lazy-create a single AudioContext on first sound (browsers require a user gesture)
let _audioCtx = null;
function getCtx() {
  if (_audioCtx) return _audioCtx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _audioCtx = new AC();
    return _audioCtx;
  } catch (e) {
    return null;
  }
}

// Play a single sine tone with envelope. Returns when scheduled.
function tone(freq, duration, {type = 'sine', startTime = 0, gain = 0.18, attack = 0.005, decay = 0.04} = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + startTime;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(gain, t0 + attack);
  env.gain.linearRampToValueAtTime(gain, t0 + duration - decay);
  env.gain.linearRampToValueAtTime(0, t0 + duration);
  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

const SFX = {
  click: () => tone(880, 0.05, {type: 'square', gain: 0.04, attack: 0.001, decay: 0.02}),
  match: () => {
    tone(523.25, 0.12, {type: 'sine', gain: 0.18}); // C5
    tone(783.99, 0.16, {type: 'sine', gain: 0.18, startTime: 0.08}); // G5
  },
  mismatch: () => {
    tone(415.30, 0.12, {type: 'triangle', gain: 0.16}); // G#4
    tone(311.13, 0.20, {type: 'triangle', gain: 0.18, startTime: 0.08}); // D#4
    tone(155.56, 0.18, {type: 'sawtooth', gain: 0.05, startTime: 0.08}); // sub-buzz
  },
  winner: () => {
    // Triumphant ascending arpeggio: C, E, G, C
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      tone(f, 0.18, {type: 'triangle', gain: 0.16, startTime: i * 0.09});
    });
    tone(1046.50, 0.55, {type: 'sine', gain: 0.12, startTime: 0.36}); // sustain top
  },
  tie: () => {
    tone(392, 0.5, {type: 'sine', gain: 0.13});
    tone(370, 0.5, {type: 'sine', gain: 0.10, startTime: 0.05}); // dissonant pair
  },
};

function playSfx(name, enabled) {
  if (!enabled) return;
  const fn = SFX[name];
  if (fn) {
    try { fn(); } catch (e) { /* swallow */ }
  }
}

// ============================================================
// SEARCH + CATEGORY HELPERS
// ============================================================
// Case-insensitive substring match on the item name
function itemMatchesSearch(item, query) {
  if (!query) return true;
  return item.name.toLowerCase().includes(query.toLowerCase().trim());
}

function SearchBar({value, onChange, accent = LIGHT_BLUE, placeholder = 'Search items…'}) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      minWidth: 200,
    }}>
      <span style={{
        position: 'absolute', left: 10,
        fontSize: 12, color: 'rgba(168,197,232,0.5)',
        pointerEvents: 'none',
      }}>🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="tra-body"
        style={{
          width: '100%',
          background: 'rgba(168,197,232,0.06)',
          border: `1px solid ${value ? accent : 'rgba(168,197,232,0.2)'}`,
          color: OFF_WHITE,
          padding: '5px 26px 5px 28px',
          fontSize: 12,
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: 6,
            background: 'transparent', border: 'none',
            color: 'rgba(168,197,232,0.7)',
            fontSize: 16, lineHeight: 1, cursor: 'pointer',
            padding: '2px 6px',
          }}
          title="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Category tab with optional count badge
function CategoryTabs({categories, items, activeCat, setActiveCat, search = '', accent = LIGHT_BLUE, size = 'normal'}) {
  // Count items in each category that match current search
  const countFor = (catId) => {
    const pool = catId === 'all' ? items : items.filter(i => i.cat === catId);
    if (!search) return pool.length;
    return pool.filter(i => itemMatchesSearch(i, search)).length;
  };
  const padY = size === 'small' ? '4px' : '6px';
  const padX = size === 'small' ? '9px' : '12px';
  const fz = size === 'small' ? 10 : 11;

  return (
    <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
      {categories.map(c => {
        const active = activeCat === c.id;
        const count = countFor(c.id);
        const dim = count === 0 && !active && !!search;
        return (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            disabled={dim}
            className="tra-display"
            style={{
              padding: `${padY} ${padX}`,
              fontSize: fz,
              letterSpacing: '0.15em',
              border: `1px solid ${active ? accent : dim ? 'rgba(168,197,232,0.1)' : 'rgba(168,197,232,0.2)'}`,
              background: active ? accent : 'transparent',
              color: active ? NAVY : dim ? 'rgba(168,197,232,0.3)' : accent,
              cursor: dim ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
          >
            {c.label}
            <span className="tra-mono" style={{
              fontSize: fz - 2,
              padding: '1px 5px',
              background: active ? 'rgba(15,30,60,0.25)' : 'rgba(168,197,232,0.1)',
              letterSpacing: '0.1em',
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// FLOATING BUDGET CHIP — draggable, persists position per device
// ============================================================
function FloatingBudget({totalSpend, budget, itemCount, accentColor = LIGHT_BLUE, who}) {
  const remaining = budget - totalSpend;
  const pct = Math.min(100, (totalSpend / budget) * 100);
  const overBudget = totalSpend > budget;
  const fmt = (n) => '$' + n.toLocaleString();

  // Position: load from localStorage or default to top-right area
  const [pos, setPos] = useState(() => {
    try {
      const saved = localStorage.getItem('tra-capex-budget-pos');
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p.x === 'number' && typeof p.y === 'number') return p;
      }
    } catch (e) { /* ignore */ }
    // Default — top-right with margin
    return { x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 240) : 20, y: 90 };
  });
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  // Visibility: only show floater once user has scrolled past the header's budget display
  const [scrolledPast, setScrolledPast] = useState(false);
  const dragRef = useRef({offsetX: 0, offsetY: 0, moved: false});

  // Watch the app's scroll container — show floater only once scrolled past the header
  useEffect(() => {
    // The root scroll container is the App's outer div with overflowY:auto.
    // Find it by walking up from this component. It's the element with the radial-gradient bg.
    // Easier: just use the first scrollable parent or window scroll as fallback.
    const scrollContainer = document.querySelector('[data-app-scroll]') || window;
    const getScrollTop = () => {
      if (scrollContainer === window) return window.scrollY;
      return scrollContainer.scrollTop;
    };
    const THRESHOLD = 180; // ~ height of header to the budget area
    const onScroll = () => {
      setScrolledPast(getScrollTop() > THRESHOLD);
    };
    onScroll(); // initial check
    scrollContainer.addEventListener('scroll', onScroll, {passive: true});
    return () => scrollContainer.removeEventListener('scroll', onScroll);
  }, []);

  // Save position to localStorage whenever it changes (debounced via timer)
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem('tra-capex-budget-pos', JSON.stringify(pos)); } catch (e) {}
    }, 250);
    return () => clearTimeout(t);
  }, [pos]);

  // Snap inside viewport on window resize so it never escapes off-screen
  useEffect(() => {
    const onResize = () => {
      setPos(p => ({
        x: Math.max(8, Math.min(p.x, window.innerWidth - 220)),
        y: Math.max(8, Math.min(p.y, window.innerHeight - 80)),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onMouseDown = (e) => {
    // Don't start drag if user clicked the expand chevron
    if (e.target.closest('[data-no-drag]')) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
    };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = Math.abs(e.clientX - dragRef.current.startX);
      const dy = Math.abs(e.clientY - dragRef.current.startY);
      if (dx > 3 || dy > 3) dragRef.current.moved = true;
      const newX = e.clientX - dragRef.current.offsetX;
      const newY = e.clientY - dragRef.current.offsetY;
      setPos({
        x: Math.max(8, Math.min(newX, window.innerWidth - 220)),
        y: Math.max(8, Math.min(newY, window.innerHeight - 80)),
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  const handleClick = () => {
    // Only toggle expand if the user didn't actually drag
    if (!dragRef.current.moved) setExpanded(!expanded);
  };

  const barColor = overBudget ? RED : pct > 85 ? GOLD : accentColor;
  const remColor = overBudget ? RED : remaining < 100000 ? GOLD : accentColor;

  // Don't render at all when at the top of the page (header budget is visible)
  if (!scrolledPast && !dragging) return null;

  return (
    <div
      onMouseDown={onMouseDown}
      onClick={handleClick}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 1000,
        background: `linear-gradient(135deg, rgba(15,30,60,0.97) 0%, rgba(10,21,41,0.97) 60%, rgba(5,11,24,0.98) 100%)`,
        border: `1px solid ${overBudget ? RED : 'rgba(201,182,131,0.4)'}`,
        borderLeft: `4px solid ${barColor}`,
        backdropFilter: 'blur(12px)',
        boxShadow: dragging
          ? `0 18px 50px rgba(0,0,0,0.7), 0 0 30px ${barColor}40, inset 0 1px 0 rgba(168,197,232,0.1)`
          : `0 8px 28px rgba(0,0,0,0.55), 0 0 14px ${barColor}25, inset 0 1px 0 rgba(168,197,232,0.08)`,
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        minWidth: 220,
        padding: '12px 16px',
        fontFamily: "'Manrope', sans-serif",
        transition: dragging ? 'none' : 'box-shadow 0.15s, transform 0.15s, opacity 0.2s',
        transform: dragging ? 'scale(1.02)' : 'scale(1)',
        animation: !dragging ? 'fb-in 0.2s ease-out' : 'none',
      }}
      title="Drag to move · click to expand"
    >
      {/* Decorative corner glow */}
      <div style={{
        position: 'absolute', top: -10, left: -10, width: 50, height: 50,
        background: `radial-gradient(circle, ${barColor}25, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Compact view */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, position: 'relative'}}>
        <div>
          <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.28em', color: GOLD, opacity: 0.85, marginBottom: 2}}>
            ◆ REMAINING BUDGET
          </div>
          <div className="tra-display" style={{
            fontSize: 26, color: remColor, lineHeight: 1, letterSpacing: '0.02em',
            textShadow: `0 0 14px ${remColor}50, 0 1px 4px rgba(0,0,0,0.6)`,
          }}>
            {fmt(remaining)}
          </div>
        </div>
        <div data-no-drag style={{
          color: 'rgba(168,197,232,0.6)',
          fontSize: 12,
          padding: 6,
          cursor: 'pointer',
        }}>
          {expanded ? '▾' : '▸'}
        </div>
      </div>

      {/* Mini progress bar */}
      <div style={{width: '100%', height: 4, background: 'rgba(168,197,232,0.12)', marginTop: 9, overflow: 'hidden', borderRadius: 2}}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${barColor} 0%, ${barColor}cc 100%)`,
          transition: 'width 0.3s, background 0.3s',
          boxShadow: `0 0 8px ${barColor}80`,
        }} />
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(201,182,131,0.2)', display: 'flex', flexDirection: 'column', gap: 5}}>
          <BudgetRow label="ITEMS" value={itemCount} />
          <BudgetRow label="SPENT" value={fmt(totalSpend)} />
          <BudgetRow label="OF" value={fmt(budget)} />
          <BudgetRow label="USED" value={`${pct.toFixed(1)}%`} accent={barColor} />
        </div>
      )}
    </div>
  );
}

function BudgetRow({label, value, accent}) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
      <span className="tra-mono" style={{fontSize: 8, letterSpacing: '0.18em', color: 'rgba(168,197,232,0.5)'}}>{label}</span>
      <span className="tra-mono" style={{fontSize: 11, color: accent || LIGHT_BLUE}}>{value}</span>
    </div>
  );
}


// ============================================================
// APP
// ============================================================
export default function App() {
  // Property settings (editable per episode)
  const [property, setProperty] = useState(DEFAULT_PROPERTY);
  const [hostName, setHostName] = useState('Trey');
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [showTitle, setShowTitle] = useState('Survivor: The CapEx Budget');

  // Three packages stored independently — all persist across mode switches
  const [treyPackage, setTreyPackage] = useState(new Set());
  const [treyLocked, setTreyLocked] = useState(false);

  const [p1Package, setP1Package] = useState(new Set());
  const [p1Locked, setP1Locked] = useState(false);
  const [p1Name, setP1Name] = useState('Contestant 1');

  const [p2Package, setP2Package] = useState(new Set());
  const [p2Locked, setP2Locked] = useState(false);
  const [p2Name, setP2Name] = useState('Contestant 2');

  // Mode routing
  const [mode, setMode] = useState('host'); // 'host' | 'contestant' | 'reveal'
  const [activeContestant, setActiveContestant] = useState('p1'); // 'p1' | 'p2'

  // Reveal state — two phases per item
  // revealedItems = host's call shown (phase 1)
  // fullyRevealedItems = contestant results shown + score updated (phase 2)
  const [revealedItems, setRevealedItems] = useState(new Set());
  const [fullyRevealedItems, setFullyRevealedItems] = useState(new Set());

  // Settings panel expand/collapse
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sound effects on/off (default off so nobody gets startled on first load)
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Text scale — per-device, persists in localStorage
  // Index into TEXT_SCALES (defined below)
  const [textScaleIdx, setTextScaleIdx] = useState(() => {
    try {
      const stored = localStorage.getItem('tra-capex-textscale');
      if (stored !== null) {
        const n = parseInt(stored, 10);
        if (!isNaN(n) && n >= 0 && n < TEXT_SCALES.length) return n;
      }
    } catch (e) { /* ignore */ }
    return 1; // default: 'NORMAL'
  });
  const textScale = TEXT_SCALES[textScaleIdx].mult;

  useEffect(() => {
    try { localStorage.setItem('tra-capex-textscale', String(textScaleIdx)); } catch (e) { /* ignore */ }
  }, [textScaleIdx]);

  const resetAll = () => {
    if (!confirm('Reset the entire game? All packages, reveals, and property settings will be cleared.')) return;
    setProperty(DEFAULT_PROPERTY);
    setHostName('Trey');
    setItems(DEFAULT_ITEMS);
    setShowTitle('Survivor: The CapEx Budget');
    setTreyPackage(new Set());
    setTreyLocked(false);
    setP1Package(new Set());
    setP1Locked(false);
    setP1Name('Contestant 1');
    setP2Package(new Set());
    setP2Locked(false);
    setP2Name('Contestant 2');
    setRevealedItems(new Set());
    setFullyRevealedItems(new Set());
    setMode('host');
    setSettingsOpen(false);
  };

  // ============ SAVE / LOAD ============
  const saveEpisode = () => {
    const data = {
      version: 1,
      savedAt: new Date().toISOString(),
      property,
      hostName,
      showTitle,
      items,
      treyPackage: Array.from(treyPackage),
      treyLocked,
      p1Name,
      p1Package: Array.from(p1Package),
      p1Locked,
      p2Name,
      p2Package: Array.from(p2Package),
      p2Locked,
      revealedItems: Array.from(revealedItems),
      fullyRevealedItems: Array.from(fullyRevealedItems),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (property.name || 'episode').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `capex-${safeName}-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadEpisode = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.version) throw new Error('Not a valid episode file');
        if (!confirm(`Load episode "${data.property?.name || 'Unknown'}"? Current state will be replaced.`)) {
          event.target.value = '';
          return;
        }
        setProperty(data.property || DEFAULT_PROPERTY);
        setHostName(data.hostName || 'Trey');
        setShowTitle(data.showTitle || 'Survivor: The CapEx Budget');
        setItems(data.items || DEFAULT_ITEMS);
        setTreyPackage(new Set(data.treyPackage || []));
        setTreyLocked(!!data.treyLocked);
        setP1Name(data.p1Name || 'Contestant 1');
        setP1Package(new Set(data.p1Package || []));
        setP1Locked(!!data.p1Locked);
        setP2Name(data.p2Name || 'Contestant 2');
        setP2Package(new Set(data.p2Package || []));
        setP2Locked(!!data.p2Locked);
        setRevealedItems(new Set(data.revealedItems || []));
        setFullyRevealedItems(new Set(data.fullyRevealedItems || []));
        setMode('host');
      } catch (err) {
        alert('Could not load that file. ' + (err.message || ''));
      } finally {
        event.target.value = ''; // allow re-loading the same file
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      data-app-scroll
      className="atmosphere-bg"
      style={{
        width: '100%', height: '100vh',
        color: OFF_WHITE,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@500;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: rgba(10,21,41,0.6); }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, rgba(201,182,131,0.3), rgba(168,197,232,0.2)); border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, rgba(201,182,131,0.5), rgba(168,197,232,0.35)); }

        .tra-display { font-family: 'Bebas Neue', ui-sans-serif, system-ui, sans-serif; }
        .tra-mono    { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .tra-body    { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        .tra-deco    { font-family: 'Cinzel', serif; font-weight: 700; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,182,131,0.4); }
          50%      { box-shadow: 0 0 0 10px rgba(201,182,131,0); }
        }
        @keyframes card-reveal {
          0%   { transform: scale(0.92) rotateX(-8deg); opacity: 0.5; }
          60%  { transform: scale(1.04) rotateX(2deg); }
          100% { transform: scale(1) rotateX(0); opacity: 1; }
        }
        @keyframes badge-pop {
          0%   { transform: scale(0.3) rotate(-8deg); opacity: 0; }
          60%  { transform: scale(1.18) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes mismatch-flash {
          0%, 100% { background-color: rgba(196,77,77,0.14); }
          25%      { background-color: rgba(196,77,77,0.55); box-shadow: 0 0 36px rgba(196,77,77,0.7), inset 0 0 20px rgba(196,77,77,0.3); }
        }
        @keyframes match-flash {
          0%, 100% { background-color: rgba(61,169,122,0.14); }
          25%      { background-color: rgba(61,169,122,0.5); box-shadow: 0 0 36px rgba(61,169,122,0.6), inset 0 0 20px rgba(61,169,122,0.25); }
        }
        @keyframes score-tick {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.22); color: #C44D4D; text-shadow: 0 0 24px rgba(196,77,77,0.9), 0 0 8px rgba(196,77,77,1); }
          100% { transform: scale(1); }
        }
        @keyframes scoreboard-shake {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-4px) rotate(-0.3deg); }
          60%      { transform: translateX(4px) rotate(0.3deg); }
          80%      { transform: translateX(-2px); }
        }
        @keyframes gold-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes title-glow {
          0%, 100% { text-shadow: 0 0 18px rgba(201,182,131,0.4), 0 0 4px rgba(201,182,131,0.6); }
          50%      { text-shadow: 0 0 28px rgba(201,182,131,0.6), 0 0 6px rgba(201,182,131,0.8); }
        }
        @keyframes ticker-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes fb-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .reveal-card-anim       { animation: card-reveal 0.55s cubic-bezier(0.34, 1.56, 0.64, 1); transform-style: preserve-3d; }
        .badge-anim             { animation: badge-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .mismatch-anim          { animation: mismatch-flash 0.85s ease-out; }
        .match-anim             { animation: match-flash 0.85s ease-out; }
        .score-tick-anim        { animation: score-tick 0.7s ease-out; display: inline-block; }
        .scoreboard-shake-anim  { animation: scoreboard-shake 0.5s ease-in-out; }
        .title-glow-anim        { animation: title-glow 4s ease-in-out infinite; }

        /* Gold shimmer effect for the show title */
        .gold-shimmer {
          background: linear-gradient(110deg, #C9B683 0%, #E8D9A8 25%, #FFF4D0 50%, #E8D9A8 75%, #C9B683 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gold-shimmer 6s linear infinite;
        }

        /* Atmospheric background — subtle blueprint grid */
        .atmosphere-bg {
          background-color: #050B18;
          background-image:
            radial-gradient(ellipse 90% 60% at 50% 0%, rgba(15,30,60,0.95) 0%, rgba(5,11,24,1) 70%),
            linear-gradient(rgba(168,197,232,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,197,232,0.025) 1px, transparent 1px);
          background-size: 100% 100%, 60px 60px, 60px 60px;
          background-position: 0 0, 0 0, 0 0;
        }

        /* Subtle grain overlay for surfaces */
        .grain::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }

        /* Fancy bordered container — subtle inner highlight */
        .premium-surface {
          background: linear-gradient(180deg, rgba(15,30,60,0.7) 0%, rgba(10,21,41,0.85) 100%);
          border: 1px solid rgba(168,197,232,0.2);
          box-shadow:
            inset 0 1px 0 rgba(168,197,232,0.08),
            0 4px 24px rgba(0,0,0,0.4);
        }
      `}</style>

      {/* GLOBAL HEADER + MODE SWITCHER */}
      <TopHeader
        property={property}
        showTitle={showTitle}
        mode={mode}
        setMode={setMode}
        resetAll={resetAll}
        saveEpisode={saveEpisode}
        loadEpisode={loadEpisode}
        treyLocked={treyLocked}
        p1Locked={p1Locked}
        p2Locked={p2Locked}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        textScaleIdx={textScaleIdx}
        setTextScaleIdx={setTextScaleIdx}
      />

      {/* EPISODE SETTINGS (collapsible) */}
      {settingsOpen && (
        <EpisodeSettings
          property={property}
          setProperty={setProperty}
          hostName={hostName}
          setHostName={setHostName}
          showTitle={showTitle}
          setShowTitle={setShowTitle}
          p1Name={p1Name}
          setP1Name={setP1Name}
          p2Name={p2Name}
          setP2Name={setP2Name}
          items={items}
          setItems={setItems}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* MODE CONTENT */}
      <div style={{display: 'flex', flexDirection: 'column', zoom: textScale}}>
        {mode === 'host' && (
          <BuildMode
            who={hostName.toUpperCase()}
            property={property}
            items={items}
            selected={treyPackage}
            setSelected={setTreyPackage}
            locked={treyLocked}
            setLocked={setTreyLocked}
            accentColor={GOLD}
          />
        )}
        {mode === 'contestant' && (
          <ContestantBuildWrapper
            property={property}
            items={items}
            activeContestant={activeContestant}
            setActiveContestant={setActiveContestant}
            p1={{name: p1Name, setName: setP1Name, package: p1Package, setPackage: setP1Package, locked: p1Locked, setLocked: setP1Locked}}
            p2={{name: p2Name, setName: setP2Name, package: p2Package, setPackage: setP2Package, locked: p2Locked, setLocked: setP2Locked}}
          />
        )}
        {mode === 'reveal' && (
          <RevealMode
            hostName={hostName}
            items={items}
            treyPackage={treyPackage}
            p1={{name: p1Name, package: p1Package}}
            p2={{name: p2Name, package: p2Package}}
            revealedItems={revealedItems}
            setRevealedItems={setRevealedItems}
            fullyRevealedItems={fullyRevealedItems}
            setFullyRevealedItems={setFullyRevealedItems}
            soundEnabled={soundEnabled}
          />
        )}
      </div>

      {/* FLOATING BUDGET — lives outside the zoomed area so drag math isn't affected */}
      {mode !== 'reveal' && !settingsOpen && (() => {
        const activePkg = mode === 'host' ? treyPackage : (activeContestant === 'p1' ? p1Package : p2Package);
        const activeWho = mode === 'host' ? hostName.toUpperCase() : (activeContestant === 'p1' ? p1Name.toUpperCase() : p2Name.toUpperCase());
        const activeAccent = mode === 'host' ? GOLD : (activeContestant === 'p1' ? '#7FB5E8' : '#E8A87F');
        const totalSpend = Array.from(activePkg).reduce((sum, id) => {
          const it = items.find(i => i.id === id);
          return sum + (it ? it.cost : 0);
        }, 0);
        return (
          <FloatingBudget
            totalSpend={totalSpend}
            budget={property.budget}
            itemCount={activePkg.size}
            accentColor={activeAccent}
            who={activeWho}
          />
        );
      })()}
    </div>
  );
}

// ============================================================
// TOP HEADER + MODE TABS
// ============================================================
function TopHeader({property, showTitle, mode, setMode, resetAll, saveEpisode, loadEpisode, treyLocked, p1Locked, p2Locked, settingsOpen, setSettingsOpen, soundEnabled, setSoundEnabled, textScaleIdx, setTextScaleIdx}) {
  const tabs = [
    { id: 'host', label: 'HOST SETUP', status: treyLocked ? 'DONE' : 'PENDING' },
    { id: 'contestant', label: 'CONTESTANT BUILD', status: (p1Locked && p2Locked) ? 'DONE' : (p1Locked || p2Locked) ? '1/2' : 'PENDING' },
    { id: 'reveal', label: 'REVEAL', status: 'READY' },
  ];

  const utilBtnStyle = (extra = {}) => ({
    padding: '7px 11px',
    background: 'rgba(10,21,41,0.6)',
    border: '1px solid rgba(168,197,232,0.25)',
    color: LIGHT_BLUE,
    fontSize: 9, letterSpacing: '0.18em', cursor: 'pointer',
    transition: 'all 0.15s',
    ...extra,
  });

  return (
    <div style={{position: 'relative', flexShrink: 0, borderBottom: `1px solid rgba(201,182,131,0.25)`}}>
      {/* Subtle gold horizon line at the very top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(201,182,131,0.5) 50%, transparent 100%)',
        boxShadow: '0 0 12px rgba(201,182,131,0.3)',
      }} />

      {/* HERO BAND — show title and brand */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(15,30,60,0.6) 0%, rgba(10,21,41,0.4) 100%)',
        padding: '20px 32px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative corner accents */}
        <div style={{position: 'absolute', top: 12, left: 12, width: 22, height: 22, borderTop: `1.5px solid ${GOLD}`, borderLeft: `1.5px solid ${GOLD}`, opacity: 0.5}} />
        <div style={{position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderTop: `1.5px solid ${GOLD}`, borderRight: `1.5px solid ${GOLD}`, opacity: 0.5}} />
        <div style={{position: 'absolute', bottom: 12, left: 12, width: 22, height: 22, borderBottom: `1.5px solid ${GOLD}`, borderLeft: `1.5px solid ${GOLD}`, opacity: 0.5}} />
        <div style={{position: 'absolute', bottom: 12, right: 12, width: 22, height: 22, borderBottom: `1.5px solid ${GOLD}`, borderRight: `1.5px solid ${GOLD}`, opacity: 0.5}} />

        <div style={{display: 'grid', gridTemplateColumns: '1.1fr 1.6fr 1.3fr', gap: 28, alignItems: 'center'}}>
          {/* LEFT — Brand lockup */}
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{
              padding: '12px 14px',
              border: `1px solid rgba(201,182,131,0.4)`,
              background: 'linear-gradient(135deg, rgba(15,30,60,0.9) 0%, rgba(5,11,24,1) 100%)',
              textAlign: 'center',
              minWidth: 110,
              boxShadow: '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,182,131,0.15)',
            }}>
              <div className="tra-display" style={{fontSize: 14, letterSpacing: '0.14em', color: OFF_WHITE}}>TRACK RECORD</div>
              <div className="tra-deco" style={{fontSize: 8, letterSpacing: '0.4em', color: GOLD, marginTop: 3}}>ASSETS</div>
            </div>
            <div>
              <div className="tra-mono" style={{fontSize: 9, letterSpacing: '0.28em', color: GOLD, opacity: 0.85}}>
                ◆  GAMESHOW  ·  G03  ◆
              </div>
              {(() => {
                // Split at first colon for two-tone treatment; whole thing in gold if no colon
                const colonIdx = showTitle.indexOf(':');
                const part1 = colonIdx > -1 ? showTitle.slice(0, colonIdx + 1) : '';
                const part2 = colonIdx > -1 ? showTitle.slice(colonIdx + 1).trim() : showTitle;
                return (
                  <>
                    {part1 && (
                      <div className="tra-display title-glow-anim" style={{fontSize: 30, letterSpacing: '0.05em', marginTop: 4, lineHeight: 1}}>
                        <span style={{color: OFF_WHITE}}>{part1.toUpperCase()}</span>
                      </div>
                    )}
                    <div className="tra-display gold-shimmer" style={{fontSize: 30, letterSpacing: '0.05em', lineHeight: 1, marginTop: part1 ? -2 : 4}}>
                      {part2.toUpperCase()}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* CENTER — "Tonight's Property" chyron */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15,30,60,0.85) 0%, rgba(10,21,41,0.95) 100%)',
            border: '1px solid rgba(168,197,232,0.2)',
            borderLeft: `3px solid ${GOLD}`,
            padding: '14px 20px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(168,197,232,0.06)',
          }}>
            <div className="tra-mono" style={{fontSize: 9, letterSpacing: '0.28em', color: GOLD, opacity: 0.8}}>
              TONIGHT'S PROPERTY
            </div>
            <div className="tra-display" style={{fontSize: 26, letterSpacing: '0.04em', color: OFF_WHITE, marginTop: 3, lineHeight: 1}}>
              {property.name}
            </div>
            <div className="tra-mono" style={{fontSize: 10, letterSpacing: '0.08em', color: LIGHT_BLUE, marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
              <span>{property.units} UNITS</span><span style={{color: 'rgba(168,197,232,0.3)'}}>◆</span>
              <span>BUILT {property.yearBuilt}</span><span style={{color: 'rgba(168,197,232,0.3)'}}>◆</span>
              <span>{(property.submarket || '').toUpperCase()}</span><span style={{color: 'rgba(168,197,232,0.3)'}}>◆</span>
              <span>RENT {property.inPlaceRent}</span><span style={{color: 'rgba(168,197,232,0.3)'}}>◆</span>
              <span>OCC {property.occupancy}</span>
            </div>
          </div>

          {/* RIGHT — The stakes */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10}}>
            <div style={{
              textAlign: 'right',
              padding: '10px 18px',
              border: `1px solid rgba(201,182,131,0.5)`,
              background: 'linear-gradient(135deg, rgba(201,182,131,0.08) 0%, rgba(10,21,41,0.6) 100%)',
              boxShadow: '0 0 24px rgba(201,182,131,0.12), inset 0 1px 0 rgba(201,182,131,0.2)',
            }}>
              <div className="tra-mono" style={{fontSize: 9, letterSpacing: '0.32em', color: GOLD, opacity: 0.9}}>TONIGHT'S STAKES</div>
              <div className="tra-display gold-shimmer" style={{fontSize: 38, letterSpacing: '0.02em', lineHeight: 1, marginTop: 2}}>
                ${(property.budget/1000000).toFixed(2)}M
              </div>
            </div>

            {/* Toolbar — utility row beneath the stakes */}
            <div style={{display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 1, border: '1px solid rgba(168,197,232,0.25)', background: 'rgba(10,21,41,0.6)'}} title="Text size">
                <button
                  onClick={() => setTextScaleIdx(Math.max(0, textScaleIdx - 1))}
                  disabled={textScaleIdx === 0}
                  className="tra-mono"
                  style={{
                    padding: '6px 9px', background: 'transparent', border: 'none',
                    color: textScaleIdx === 0 ? 'rgba(168,197,232,0.3)' : LIGHT_BLUE,
                    fontSize: 11, cursor: textScaleIdx === 0 ? 'not-allowed' : 'pointer',
                  }}
                  title="Smaller text"
                >A−</button>
                <div className="tra-mono" style={{padding: '6px 8px', fontSize: 9, letterSpacing: '0.15em', color: GOLD, borderLeft: '1px solid rgba(168,197,232,0.2)', borderRight: '1px solid rgba(168,197,232,0.2)', minWidth: 28, textAlign: 'center'}}>
                  {TEXT_SCALES[textScaleIdx].label}
                </div>
                <button
                  onClick={() => setTextScaleIdx(Math.min(TEXT_SCALES.length - 1, textScaleIdx + 1))}
                  disabled={textScaleIdx === TEXT_SCALES.length - 1}
                  className="tra-mono"
                  style={{
                    padding: '6px 9px', background: 'transparent', border: 'none',
                    color: textScaleIdx === TEXT_SCALES.length - 1 ? 'rgba(168,197,232,0.3)' : LIGHT_BLUE,
                    fontSize: 13, cursor: textScaleIdx === TEXT_SCALES.length - 1 ? 'not-allowed' : 'pointer',
                  }}
                  title="Larger text"
                >A+</button>
              </div>
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) playSfx('click', true);
                }}
                style={utilBtnStyle({
                  background: soundEnabled ? GOLD : 'rgba(10,21,41,0.6)',
                  color: soundEnabled ? NAVY : LIGHT_BLUE,
                  borderColor: soundEnabled ? GOLD : 'rgba(168,197,232,0.25)',
                  fontSize: 11, padding: '6px 10px',
                })}
                title={soundEnabled ? 'Sound on — click to mute' : 'Sound off — click to enable'}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                style={utilBtnStyle({
                  background: settingsOpen ? LIGHT_BLUE : 'rgba(10,21,41,0.6)',
                  color: settingsOpen ? NAVY : LIGHT_BLUE,
                  borderColor: settingsOpen ? LIGHT_BLUE : 'rgba(168,197,232,0.25)',
                })}
                title="Edit episode settings"
              >⚙ EPISODE</button>
              <button onClick={saveEpisode} style={utilBtnStyle()} title="Download episode JSON">⬇ SAVE</button>
              <label style={utilBtnStyle({display: 'inline-block'})} title="Load saved episode">
                ⬆ LOAD
                <input type="file" accept="application/json,.json" onChange={loadEpisode} style={{display: 'none'}} />
              </label>
              <button
                onClick={resetAll}
                style={utilBtnStyle({color: GOLD, borderColor: 'rgba(201,182,131,0.4)'})}
                title="Reset the whole game"
              >RESET</button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS — sticky, premium feel */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid rgba(201,182,131,0.2)',
        background: 'linear-gradient(180deg, rgba(10,21,41,0.95) 0%, rgba(15,30,60,0.85) 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}>
        {tabs.map((t, idx) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className="tra-display"
              style={{
                flex: 1,
                padding: '18px 24px',
                background: active
                  ? `linear-gradient(180deg, rgba(201,182,131,0.12) 0%, rgba(15,30,60,0.6) 100%)`
                  : 'transparent',
                color: active ? GOLD : 'rgba(168,197,232,0.55)',
                border: 'none',
                borderRight: idx < tabs.length - 1 ? '1px solid rgba(168,197,232,0.08)' : 'none',
                borderBottom: active ? `3px solid ${GOLD}` : '3px solid transparent',
                fontSize: 17,
                letterSpacing: '0.16em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                transition: 'all 0.2s',
                position: 'relative',
                textShadow: active ? '0 0 12px rgba(201,182,131,0.4)' : 'none',
              }}
            >
              <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
                {active && <span style={{color: GOLD, opacity: 0.6}}>◆</span>}
                {t.label}
                {active && <span style={{color: GOLD, opacity: 0.6}}>◆</span>}
              </span>
              <span className="tra-mono" style={{
                fontSize: 8, letterSpacing: '0.22em',
                padding: '3px 8px',
                background: t.status === 'DONE' ? 'rgba(61,169,122,0.18)' : t.status === 'READY' ? 'rgba(201,182,131,0.18)' : 'rgba(168,197,232,0.08)',
                color: t.status === 'DONE' ? GREEN : t.status === 'READY' ? GOLD : 'rgba(168,197,232,0.5)',
                border: `1px solid ${t.status === 'DONE' ? 'rgba(61,169,122,0.4)' : t.status === 'READY' ? 'rgba(201,182,131,0.4)' : 'rgba(168,197,232,0.15)'}`,
              }}>
                {t.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// BUILD MODE — shared by Trey and contestants
// ============================================================
function BuildMode({who, subtitle, property, items, selected, setSelected, locked, setLocked, accentColor = LIGHT_BLUE, extraHeader = null}) {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const totalSpend = useMemo(
    () => Array.from(selected).reduce((sum, id) => {
      const it = items.find(i => i.id === id);
      return sum + (it ? it.cost : 0);
    }, 0),
    [selected, items]
  );
  const budgetRemaining = property.budget - totalSpend;
  const budgetPct = Math.min(100, (totalSpend / property.budget) * 100);
  const overBudget = totalSpend > property.budget;

  const filteredItems = useMemo(
    () => {
      let list = activeCat === 'all' ? items : items.filter(i => i.cat === activeCat);
      if (search) list = list.filter(i => itemMatchesSearch(i, search));
      return list;
    },
    [activeCat, items, search]
  );

  const fmt = (n) => '$' + n.toLocaleString();

  const toggleItem = (id) => {
    if (locked) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else {
      const it = items.find(i => i.id === id);
      if (totalSpend + it.cost > property.budget) return;
      next.add(id);
    }
    setSelected(next);
  };

  const canAfford = (item) => selected.has(item.id) || totalSpend + item.cost <= property.budget;

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {/* Builder status bar */}
      <div style={{
        background: NAVY_DEEP,
        padding: '14px 24px',
        borderBottom: '1px solid rgba(168,197,232,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexShrink: 0,
      }}>
        <div style={{
          padding: '6px 14px',
          background: accentColor,
          color: NAVY,
          flexShrink: 0,
        }}>
          <div className="tra-display" style={{fontSize: 14, letterSpacing: '0.15em', whiteSpace: 'nowrap'}}>{who}</div>
        </div>

        <div style={{flex: 1}} />

        <div style={{display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0}}>
          <Stat label="ITEMS" value={selected.size} />
          <Stat label="SPENT" value={fmt(totalSpend)} />
          <Stat label="REMAINING" value={fmt(budgetRemaining)} color={overBudget ? RED : budgetRemaining < 100000 ? GOLD : LIGHT_BLUE} />
        </div>

        {!locked ? (
          <button
            onClick={() => setLocked(true)}
            disabled={selected.size === 0}
            className="tra-display"
            style={{
              padding: '10px 22px',
              background: selected.size === 0 ? 'rgba(168,197,232,0.15)' : accentColor,
              color: selected.size === 0 ? 'rgba(168,197,232,0.4)' : NAVY,
              border: 'none',
              fontSize: 13, letterSpacing: '0.1em',
              cursor: selected.size === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            SEAL PACKAGE ✓
          </button>
        ) : (
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <div className="tra-display" style={{padding: '10px 16px', background: 'rgba(61,169,122,0.15)', border: `1px solid ${GREEN}`, color: GREEN, fontSize: 13, letterSpacing: '0.1em'}}>
              ✓ SEALED
            </div>
            <button
              onClick={() => setLocked(false)}
              className="tra-mono"
              style={{padding: '10px 14px', background: 'transparent', border: '1px solid rgba(168,197,232,0.3)', color: 'rgba(168,197,232,0.7)', fontSize: 9, letterSpacing: '0.15em', cursor: 'pointer'}}
            >
              UNSEAL
            </button>
          </div>
        )}
      </div>

      {/* Budget bar */}
      <div style={{width: '100%', height: 4, background: 'rgba(168,197,232,0.1)', flexShrink: 0}}>
        <div style={{height: '100%', width: `${budgetPct}%`, background: overBudget ? RED : budgetPct > 85 ? GOLD : accentColor, transition: 'width 0.3s, background 0.3s'}} />
      </div>

      {/* Categories + Search */}
      <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', background: NAVY_DARK, borderBottom: '1px solid rgba(168,197,232,0.08)', flexWrap: 'wrap', flexShrink: 0}}>
        <div style={{flex: 1, minWidth: 0}}>
          <CategoryTabs categories={CATEGORIES} items={items} activeCat={activeCat} setActiveCat={setActiveCat} search={search} accent={accentColor} />
        </div>
        <SearchBar value={search} onChange={setSearch} accent={accentColor} placeholder="Find an upgrade…" />
      </div>

      {/* Item grid */}
      <div style={{padding: '16px 24px', background: NAVY_DEEP, opacity: locked ? 0.55 : 1, pointerEvents: locked ? 'none' : 'auto', minHeight: 0}}>
        {filteredItems.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px 20px', color: 'rgba(168,197,232,0.5)'}} className="tra-body">
            <div className="tra-display" style={{fontSize: 22, color: OFF_WHITE, marginBottom: 8, letterSpacing: '0.04em'}}>
              NO MATCHES
            </div>
            <div style={{fontSize: 13, fontStyle: 'italic'}}>
              {search ? `Nothing matches "${search}" in this category. Clear the search or try a different one.` : 'No items in this category.'}
            </div>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12}}>
            {filteredItems.map(item => {
              const isSelected = selected.has(item.id);
              const affordable = canAfford(item);
              return (
                <div
                  key={item.id}
                  onClick={() => affordable && toggleItem(item.id)}
                  style={{
                    padding: '14px 16px',
                    background: isSelected
                      ? `linear-gradient(135deg, ${accentColor}28 0%, rgba(15,30,60,0.9) 60%, rgba(10,21,41,0.95) 100%)`
                      : 'linear-gradient(180deg, rgba(15,30,60,0.7) 0%, rgba(10,21,41,0.85) 100%)',
                    border: `1px solid ${isSelected ? accentColor : 'rgba(168,197,232,0.15)'}`,
                    borderLeft: `3px solid ${isSelected ? accentColor : 'rgba(168,197,232,0.2)'}`,
                    opacity: affordable ? 1 : 0.32,
                    cursor: affordable ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                    position: 'relative',
                    boxShadow: isSelected
                      ? `0 6px 20px rgba(0,0,0,0.45), 0 0 0 1px ${accentColor}40, inset 0 1px 0 ${accentColor}30`
                      : '0 3px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(168,197,232,0.06)',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && affordable) e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Subtle corner highlight on selected */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 0, right: 0, width: 60, height: 60,
                      background: `radial-gradient(circle at top right, ${accentColor}30, transparent 70%)`,
                      pointerEvents: 'none',
                    }} />
                  )}
                  {isSelected && (
                    <div className="tra-display" style={{
                      position: 'absolute', top: 10, right: 10,
                      padding: '3px 9px',
                      background: accentColor, color: NAVY,
                      fontSize: 10, letterSpacing: '0.15em',
                      boxShadow: `0 2px 8px ${accentColor}80`,
                    }}>
                      ✓ IN
                    </div>
                  )}
                  <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.28em', color: GOLD, marginBottom: 5, opacity: 0.9}}>
                    {item.cat.toUpperCase()}
                  </div>
                  <div className="tra-body" style={{fontSize: 13, fontWeight: 600, color: OFF_WHITE, lineHeight: 1.3, marginBottom: 8, paddingRight: isSelected ? 44 : 0, minHeight: 34}}>
                    {item.name}
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(168,197,232,0.08)', paddingTop: 6}}>
                    <span className="tra-display" style={{fontSize: 18, color: isSelected ? accentColor : LIGHT_BLUE, letterSpacing: '0.02em', textShadow: isSelected ? `0 0 12px ${accentColor}60` : 'none'}}>{fmt(item.cost)}</span>
                    <span className="tra-mono" style={{fontSize: 9, letterSpacing: '0.12em', color: 'rgba(168,197,232,0.5)'}}>{item.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({label, value, color = OFF_WHITE}) {
  return (
    <div>
      <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.22em', color: 'rgba(168,197,232,0.5)'}}>{label}</div>
      <div className="tra-display" style={{fontSize: 18, letterSpacing: '0.02em', color, marginTop: 1}}>{value}</div>
    </div>
  );
}

// ============================================================
// CONTESTANT WRAPPER — switches between P1 and P2
// ============================================================
function ContestantBuildWrapper({property, items, activeContestant, setActiveContestant, p1, p2}) {
  const active = activeContestant === 'p1' ? p1 : p2;

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {/* Contestant switcher */}
      <div style={{
        display: 'flex',
        background: NAVY_DEEP,
        borderBottom: '1px solid rgba(168,197,232,0.1)',
        padding: '0 24px',
        flexShrink: 0,
      }}>
        {[
          {id: 'p1', label: p1.name, locked: p1.locked, count: p1.package.size},
          {id: 'p2', label: p2.name, locked: p2.locked, count: p2.package.size},
        ].map(c => {
          const isActive = activeContestant === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveContestant(c.id)}
              className="tra-display"
              style={{
                padding: '12px 20px',
                background: isActive ? NAVY_DARK : 'transparent',
                color: isActive ? LIGHT_BLUE : 'rgba(168,197,232,0.5)',
                border: 'none',
                borderBottom: isActive ? `2px solid ${LIGHT_BLUE}` : '2px solid transparent',
                fontSize: 13,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {c.label.toUpperCase()}
              {c.locked && (
                <span className="tra-mono" style={{fontSize: 8, padding: '2px 6px', background: 'rgba(61,169,122,0.2)', border: `1px solid ${GREEN}`, color: GREEN, letterSpacing: '0.15em'}}>
                  SEALED
                </span>
              )}
            </button>
          );
        })}
      </div>

      <BuildMode
        who={active.name.toUpperCase()}
        property={property}
        items={items}
        selected={active.package}
        setSelected={active.setPackage}
        locked={active.locked}
        setLocked={active.setLocked}
        accentColor={activeContestant === 'p1' ? '#7FB5E8' : '#E8A87F'}
      />
    </div>
  );
}

// ============================================================
// REVEAL MODE — the scoring payoff
// ============================================================
function RevealMode({hostName, items, treyPackage, p1, p2, revealedItems, setRevealedItems, fullyRevealedItems, setFullyRevealedItems, soundEnabled}) {
  const [activeCat, setActiveCat] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [search, setSearch] = useState('');
  const [lastRevealedId, setLastRevealedId] = useState(null);
  const [lastFullyRevealedId, setLastFullyRevealedId] = useState(null);
  const fmt = (n) => '$' + n.toLocaleString();

  // Score only counts FULLY revealed items (phase 2)
  const calcScore = (playerPackage) => {
    let score = 100;
    fullyRevealedItems.forEach(itemId => {
      const treyIn = treyPackage.has(itemId);
      const playerIn = playerPackage.has(itemId);
      if (treyIn !== playerIn) score -= 1;
    });
    return score;
  };

  const p1Score = calcScore(p1.package);
  const p2Score = calcScore(p2.package);

  const prevP1Score = useRef(p1Score);
  const prevP2Score = useRef(p2Score);
  const [p1Flash, setP1Flash] = useState(false);
  const [p2Flash, setP2Flash] = useState(false);

  useEffect(() => {
    if (p1Score < prevP1Score.current) {
      setP1Flash(true);
      const t = setTimeout(() => setP1Flash(false), 600);
      prevP1Score.current = p1Score;
      return () => clearTimeout(t);
    }
    prevP1Score.current = p1Score;
  }, [p1Score]);

  useEffect(() => {
    if (p2Score < prevP2Score.current) {
      setP2Flash(true);
      const t = setTimeout(() => setP2Flash(false), 600);
      prevP2Score.current = p2Score;
      return () => clearTimeout(t);
    }
    prevP2Score.current = p2Score;
  }, [p2Score]);

  const [scoreboardStuck, setScoreboardStuck] = useState(false);
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-app-scroll]') || window;
    const getScrollTop = () => scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;
    const THRESHOLD = 420;
    const onScroll = () => setScoreboardStuck(getScrollTop() > THRESHOLD);
    onScroll();
    scrollContainer.addEventListener('scroll', onScroll, {passive: true});
    return () => scrollContainer.removeEventListener('scroll', onScroll);
  }, []);

  const filterPipeline = useMemo(() => {
    let list = activeCat === 'all' ? items : items.filter(i => i.cat === activeCat);
    if (filterMode === 'unrevealed') {
      list = list.filter(i => !revealedItems.has(i.id));
    } else if (filterMode === 'disagree') {
      list = list.filter(i => p1.package.has(i.id) !== p2.package.has(i.id));
    } else if (filterMode === 'mismatch') {
      list = list.filter(i => {
        if (!fullyRevealedItems.has(i.id)) return false;
        const treyIn = treyPackage.has(i.id);
        return p1.package.has(i.id) !== treyIn || p2.package.has(i.id) !== treyIn;
      });
    }
    if (search) list = list.filter(i => itemMatchesSearch(i, search));
    return list;
  }, [activeCat, filterMode, items, revealedItems, fullyRevealedItems, p1.package, p2.package, treyPackage, search]);

  // TWO-PHASE REVEAL
  const revealItem = (id) => {
    const isRevealed = revealedItems.has(id);
    const isFullyRevealed = fullyRevealedItems.has(id);
    if (!isRevealed) {
      const next = new Set(revealedItems);
      next.add(id);
      setRevealedItems(next);
      setLastRevealedId(id);
      setLastFullyRevealedId(null);
      playSfx('click', soundEnabled);
    } else if (!isFullyRevealed) {
      const next = new Set(fullyRevealedItems);
      next.add(id);
      setFullyRevealedItems(next);
      setLastFullyRevealedId(id);
      const treyIn = treyPackage.has(id);
      const anyMismatch = p1.package.has(id) !== treyIn || p2.package.has(id) !== treyIn;
      playSfx(anyMismatch ? 'mismatch' : 'match', soundEnabled);
    } else {
      const nextR = new Set(revealedItems); nextR.delete(id);
      const nextF = new Set(fullyRevealedItems); nextF.delete(id);
      setRevealedItems(nextR);
      setFullyRevealedItems(nextF);
      setLastRevealedId(null);
      setLastFullyRevealedId(null);
      playSfx('click', soundEnabled);
    }
  };

  const revealAll = () => {
    setRevealedItems(new Set(items.map(i => i.id)));
    setFullyRevealedItems(new Set(items.map(i => i.id)));
    setLastRevealedId(null);
    setLastFullyRevealedId(null);
  };
  const resetReveals = () => {
    setRevealedItems(new Set());
    setFullyRevealedItems(new Set());
    setLastRevealedId(null);
    setLastFullyRevealedId(null);
  };

  const allRevealed = fullyRevealedItems.size === items.length;
  const winner = allRevealed ? (p1Score === p2Score ? 'TIE' : p1Score > p2Score ? p1.name : p2.name) : null;

  const winnerPlayedRef = useRef(false);
  useEffect(() => {
    if (allRevealed && !winnerPlayedRef.current) {
      winnerPlayedRef.current = true;
      setTimeout(() => playSfx(winner === 'TIE' ? 'tie' : 'winner', soundEnabled), 350);
    } else if (!allRevealed) { winnerPlayedRef.current = false; }
  }, [allRevealed, winner, soundEnabled]);

  const disagreeCount = items.filter(i => p1.package.has(i.id) !== p2.package.has(i.id)).length;
  const unrevealedCount = items.length - revealedItems.size;
  const mismatchCount = Array.from(fullyRevealedItems).filter(id => {
    const treyIn = treyPackage.has(id);
    return p1.package.has(id) !== treyIn || p2.package.has(id) !== treyIn;
  }).length;

  const nothingToReveal = treyPackage.size === 0 && p1.package.size === 0 && p2.package.size === 0;
  if (nothingToReveal) {
    return (
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40}}>
        <div style={{textAlign: 'center', maxWidth: 500}}>
          <div className="tra-display" style={{fontSize: 28, letterSpacing: '0.04em', color: OFF_WHITE, marginBottom: 12}}>NO PACKAGES TO REVEAL YET</div>
          <div className="tra-body" style={{fontSize: 14, color: 'rgba(168,197,232,0.7)', lineHeight: 1.5}}>
            Switch to <b>HOST SETUP</b> to build {hostName}'s answer key, then to <b>CONTESTANT BUILD</b> so each player can build their package. Come back here for the reveal.
          </div>
        </div>
      </div>
    );
  }

  const filterTabs = [
    { id: 'all', label: 'ALL', count: items.length, color: LIGHT_BLUE },
    { id: 'unrevealed', label: 'UNREVEALED', count: unrevealedCount, color: LIGHT_BLUE },
    { id: 'disagree', label: 'DISAGREEMENTS', count: disagreeCount, color: GOLD },
    { id: 'mismatch', label: 'MISMATCHES', count: mismatchCount, color: RED },
  ];

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {/* Compact fixed scoreboard */}
      {scoreboardStuck && (
        <div style={{background: `linear-gradient(180deg, ${NAVY_DEEP} 0%, rgba(5,11,24,0.98) 100%)`, padding: '8px 24px', borderBottom: '1px solid rgba(201,182,131,0.25)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 15, boxShadow: '0 8px 20px rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', animation: 'fb-in 0.2s ease-out'}}>
          <ScorePanel compact name={p1.name} score={p1Score} color="#7FB5E8" isWinner={allRevealed && p1Score > p2Score} isTie={allRevealed && p1Score === p2Score} flash={p1Flash} />
          <ScorePanel compact name={p2.name} score={p2Score} color="#E8A87F" isWinner={allRevealed && p2Score > p1Score} isTie={allRevealed && p1Score === p2Score} flash={p2Flash} />
        </div>
      )}

      {/* Full-size scoreboard */}
      <div style={{background: `linear-gradient(180deg, ${NAVY_DEEP} 0%, rgba(5,11,24,0.98) 100%)`, padding: '16px 24px', borderBottom: '1px solid rgba(201,182,131,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flexShrink: 0}}>
        <ScorePanel name={p1.name} score={p1Score} color="#7FB5E8" isWinner={allRevealed && p1Score > p2Score} isTie={allRevealed && p1Score === p2Score} flash={p1Flash} />
        <ScorePanel name={p2.name} score={p2Score} color="#E8A87F" isWinner={allRevealed && p2Score > p1Score} isTie={allRevealed && p1Score === p2Score} flash={p2Flash} />
      </div>

      {/* View filter row */}
      <div style={{background: NAVY_DARK, padding: '8px 24px', borderBottom: '1px solid rgba(168,197,232,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0}}>
        <span className="tra-mono" style={{fontSize: 9, letterSpacing: '0.22em', color: 'rgba(168,197,232,0.5)'}}>VIEW:</span>
        <div style={{display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1}}>
          {filterTabs.map(f => {
            const active = filterMode === f.id;
            const dim = f.count === 0 && !active;
            return (
              <button key={f.id} onClick={() => setFilterMode(f.id)} disabled={dim} className="tra-display"
                style={{padding: '5px 11px', fontSize: 10, letterSpacing: '0.15em', border: `1px solid ${active ? f.color : dim ? 'rgba(168,197,232,0.1)' : 'rgba(168,197,232,0.25)'}`, background: active ? f.color : 'transparent', color: active ? NAVY : dim ? 'rgba(168,197,232,0.3)' : f.color, cursor: dim ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6}}>
                {f.label}
                <span className="tra-mono" style={{fontSize: 8, padding: '1px 5px', background: active ? 'rgba(15,30,60,0.25)' : 'rgba(168,197,232,0.1)', letterSpacing: '0.1em'}}>{f.count}</span>
              </button>
            );
          })}
        </div>
        {winner && (
          <div className="tra-display badge-anim" style={{padding: '6px 14px', background: winner === 'TIE' ? 'rgba(201,182,131,0.2)' : 'rgba(61,169,122,0.2)', border: `1px solid ${winner === 'TIE' ? GOLD : GREEN}`, color: winner === 'TIE' ? GOLD : GREEN, fontSize: 12, letterSpacing: '0.12em'}}>
            {winner === 'TIE' ? '🤝 TIE — LIGHTNING ROUND' : `🏆 ${winner.toUpperCase()} WINS`}
          </div>
        )}
      </div>

      {/* Category row */}
      <div style={{background: NAVY_DARK, padding: '8px 24px', borderBottom: '1px solid rgba(168,197,232,0.04)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0}}>
        <span className="tra-mono" style={{fontSize: 9, letterSpacing: '0.22em', color: 'rgba(168,197,232,0.5)', flexShrink: 0}}>CATEGORY:</span>
        <div style={{flex: 1, minWidth: 0}}>
          <CategoryTabs categories={CATEGORIES} items={items} activeCat={activeCat} setActiveCat={setActiveCat} search={search} accent={LIGHT_BLUE} size="small" />
        </div>
      </div>

      {/* Search + controls */}
      <div style={{background: NAVY_DARK, padding: '8px 24px 10px', borderBottom: '1px solid rgba(168,197,232,0.08)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, flexWrap: 'wrap'}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Find an item to reveal…" />
        <div style={{flex: 1}} />
        <div className="tra-mono" style={{fontSize: 10, letterSpacing: '0.18em', color: 'rgba(168,197,232,0.6)', whiteSpace: 'nowrap'}}>
          REVEALED: <span style={{color: GOLD}}>{fullyRevealedItems.size} / {items.length}</span>
        </div>
        <button onClick={resetReveals} className="tra-mono" style={{padding: '5px 10px', background: 'transparent', border: '1px solid rgba(168,197,232,0.3)', color: 'rgba(168,197,232,0.7)', fontSize: 9, letterSpacing: '0.15em', cursor: 'pointer', whiteSpace: 'nowrap'}}>RESET REVEALS</button>
        <button onClick={revealAll} className="tra-mono" style={{padding: '5px 10px', background: 'rgba(201,182,131,0.15)', border: `1px solid ${GOLD}`, color: GOLD, fontSize: 9, letterSpacing: '0.15em', cursor: 'pointer', whiteSpace: 'nowrap'}}>REVEAL ALL</button>
      </div>

      {/* Item grid */}
      <div style={{padding: '16px 24px', background: NAVY_DEEP, minHeight: 0}}>
        {filterPipeline.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px 20px', color: 'rgba(168,197,232,0.5)'}} className="tra-body">
            <div className="tra-display" style={{fontSize: 22, color: OFF_WHITE, marginBottom: 8, letterSpacing: '0.04em'}}>NOTHING TO SHOW</div>
            <div style={{fontSize: 13, fontStyle: 'italic'}}>
              {search && `Nothing matches "${search}" in this view. `}
              {!search && filterMode === 'mismatch' && 'No mismatches yet — try revealing more items.'}
              {!search && filterMode === 'disagree' && 'The contestants agreed on every pick. Move along.'}
              {!search && filterMode === 'unrevealed' && 'Everything has been revealed. The reveal segment is over.'}
              {!search && filterMode === 'all' && 'No items in this category.'}
            </div>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10}}>
            {filterPipeline.map(item => {
              const phase1 = revealedItems.has(item.id);
              const phase2 = fullyRevealedItems.has(item.id);
              const treyIn = treyPackage.has(item.id);
              const p1In = p1.package.has(item.id);
              const p2In = p2.package.has(item.id);
              const p1Match = p1In === treyIn;
              const p2Match = p2In === treyIn;
              const isLastHost = lastRevealedId === item.id;
              const isLastFull = lastFullyRevealedId === item.id;

              const borderCol = phase2 ? 'rgba(201,182,131,0.5)' : phase1 ? GOLD : 'rgba(168,197,232,0.15)';

              return (
                <div key={item.id} onClick={() => revealItem(item.id)}
                  className={(isLastHost && phase1 && !phase2) || (isLastFull && phase2) ? 'reveal-card-anim' : ''}
                  style={{
                    padding: '10px 12px',
                    background: phase2 ? 'rgba(10,21,41,0.85)' : phase1 ? 'rgba(15,30,60,0.7)' : 'rgba(10,21,41,0.4)',
                    border: `1px solid ${borderCol}`,
                    borderLeft: `3px solid ${phase2 || phase1 ? GOLD : 'rgba(168,197,232,0.15)'}`,
                    cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none', position: 'relative',
                    boxShadow: phase1 && !phase2 ? '0 0 16px rgba(201,182,131,0.15), inset 0 1px 0 rgba(201,182,131,0.1)' : 'none',
                  }}>
                  {/* Item head */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
                    <div style={{flex: 1, paddingRight: 8}}>
                      <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.22em', color: GOLD, marginBottom: 3}}>{item.cat.toUpperCase()}</div>
                      <div className="tra-body" style={{fontSize: 12, fontWeight: 600, color: OFF_WHITE, lineHeight: 1.25}}>{item.name}</div>
                    </div>
                    <div className="tra-display" style={{fontSize: 13, color: LIGHT_BLUE, letterSpacing: '0.02em', whiteSpace: 'nowrap'}}>{fmt(item.cost)}</div>
                  </div>

                  {phase2 ? (
                    <div style={{marginTop: 8}}>
                      <div style={{textAlign: 'center', marginBottom: 6, padding: '4px 0'}}>
                        <span className="tra-mono" style={{fontSize: 8, letterSpacing: '0.22em', color: 'rgba(168,197,232,0.5)'}}>{hostName.toUpperCase()}: </span>
                        <span className="tra-display" style={{fontSize: 16, letterSpacing: '0.1em', color: GOLD, textShadow: '0 0 10px rgba(201,182,131,0.4)'}}>{treyIn ? 'IN' : 'OUT'}</span>
                      </div>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6}}>
                        <div className={isLastFull ? (p1Match ? 'match-anim' : 'mismatch-anim') : ''} style={{textAlign: 'center', padding: '6px 8px', background: p1Match ? 'rgba(61,169,122,0.12)' : 'rgba(196,77,77,0.12)', border: `1px solid ${p1Match ? GREEN + '50' : RED + '50'}`}}>
                          <div className="tra-mono" style={{fontSize: 7, letterSpacing: '0.18em', color: 'rgba(168,197,232,0.6)', marginBottom: 2}}>{p1.name.toUpperCase()}</div>
                          <div className="tra-display" style={{fontSize: 20, color: p1Match ? GREEN : RED}}>{p1Match ? '✓' : '✗'}</div>
                        </div>
                        <div className={isLastFull ? (p2Match ? 'match-anim' : 'mismatch-anim') : ''} style={{textAlign: 'center', padding: '6px 8px', background: p2Match ? 'rgba(61,169,122,0.12)' : 'rgba(196,77,77,0.12)', border: `1px solid ${p2Match ? GREEN + '50' : RED + '50'}`}}>
                          <div className="tra-mono" style={{fontSize: 7, letterSpacing: '0.18em', color: 'rgba(168,197,232,0.6)', marginBottom: 2}}>{p2.name.toUpperCase()}</div>
                          <div className="tra-display" style={{fontSize: 20, color: p2Match ? GREEN : RED}}>{p2Match ? '✓' : '✗'}</div>
                        </div>
                      </div>
                    </div>
                  ) : phase1 ? (
                    <div style={{marginTop: 8}}>
                      <div className={isLastHost ? 'badge-anim' : ''} style={{textAlign: 'center', padding: '14px 0 10px', background: 'linear-gradient(180deg, rgba(201,182,131,0.08) 0%, rgba(10,21,41,0.4) 100%)', border: '1px solid rgba(201,182,131,0.3)'}}>
                        <div className="tra-mono" style={{fontSize: 9, letterSpacing: '0.32em', color: GOLD, opacity: 0.8, marginBottom: 4}}>{hostName.toUpperCase()} SAYS</div>
                        <div className="tra-display" style={{fontSize: 36, letterSpacing: '0.15em', color: GOLD, textShadow: '0 0 20px rgba(201,182,131,0.5), 0 2px 6px rgba(0,0,0,0.5)', lineHeight: 1}}>{treyIn ? 'IN' : 'OUT'}</div>
                      </div>
                      <div className="tra-mono" style={{fontSize: 9, letterSpacing: '0.18em', color: 'rgba(168,197,232,0.5)', textAlign: 'center', padding: '6px 0 0'}}>CLICK FOR RESULTS</div>
                    </div>
                  ) : (
                    <div className="tra-mono" style={{fontSize: 10, letterSpacing: '0.18em', color: 'rgba(168,197,232,0.4)', textAlign: 'center', padding: '6px 0'}}>CLICK TO REVEAL</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ScorePanel({name, score, color, isWinner, isTie, flash, compact}) {
  const pad = compact ? '8px 16px' : (isWinner ? '34px 28px 20px' : '20px 28px');
  const nameFz = compact ? 18 : 30;
  const scoreFz = compact ? 34 : 64;
  const labelFz = compact ? 8 : 10;

  return (
    <div
      className={flash ? 'scoreboard-shake-anim' : ''}
      style={{
        padding: pad,
        background: isWinner
          ? `linear-gradient(135deg, rgba(61,169,122,0.18) 0%, rgba(10,21,41,0.9) 100%)`
          : `linear-gradient(135deg, ${color}10 0%, rgba(10,21,41,0.85) 60%, rgba(5,11,24,0.95) 100%)`,
        border: `1px solid ${isWinner ? GREEN : flash ? RED : color + '40'}`,
        borderLeft: `${compact ? 4 : 5}px solid ${isWinner ? GREEN : color}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.4s, background 0.4s, padding 0.3s',
        boxShadow: isWinner
          ? `0 0 40px rgba(61,169,122,0.3), inset 0 1px 0 rgba(61,169,122,0.2)`
          : `0 6px 24px rgba(0,0,0,0.4), inset 0 1px 0 ${color}25, inset 0 0 40px ${color}08`,
      }}
    >
      {/* Decorative corner glow */}
      <div style={{
        position: 'absolute', top: -20, left: -20, width: 80, height: 80,
        background: `radial-gradient(circle, ${color}25, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{position: 'relative', zIndex: 1}}>
        <div className="tra-mono" style={{fontSize: labelFz, letterSpacing: '0.32em', color: 'rgba(168,197,232,0.55)'}}>
          ◆ CONTESTANT
        </div>
        <div className="tra-display" style={{fontSize: nameFz, letterSpacing: '0.06em', color: OFF_WHITE, marginTop: compact ? 2 : 4, lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>
          {name.toUpperCase()}
        </div>
      </div>
      <div style={{textAlign: 'right', position: 'relative', zIndex: 1}}>
        <div className="tra-mono" style={{fontSize: labelFz, letterSpacing: '0.32em', color: 'rgba(168,197,232,0.55)'}}>SCORE</div>
        <div className="tra-display" style={{
          fontSize: scoreFz,
          letterSpacing: '0.02em',
          color,
          lineHeight: 1,
          marginTop: 2,
          textShadow: `0 0 ${compact ? 18 : 30}px ${color}50, 0 2px 8px rgba(0,0,0,0.5)`,
          fontWeight: 700,
        }}>
          <span key={score} className={flash ? 'score-tick-anim' : ''}>{score}</span>
        </div>
      </div>
      {isWinner && !isTie && !compact && (
        <div className="tra-display badge-anim" style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, color: GREEN, letterSpacing: '0.28em',
          padding: '4px 14px',
          background: 'rgba(61,169,122,0.2)',
          border: `1px solid ${GREEN}`,
          textShadow: `0 0 12px rgba(61,169,122,0.7)`,
          boxShadow: `0 0 20px rgba(61,169,122,0.3)`,
          zIndex: 2,
          whiteSpace: 'nowrap',
        }}>🏆 WINNER</div>
      )}
    </div>
  );
}

function CallBadge({label, on, match, accent, animate}) {
  // Trey's card (no match prop) → just shows his call
  // Player cards → shows call + match/mismatch styling
  const isPlayer = match !== undefined;
  const bg = isPlayer
    ? (match ? 'rgba(61,169,122,0.12)' : 'rgba(196,77,77,0.12)')
    : 'rgba(201,182,131,0.08)';
  const borderColor = isPlayer
    ? (match ? GREEN : RED)
    : accent;
  const callColor = isPlayer
    ? (match ? GREEN : RED)
    : (on ? accent : 'rgba(168,197,232,0.5)');

  // Pick animation class based on whether this player matched or not
  let animClass = '';
  if (animate) {
    if (isPlayer) animClass = match ? 'match-anim' : 'mismatch-anim';
    else animClass = 'badge-anim';
  }

  return (
    <div
      className={animClass}
      style={{
        padding: '5px 6px',
        background: bg,
        border: `1px solid ${borderColor}40`,
        textAlign: 'center',
      }}
    >
      <div className="tra-mono" style={{fontSize: 7, letterSpacing: '0.18em', color: 'rgba(168,197,232,0.7)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
        {label}
      </div>
      <div className="tra-display" style={{fontSize: 13, letterSpacing: '0.08em', color: callColor}}>
        {on ? 'IN' : 'OUT'}
        {isPlayer && (
          <span style={{marginLeft: 4, fontSize: 11}}>{match ? '✓' : '✗'}</span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EPISODE SETTINGS PANEL — edit property + contestants on the fly
// ============================================================
function EpisodeSettings({property, setProperty, hostName, setHostName, showTitle, setShowTitle, p1Name, setP1Name, p2Name, setP2Name, items, setItems, onClose}) {
  const update = (key, value) => setProperty({...property, [key]: value});
  const updateNum = (key, value) => {
    if (value === '') { setProperty({...property, [key]: ''}); return; }
    const n = parseInt(value.toString().replace(/[^0-9]/g, ''), 10);
    if (!isNaN(n)) setProperty({...property, [key]: n});
  };

  // Menu editor state
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuFilter, setMenuFilter] = useState('all');

  const updateItem = (id, field, value) => {
    setItems(items.map(it => it.id === id ? {...it, [field]: value} : it));
  };
  const updateItemCost = (id, value) => {
    if (value === '') { updateItem(id, 'cost', ''); return; }
    const n = parseInt(value.toString().replace(/[^0-9]/g, ''), 10);
    if (!isNaN(n)) updateItem(id, 'cost', n);
  };
  const deleteItem = (id) => {
    const it = items.find(i => i.id === id);
    if (!confirm(`Delete "${it?.name}"? It will be removed from any sealed packages too.`)) return;
    setItems(items.filter(i => i.id !== id));
  };
  const addItem = () => {
    const newId = `custom-${Date.now()}`;
    setItems([...items, {
      id: newId,
      name: 'New upgrade',
      cost: 50000,
      unit: 'flat',
      cat: menuFilter === 'all' ? 'interior' : menuFilter,
    }]);
  };
  const restoreDefaults = () => {
    if (!confirm('Restore the default menu? Any custom items or edits will be lost.')) return;
    setItems(DEFAULT_ITEMS);
  };

  const filteredMenu = menuFilter === 'all' ? items : items.filter(i => i.cat === menuFilter);
  const totalMenuCost = items.reduce((sum, i) => sum + (i.cost || 0), 0);

  return (
    <div style={{
      background: NAVY_DEEP,
      borderBottom: '1px solid rgba(168,197,232,0.2)',
      padding: '18px 24px',
      flexShrink: 0,
      maxHeight: '70vh',
      overflowY: 'auto',
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
        <div>
          <div className="tra-mono" style={{fontSize: 9, letterSpacing: '0.25em', color: GOLD}}>EPISODE SETTINGS</div>
          <div className="tra-display" style={{fontSize: 18, letterSpacing: '0.04em', color: OFF_WHITE, marginTop: 2}}>
            CONFIGURE TONIGHT'S PROPERTY
          </div>
        </div>
        <button
          onClick={onClose}
          className="tra-mono"
          style={{
            padding: '6px 14px', background: 'transparent',
            border: '1px solid rgba(168,197,232,0.3)',
            color: 'rgba(168,197,232,0.8)',
            fontSize: 10, letterSpacing: '0.15em', cursor: 'pointer',
          }}
        >
          DONE ✓
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12}}>
        <SettingField label="SHOW TITLE" value={showTitle} onChange={setShowTitle} placeholder="Survivor: The CapEx Budget" accent={GOLD} />
        <SettingField label="PROPERTY NAME" value={property.name} onChange={(v) => update('name', v)} placeholder="Morgan Bay" />
        <SettingField label="SUBMARKET" value={property.submarket} onChange={(v) => update('submarket', v)} placeholder="Champions East" />
        <SettingField label="UNITS" value={property.units} onChange={(v) => updateNum('units', v)} placeholder="268" type="number" />
        <SettingField label="YEAR BUILT" value={property.yearBuilt} onChange={(v) => updateNum('yearBuilt', v)} placeholder="1983" type="number" />
        <SettingField label="IN-PLACE RENT" value={property.inPlaceRent} onChange={(v) => update('inPlaceRent', v)} placeholder="$963" />
        <SettingField label="OCCUPANCY" value={property.occupancy} onChange={(v) => update('occupancy', v)} placeholder="94%" />
        <SettingField label="BUDGET ($)" value={property.budget} onChange={(v) => updateNum('budget', v)} placeholder="1600000" type="number" highlight />
        <SettingField label="HOST NAME" value={hostName} onChange={setHostName} placeholder="Trey" accent={GOLD} />
        <SettingField label="CONTESTANT 1 NAME" value={p1Name} onChange={setP1Name} placeholder="Contestant 1" accent="#7FB5E8" />
        <SettingField label="CONTESTANT 2 NAME" value={p2Name} onChange={setP2Name} placeholder="Contestant 2" accent="#E8A87F" />
      </div>

      {/* Menu editor toggle */}
      <div style={{marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(168,197,232,0.15)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div className="tra-mono" style={{fontSize: 9, letterSpacing: '0.25em', color: GOLD}}>UPGRADE MENU</div>
            <div className="tra-body" style={{fontSize: 12, color: 'rgba(168,197,232,0.7)', marginTop: 2}}>
              {items.length} items · total menu value <span style={{color: LIGHT_BLUE}}>${(totalMenuCost/1000000).toFixed(2)}M</span> (~{(totalMenuCost / property.budget).toFixed(1)}× budget)
            </div>
          </div>
          <div style={{display: 'flex', gap: 8}}>
            <button
              onClick={restoreDefaults}
              className="tra-mono"
              style={{padding: '6px 12px', background: 'transparent', border: '1px solid rgba(168,197,232,0.3)', color: 'rgba(168,197,232,0.7)', fontSize: 9, letterSpacing: '0.15em', cursor: 'pointer'}}
            >
              RESTORE DEFAULTS
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="tra-mono"
              style={{
                padding: '6px 12px',
                background: menuOpen ? LIGHT_BLUE : 'transparent',
                border: `1px solid ${menuOpen ? LIGHT_BLUE : 'rgba(168,197,232,0.4)'}`,
                color: menuOpen ? NAVY : LIGHT_BLUE,
                fontSize: 9, letterSpacing: '0.15em', cursor: 'pointer',
              }}
            >
              {menuOpen ? 'COLLAPSE' : 'EDIT MENU'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{marginTop: 14}}>
            {/* Filter + add */}
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap'}}>
              <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setMenuFilter(c.id)}
                    className="tra-display"
                    style={{
                      padding: '5px 10px', fontSize: 10, letterSpacing: '0.15em',
                      border: `1px solid ${menuFilter === c.id ? LIGHT_BLUE : 'rgba(168,197,232,0.2)'}`,
                      background: menuFilter === c.id ? LIGHT_BLUE : 'transparent',
                      color: menuFilter === c.id ? NAVY : LIGHT_BLUE,
                      cursor: 'pointer',
                    }}
                  >
                    {c.label} ({c.id === 'all' ? items.length : items.filter(i => i.cat === c.id).length})
                  </button>
                ))}
              </div>
              <div style={{flex: 1}} />
              <button
                onClick={addItem}
                className="tra-display"
                style={{padding: '6px 14px', background: GOLD, color: NAVY, border: 'none', fontSize: 11, letterSpacing: '0.12em', cursor: 'pointer'}}
              >
                + ADD ITEM
              </button>
            </div>

            {/* Header row */}
            <div style={{display: 'grid', gridTemplateColumns: '2.5fr 1fr 0.9fr 1fr 36px', gap: 8, padding: '6px 8px', alignItems: 'center'}}>
              <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.22em', color: 'rgba(168,197,232,0.5)'}}>NAME</div>
              <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.22em', color: 'rgba(168,197,232,0.5)'}}>COST ($)</div>
              <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.22em', color: 'rgba(168,197,232,0.5)'}}>UNIT</div>
              <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.22em', color: 'rgba(168,197,232,0.5)'}}>CATEGORY</div>
              <div></div>
            </div>

            {/* Editable rows */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
              {filteredMenu.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 1fr 0.9fr 1fr 36px',
                    gap: 8,
                    padding: '6px 8px',
                    background: 'rgba(168,197,232,0.04)',
                    borderLeft: `3px solid ${item.id.startsWith('custom-') ? GOLD : 'rgba(168,197,232,0.3)'}`,
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="tra-body"
                    style={editInputStyle()}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={item.cost ?? ''}
                    onChange={(e) => updateItemCost(item.id, e.target.value)}
                    className="tra-mono"
                    style={editInputStyle()}
                  />
                  <input
                    type="text"
                    value={item.unit ?? ''}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                    placeholder="flat"
                    className="tra-mono"
                    style={editInputStyle({fontSize: 11})}
                  />
                  <select
                    value={item.cat}
                    onChange={(e) => updateItem(item.id, 'cat', e.target.value)}
                    className="tra-mono"
                    style={{...editInputStyle(), cursor: 'pointer', appearance: 'none', paddingRight: 16}}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id} style={{background: NAVY_DARK}}>{c.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteItem(item.id)}
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: '1px solid rgba(196,77,77,0.4)',
                      color: RED,
                      fontSize: 14,
                      lineHeight: 1,
                      cursor: 'pointer',
                    }}
                    title="Delete this item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {filteredMenu.length === 0 && (
              <div className="tra-body" style={{padding: '20px', textAlign: 'center', color: 'rgba(168,197,232,0.5)', fontStyle: 'italic'}}>
                No items in this category. Click + ADD ITEM to create one.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="tra-body" style={{fontSize: 11, color: 'rgba(168,197,232,0.55)', marginTop: 14, fontStyle: 'italic', lineHeight: 1.5}}>
        Changes apply instantly across all three modes. Editing or deleting items mid-game updates
        existing packages — players may need to unseal and adjust if budgets shift.
      </div>
    </div>
  );
}

function editInputStyle(overrides = {}) {
  return {
    width: '100%',
    background: 'rgba(168,197,232,0.06)',
    border: '1px solid rgba(168,197,232,0.2)',
    color: OFF_WHITE,
    padding: '5px 8px',
    fontSize: 12,
    outline: 'none',
    ...overrides,
  };
}

function SettingField({label, value, onChange, placeholder, type = 'text', highlight = false, accent = null}) {
  return (
    <div>
      <div className="tra-mono" style={{fontSize: 8, letterSpacing: '0.22em', color: accent || 'rgba(168,197,232,0.6)', marginBottom: 4}}>
        {label}
      </div>
      <input
        type="text"
        inputMode={type === 'number' ? 'numeric' : 'text'}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="tra-body"
        style={{
          width: '100%',
          background: 'rgba(168,197,232,0.08)',
          border: `1px solid ${highlight ? GOLD : accent || 'rgba(168,197,232,0.25)'}`,
          borderLeft: `3px solid ${highlight ? GOLD : accent || 'rgba(168,197,232,0.25)'}`,
          color: OFF_WHITE,
          padding: '8px 10px',
          fontSize: 13,
          fontWeight: 600,
          outline: 'none',
        }}
      />
    </div>
  );
}
