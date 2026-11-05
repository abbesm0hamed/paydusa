"use client";

import React, { createContext, useContext } from "react";

interface ModalContextValue {
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

interface ModalProviderProps {
  children?: React.ReactNode;
  close: () => void;
}

export const ModalProvider = ({ children, close }: ModalProviderProps) => (
  <ModalContext.Provider
    value={{
      close,
    }}
  >
    {children}
  </ModalContext.Provider>
);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === null) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
