import React, { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { InteractiveButton } from '../interactions/interactive-button';
import { useNavigation } from '../system/app-router';
import { useUser } from '../system/data-context';
import { useFormValidation, ValidationPatterns, CommonValidationRules } from '../system/form-validation';
import { EnhancedInput } from '../forms/enhanced-form-components';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Shield, Clock, Zap, Building2, Smartphone, Settings } from 'lucide-react';

interface AuthPagesProps {
  type: 'login' | 'register' | 'forgot-password' | 'waiting-approval';
}

export function AuthPages({ type }: AuthPagesProps) {
  const navigation = useNavigation();

  switch (type) {
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'forgot-password':
      return <ForgotPasswordPage />;
    case 'waiting-approval':
      return <WaitingApprovalPage />;
    default:
      return <LoginPage />;
  }
}

function LoginPage() {
  const navigation = useNavigation();
  const { login, loading, errors } = useUser();
  const [rememberMe, setRememberMe] = useState(false);

  // 폼 검증 설정
  const form = useFormValidation(
    { email: '', password: '' },
    {
      email: CommonValidationRules.email,
      password: { required: true, minLength: 1 } // 로그인시에는 간단한 검증
    }
  );

  const handleLogin = async () => {
    form.submitForm(async (formData) => {
      try {
        const user = await login(formData.email, formData.password);
        
        // 로그인 상태 기억하기
        if (rememberMe) {
          localStorage.setItem('rememberLogin', 'true');
        }

        // 사용자 타입에 따라 다른 페이지로 이동
        if (user.email.includes('admin')) {
          navigation.navigate('admin-dashboard');
        } else if (user.email.includes('store')) {
          navigation.navigate('store-dashboard');
        } else {
          navigation.navigate('app-builder');
        }
      } catch (error) {
        console.error('로그인 실패:', error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <ImageWithFallback 
              src="figma:asset/4045e6f074ff4480cd95c7c5514e0728fe19fc42.png"
              alt="MyStoreStory 로고"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-heading-2 text-gray-900">
          로그인
        </h2>
        <p className="mt-2 text-center text-body text-gray-600">
          계정에 로그인하여 시작하세요
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* 로그인 에러 표시 */}
            {errors.login && (
              <div className="bg-error-red-50 border border-error-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-error-red" />
                  <span className="text-body-small text-error-red">{errors.login}</span>
                </div>
              </div>
            )}

            {/* 이메일 입력 */}
            <EnhancedInput
              label="이메일"
              type="email"
              value={form.data.email}
              onChange={(value) => form.updateField('email', value)}
              onBlur={() => form.touchField('email')}
              validation={CommonValidationRules.email}
              icon={<Mail size={20} />}
              placeholder="이메일을 입력하세요"
              required
            />

            {/* 비밀번호 입력 */}
            <EnhancedInput
              label="비밀번호"
              type="password"
              value={form.data.password}
              onChange={(value) => form.updateField('password', value)}
              onBlur={() => form.touchField('password')}
              validation={{ required: true, minLength: 1 }}
              icon={<Lock size={20} />}
              placeholder="비밀번호를 입력하세요"
              required
            />

            {/* 로그인 옵션 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
                <label className="ml-2 block text-body-small text-gray-700">
                  로그인 상태 유지
                </label>
              </div>
              <button
                onClick={() => navigation.navigate('forgot-password')}
                className="text-body-small text-primary-blue hover:text-primary-blue-dark transition-colors"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {/* 로그인 버튼 */}
            <InteractiveButton
              variant="primary"
              size="lg"
              onClick={handleLogin}
              className="w-full"
              disabled={loading.login || !form.isValid}
            >
              {loading.login ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  로그인 중...
                </div>
              ) : (
                '로그인'
              )}
            </InteractiveButton>

            {/* 소셜 로그인 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-body-small">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <InteractiveButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    console.log('Google OAuth 로그인');
                    // 임시로 앱빌더로 이동
                    navigation.navigate('app-builder');
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  🔍 Google
                </InteractiveButton>
                <InteractiveButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    console.log('Apple OAuth 로그인');
                    // 임시로 앱빌더로 이동
                    navigation.navigate('app-builder');
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  🍎 Apple
                </InteractiveButton>
              </div>
            </div>

            {/* 회원가입 링크 */}
            <div className="text-center">
              <span className="text-body-small text-gray-600">
                아직 계정이 없으신가요?{' '}
              </span>
              <button
                onClick={() => navigation.navigate('register')}
                className="text-body-small text-primary-blue hover:text-primary-blue-dark font-medium transition-colors"
              >
                무료로 회원가입하기
              </button>
            </div>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigation.navigate('home')}
            className="inline-flex items-center gap-2 text-body-small text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const navigation = useNavigation();
  const { register, loading, errors } = useUser();
  const selectedPlan = navigation.routeParams.selectedPlan || 'basic';

  // 폼 검증 설정
  const form = useFormValidation(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeToTerms: false,
      agreeToPrivacy: false
    },
    {
      name: CommonValidationRules.name,
      email: CommonValidationRules.email,
      password: CommonValidationRules.password,
      confirmPassword: CommonValidationRules.confirmPassword('password'),
      phone: CommonValidationRules.phone,
      agreeToTerms: { required: true },
      agreeToPrivacy: { required: true }
    }
  );

  const handleRegister = async () => {
    form.submitForm(async (formData) => {
      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          plan: selectedPlan
        });
        
        navigation.navigate('waiting-approval');
      } catch (error) {
        console.error('회원가입 실패:', error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <ImageWithFallback 
              src="figma:asset/4045e6f074ff4480cd95c7c5514e0728fe19fc42.png"
              alt="MyStoreStory 로고"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-heading-2 text-gray-900">
          회원가입
        </h2>
        <p className="mt-2 text-center text-body text-gray-600">
          MyStoreStory와 함께 시작하세요
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* 선택된 플랜 표시 */}
            {selectedPlan && (
              <div className="bg-primary-blue-50 border border-primary-blue-200 rounded-lg p-3">
                <p className="text-body-small text-primary-blue">
                  선택된 플랜: <span className="font-medium">{selectedPlan}</span>
                </p>
              </div>
            )}

            {/* 회원가입 에러 표시 */}
            {errors.register && (
              <div className="bg-error-red-50 border border-error-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-error-red" />
                  <span className="text-body-small text-error-red">{errors.register}</span>
                </div>
              </div>
            )}

            {/* 이름 입력 */}
            <EnhancedInput
              label="이름"
              type="text"
              value={form.data.name}
              onChange={(value) => form.updateField('name', value)}
              onBlur={() => form.touchField('name')}
              validation={CommonValidationRules.name}
              icon={<User size={20} />}
              placeholder="이름을 입력하세요"
              required
            />

            {/* 이메일 입력 */}
            <EnhancedInput
              label="이메일"
              type="email"
              value={form.data.email}
              onChange={(value) => form.updateField('email', value)}
              onBlur={() => form.touchField('email')}
              validation={CommonValidationRules.email}
              icon={<Mail size={20} />}
              placeholder="이메일을 입력하세요"
              required
            />

            {/* 전화번호 입력 */}
            <EnhancedInput
              label="전화번호"
              type="tel"
              value={form.data.phone}
              onChange={(value) => form.updateField('phone', value)}
              onBlur={() => form.touchField('phone')}
              validation={CommonValidationRules.phone}
              autoFormat="phone"
              placeholder="전화번호를 입력하세요"
              required
            />

            {/* 비밀번호 입력 */}
            <EnhancedInput
              label="비밀번호"
              type="password"
              value={form.data.password}
              onChange={(value) => form.updateField('password', value)}
              onBlur={() => form.touchField('password')}
              validation={CommonValidationRules.password}
              icon={<Lock size={20} />}
              placeholder="비밀번호를 입력하세요"
              required
            />

            {/* 비밀번호 확인 */}
            <EnhancedInput
              label="비밀번호 확인"
              type="password"
              value={form.data.confirmPassword}
              onChange={(value) => form.updateField('confirmPassword', value)}
              onBlur={() => form.touchField('confirmPassword')}
              validation={CommonValidationRules.confirmPassword('password')}
              otherFields={form.data}
              icon={<Lock size={20} />}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />

            {/* 약관 동의 */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.data.agreeToTerms}
                  onChange={(e) => form.updateField('agreeToTerms', e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
                <label className="flex-1 text-body-small text-gray-700">
                  <button
                    onClick={() => navigation.navigate('terms')}
                    className="text-primary-blue hover:text-primary-blue-dark underline transition-colors"
                  >
                    이용약관
                  </button>
                  에 동의합니다 <span className="text-error-red">*</span>
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.data.agreeToPrivacy}
                  onChange={(e) => form.updateField('agreeToPrivacy', e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
                <label className="flex-1 text-body-small text-gray-700">
                  <button
                    onClick={() => navigation.navigate('privacy')}
                    className="text-primary-blue hover:text-primary-blue-dark underline transition-colors"
                  >
                    개인정보처리방침
                  </button>
                  에 동의합니다 <span className="text-error-red">*</span>
                </label>
              </div>

              {/* 약관 동의 에러 표시 */}
              {(form.touched.agreeToTerms && form.errors.agreeToTerms) && (
                <div className="text-body-small text-error-red">
                  이용약관에 동의해주세요.
                </div>
              )}
              {(form.touched.agreeToPrivacy && form.errors.agreeToPrivacy) && (
                <div className="text-body-small text-error-red">
                  개인정보처리방침에 동의해주세요.
                </div>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <InteractiveButton
              variant="primary"
              size="lg"
              onClick={handleRegister}
              className="w-full"
              disabled={loading.register || !form.isValid}
            >
              {loading.register ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  회원가입 중...
                </div>
              ) : (
                '회원가입하기'
              )}
            </InteractiveButton>

            {/* 로그인 링크 */}
            <div className="text-center">
              <span className="text-body-small text-gray-600">
                이미 계정이 있으신가요?{' '}
              </span>
              <button
                onClick={() => navigation.navigate('login')}
                className="text-body-small text-primary-blue hover:text-primary-blue-dark font-medium transition-colors"
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigation.navigate('home')}
            className="inline-flex items-center gap-2 text-body-small text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSendResetEmail = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      console.log('비밀번호 재설정 이메일 전송:', email);
    }, 1500);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <CheckCircle size={48} className="mx-auto text-success-green mb-4" />
            <h2 className="text-heading-3 text-gray-900 mb-4">이메일을 확인하세요</h2>
            <p className="text-body text-gray-600 mb-6">
              비밀번호 재설정 링크를 {email}로 보내드렸습니다.
              이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.
            </p>
            <div className="space-y-3">
              <InteractiveButton
                variant="primary"
                size="md"
                onClick={() => setIsEmailSent(false)}
                className="w-full"
              >
                이메일을 다시 보내기
              </InteractiveButton>
              <InteractiveButton
                variant="secondary"
                size="md"
                onClick={() => navigation.navigate('login')}
                className="w-full"
              >
                로그인으로 돌아가기
              </InteractiveButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <ImageWithFallback 
              src="figma:asset/4045e6f074ff4480cd95c7c5514e0728fe19fc42.png"
              alt="MyStoreStory 로고"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-heading-2 text-gray-900">
          비밀번호 재설정
        </h2>
        <p className="mt-2 text-center text-body text-gray-600">
          등록된 이메일로 재설정 링크를 보내드립니다
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-body-small text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="등록된 이메일을 입력하세요"
                />
              </div>
            </div>

            <InteractiveButton
              variant="primary"
              size="lg"
              onClick={handleSendResetEmail}
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? '전송 중...' : '재설정 링크 보내기'}
            </InteractiveButton>

            <div className="text-center">
              <button
                onClick={() => navigation.navigate('login')}
                className="text-body-small text-primary-blue hover:text-primary-blue-dark"
              >
                로그인으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WaitingApprovalPage() {
  const navigation = useNavigation();
  const [isChecking, setIsChecking] = useState(false);

  const handleRefreshStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // 임시로 앱빌더로 이동 (승인 완료)
      navigation.navigate('app-builder');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <AlertCircle size={48} className="mx-auto text-warning-yellow mb-4" />
          <h2 className="text-heading-3 text-gray-900 mb-4">플랜 승인 대기 중</h2>
          <p className="text-body text-gray-600 mb-6">
            회원가입이 완료되었습니다. 선택하신 플랜의 승인을 기다리고 있습니다.
            일반적으로 1-2시간 내에 승인이 완료됩니다.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-body-small font-medium text-gray-900 mb-2">승인 상태</h3>
            <div className="flex items-center justify-between">
              <span className="text-body-small text-gray-600">현재 상태:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-yellow-50 text-warning-yellow">
                승인 대기
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <InteractiveButton
              variant="primary"
              size="md"
              onClick={handleRefreshStatus}
              className="w-full"
              disabled={isChecking}
            >
              {isChecking ? '확인 중...' : '상태 새로고침'}
            </InteractiveButton>
            <InteractiveButton
              variant="secondary"
              size="md"
              onClick={() => navigation.navigate('support')}
              className="w-full"
            >
              고객지원 문의
            </InteractiveButton>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-body-small text-gray-500">
              승인이 완료되면 이메일로 알려드립니다.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigation.navigate('home')}
            className="inline-flex items-center gap-2 text-body-small text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}