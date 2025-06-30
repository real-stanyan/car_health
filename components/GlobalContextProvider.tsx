"use client";
import { createContext, useContext, useState } from "react";

type Car = { brand: string; model: string };

type GlobalContextType = {
  car: Car[];
  setCar: React.Dispatch<React.SetStateAction<Car[]>>;
};

const Context = createContext<GlobalContextType | null>(null);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [car, setCar] = useState<Car[]>([]);
  return (
    <Context.Provider value={{ car, setCar }}>{children}</Context.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within GlobalContextProvider"
    );
  }
  return context;
};
