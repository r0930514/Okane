'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowRight, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthForm } from '@/lib/hooks/useAuthForm';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
}

export function LoginForm({ email, setEmail }: LoginFormProps) {
  const router = useRouter();
  const { 
    isLoading, 
    error, 
    isAuthenticated,
    clearError, 
    verifyEmailAndNavigate 
  } = useAuth();

  const { 
    validateEmailWithError,
    createKeyPressHandler 
  } = useAuthForm();

  // 如果已經登入，重定向到儀表板
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleContinue = async () => {
    clearError();
    
    if (!validateEmailWithError(email)) {
      return;
    }

    await verifyEmailAndNavigate(email);
  };

  const handleKeyPress = createKeyPressHandler(handleContinue);

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">開始使用 Okane</h2>
        <p className="text-muted-foreground">輸入您的電子郵件地址以繼續</p>
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
          <Label htmlFor="email">電子郵件</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="請輸入您的電子郵件"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            我們將檢查此電子郵件是否已註冊
          </p>
        </div>

        <Button 
          onClick={handleContinue} 
          disabled={isLoading || !email.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              檢查中...
            </>
          ) : (
            <>
              繼續
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* 分隔線 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或使用其他方式
            </span>
          </div>
        </div>

        {/* 通行密鑰按鈕 */}
        <Button 
          variant="outline" 
          className="w-full" 
          disabled
        >
          <Key className="mr-2 h-4 w-4" />
          使用通行密鑰登入
          <span className="ml-2 text-xs text-muted-foreground">(即將推出)</span>
        </Button>
      </div>

      {/* 條款說明 */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          繼續即表示您同意我們的{' '}
          <button className="underline hover:text-foreground">服務條款</button>
          {' '}和{' '}
          <button className="underline hover:text-foreground">隱私政策</button>
        </p>
      </div>
    </div>
  );
}