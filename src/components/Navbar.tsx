"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import type { User } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const onLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
  };

  const user = session?.user as User & { username?: string };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          Secretive
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-300">
                Welcome, {user.username ?? user.name ?? user.email}
              </span>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={onLogout}
                className="bg-slate-100 text-black hover:bg-slate-200"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  className="bg-slate-100 text-black hover:bg-slate-200"
                  variant="outline"
                >
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  variant="default"
                >
                  Signup
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col items-center gap-3 p-4">
            {session ? (
              <>
                <span className="text-sm text-gray-300 text-center">
                  Welcome, {user.username ?? user.name ?? user.email}
                </span>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-slate-100 text-black hover:bg-slate-200"
                  variant="outline"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-slate-100 text-black hover:bg-slate-200" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" variant="default">
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
