import { useEffect, useRef } from 'react';

const TILE_SIZE = 512;
const EXPORT_FILENAME = 'nav-hover-texture-tile-512.png';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function isEditableKeyTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = objectUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}

function inlineTokenColor(svgElement: SVGSVGElement, tokenName: string) {
  const tokenValue = window.getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();

  if (!tokenValue) {
    return;
  }

  svgElement.querySelectorAll(`[fill="var(${tokenName})"]`).forEach((element) => {
    element.setAttribute('fill', tokenValue);
  });
}

function exportSvgTexture(svgElement: SVGSVGElement) {
  const exportSvg = svgElement.cloneNode(true) as SVGSVGElement;

  inlineTokenColor(exportSvg, '--amber-core');
  inlineTokenColor(exportSvg, '--amber-base');
  inlineTokenColor(exportSvg, '--amber-dim');

  const serializedSvg = new XMLSerializer().serializeToString(exportSvg);
  const svgBlob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${serializedSvg}\n`], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const objectUrl = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;

    if (!context) {
      URL.revokeObjectURL(objectUrl);
      return;
    }

    context.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
    context.drawImage(image, 0, 0, TILE_SIZE, TILE_SIZE);
    URL.revokeObjectURL(objectUrl);

    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }

      downloadBlob(blob, EXPORT_FILENAME);
    }, 'image/png');
  };

  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
  };

  image.src = objectUrl;
}

export function HoverTextureExport() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== 'e' ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isEditableKeyTarget(event.target)
      ) {
        return;
      }

      const svgElement = svgRef.current;

      if (!svgElement) {
        return;
      }

      event.preventDefault();
      exportSvgTexture(svgElement);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <main className="grid h-full w-full place-items-center overflow-hidden">
      <svg
        ref={svgRef}
        xmlns={SVG_NAMESPACE}
        width={TILE_SIZE}
        height={TILE_SIZE}
        viewBox={`0 0 ${TILE_SIZE} ${TILE_SIZE}`}
        className="block h-[512px] w-[512px]"
        aria-hidden="true"
      >
        <defs>
          <pattern id="hover-scanline-tile" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="1" fill="var(--amber-base)" opacity="0.08" />
          </pattern>
          <pattern id="hover-column-tile" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="1" height="4" fill="var(--amber-core)" opacity="0.018" />
          </pattern>
          <pattern id="hover-dither-tile" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect x="2" y="3" width="1" height="1" fill="var(--amber-core)" opacity="0.022" />
            <rect x="11" y="5" width="1" height="1" fill="var(--amber-base)" opacity="0.018" />
            <rect x="6" y="10" width="1" height="1" fill="var(--amber-dim)" opacity="0.026" />
            <rect x="14" y="13" width="1" height="1" fill="var(--amber-base)" opacity="0.014" />
          </pattern>
        </defs>
        <rect width={TILE_SIZE} height={TILE_SIZE} fill="var(--amber-base)" opacity="0.095" />
        <rect width={TILE_SIZE} height={TILE_SIZE} fill="url(#hover-scanline-tile)" />
        <rect width={TILE_SIZE} height={TILE_SIZE} fill="url(#hover-column-tile)" />
        <rect width={TILE_SIZE} height={TILE_SIZE} fill="url(#hover-dither-tile)" />
      </svg>
    </main>
  );
}

export default HoverTextureExport;
