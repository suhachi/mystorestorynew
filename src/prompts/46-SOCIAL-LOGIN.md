# 46 - Social Login Integration

## 📌 목표
소셜 로그인 통합을 구축합니다. (이미 social-login-api-system.tsx 존재)

**결과물**:
- social-login-api-system.tsx (이미 존재) - 확인 및 문서화

**총 1개 파일 (확인)**

---

## 🔄 STEP 1: Social Login API System 확인

### 프롬프트 템플릿

```
/components/system/social-login-api-system.tsx 파일이 이미 존재합니다. 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/system/social-login-api-system.tsx

주요 기능:
- 구글 로그인
- 카카오 로그인
- 네이버 로그인
- 애플 로그인
- Firebase Authentication 연동

## Firebase Authentication 소셜 로그인

```typescript
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  OAuthProvider,
  signOut
} from 'firebase/auth';
import { auth } from './firebase-config';

// 1. 구글 로그인
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('구글 로그인 성공:', user);
    
    // Firestore에 사용자 정보 저장
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: 'google',
      createdAt: serverTimestamp()
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('구글 로그인 실패:', error);
    throw error;
  }
}

// 2. 애플 로그인
async function signInWithApple() {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('애플 로그인 성공:', user);
    return user;
  } catch (error) {
    console.error('애플 로그인 실패:', error);
    throw error;
  }
}

// 3. 로그아웃
async function handleSignOut() {
  try {
    await signOut(auth);
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
```

## 카카오 로그인 (REST API)

```typescript
// 1. 카카오 로그인 URL 생성
function getKakaoLoginUrl() {
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_REST_API_KEY,
    redirect_uri: `${window.location.origin}/auth/kakao/callback`,
    response_type: 'code'
  });
  
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

// 2. 카카오 로그인 버튼
function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <Button onClick={handleKakaoLogin} className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black">
      <img src="/kakao-logo.png" className="w-5 h-5 mr-2" />
      카카오 로그인
    </Button>
  );
}

// 3. 카카오 콜백 처리
async function handleKakaoCallback(code: string) {
  // 액세스 토큰 요청
  const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: `${window.location.origin}/auth/kakao/callback`,
      code: code
    })
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // 사용자 정보 요청
  const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const userData = await userResponse.json();
  
  // Firebase Custom Token 생성 (Cloud Function)
  const customToken = await createCustomToken(userData.id, 'kakao');
  
  // Firebase 로그인
  await signInWithCustomToken(auth, customToken);
  
  return userData;
}

// Cloud Function: Custom Token 생성
export const createKakaoCustomToken = functions.https.onCall(async (data) => {
  const { kakaoId } = data;
  
  // Firebase Custom Token 생성
  const customToken = await admin.auth().createCustomToken(kakaoId, {
    provider: 'kakao'
  });
  
  return { customToken };
});
```

## 네이버 로그인 (REST API)

```typescript
// 1. 네이버 로그인 URL 생성
function getNaverLoginUrl() {
  const state = generateRandomState(); // CSRF 방지용 랜덤 문자열
  sessionStorage.setItem('naver_state', state);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NAVER_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/naver/callback`,
    state: state
  });
  
  return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`;
}

// 2. 네이버 콜백 처리
async function handleNaverCallback(code: string, state: string) {
  // State 검증
  const savedState = sessionStorage.getItem('naver_state');
  if (state !== savedState) {
    throw new Error('Invalid state parameter');
  }

  // 액세스 토큰 요청
  const tokenResponse = await fetch(
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&code=${code}&state=${state}`
  );

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // 사용자 정보 요청
  const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const userData = await userResponse.json();
  
  return userData.response;
}
```

## 소셜 로그인 UI

```typescript
function SocialLoginButtons() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('로그인 성공');
      // 홈으로 이동
    } catch (error) {
      toast.error('로그인 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  const handleNaverLogin = () => {
    window.location.href = getNaverLoginUrl();
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithApple();
      toast.success('로그인 성공');
    } catch (error) {
      toast.error('로그인 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* 구글 */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <img src="/google-logo.png" className="w-5 h-5 mr-2" />
        구글로 계속하기
      </Button>

      {/* 카카오 */}
      <Button 
        className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black"
        onClick={handleKakaoLogin}
        disabled={isLoading}
      >
        <img src="/kakao-logo.png" className="w-5 h-5 mr-2" />
        카카오로 계속하기
      </Button>

      {/* 네이버 */}
      <Button 
        className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white"
        onClick={handleNaverLogin}
        disabled={isLoading}
      >
        <img src="/naver-logo.png" className="w-5 h-5 mr-2" />
        네이버로 계속하기
      </Button>

      {/* 애플 */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleAppleLogin}
        disabled={isLoading}
      >
        <img src="/apple-logo.png" className="w-5 h-5 mr-2" />
        Apple로 계속하기
      </Button>

      <div className="relative">
        <Separator className="my-4" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-slate-500">
          또는
        </span>
      </div>

      {/* 이메일 로그인 */}
      <Button variant="outline" className="w-full">
        이메일로 계속하기
      </Button>
    </div>
  );
}
```

## 프로필 연동

```typescript
// 소셜 로그인 후 사용자 정보 동기화
async function syncUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider: user.providerData[0]?.providerId || 'unknown',
    lastLoginAt: serverTimestamp(),
    // 처음 로그인이면 추가 정보
    createdAt: serverTimestamp()
  }, { merge: true });
}

// 인증 상태 리스너
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('로그인됨:', user);
    await syncUserProfile(user);
  } else {
    console.log('로그아웃됨');
  }
});
```

IMPORTANT:
- Firebase Authentication 사용
- 구글/애플: signInWithPopup
- 카카오/네이버: REST API + Custom Token
- 보안: CSRF 방지 (state 파라미터)
- 프로필 동기화
```

---

## 📝 핵심 포인트

### 소셜 로그인 프로세스
1. **로그인 버튼 클릭**: 소셜 로그인 URL로 이동
2. **소셜 인증**: 사용자가 소셜 서비스에서 인증
3. **콜백**: 인증 코드와 함께 리다이렉트
4. **토큰 교환**: 액세스 토큰 발급
5. **사용자 정보**: 프로필 정보 가져오기
6. **Firebase 로그인**: Custom Token으로 Firebase 로그인

### 보안
- **CSRF 방지**: state 파라미터 사용
- **토큰 검증**: 서버에서 검증
- **Secret Key**: 서버에서만 사용

---

## ✅ 완료 체크리스트

- [ ] social-login-api-system.tsx 확인
- [ ] 소셜 로그인 문서화

---

## 📝 다음 단계

**47-FINAL-TESTING-DASHBOARD.md**로 이동합니다.
