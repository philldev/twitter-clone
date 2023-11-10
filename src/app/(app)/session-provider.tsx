"use client";

import { ReactNode, createContext, useContext } from "react";

const SessionContext = createContext<{
  user: {
    uid: string;
    username: string;
  };
} | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: {
    uid: string;
    username: string;
  };
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ user }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Session not provided");
  return session;
}
