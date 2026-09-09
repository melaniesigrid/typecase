// A "look": one pairing composed as a small designed piece in its own palette.
// Layouts are deliberately few. The type does the work.
import { byFace } from '../lib/fonts.js';
import { Sample } from './ui.jsx';

// `look.tweak[role]` holds inline style overrides for faces whose proportions need help
// (a very condensed display face, a script with a low x-height).
function F({ role, look, text, className, style, as }) {
  const face = byFace[look.faces[role]];
  if (!face) return null;
  return <Sample face={face} text={text} className={className} style={{ ...style, ...look.tweak?.[role] }} as={as} />;
}

export default function Look({ look, size = 'wide', interactive = true, onOpen }) {
  const { palette, copy, layout } = look;
  const vars = { '--lk-paper': palette.paper, '--lk-ink': palette.ink, '--lk-accent': palette.accent };
  const Tag = interactive ? 'button' : 'div';
  return (
    <Tag type={interactive ? 'button' : undefined} className={`look look-${layout} look-${size}`} style={vars}
      onClick={interactive ? () => onOpen?.(look) : undefined} aria-label={interactive ? `Open look ${look.title}` : undefined}>
      {layout === 'poster' && (
        <>
          <span className="lk-kicker">{copy.kicker}</span>
          <F role="display" look={look} text={copy.headline} className="lk-head" />
          {copy.accent && <F role="accent" look={look} text={copy.accent} className="lk-accent" />}
          <F role="body" look={look} text={copy.body} className="lk-body" as="p" />
        </>
      )}
      {layout === 'editorial' && (
        <>
          <span className="lk-kicker">{copy.kicker}</span>
          <F role="display" look={look} text={copy.headline} className="lk-head" />
          {copy.accent && <F role="accent" look={look} text={copy.accent} className="lk-deck" />}
          <div className="lk-cols">
            <F role="body" look={look} text={copy.body} className="lk-body" as="p" />
            <F role="body" look={look} text={copy.body2 || copy.body} className="lk-body" as="p" />
          </div>
        </>
      )}
      {layout === 'card' && (
        <>
          {copy.accent && <F role="accent" look={look} text={copy.accent} className="lk-accent" />}
          <F role="display" look={look} text={copy.headline} className="lk-head" />
          <span className="lk-rule" />
          <F role="body" look={look} text={copy.body} className="lk-body" as="p" />
          <span className="lk-kicker">{copy.kicker}</span>
        </>
      )}
      {layout === 'label' && (
        <div className="lk-frame">
          <span className="lk-kicker">{copy.kicker}</span>
          <F role="display" look={look} text={copy.headline} className="lk-head" />
          {copy.accent && <F role="accent" look={look} text={copy.accent} className="lk-accent" />}
          <span className="lk-rule" />
          <F role="body" look={look} text={copy.body} className="lk-body" as="p" />
        </div>
      )}
      {layout === 'split' && (
        <>
          <div className="lk-left">
            <F role="display" look={look} text={copy.headline} className="lk-head" />
          </div>
          <div className="lk-right">
            <span className="lk-kicker">{copy.kicker}</span>
            {copy.accent && <F role="accent" look={look} text={copy.accent} className="lk-accent" />}
            <F role="body" look={look} text={copy.body} className="lk-body" as="p" />
          </div>
        </>
      )}
      <span className="lk-tag mono">{look.title}</span>
    </Tag>
  );
}
