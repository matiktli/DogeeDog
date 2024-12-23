import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import User from '@/app/models/User';
import { connectToDatabase } from '@/app/lib/db';
import bcrypt from "bcryptjs";
import { AchievementManager } from '@/app/lib/AchievementManager';
import { initializeServer } from '@/app/lib/init';

interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

// Initialize server before setting up auth
await initializeServer();

const handler = NextAuth({
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

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('Invalid credentials');
        }

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
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          await connectToDatabase();
          
          const googleProfile = profile as GoogleProfile;
          let dbUser = await User.findOne({ email: user.email });
          
          if (!dbUser) {
            dbUser = await User.create({
              email: user.email,
              name: user.name,
              imageUrl: googleProfile.picture || null,
              emailConfirmed: true,
              googleId: googleProfile.sub,
              provider: 'google',
            });
          } else if (!dbUser.googleId) {
            await User.findByIdAndUpdate(dbUser._id, {
              googleId: googleProfile.sub,
              provider: 'google',
              emailConfirmed: true,
              imageUrl: googleProfile.picture || null,
            });
          }
          
          return true;
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      
      return true;
    },
    
    async session({ session }) {
      if (session?.user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.image = dbUser.imageUrl;
          session.user.hasAccess = dbUser.payment?.hasAccess || false;
          session.user.isTrial = dbUser.isTrial;
        }
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },

    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/signin',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn({ user }) {
      try {
        // Create achievement progresses for the user if they don't exist yet
        const existingProgress = await AchievementManager.fetchUserAchievementProgressList(user.id);
        if (existingProgress.length === 0) {
          await AchievementManager.createUserAchievementProgressesForNewUser(user.id);
          console.log('Created achievement progresses for new user:', user.id);
        }
      } catch (error) {
        console.error('Error in signIn event:', error);
        // Don't throw the error to avoid blocking sign-in
      }
    }
  },
});

export { handler as GET, handler as POST }; 