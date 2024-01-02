import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// declare module "next-auth" {
//   interface User {
//     name: string;
//     username: string;
//     role: string;
//   }
//   interface Session {
//     user: User & {
//       name: string;
//       username: string;
//       role: string;
//     };
//     token: {
//       name: string;
//       username: string;
//       role: string;
//     };
//   }
// }

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    username: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
  }
}
