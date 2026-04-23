import { createContext, useContext, useState, ReactNode } from "react";
import { PeerLabelType } from "./peerData";

interface PeerVisibilityValue {
  visible: Record<PeerLabelType, boolean>;
  toggle: (type: PeerLabelType) => void;
}

const defaultVisible: Record<PeerLabelType, boolean> = {
  team_project: true,
  shared_course: true,
  book_club: true,
  shared_location: false,
  previously_interacted: true,
};

const PeerVisibilityContext = createContext<PeerVisibilityValue | null>(null);

export function PeerVisibilityProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(defaultVisible);
  const toggle = (type: PeerLabelType) =>
    setVisible((v) => ({ ...v, [type]: !v[type] }));
  return (
    <PeerVisibilityContext.Provider value={{ visible, toggle }}>
      {children}
    </PeerVisibilityContext.Provider>
  );
}

export function usePeerVisibility() {
  const ctx = useContext(PeerVisibilityContext);
  if (!ctx) throw new Error("usePeerVisibility must be used inside PeerVisibilityProvider");
  return ctx;
}
