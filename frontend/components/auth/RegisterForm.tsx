'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, AlertCircle, Check, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';

interface RegisterFormProps {
  email: string;
}

export function RegisterForm({ email }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { 
    isLoading, 
    error, 
    clearError, 
    register 
  } = useAuth();

  const { 
    validateUsername,
    createKeyPressHandler 
  } = useAuthForm();

  const handleRegister = async () => {
    clearError();
    
    // 驗證使用者名稱
    if (!username.trim()) {
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      return;
    }

    // 驗證密碼
    if (!password.trim()) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    await register({ email, username, password });
  };

  const handleKeyPress = createKeyPressHandler(handleRegister);

  const isFormValid = username.trim() && 
                     password.trim() && 
                     confirmPassword.trim() && 
                     password === confirmPassword &&
                     password.length >= 6;

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">建立您的帳號</h2>
        <p className="text-muted-foreground">請填寫以下資訊來註冊您的 Okane 帳號</p>
      </div>

      {/* 提示訊息 */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          此電子郵件尚未註冊，請完成註冊程序
        </AlertDescription>
      </Alert>

      {/* 錯誤訊息 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 表單 */}
      <div className="space-y-4">
        {/* 電子郵件 (唯讀) */}
        <div className="space-y-2">
          <Label htmlFor="email">電子郵件</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="pl-10 pr-20"
            />
            <span className="absolute right-3 top-3 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              新用戶
            </span>
          </div>
        </div>

        {/* 使用者名稱 */}
        <div className="space-y-2">
          <Label htmlFor="username">使用者名稱</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              placeholder="請輸入使用者名稱"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            2-20 個字元，將顯示為您的帳號名稱
          </p>
        </div>

        {/* 密碼 */}
        <div className="space-y-2">
          <Label htmlFor="password">密碼</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="請輸入密碼"
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
          <p className="text-sm text-muted-foreground">
            至少 6 個字元
          </p>
        </div>

        {/* 確認密碼 */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">確認密碼</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="請再次輸入密碼"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            {password && confirmPassword && password === confirmPassword && (
              <Check className="absolute right-10 top-3 h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            請確認兩次密碼輸入一致
          </p>
        </div>

        <Button 
          onClick={handleRegister} 
          disabled={isLoading || !isFormValid}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              註冊中...
            </>
          ) : (
            '建立帳號'
          )}
        </Button>

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

      {/* 條款說明 */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          註冊即表示您同意我們的{' '}
          <button className="underline hover:text-foreground">服務條款</button>
          {' '}和{' '}
          <button className="underline hover:text-foreground">隱私政策</button>
        </p>
      </div>
    </div>
  );
}