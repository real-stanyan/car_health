"use client";
import { createContext, useContext, useState } from "react";

type Car = { brand: string; model: string; year: string; id: string };

type GlobalContextType = {
  // car
  car: Car[];
  setCar: React.Dispatch<React.SetStateAction<Car[]>>;
  // currentCar
  currentCar: Car;
  setcurrentCar: React.Dispatch<React.SetStateAction<Car>>;
};

const Context = createContext<GlobalContextType | null>(null);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [car, setCar] = useState<Car[]>([]);
  const [currentCar, setcurrentCar] = useState<Car>({
    brand: "",
    model: "",
    year: "",
    id: "",
  });

  return (
    <Context.Provider value={{ car, setCar, currentCar, setcurrentCar }}>
      {children}
    </Context.Provider>
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
