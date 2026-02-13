"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import NoAccess from "./NoAccess";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "customer")[];
  pageName?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  pageName = "this page",
}: ProtectedRouteProps) {
  const { user } = useStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-revoshop-accent"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login?redirect=" + window.location.pathname);
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <NoAccess
        details={`You need ${allowedRoles.join(" or ")} privileges to access ${pageName}.`}
      />
    );
  }

  return <>{children}</>;
}
