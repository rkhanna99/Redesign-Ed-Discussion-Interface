import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { CURRENT_USER } from "../data/threads";
import { peerProfiles, type PeerProfile } from "./peerData";

interface PeerProfilesValue {
  profiles: Record<string, PeerProfile>;
  updateProfile: (key: string, profile: PeerProfile) => void;
}

const STORAGE_KEY = "ed-discussion-peer-profiles";

const PeerProfilesContext = createContext<PeerProfilesValue | null>(null);

function loadProfiles() {
  if (typeof window === "undefined") return peerProfiles;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return peerProfiles;

    const parsed = JSON.parse(raw) as Record<string, PeerProfile>;
    const savedCurrentUser = parsed[CURRENT_USER];
    if (!savedCurrentUser) return peerProfiles;

    return {
      ...peerProfiles,
      [CURRENT_USER]: savedCurrentUser,
    };
  } catch {
    return peerProfiles;
  }
}

export function PeerProfilesProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, PeerProfile>>(() => loadProfiles());

  useEffect(() => {
    setProfiles((current) => ({
      ...peerProfiles,
      [CURRENT_USER]: current[CURRENT_USER] || peerProfiles[CURRENT_USER],
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        [CURRENT_USER]: profiles[CURRENT_USER],
      }),
    );
  }, [profiles]);

  const updateProfile = (key: string, profile: PeerProfile) => {
    setProfiles((current) => ({ ...current, [key]: profile }));
  };

  return (
    <PeerProfilesContext.Provider value={{ profiles, updateProfile }}>
      {children}
    </PeerProfilesContext.Provider>
  );
}

export function usePeerProfiles() {
  const ctx = useContext(PeerProfilesContext);
  if (!ctx) throw new Error("usePeerProfiles must be used inside PeerProfilesProvider");
  return ctx;
}
