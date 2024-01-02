import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession(authOptions);

  // here callbackUrl=/dashboard-user is the route you want to redirect to, page route
  // if page route is /user, then callbackUrl will be callbackUrl=/user
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/dashboard-user");
  }

  return (
    <div>
      <h2 className="text-2xl font-medium">Server Session</h2>
      <p>Hi {session?.user.name}!</p>
      {JSON.stringify(session, null, 4)}
    </div>
  );
}
