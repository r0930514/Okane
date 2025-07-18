'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';

function RegisterPageContent() {
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

  return <RegisterForm email={email} />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}