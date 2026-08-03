import logoSvg from '../../assets/images/Logo AI Amber Accurate.svg?raw';

const inlineLogoSvg = logoSvg
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace('<svg ', '<svg viewBox="0 0 441 450" preserveAspectRatio="xMidYMid meet" ')
  .replace(/<path[^>]*transform="translate\(173\.24412536621094,-0\.267425537109375\)"\/>\s*/g, '')
  .replace(/<path[^>]*transform="translate\((3|314),435\)"\/>\s*/g, '')
  .replace(/<path[^>]*transform="translate\((12|305),409\)"\/>\s*/g, '')
  .replace(/fill="#B29241"/g, 'fill="currentColor"');

type LogoMarkProps = {
  label: string;
  className?: string;
};

export function LogoMark({ label, className }: LogoMarkProps) {
  return (
    <span
      className={className}
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: inlineLogoSvg }}
    />
  );
}
