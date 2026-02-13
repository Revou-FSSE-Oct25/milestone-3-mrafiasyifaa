"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubText } from "@/components/ui/text";
import { users } from "@/src/config/users";
import useStore from "@/store";
import Container from "@/components/Container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

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

      // Handle redirect setelah login (ambil dari query param redirect)
      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-lightColor flex items-center justify-center py-12 px-4">
      <Container>
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-revoshop-accent mb-6 hoverEffect"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <Card className="w-full">
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

                <div className="space-y-1 pt-4 border-t">
                  <SubText className="text-xs text-center text-muted-foreground font-semibold">
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
      </Container>
    </div>
  );
}
