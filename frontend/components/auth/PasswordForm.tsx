'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthForm } from '@/lib/hooks/useAuthForm';

interface PasswordFormProps {
  email: string;
}

export function PasswordForm({ email }: PasswordFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    isLoading, 
    error, 
    clearError, 
    login 
  } = useAuth();

  const { 
    createKeyPressHandler 
  } = useAuthForm();

  const handleLogin = async () => {
    clearError();
    
    if (!password.trim()) {
      return;
    }

    await login({ email, password });
  };

  const handleKeyPress = createKeyPressHandler(handleLogin);

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">歡迎回來</h2>
        <p className="text-muted-foreground">請輸入您的密碼以繼續</p>
      </div>

      {/* 用戶資訊 */}
      <div className="p-4 rounded-lg bg-muted/50">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{email}</span>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 表單 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">密碼</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="請輸入您的密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button 
          onClick={handleLogin} 
          disabled={isLoading || !password.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              登入中...
            </>
          ) : (
            '登入'
          )}
        </Button>

        {/* 忘記密碼 */}
        <div className="text-center">
          <button className="text-sm text-primary hover:underline">
            忘記密碼？
          </button>
        </div>

        {/* 分隔線 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或
            </span>
          </div>
        </div>

        {/* 返回按鈕 */}
        <Button 
          variant="outline" 
          className="w-full" 
          asChild
        >
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            使用其他帳號
          </Link>
        </Button>
      </div>
    </div>
  );
}