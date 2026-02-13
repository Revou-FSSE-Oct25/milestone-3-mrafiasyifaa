"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SubText } from "./ui/text";
import { X } from "lucide-react";
import { users } from "@/src/config/users";
import useStore from "@/store";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!isOpen) {
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi email & password dengan data dari src/config/users.ts
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Panggil setUser() setelah login berhasil
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      });
      
      setEmail("");
      setPassword("");
      onClose();
      
      // Handle redirect setelah login (ambil dari query param redirect)
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    } else {
      setError("Invalid email or password");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <Card className="w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-revoshop-accent-hover hoverEffect"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <SubText className="text-muted-foreground">
            Enter your credentials to access your account
          </SubText>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-darkColor"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-darkColor"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {error && (
              <SubText className="text-red-600 text-sm">{error}</SubText>
            )}

            <Button
              type="submit"
              className="w-full bg-revoshop-accent hover:bg-revoshop-accent-hover"
            >
              Login
            </Button>

            <div className="space-y-1">
              <SubText className="text-xs text-center text-muted-foreground">
                Demo Accounts:
              </SubText>
              <SubText className="text-xs text-center text-muted-foreground">
                Customer: john@mail.com / changeme
              </SubText>
              <SubText className="text-xs text-center text-muted-foreground">
                Admin: admin@mail.com / admin123
              </SubText>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;