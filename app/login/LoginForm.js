'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ContinueWithOweb from '@/components/ContinueWithOweb';
import { createClient } from '@/lib/supabase/client';
import { owebSignupUrl } from '@/lib/ogi/constants';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/studio';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function completeAuth(activationKind) {
    await fetch('/api/auth/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activation_kind: activationKind }),
    });
    router.replace(nextPath.startsWith('/') ? nextPath : '/studio');
    router.refresh();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const trimmed = email.trim();
    const supabase = createClient();

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });
      if (signInError) {
        const msg = signInError.message || '';
        if (/invalid login credentials/i.test(msg)) {
          throw new Error(
            'No matching OneID for that email and password. Create or recover your account on OWeb, then sign in here with the same credentials.',
          );
        }
        throw signInError;
      }
      if (data.session?.user) {
        await completeAuth('sign_in');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold">Sign in</h2>
      <p className="mt-2 text-sm text-white/50">
        OneID only — use the same email and password as OWeb. This app does not create a second account.
      </p>

      <div className="mt-6">
        <ContinueWithOweb />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/40">or email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
          required
          autoComplete="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
          required
          autoComplete="current-password"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-[#d9ff00] py-2.5 text-sm font-bold text-black disabled:opacity-50"
        >
          {busy ? 'Please wait…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-white/50">
        New to OWeb?{' '}
        <a href={owebSignupUrl()} className="text-[#d9ff00] hover:underline">
          Create a OneID on OWeb
        </a>
      </p>
    </div>
  );
}
