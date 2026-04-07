"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { useNotification } from "../components/Notification";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        showNotification(result.error, "error");
      } else {
        showNotification("Logged in successfully!", "success");
        router.push("/");
      }
    } catch (error) {
      showNotification("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-md shadow-2xl border border-base-200 ring-1 ring-base-200/50 overflow-hidden transform transition-all hover:scale-[1.01]">
        <div className="card-body p-8">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-base-content/60 font-medium">
              Ready to explore more reels? Let's get you in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control group">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">
                  Email Address
                </span>
              </label>
              <div className="relative group-focus-within:scale-[1.02] transition-transform">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-11 bg-base-200/30 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl"
                  required
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="form-control group">
              <div className="flex justify-between items-center mb-1">
                <label className="label p-0">
                   <span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">
                    Password
                  </span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group-focus-within:scale-[1.02] transition-transform">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-11 bg-base-200/30 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full shadow-lg shadow-primary/20 font-bold tracking-wide transition-all active:scale-95 rounded-xl h-14 ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Log In to ReelsPro"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-base-200 text-center">
            <p className="text-base-content/60">
              New to ReelsPro?{" "}
              <Link 
                href="/register" 
                className="text-primary font-bold hover:underline transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
