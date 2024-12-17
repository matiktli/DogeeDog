import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { sendWelcomeEmail } from '@/app/services/email';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, password, name } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      email,
      passwordHash,
      name,
      emailConfirmed: false,
    });

    await sendWelcomeEmail(user.email, user.name);

    // Remove password hash from response
    const userWithoutPassword = {
      email: user.email,
      name: user.name,
      emailConfirmed: user.emailConfirmed,
      createdAt: user.createdAt,
    };

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 