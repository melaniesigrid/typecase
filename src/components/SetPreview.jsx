// Companion sets (duos and trios) previewed together on one card. Each face gets a role
// from its style name: scripts whisper, sans faces label, everything else headlines.
import { Sample } from './ui.jsx';

export function roleOf(face) {
  if (/script|signature|hand/i.test(face.style)) return 'script';
  if (/sans|grotesk|straight/i.test(face.style)) return 'sans';
  return 'headline';
}

export default function SetPreview({ fam, text, size = 'wide' }) {
  const t = (text || '').trim();
  const headline = fam.faces.find(f => roleOf(f) === 'headline') || fam.faces[0];
  const script = fam.faces.find(f => roleOf(f) === 'script');
  const sans = fam.faces.find(f => roleOf(f) === 'sans');
  const others = fam.faces.filter(f => ![headline, script, sans].includes(f));
  return (
    <div className={`setp setp-${size}`}>
      {script && <Sample face={script} text={t ? t : (fam.setCopy?.script || 'with love and')} className="setp-script" />}
      <Sample face={headline} text={t || fam.setCopy?.headline || fam.name} className="setp-head" />
      {sans && <Sample face={sans} text={t || fam.setCopy?.sans || `${fam.designer || 'Companion set'} · ${fam.faces.length} faces`} className="setp-sans" />}
      {others.map(f => <Sample key={f.id} face={f} text={t || fam.sample || fam.name} className="setp-other" />)}
      <span className="setp-legend mono">
        {fam.faces.map(f => <span key={f.id}><i /> {f.style}</span>)}
      </span>
    </div>
  );
}
