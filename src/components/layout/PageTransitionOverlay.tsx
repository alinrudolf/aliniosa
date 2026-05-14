import { useEffect, useState, type CSSProperties } from 'react';

export type PageTransitionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PageTransitionState = {
  id: number;
  from: PageTransitionRect;
  to: PageTransitionRect;
};

type PageTransitionOverlayProps = {
  transition: PageTransitionState;
  onComplete: () => void;
};

const TRANSITION_DURATION_MS = 220;

function makeRectStyle(rect: PageTransitionRect): CSSProperties {
  return {
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
}

export function PageTransitionOverlay({ transition, onComplete }: PageTransitionOverlayProps) {
  const [rect, setRect] = useState(transition.from);

  useEffect(() => {
    setRect(transition.from);

    const animationFrame = window.requestAnimationFrame(() => {
      setRect(transition.to);
    });
    const timeoutId = window.setTimeout(onComplete, TRANSITION_DURATION_MS + 40);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeoutId);
    };
  }, [onComplete, transition]);

  return (
    <div className="page-transition-overlay" aria-hidden="true">
      <div className="page-transition-outline" style={makeRectStyle(rect)} />
    </div>
  );
}
