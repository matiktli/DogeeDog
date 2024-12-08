'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import LoadingScreen from '@/app/components/LoadingScreen'
import { useLoading } from '@/app/hooks/useLoading'

type SignUpFormData = {
  name: string
  email: string
  password: string
}

export default function SignUp() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { isLoading, withLoading } = useLoading()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    mode: "onBlur",
    reValidateMode: "onBlur"
  })

  const onSubmit = async (data: SignUpFormData) => {
    await withLoading(async () => {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Something went wrong');
        }

        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          throw new Error('Failed to sign in after registration');
        }

        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Registration error:', error);
      }
    })
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md bg-white dark:bg-black/20 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            Paw-lease come in! 🐾
          </h1>
          <p className="text-[var(--foreground)]/60">
            Ready to start walking with your dog?
          </p>
        </div>

        {!showEmailForm ? (
          <>
            {/* Social Sign Up Button */}
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--foreground)]/20 rounded-lg hover:bg-[var(--foreground)]/5 transition-colors"
            >
              <Image 
                src="/google-icon.svg" 
                alt="Google" 
                width={20} 
                height={20}
              />
              <span>SIGN UP WITH GOOGLE</span>
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--foreground)]/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm bg-white dark:bg-black/20 text-[var(--foreground)]/60">
                  OR
                </span>
              </div>
            </div>

            {/* Email Button */}
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full py-3 px-4 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              SIGN UP WITH EMAIL
            </button>
          </>
        ) : (
          /* Email Form */
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
                Name
              </label>
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  },
                  maxLength: {
                    value: 20,
                    message: 'Name must be less than 20 characters'
                  }
                })}
                type="text"
                id="name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-[var(--foreground)]/20'
                } bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                id="email"
                placeholder="habits@garden.com"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-[var(--foreground)]/20'
                } bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-[var(--foreground)]/20'
                  } bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
            >
              SIGN UP →
            </button>
          </form>
        )}

        {/* Terms and Privacy */}
        <p className="mt-6 text-center text-sm text-[var(--foreground)]/60">
          By signing up, you agree to our{' '}
          <Link href="/tos" className="text-[var(--accent)] hover:underline">
            TOS
          </Link>
          {' '}&{' '}
          <Link href="/privacy" className="text-[var(--accent)] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
      {isLoading && <LoadingScreen />}
    </div>
  )
} 