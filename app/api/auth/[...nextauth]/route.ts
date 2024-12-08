import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Log the sign-in data for now
      console.log('Sign-in attempt:', { user, account, profile })
      return true
    },
    async session({ session, token }) {
      // Log session data
      console.log('Session:', session)
      return session
    },
  },
})

export { handler as GET, handler as POST } 