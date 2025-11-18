# 53 - Hooks - useAuth

## 📌 목표
인증 관리를 위한 커스텀 훅을 구축합니다. (이미 useAuth.ts 존재)

**결과물**:
- useAuth.ts (이미 존재) - 인증 훅
- types/auth.ts (이미 존재) - 인증 타입

**총 2개 파일 (확인 및 문서화)**

---

## 🔄 STEP 1: useAuth Hook 확인

### 프롬프트 템플릿

```
인증 관리 훅을 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: 
- /hooks/useAuth.ts
- /types/auth.ts

주요 기능:
- 현재 사용자 상태
- 역할 기반 접근 제어 (RBAC)
- Mock 인증 (Firebase Auth로 교체 가능)
- 로그인/로그아웃

## 타입 정의 (types/auth.ts)

```typescript
export type UserRole = 'customer' | 'owner' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  storeId?: string;      // owner인 경우 상점 ID
  createdAt: number;
  lastLoginAt: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

## useAuth Hook

```typescript
import { useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types/auth';

// Mock 사용자 가져오기
const getMockUser = (): User | null => {
  const stored = localStorage.getItem('mock_auth_user');
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

export function useAuth(): AuthState & {
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  login: (role: UserRole, storeId?: string) => void;
  logout: () => void;
} {
  const [user, setUser] = useState<User | null>(getMockUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Production: Firebase Auth 상태 변경 구독
    // const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    //   if (firebaseUser) {
    //     // Firestore에서 역할 가져오기
    //     const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    //     const userData = userDoc.data();
    //     setUser({
    //       id: firebaseUser.uid,
    //       email: firebaseUser.email,
    //       displayName: firebaseUser.displayName,
    //       photoURL: firebaseUser.photoURL,
    //       role: userData.role,
    //       storeId: userData.storeId,
    //       createdAt: userData.createdAt,
    //       lastLoginAt: Date.now()
    //     });
    //   } else {
    //     setUser(null);
    //   }
    //   setLoading(false);
    // });
    // return unsubscribe;

    setLoading(false);
  }, []);

  // 역할 체크
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // Mock 로그인
  const login = (role: UserRole, storeId?: string) => {
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email: `${role}@example.com`,
      displayName: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role,
      storeId,
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    };
    
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
    console.log('[Auth] Mock login:', mockUser);
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('mock_auth_user');
    setUser(null);
    console.log('[Auth] Mock logout');
  };

  return {
    user,
    loading,
    error,
    hasRole,
    login,
    logout
  };
}
```

## Firebase Auth로 교체하기

### 1. Firebase 설정
```typescript
// firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 2. Firebase Auth 훅
```typescript
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Firestore에서 역할 가져오기
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            role: userData?.role || 'customer',
            storeId: userData?.storeId,
            createdAt: userData?.createdAt || Date.now(),
            lastLoginAt: Date.now()
          });
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load user data');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return {
    user,
    loading,
    error,
    hasRole,
    signIn,
    signOut
  };
}
```

## 사용 예시

### 컴포넌트에서 사용
```typescript
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user, loading, hasRole, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      
      {/* 역할별 컨텐츠 */}
      {hasRole('admin') && (
        <div>
          <h2>관리자 전용</h2>
          <AdminPanel />
        </div>
      )}

      {hasRole('owner') && (
        <div>
          <h2>사장님 대시보드</h2>
          <StoreDashboard storeId={user.storeId} />
        </div>
      )}

      {hasRole('customer') && (
        <div>
          <h2>고객 페이지</h2>
          <CustomerApp />
        </div>
      )}

      <Button onClick={logout}>로그아웃</Button>
    </div>
  );
}
```

### RequireRole 컴포넌트
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth';

interface RequireRoleProps {
  roles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireRole({ roles, children, fallback }: RequireRoleProps) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!hasRole(roles)) {
    return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}

// 사용
<RequireRole roles="admin">
  <AdminDashboard />
</RequireRole>

<RequireRole roles={['owner', 'admin']}>
  <StoreDashboard />
</RequireRole>
```

### 라우팅에서 사용
```typescript
import { Routes, Route } from 'react-router-dom';
import { RequireRole } from './components/auth/RequireRole';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* 관리자 전용 */}
      <Route path="/admin/*" element={
        <RequireRole roles="admin">
          <AdminLayout />
        </RequireRole>
      } />

      {/* 사장님 전용 */}
      <Route path="/store/*" element={
        <RequireRole roles="owner">
          <StoreLayout />
        </RequireRole>
      } />

      {/* 고객 전용 */}
      <Route path="/customer/*" element={
        <RequireRole roles="customer">
          <CustomerLayout />
        </RequireRole>
      } />
    </Routes>
  );
}
```

IMPORTANT:
- 3개 역할 (customer, owner, admin)
- Mock 인증 (개발용)
- Firebase Auth 준비됨
- 역할 기반 접근 제어
- RequireRole 컴포넌트
```

---

## 📝 핵심 포인트

### 3가지 역할
1. **customer**: 일반 사용자
2. **owner**: 사장님 (상점 관리)
3. **admin**: 관리자 (플랫폼 관리)

### 주요 함수
- `hasRole`: 역할 체크
- `login/signIn`: 로그인
- `logout/signOut`: 로그아웃
- `user`: 현재 사용자
- `loading`: 로딩 상태

---

## ✅ 완료 체크리스트

- [ ] useAuth.ts 확인
- [ ] types/auth.ts 확인
- [ ] Firebase Auth 문서화

---

## 📝 다음 단계

**54-HOOKS-CUSTOM-HOOKS.md**로 이동합니다.
