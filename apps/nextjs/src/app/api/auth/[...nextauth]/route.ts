import NextAuth from "next-auth";

import { authOptions } from "@saasfly/auth";

const nextAuthTyped = NextAuth as unknown as (
  options: typeof authOptions,
) => (req: Request) => Promise<Response>;
const handler = nextAuthTyped(authOptions);

export { handler as GET, handler as POST };
