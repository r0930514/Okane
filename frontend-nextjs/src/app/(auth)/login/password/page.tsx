'use client';

import { useSearchParams } from 'next/navigation';
import { PasswordForm } from '@/components/auth';

export default function PasswordPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    return <PasswordForm email={email} />;
}