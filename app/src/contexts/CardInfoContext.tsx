'use client'
import React, { createContext, useState, ReactNode } from "react";

interface CardModal {
  id: string;
  companyId: string;
  companyLogo: string;
  position: string;
  jobDescription: string;
  location: string;
  time: string;
  salary: string;
  availablePositions: number;
  totalEmployees: number;
  duration: string;
  gender: string;
  jobResponsibilities: string[];
  startDate: string;
  endDate: string;
}

interface CardContextProp {
  children: ReactNode;
}

interface ContextProps {
  CardInfo: CardModal[];
  setCardInfo: React.Dispatch<React.SetStateAction<CardModal[]>>;
}

export const MyContext = createContext<ContextProps>({
  CardInfo: [], // Initial state should match CardModal[]
  setCardInfo: () => {},
});

const CardContext: React.FC<CardContextProp> = ({ children }) => {
  const [CardInfo, setCardInfo] = useState<CardModal[]>([]); // Initialize with an empty array of CardModal

  const Contextvalue = {
    CardInfo,
    setCardInfo,
  };

  return (
    <MyContext.Provider value={Contextvalue}>{children}</MyContext.Provider>
  );
};

export default CardContext;