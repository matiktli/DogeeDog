import type { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/app/lib/mongodb"
import User from "@/app/models/User"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Connect to database
      await dbConnect();
      
      if (account?.provider === "google") {
        // Find or create user for Google sign-in
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          // Create new user if doesn't exist
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          });
          return true;
        }
        return true;
      }
      return true;
    },
    async session({ session }) {
      if (session?.user) {
        await dbConnect();
        // Look up user in database by email
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          // Use database ID instead of OAuth provider's ID
          session.user.id = dbUser._id.toString();
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log('Google sign in redirect1: ', redirectUrl)
        return redirectUrl
      }
        
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl){
        console.log('Google sign in redirect2: ', url)
        return url
      } 
      console.log('Google sign in redirect3: ', baseUrl)
      return baseUrl
    },
  },
  pages: {
    signIn: '/signin',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
} 

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      hasAccess?: boolean;
      isTrial?: boolean;
    }
  }
} 