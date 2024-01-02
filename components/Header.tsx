"use client";

import Link from "next/link";
import AuthButtons from "./auth-components/auth-buttons";
import SignOutButton from "./auth-components/sign-out-button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import LogoIcons from "./icons/logo-icons";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "bg-zinc-100 border-b border-s-zinc-200 fixed w-full z-10 top-0",
        {
          hidden: ["/auth/sign-up", "/auth/sign-in"].includes(pathname),
        }
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/">
          <LogoIcons />
        </Link>
        {session?.user ? (
          <div className="flex gap-2 items-center">
            {session?.user.name},
            <SignOutButton />
          </div>
        ) : (
          <AuthButtons />
        )}
      </div>
    </header>
  );
}
