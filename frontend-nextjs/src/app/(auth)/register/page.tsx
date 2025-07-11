'use client';

import { useSearchParams } from 'next/navigation';
import { RegisterForm } from '@/components/auth';

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    return <RegisterForm email={email} />;
}