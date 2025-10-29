import { createContext, useContext, useState } from "react";

import type { Dispatch, ReactNode } from "react";

export type ModeType = "light" | "dark";

type ModeContextType = {
  mode: ModeType;
  setMode?: Dispatch<React.SetStateAction<ModeType>>;
};

const ModeContext = createContext<ModeContextType>({
  mode: "light",
  setMode: undefined,
});

export default function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ModeType>("light");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
