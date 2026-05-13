import { useEffect, useRef, useState } from 'react';

const OVERLAY_CHARS = '[]/\\|_-=+0123456789';
const REST_LABEL = '[NAVIGATION]';
const FRAME_MS = 32;
const FRAME_COUNT = 9;

type TerminalTextSwapProps = {
  value: string;
};

function getOverlayChar(charIndex: number, frameIndex: number) {
  return OVERLAY_CHARS[(charIndex * 7 + frameIndex * 3) % OVERLAY_CHARS.length];
}

function getFrameText(value: string, frameIndex: number) {
  const resolvedCount = Math.max(0, Math.floor(((frameIndex - 1) / (FRAME_COUNT - 2)) * value.length));

  return Array.from(value, (char, charIndex) => {
    if (charIndex < resolvedCount || frameIndex >= FRAME_COUNT - 1) {
      return char;
    }

    return getOverlayChar(charIndex, frameIndex);
  }).join('');
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function TerminalTextSwap({ value }: TerminalTextSwapProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (previousValueRef.current === value) {
      return;
    }

    previousValueRef.current = value;

    if (prefersReducedMotion()) {
      setDisplayValue(value);
      setIsAnimating(false);

      return;
    }

    let frameIndex = 0;

    setIsAnimating(true);
    setDisplayValue(getFrameText(value, frameIndex));

    const intervalId = window.setInterval(() => {
      frameIndex += 1;

      if (frameIndex >= FRAME_COUNT) {
        window.clearInterval(intervalId);
        setDisplayValue(value);
        setIsAnimating(false);

        return;
      }

      setDisplayValue(getFrameText(value, frameIndex));
    }, FRAME_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [value]);

  return (
    <span className={`terminal-text-swap ${isAnimating ? 'terminal-text-swap-active' : ''}`} aria-label={value}>
      <span className="terminal-text-swap-sizer" aria-hidden="true">
        {REST_LABEL}
      </span>
      <span className="terminal-text-swap-output" aria-hidden="true">
        {displayValue}
      </span>
    </span>
  );
}
