'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PasswordForm } from '@/components/auth/PasswordForm';

function PasswordPageContent() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push('/login');
    }
  }, [searchParams, router]);

  if (!email) {
    return null;
  }

  return <PasswordForm email={email} />;
}

export default function PasswordPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <PasswordPageContent />
    </Suspense>
  );
}