// LockContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const LockContext = createContext();

export const LockProvider = ({ children }) => {
  const [lockedStates, setLockedStates] = useState({});

  return (
    <LockContext.Provider value={{ lockedStates, setLockedStates }}>
      {children}
    </LockContext.Provider>
  );
};

export const useLockContext = () => useContext(LockContext);
