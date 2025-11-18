import { useState, useEffect } from 'react';

const getRawOrientation = function(e) {
  if (!e) {
    return { alpha: 0, beta: 0, gamma: 0 };
  } else {
    return { alpha: e.alpha, beta: e.beta, gamma: e.gamma };
  }
};

const getOrientationObject = (e, baseOrientation) => {
  const orientation = getRawOrientation(e);
  return {
    absolute: orientation,
    relative: {
      alpha: orientation.alpha - baseOrientation.alpha,
      beta: orientation.beta - baseOrientation.beta,
      gamma: orientation.gamma - baseOrientation.gamma,
    },
  };
};

export function useOrientation() {
  const [firstReading, setFirstReading] = useState(true);
  const [baseOrientation, setBaseOrientation] = useState(getRawOrientation());
  const [orientation, setOrientation] = useState(getOrientationObject(null, baseOrientation));

  const resetBaseOrientation = () => {
    setFirstReading(true);
    setBaseOrientation(getRawOrientation());
  };

  useEffect(() => {
    const handleOrientation = function(e) {
      if (firstReading) {
        setFirstReading(false);
        const newBase = getRawOrientation(e);
        setBaseOrientation(newBase);
        setOrientation(getOrientationObject(e, newBase));
      } else {
        setOrientation(getOrientationObject(e, baseOrientation));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return function stop() {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [firstReading, baseOrientation]);

  return { orientation, resetBaseOrientation };
}

