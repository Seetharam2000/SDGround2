const CATEGORY_ICONS = {
  water: '💧',
  garbage: '🗑️',
  air: '💨',
  roads: '🛣️',
  health: '🏥',
};

const PRIORITY_STYLES = {
  Low:      { bg: '#14532d', text: '#86efac' },
  Medium:   { bg: '#713f12', text: '#fde68a' },
  High:     { bg: '#7c2d12', text: '#fdba74' },
  Critical: { bg: '#450a0a', text: '#fca5a5' },
};

function ScoreBar({ label, value, max = 35 }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value > 20 ? '#ef4444' : value > 10 ? '#f97316' : '#22c55e';
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: '#9ca3af', fontSize: '13px' }}>{label}</span>
        <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{value}</span>
      </div>
      <div style={{ background: '#374151', borderRadius: '999px', height: '8px' }}>
        <div style={{
          width: `${pct}%`,
          background: color,
          height: '100%',
          borderRadius: '999px',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

export default function WardSidebar({ ward, onClose }) {
  const ps = PRIORITY_STYLES[ward.priority] || PRIORITY_STYLES.Medium;

  return (
    <div style={{
      width: '340px',
      background: '#111827',
      borderLeft: '1px solid #1f2937',
      overflowY: 'auto',
      padding: '24px',
      color: '#fff',
      fontFamily: 'sans-serif',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>{ward.name}</h2>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '13px' }}>
            SDG Score: <span style={{ color: '#fff', fontWeight: 'bold' }}>{ward.sdgScore}/100</span>
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#374151',
            border: 'none',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >✕</button>
      </div>

      {/* Priority badge */}
      <div style={{
        display: 'inline-block',
        background: ps.bg,
        color: ps.text,
        padding: '4px 14px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '20px',
        letterSpacing: '0.05em',
      }}>
        {ward.priority.toUpperCase()}
      </div>

      {/* Score meter */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#9ca3af', fontSize: '13px' }}>Overall SDG Score</span>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>{ward.sdgScore}/100</span>
        </div>
        <div style={{ background: '#374151', borderRadius: '999px', height: '10px' }}>
          <div style={{
            width: `${ward.sdgScore}%`,
            background: ward.sdgScore >= 75 ? '#22c55e' : ward.sdgScore >= 50 ? '#f59e0b' : ward.sdgScore >= 30 ? '#f97316' : '#ef4444',
            height: '100%',
            borderRadius: '999px',
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* Complaint breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
          Complaints Breakdown
        </h3>
        {Object.entries(ward.complaints).map(([key, val]) => (
          <ScoreBar
            key={key}
            label={`${CATEGORY_ICONS[key] || ''} ${key.charAt(0).toUpperCase() + key.slice(1)}`}
            value={val}
          />
        ))}
      </div>

      {/* AI Summary */}
      <div style={{
        background: '#1e1b4b',
        border: '1px solid #4c1d95',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <div style={{ color: '#a78bfa', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          🤖 AI Report
        </div>
        <p style={{ margin: 0, color: '#e5e7eb', fontSize: '13px', lineHeight: '1.6' }}>
          {ward.aiSummary}
        </p>
      </div>

      {/* Suggested action */}
      {ward.suggestedAction && (
        <div style={{
          background: '#1c1917',
          border: '1px solid #78350f',
          borderRadius: '12px',
          padding: '14px',
        }}>
          <div style={{ color: '#fbbf24', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
            ⚡ Suggested Action
          </div>
          <p style={{ margin: 0, color: '#fde68a', fontSize: '13px', lineHeight: '1.5' }}>
            {ward.suggestedAction}
          </p>
        </div>
      )}
    </div>
  );
}
