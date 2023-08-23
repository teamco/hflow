import React, { useState } from 'react';

export const ConfirmContext = React.createContext(null);

const ConfirmContextProvider = ({ children }) => {
  const [resolve, setResolve] = useState(false);

  return (
      <ConfirmContext.Provider value={{
        resolve,
        setResolve
      }}>
        {children}
      </ConfirmContext.Provider>
  );
};

export default ConfirmContextProvider;
