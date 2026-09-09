// Small UI primitives shared by every view.
import { segments, ff } from '../lib/fonts.js';

export function cx(...a) { return a.filter(Boolean).join(' '); }

// Text set in a library face. Characters the cut does not contain are shown in the UI
// font with a dotted mark instead of a tofu box.
export function Sample({ face, text, style, className, as: Tag = 'div', ...rest }) {
  const segs = segments(face, text);
  return (
    <Tag className={cx('sample', className)} style={{ fontFamily: ff(face), ...style }} {...rest}>
      {segs.map((s, i) => (s.missing
        ? <span key={i} className="miss" title="Not in this cut">{s.text}</span>
        : <span key={i}>{s.text}</span>))}
    </Tag>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}{hint && <em>{hint}</em>}</span>
      {children}
    </label>
  );
}

export function Range({ value, onChange, min, max, step = 1, unit = '' }) {
  return (
    <span className="range">
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} />
      <output>{typeof value === 'number' && step < 1 ? value.toFixed(2) : value}{unit}</output>
    </span>
  );
}

export function Seg({ value, onChange, options }) {
  return (
    <span className="seg" role="radiogroup">
      {options.map(o => {
        const [v, l] = Array.isArray(o) ? o : [o, o];
        return (
          <button key={v} type="button" role="radio" aria-checked={value === v}
            className={cx('seg-btn', value === v && 'on')} onClick={() => onChange(v)}>{l}</button>
        );
      })}
    </span>
  );
}

export function Badge({ children, tone }) {
  return <span className={cx('badge', tone && `badge-${tone}`)}>{children}</span>;
}

export function Kv({ k, v, mono = true }) {
  return (
    <div className="kv">
      <dt>{k}</dt>
      <dd className={mono ? 'mono' : undefined}>{v}</dd>
    </div>
  );
}
