type UserId = string;
type SessionUser = {
  id: UserId;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    isAdmin?: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}
