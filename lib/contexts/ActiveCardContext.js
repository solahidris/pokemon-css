import { createContext, useContext, useState } from 'react';

const ActiveCardContext = createContext();

export function ActiveCardProvider({ children }) {
  const [activeCard, setActiveCard] = useState(undefined);

  return (
    <ActiveCardContext.Provider value={{ activeCard, setActiveCard }}>
      {children}
    </ActiveCardContext.Provider>
  );
}

export function useActiveCard() {
  const context = useContext(ActiveCardContext);
  if (context === undefined) {
    throw new Error('useActiveCard must be used within an ActiveCardProvider');
  }
  return context;
}

