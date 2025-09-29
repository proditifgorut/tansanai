import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BuilderContextType {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [code, setCode] = useState(`// Welcome to Tansan AI dev
// Your generated code will appear here.`);
  const [language, setLanguage] = useState('typescript');

  return (
    <BuilderContext.Provider value={{ code, setCode, language, setLanguage }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
