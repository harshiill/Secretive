"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import type { User } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const onLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
  };

  const user = session?.user as User & { username?: string };

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          Secretive
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <span>
              Welcome, {user.username ?? user.name ?? user.email}
            </span>
            <Link href="/dashboard">
              <Button
                className="w-full md:w-auto bg-blue-600 text-white"
                variant="default"
              >
                Dashboard
              </Button>
            </Link>
            <Button
              onClick={onLogout}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <>
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Signup
              </Button>
            </Link>
          </>
          
        )}
      </div>
    </nav>
  );
}

export default Navbar;
