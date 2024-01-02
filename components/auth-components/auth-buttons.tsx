"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AuthButtons() {
  const pathname = usePathname();
  return (
    <div
      className={cn("flex gap-2 items-center", {
        hidden: ["/auth/sign-up", "/auth/sign-in"].includes(pathname),
      })}
    >
      <Button asChild>
        <Link href="/auth/sign-in">Sign in</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
