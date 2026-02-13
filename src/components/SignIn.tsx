"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore, { User } from "@/store";
import { LogOut, User as UserIcon } from "lucide-react";

interface SignInProps {
  serverUser: User | null;
}

function SignIn({ serverUser }: SignInProps) {
  const { user, logout, setUser } = useStore();
  const router = useRouter();

  // Sync server user with client state on mount
  useEffect(() => {
    if (serverUser && !user) {
      setUser(serverUser);
    }
  }, [serverUser, user, setUser]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // Use server user as source of truth, fallback to client state
  const currentUser = serverUser || user;

  if (currentUser) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-darkColor">
          <UserIcon className="w-4 h-4" />
          <span className="hidden md:inline">{currentUser.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold hover:text-revoshop-accent-hover text-darkColor hover:cursor-pointer hoverEffect flex items-center gap-1"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="text-sm font-semibold hover:text-revoshop-accent-hover text-darkColor hover:cursor-pointer hoverEffect"
    >
      Login
    </button>
  );
}

export default SignIn;
