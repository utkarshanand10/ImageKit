"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="navbar bg-base-100/70 backdrop-blur-lg border-b border-base-200 sticky top-0 z-50 px-4 lg:px-8">
      <div className="flex-1">
        <Link
          href="/"
          className="group flex items-center gap-3 hover:opacity-80 transition-all"
          prefetch={true}
        >
          <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
            <Home className="w-6 h-6 text-primary-content" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-base-content to-base-content/60 bg-clip-text text-transparent">
            ReelsPro
          </span>
        </Link>
      </div>

      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar placeholder border-2 border-primary/20 hover:border-primary transition-all duration-300"
          >
            <div className="bg-primary/10 text-primary rounded-full w-10 flex items-center justify-center">
              {session ? (
                <span className="text-sm font-black uppercase">
                  {session.user?.email?.[0]}
                </span>
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100/90 backdrop-blur-xl rounded-2xl w-64 mt-4 border border-base-200 ring-1 ring-black/5"
          >
            {session ? (
              <>
                <li className="menu-title px-4 py-3">
                  <span className="text-xs uppercase tracking-widest font-black opacity-40">
                    Account Info
                  </span>
                  <div className="text-sm font-semibold mt-1 truncate">
                    {session.user?.email}
                  </div>
                </li>
                <div className="divider my-0 opacity-50"></div>
                <li>
                  <Link
                    href="/upload"
                    className="flex items-center gap-3 py-3 px-4 hover:bg-primary hover:text-primary-content transition-all rounded-xl m-1"
                  >
                    Video Upload
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 py-3 px-4 text-error hover:bg-error/10 transition-all rounded-xl m-1"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 py-3 px-4 hover:bg-primary/10 text-primary font-bold transition-all rounded-xl m-1"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 py-3 px-4 bg-primary text-primary-content font-bold hover:bg-primary/90 transition-all rounded-xl m-1"
                  >
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
