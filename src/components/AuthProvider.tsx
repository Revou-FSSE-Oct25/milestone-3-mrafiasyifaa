"use client";

import { useEffect } from "react";
import useStore, { getSessionFromCookie } from "@/store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, user } = useStore();

  useEffect(() => {
    if (!user) {
      const sessionUser = getSessionFromCookie();
      if (sessionUser) {
        setUser(sessionUser);
      }
    }
  }, []);

  return <>{children}</>;
}
