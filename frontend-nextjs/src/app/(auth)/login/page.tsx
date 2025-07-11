'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');

    return <LoginForm email={email} setEmail={setEmail} />;
}