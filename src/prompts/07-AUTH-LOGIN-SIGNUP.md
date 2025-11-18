# 07 - 인증 페이지 (로그인/회원가입)

## 📌 목표
로그인과 회원가입 페이지를 구축합니다.

**결과물**:
- 로그인 페이지
- 회원가입 페이지
- useAuth 훅
- AuthContext

---

## 🔄 STEP 1: AuthContext 및 useAuth 훅

### 프롬프트 템플릿

```
인증 시스템의 Context와 훅을 만듭니다.

## 요구사항

1. /hooks/useAuth.ts 생성:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, PlanType } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem('mystorystory_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Date 객체 복원
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        parsedUser.updatedAt = new Date(parsedUser.updatedAt);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('mystorystory_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock 로그인 - 실제로는 Firebase Auth 사용
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock 사용자 데이터
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'store_owner',
        plan: 'BASIC',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('mystorystory_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Mock 회원가입
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'store_owner',
        plan: 'FREE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('mystorystory_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      localStorage.removeItem('mystorystory_user');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    
    setUser(updatedUser);
    localStorage.setItem('mystorystory_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

2. /components/auth/RequireRole.tsx 생성:

```typescript
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

interface RequireRoleProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ 
  children, 
  roles,
  fallback 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="mb-4">로그인이 필요합니다</h3>
          <a href="/auth/login" className="text-primary hover:underline">
            로그인하기 →
          </a>
        </div>
      </div>
    );
  }

  if (!roles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="mb-4">접근 권한이 없습니다</h3>
          <p className="text-slate-600">
            이 페이지는 {roles.join(', ')} 권한이 필요합니다.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

IMPORTANT:
- Mock 인증 (Firebase 연동 전)
- localStorage에 사용자 정보 저장
- RequireRole로 권한 체크
```

### 예상 결과

```
/hooks/useAuth.ts
/components/auth/RequireRole.tsx
```

### 검증 체크리스트

- [ ] useAuth 훅 생성
- [ ] AuthProvider 작동
- [ ] RequireRole 컴포넌트
- [ ] localStorage 저장 확인

---

## 🔄 STEP 2: 로그인 페이지

### 프롬프트 템플릿

```
로그인 페이지를 만듭니다.

## 요구사항

/components/pages/auth-pages.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Container, Flex } from '../common';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { Store, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Container size="sm">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-primary">MyStoreStory</h3>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="mb-2">로그인</h2>
            <p className="text-slate-600">
              계속하려면 로그인하세요
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span className="text-slate-600">로그인 상태 유지</span>
              </label>
              <a href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                비밀번호 찾기
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full group"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">또는</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" type="button">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 계속하기
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub로 계속하기
            </Button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-600 mt-6">
            계정이 없으신가요?{' '}
            <a href="/auth/signup" className="text-primary hover:underline">
              회원가입
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      window.location.href = '/app-builder';
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Container size="sm">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-primary">MyStoreStory</h3>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="mb-2">회원가입</h2>
            <p className="text-slate-600">
              무료로 시작하세요. 신용카드 불필요.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">이름</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="최소 8자"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">비밀번호 확인</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded" />
              <p className="text-sm text-slate-600">
                <a href="/terms" className="text-primary hover:underline">이용약관</a> 및{' '}
                <a href="/privacy" className="text-primary hover:underline">개인정보처리방침</a>에 동의합니다
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full group"
              disabled={loading}
            >
              {loading ? '가입 중...' : '회원가입'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-600 mt-6">
            이미 계정이 있으신가요?{' '}
            <a href="/auth/login" className="text-primary hover:underline">
              로그인
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
};
```

IMPORTANT:
- 로그인/회원가입 폼
- 유효성 검사
- 에러 처리
- 소셜 로그인 버튼 (UI만)
```

### 예상 결과

```
/components/pages/auth-pages.tsx
```

### 검증 체크리스트

- [ ] 로그인 페이지 렌더링
- [ ] 회원가입 페이지 렌더링
- [ ] 폼 유효성 검사 작동
- [ ] 에러 메시지 표시
- [ ] 로그인 성공 시 리다이렉트

---

## ✅ 완료 체크리스트

- [ ] useAuth 훅
- [ ] AuthProvider
- [ ] RequireRole 컴포넌트
- [ ] 로그인 페이지
- [ ] 회원가입 페이지
- [ ] 폼 유효성 검사

---

## 📝 다음 단계

**08-APP-BUILDER-STEP-ONE.md**로 이동하여 앱 빌더 첫 단계를 구축합니다.
