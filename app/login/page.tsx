"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectusService } from "@/lib/directus";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loginData, setLoginData] = useState({
    email: "baolq@lightmark.com",
    password: "asdasd",
  });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", loginData);
    try {
      await DirectusService.login(loginData.email, loginData.password);
      const currentUser = await DirectusService.getCurrentUser();
      console.log("Current User:", currentUser);
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
      return;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    console.log("e :>> ", e);
    e.preventDefault();
    // Handle register logic here
    console.log("Register:", registerData);
    await DirectusService.register(registerData.email, registerData.password);
    setActiveTab("login"); // Switch to login tab after registration
    // handleLogin(e);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://unsplash.com/photos/LJh9ayGO8t8/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzUxODE4MzUzfA&force=true&w=1920')`,
        backgroundImage: `linear-gradient(#fcba0333, #4991de33), url('/auth-layout-bg.jpg')`,
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="ml-2 text-xl font-bold">Lightmark</span>
          </div>
          <CardDescription>
            {/* Take note whatever stirs your soul — a color that lifts your
            spirits, sunlight slipping through a crack in the door, or the
            fleeting hue of a drifting puff of smoke. */}
            Let your soul be stirred by what others walk past. <br />
            Write it down, draw it, hold it. Even the briefest hue of drifting
            smoke can become a memory — not of what happened, but of what
            mattered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Built for photographers, by Bao LE.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
