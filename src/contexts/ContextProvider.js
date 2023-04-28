import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const tempUrl = "https://p3l200710588api.itkitapro.com";
// export const tempUrl = "http://localhost:5000";

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);

  return (
    <StateContext.Provider
      value={{
        screenSize,
        setScreenSize
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
