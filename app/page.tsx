"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  // here callbackUrl=/ is the route you want to redirect to, page route
  // if page route is /user, then callbackUrl will be callbackUrl=/user
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/sign-in?callbackUrl=/");
    },
  });

  // const router = useRouter();

  // const { data: session, status: sessionStatus } = useSession();

  // useEffect(() => {
  //   if (sessionStatus === "unauthenticated") {
  //     router.replace("/auth/sign-in?callbackUrl=/");
  //   }
  // }, [sessionStatus, router]);

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-2xl font-semibold">This is home page</h3>
      <Button asChild>
        <Link href="/admin/dashboard-admin">
          Admin page || Server Component || Admin only
        </Link>
      </Button>

      <Button asChild>
        <Link href="/admin/dashboard-user">
          Admin page || Server Component || Every User
        </Link>
      </Button>

      <h2 className="text-2xl font-medium">Client Session</h2>
      <pre>
        Signed in as {session?.user.email}
        <p>Details are : </p>
        {JSON.stringify(session, null, 4)}
      </pre>
    </section>
  );
}
