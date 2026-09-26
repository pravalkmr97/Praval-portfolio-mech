import { useEffect, useState } from 'react';

interface CountUpProps {
  value: string | number;
  duration?: number; // duration in milliseconds
}

export default function CountUp({ value, duration = 1500 }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    const valStr = String(value);
    // Parse the value into prefix, numeric part, and suffix using regex
    // This matches: 
    // Group 1: any non-digit/non-negative prefix (like "$")
    // Group 2: the number itself (supporting negative sign, decimal point)
    // Group 3: any non-digit suffix (like "°C", "KW", "%", "+", "m")
    const match = valStr.match(/^([^\d\-.]*)([\-+]?\d+(?:\.\d+)?)([^\d]*)$/);

    if (!match) {
      setDisplayValue(valStr);
      return;
    }

    const prefix = match[1];
    const targetNum = parseFloat(match[2]);
    const suffix = match[3];

    if (isNaN(targetNum)) {
      setDisplayValue(valStr);
      return;
    }

    const startTime = performance.now();
    const isDecimal = match[2].includes('.');
    const decimalPlaces = isDecimal ? match[2].split('.')[1].length : 0;

    let animationFrameId: number;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = targetNum * easedProgress;

      // Format currentVal with exact decimal places as target number
      const formattedNum = currentVal.toFixed(decimalPlaces);
      
      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(valStr); // Ensure perfect precision at the end
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return <span>{displayValue}</span>;
}
