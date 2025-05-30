import React, { createContext, useContext, useState } from 'react';

type FilterContextType = {
  spicinessLevel?: number;
  setSpicinessLevel: (val?: number) => void;
  originCountry: string;
  setOriginCountry: (val: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spicinessLevel, setSpicinessLevel] = useState<number | undefined>();
  const [originCountry, setOriginCountry] = useState("");

  return (
    <FilterContext.Provider value={{ spicinessLevel, setSpicinessLevel, originCountry, setOriginCountry }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
