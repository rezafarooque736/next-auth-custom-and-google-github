"use client";

import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface NextAuthProviderProps {
  children: ReactNode;
  session: any;
}

const NextAuthProvider: FC<NextAuthProviderProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
export default NextAuthProvider;
