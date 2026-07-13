import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Protect all /admin paths EXCEPT /admin/login
  matcher: ["/admin/((?!login).*)"],
};
