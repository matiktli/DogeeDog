import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import connectDB from '@/app/lib/mongodb';
import { encode } from 'next-auth/jwt';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=invalid-token', request.url));
  }

  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || '') as { email: string };
    console.log('decoded token: ', decoded);

    await connectDB();
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user-not-found', request.url));
    }

    // Create a NextAuth compatible session token
    const sessionToken = await encode({
      token: {
        email: user.email,
        name: user.name,
        sub: user._id.toString(),
      },
      secret: process.env.NEXTAUTH_SECRET || '',
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('next-auth.session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    // Set callback URL cookie for NextAuth
    cookieStore.set('next-auth.callback-url', '/dashboard', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.log('magic-link error: ', error);
    return NextResponse.redirect(new URL('/login?error=invalid-token', request.url));
  }
}
