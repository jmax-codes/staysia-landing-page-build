"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283B73] via-[#1e2d5a] to-[#283B73] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FFB400] flex items-center justify-center">
            <span className="font-bold text-2xl text-white">S</span>
          </div>
          <span className="text-3xl font-bold text-white">Staysia</span>
        </Link>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-md font-semibold transition-all ${
                mode === "login"
                  ? "bg-white text-[#283B73] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-md font-semibold transition-all ${
                mode === "register"
                  ? "bg-white text-[#283B73] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {mode === "login" ? (
            <LoginForm onSwitchToRegister={() => setMode("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode("login")} />
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
