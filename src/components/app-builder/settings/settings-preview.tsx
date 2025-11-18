import React from 'react';
import { 
  Store, Clock, CreditCard, Bell, Shield, Settings,
  MapPin, Phone, Mail, Truck, Calendar, Sun,
  Smartphone, MessageSquare, AlertTriangle
} from 'lucide-react';
import { SettingsConfig } from '../../../hooks/useSettingsConfig';

interface SettingsPreviewProps {
  config: SettingsConfig;
  plan: 'Basic' | 'Pro' | 'Enterprise';
}

export function SettingsPreview({ config, plan }: SettingsPreviewProps) {
  return (
    <div className="space-y-6">
      {/* 기본 정보 미리보기 */}
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700">
          기본 정보
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.basicInfo.storeName && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">상점명</span>
              </div>
              <div className="text-xs text-gray-500">
                상점 기본 정보 관리
              </div>
            </div>
          )}
          
          {config.basicInfo.storeDescription && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">상점 설명</span>
              </div>
              <div className="text-xs text-gray-500">
                상점 소개 및 설명
              </div>
            </div>
          )}
          
          {config.basicInfo.storeAddress && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium">상점 주소</span>
              </div>
              <div className="text-xs text-gray-500">
                매장 위치 정보
              </div>
            </div>
          )}
          
          {config.basicInfo.contactInfo && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">연락처</span>
              </div>
              <div className="text-xs text-gray-500">
                전화번호, 이메일
              </div>
            </div>
          )}
          
          {config.basicInfo.storeLogo && plan !== 'Basic' && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">로고 설정</span>
              </div>
              <div className="text-xs text-gray-500">
                상점 로고 및 브랜딩
              </div>
            </div>
          )}
          
          {config.basicInfo.whiteLabeling && plan === 'Enterprise' && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-medium">화이트 라벨링</span>
              </div>
              <div className="text-xs text-gray-500">
                완전한 브랜드 커스터마이징
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 운영 시간 미리보기 */}
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700">
          운영 시간
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.operatingHours.weeklySchedule && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">주간 스케줄</span>
              </div>
              <div className="text-xs text-gray-500">
                요일별 운영 시간 설정
              </div>
            </div>
          )}
          
          {config.operatingHours.deliveryHours && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">배달 시간</span>
              </div>
              <div className="text-xs text-gray-500">
                배달 가능 시간 설정
              </div>
            </div>
          )}
          
          {config.operatingHours.seasonalHours && plan !== 'Basic' && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">계절별 시간</span>
              </div>
              <div className="text-xs text-gray-500">
                계절별 운영 시간 조정
              </div>
            </div>
          )}
          
          {config.operatingHours.breakTime && (
            <div className="p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">브레이크 타임</span>
              </div>
              <div className="text-xs text-gray-500">
                중간 휴게시간 설정
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 결제 설정 미리보기 */}
      {config.paymentSettings && plan !== 'Basic' && (
        <div className="space-y-3">
          <h4 className="text-body-small font-medium text-gray-700">
            결제 설정
          </h4>
          <div className="space-y-2">
            {config.paymentSettings.paymentMethods && (
              <div className="flex items-center gap-2 text-xs">
                <CreditCard className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600">결제 방법</span>
              </div>
            )}
            
            {config.paymentSettings.paymentProcessing && (
              <div className="flex items-center gap-2 text-xs">
                <Settings className="w-3 h-3 text-green-500" />
                <span className="text-gray-600">결제 처리</span>
              </div>
            )}
            
            {config.paymentSettings.refundPolicy && (
              <div className="flex items-center gap-2 text-xs">
                <Settings className="w-3 h-3 text-orange-500" />
                <span className="text-gray-600">환불 정책</span>
              </div>
            )}
            
            {config.paymentSettings.paymentSecurity && (
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-3 h-3 text-red-500" />
                <span className="text-gray-600">결제 보안</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 알림 설정 미리보기 */}
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700">
          알림 설정
        </h4>
        <div className="space-y-2">
          {config.notifications.orderNotifications && (
            <div className="flex items-center gap-2 text-xs">
              <Bell className="w-3 h-3 text-blue-500" />
              <span className="text-gray-600">주문 알림</span>
            </div>
          )}
          
          {config.notifications.emailNotifications && (
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-3 h-3 text-green-500" />
              <span className="text-gray-600">이메일 알림</span>
            </div>
          )}
          
          {config.notifications.smsNotifications && plan !== 'Basic' && (
            <div className="flex items-center gap-2 text-xs">
              <MessageSquare className="w-3 h-3 text-purple-500" />
              <span className="text-gray-600">SMS 알림</span>
            </div>
          )}
          
          {config.notifications.pushNotifications && plan !== 'Basic' && (
            <div className="flex items-center gap-2 text-xs">
              <Smartphone className="w-3 h-3 text-indigo-500" />
              <span className="text-gray-600">푸시 알림</span>
            </div>
          )}
          
          {config.notifications.basicAlerts && (
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className="w-3 h-3 text-orange-500" />
              <span className="text-gray-600">기본 알림</span>
            </div>
          )}
        </div>
      </div>

      {/* 보안 설정 미리보기 */}
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700">
          보안 설정
        </h4>
        <div className="space-y-2">
          {config.security.passwordPolicy && (
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-3 h-3 text-red-500" />
              <span className="text-gray-600">비밀번호 정책</span>
            </div>
          )}
          
          {config.security.twoFactorAuth && (
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-3 h-3 text-blue-500" />
              <span className="text-gray-600">2단계 인증</span>
            </div>
          )}
          
          {config.security.sessionManagement && (
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 text-green-500" />
              <span className="text-gray-600">세션 관리</span>
            </div>
          )}
        </div>
      </div>

      {/* 설정 요약 */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="text-body-small font-medium text-gray-700 mb-3">
          설정 요약
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Object.values(config.basicInfo).filter(Boolean).length}
            </div>
            <div className="text-xs text-gray-600">기본 정보</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {Object.values(config.operatingHours).filter(Boolean).length}
            </div>
            <div className="text-xs text-gray-600">운영 설정</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {Object.values(config.notifications).filter(Boolean).length}
            </div>
            <div className="text-xs text-gray-600">알림 설정</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {Object.values(config.security).filter(Boolean).length}
            </div>
            <div className="text-xs text-gray-600">보안 설정</div>
          </div>
        </div>
      </div>

      {/* 플랜별 추가 정보 */}
      <div className="p-3 border rounded-lg bg-blue-50">
        <div className="flex items-center justify-between">
          <span className="text-body-small font-medium text-blue-900">
            현재 플랜: {plan}
          </span>
          <span className="text-xs text-blue-700">
            {plan === 'Basic' ? '기본 기능' :
             plan === 'Pro' ? '고급 기능 포함' :
             '모든 기능 포함'}
          </span>
        </div>
      </div>
    </div>
  );
}