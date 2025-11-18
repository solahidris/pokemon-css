import { useState, useEffect, useRef } from 'react';

export function useSpring(initialValue, settings = { stiffness: 0.066, damping: 0.25 }) {
  const [value, setValue] = useState(initialValue);
  const [targetValue, setTargetValue] = useState(initialValue);
  const [velocity, setVelocity] = useState(
    typeof initialValue === 'object' 
      ? Object.keys(initialValue).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
      : 0
  );
  const settingsRef = useRef(settings);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const animate = () => {
      const { stiffness, damping } = settingsRef.current;
      
      if (typeof value === 'object') {
        let hasChanged = false;
        const newValue = {};
        const newVelocity = {};
        
        Object.keys(value).forEach(key => {
          const diff = targetValue[key] - value[key];
          if (Math.abs(diff) > 0.001 || Math.abs(velocity[key]) > 0.001) {
            hasChanged = true;
            newVelocity[key] = velocity[key] + diff * stiffness;
            newVelocity[key] *= 1 - damping;
            newValue[key] = value[key] + newVelocity[key];
          } else {
            newValue[key] = targetValue[key];
            newVelocity[key] = 0;
          }
        });
        
        if (hasChanged) {
          setValue(newValue);
          setVelocity(newVelocity);
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      } else {
        const diff = targetValue - value;
        if (Math.abs(diff) > 0.001 || Math.abs(velocity) > 0.001) {
          const newVelocity = velocity + diff * stiffness;
          const dampedVelocity = newVelocity * (1 - damping);
          setValue(value + dampedVelocity);
          setVelocity(dampedVelocity);
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, targetValue, velocity]);

  const set = (newTargetValue, options = {}) => {
    if (options.hard) {
      setValue(newTargetValue);
      setTargetValue(newTargetValue);
      setVelocity(
        typeof newTargetValue === 'object'
          ? Object.keys(newTargetValue).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
          : 0
      );
    } else {
      setTargetValue(newTargetValue);
    }
  };

  return [value, set, settingsRef];
}

