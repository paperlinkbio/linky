'use client';

import { auth } from '@/app/lib/auth';
import { Button } from '@trylinky/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function TestUserPrivateLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setIsSubmitting(true);
    const { error } = await auth.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message ?? 'Unable to sign in');
      setIsSubmitting(false);
      return;
    }

    router.push('/edit');
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">
        Login form for app review test users
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-slate-200 rounded-ld min-w-96 p-6"
      >
        <label className="flex flex-col">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label className="flex flex-col">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          Login
        </Button>
      </form>
      <div className="flex flex-row gap-2 mt-2 text-sm text-gray-500">
        <Link href="/i/privacy">Privacy Policy</Link>
        <Link href="/i/terms">Terms of Service</Link>
      </div>
    </div>
  );
}
