import { useActiveCard } from '../lib/contexts/ActiveCardContext';
import { useRef, useEffect, useState } from 'react';

export default function Cards({ children }) {
  const { activeCard } = useActiveCard();
  const thisGrid = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (thisGrid.current && thisGrid.current.contains(activeCard)) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [activeCard]);

  return (
    <section className={`card-grid ${active ? 'active' : ''}`} ref={thisGrid}>
      {children}
    </section>
  );
}

