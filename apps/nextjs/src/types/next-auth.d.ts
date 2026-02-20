interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}
