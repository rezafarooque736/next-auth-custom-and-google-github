import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-slate-200 py-5 px-10 rounded-md w-96">{children}</div>
  );
};

export default AuthLayout;
