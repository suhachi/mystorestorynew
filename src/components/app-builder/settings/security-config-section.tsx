import React from 'react';
import { Shield, Lock, Key, UserCheck, Eye, Clock } from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { SettingsConfig } from '../../../hooks/useSettingsConfig';

interface SecurityConfigSectionProps {
  config: SettingsConfig;
  onChange: (updates: Partial<SettingsConfig['security']>) => void;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  canUseFeature: (feature: string) => boolean;
}

export function SecurityConfigSection({ 
  config, 
  onChange, 
  currentPlan, 
  canUseFeature 
}: SecurityConfigSectionProps) {
  const handleToggle = (key: keyof SettingsConfig['security'], value: boolean) => {
    onChange({ [key]: value });
  };

  const securityFeatures = [
    {
      key: 'passwordPolicy' as const,
      icon: Lock,
      title: '비밀번호 정책',
      description: '강력한 비밀번호 요구사항 설정',
      color: 'text-red-600',
      required: true
    },
    {
      key: 'twoFactorAuth' as const,
      icon: UserCheck,
      title: '2단계 인증',
      description: '로그인 시 ��가 인증 단계',
      color: 'text-blue-600',
      required: false
    },
    {
      key: 'sessionManagement' as const,
      icon: Clock,
      title: '세션 관리',
      description: '자동 로그아웃 및 세션 보안',
      color: 'text-green-600',
      required: false
    }
  ];

  const renderFeatureItem = (feature: any) => {
    const IconComponent = feature.icon;
    const isEnabled = config.security[feature.key] || false;
    
    return (
      <div 
        key={feature.key}
        className="p-4 border rounded-lg bg-white hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-gray-50">
              <IconComponent className={`w-5 h-5 ${feature.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-body font-medium text-gray-900">
                  {feature.title}
                </h4>
                {feature.required && (
                  <Badge variant="destructive" className="text-xs">
                    필수
                  </Badge>
                )}
              </div>
              <p className="text-body-small text-gray-600">
                {feature.description}
              </p>
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => handleToggle(feature.key, checked)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 보안 설정 */}
      <Card className="p-6">
        <h3 className="text-heading-4 text-gray-900 mb-4">보안 설정</h3>
        <p className="text-body-small text-gray-600 mb-6">
          상점과 고객 데이터를 보호하기 위한 보안 설정입니다.
        </p>
        <div className="grid gap-4">
          {securityFeatures.map(feature => renderFeatureItem(feature))}
        </div>
      </Card>

      {/* 비밀번호 정책 상세 */}
      {config.security.passwordPolicy && (
        <Card className="p-6 bg-red-50">
          <h3 className="text-heading-4 text-gray-900 mb-4">비밀번호 정책</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Key className="w-4 h-4 text-red-600" />
                <div>
                  <div className="text-body-small font-medium text-gray-900">최소 길이</div>
                  <div className="text-xs text-gray-600">8자 이상</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Key className="w-4 h-4 text-red-600" />
                <div>
                  <div className="text-body-small font-medium text-gray-900">문자 조합</div>
                  <div className="text-xs text-gray-600">대문자, 소문자, 숫자, 특수문자</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Clock className="w-4 h-4 text-orange-600" />
                <div>
                  <div className="text-body-small font-medium text-gray-900">변경 주기</div>
                  <div className="text-xs text-gray-600">90일마다 변경 권장</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-body-small font-medium text-gray-900">이력 관리</div>
                  <div className="text-xs text-gray-600">최근 5개 비밀번호 재사용 금지</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 2단계 인증 */}
      {config.security.twoFactorAuth && (
        <Card className="p-6 bg-blue-50">
          <h3 className="text-heading-4 text-gray-900 mb-4">2단계 인증</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span className="text-body font-medium text-gray-900">SMS 인증</span>
              </div>
              <div className="space-y-2 text-body-small text-gray-600">
                <div>• 휴대폰 번호 인증</div>
                <div>• 6자리 인증번호</div>
                <div>• 3분 내 입력</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="text-body font-medium text-gray-900">앱 인증</span>
              </div>
              <div className="space-y-2 text-body-small text-gray-600">
                <div>• Google Authenticator</div>
                <div>• 30초 갱신</div>
                <div>• 오프라인 지원</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <span className="text-body font-medium text-gray-900">이메일 인증</span>
              </div>
              <div className="space-y-2 text-body-small text-gray-600">
                <div>• 이메일 링크 클릭</div>
                <div>• 10분 유효</div>
                <div>• 백업 방법</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 세션 관리 */}
      {config.security.sessionManagement && (
        <Card className="p-6 bg-green-50">
          <h3 className="text-heading-4 text-gray-900 mb-4">세션 관리</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-body font-medium text-gray-900">자동 로그아웃</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Clock className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-body-small font-medium text-gray-900">비활성 시간</div>
                    <div className="text-xs text-gray-600">30분 후 자동 로그아웃</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-body-small font-medium text-gray-900">보안 로그아웃</div>
                    <div className="text-xs text-gray-600">의심스러운 활동 감지 시</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-body font-medium text-gray-900">접근 제어</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-body-small font-medium text-gray-900">로그인 기록</div>
                    <div className="text-xs text-gray-600">접속 시간, IP 주소 기록</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Lock className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-body-small font-medium text-gray-900">다중 기기 제한</div>
                    <div className="text-xs text-gray-600">최대 3개 기기 동시 접속</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 보안 수준 표시 */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-heading-4 text-gray-900 mb-4">보안 수준</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              Object.values(config.security).filter(Boolean).length >= 2 
                ? 'text-green-600' 
                : Object.values(config.security).filter(Boolean).length >= 1
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              {Object.values(config.security).filter(Boolean).length >= 2 ? '높음' :
               Object.values(config.security).filter(Boolean).length >= 1 ? '보통' : '낮음'}
            </div>
            <div className="text-body-small text-gray-600">현재 보안 수준</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(config.security).filter(Boolean).length}
            </div>
            <div className="text-body-small text-gray-600">활성화된 보안 기능</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              config.security.passwordPolicy && config.security.twoFactorAuth 
                ? 'text-green-600' 
                : 'text-orange-600'
            }`}>
              {config.security.passwordPolicy && config.security.twoFactorAuth ? '최적' : '개선 필요'}
            </div>
            <div className="text-body-small text-gray-600">보안 상태</div>
          </div>
        </div>
        
        {(!config.security.passwordPolicy || !config.security.twoFactorAuth) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Shield className="w-4 h-4" />
              <span className="text-body-small font-medium">보안 강화 권장</span>
            </div>
            <div className="text-xs text-yellow-700 mt-1">
              최적의 보안을 위해 비밀번호 정책과 2단계 인증을 모두 활성화하는 것을 권장합니다.
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}