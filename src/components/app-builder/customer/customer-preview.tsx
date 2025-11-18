import React from 'react';
import { CustomerConfig } from '../../../hooks/useCustomerConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Users, User, Crown, Star, Gift, Target, 
  Mail, MessageSquare, Bell, Brain, Zap, 
  BarChart3, TrendingUp, Heart, Shield,
  Clock, Calendar, Award, Sparkles, Activity
} from 'lucide-react';

interface CustomerPreviewProps {
  config: CustomerConfig;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  isCompact?: boolean;
}

export function CustomerPreview({ config, plan, isCompact = false }: CustomerPreviewProps) {
  
  // Mock 고객 데이터
  const mockCustomers = [
    { id: 1, name: '김민수', tier: 'vip', points: 2450, visits: 15, spent: 245000, lastVisit: '2024-01-20' },
    { id: 2, name: '이영희', tier: 'gold', points: 1560, visits: 8, spent: 156000, lastVisit: '2024-01-19' },
    { id: 3, name: '박철수', tier: 'silver', points: 890, visits: 5, spent: 89000, lastVisit: '2024-01-18' },
    { id: 4, name: '정수연', tier: 'bronze', points: 340, visits: 3, spent: 34000, lastVisit: '2024-01-17' },
    { id: 5, name: '최지훈', tier: 'gold', points: 1820, visits: 12, spent: 182000, lastVisit: '2024-01-16' }
  ];

  const mockSegments = [
    { name: '신규 고객', count: 45, color: 'blue', growth: 12 },
    { name: '단골 고객', count: 123, color: 'green', growth: 8 },
    { name: '휴면 고객', count: 34, color: 'orange', growth: -5 },
    { name: 'VIP 고객', count: 18, color: 'purple', growth: 25 }
  ];

  // 고객 관리 미리보기 렌더링
  const renderCustomerManagement = () => {
    if (!config.customerManagement.customerList) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Users className="w-3 h-3" />
          고객 관리
        </h4>
        
        <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-2`}>
          {config.customerManagement.customerList && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-2 h-2 text-blue-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  고객 목록
                </span>
              </div>
              <div className="text-xs text-gray-500">
                전체 고객 관리
              </div>
            </div>
          )}
          
          {config.customerManagement.basicInfo && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <User className="w-2 h-2 text-green-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  기본 정보
                </span>
              </div>
              <div className="text-xs text-gray-500">
                연락처, 주소 관리
              </div>
            </div>
          )}
          
          {config.customerManagement.customerTiers && plan !== 'Basic' && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Crown className="w-2 h-2 text-purple-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  고객 등급
                </span>
              </div>
              <div className="text-xs text-gray-500">
                VIP, Gold, Silver
              </div>
            </div>
          )}
          
          {config.customerManagement.advancedSegmentation && plan === 'Enterprise' && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-2 h-2 text-violet-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  고급 세분화
                </span>
              </div>
              <div className="text-xs text-gray-500">
                AI 기반 세분화
              </div>
            </div>
          )}
        </div>

        {/* 고객 관리 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.customerManagement.orderHistory && (
            <Badge variant="outline" className="text-xs h-4">
              주문 이력
            </Badge>
          )}
          {config.customerManagement.customerSegmentation && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Crown className="w-2 h-2 mr-1" />
              세분화
            </Badge>
          )}
          {config.customerManagement.aiInsights && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Brain className="w-2 h-2 mr-1" />
              AI 인사이트
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 고객 등급 미리보기 렌더링
  const renderCustomerTiers = () => {
    if (!config.loyaltyProgram?.tierBenefits || plan === 'Basic') return null;

    const tiers = [
      { name: 'VIP', color: 'purple', count: 18, percentage: 8 },
      { name: 'Gold', color: 'yellow', count: 45, percentage: 20 },
      { name: 'Silver', color: 'gray', count: 89, percentage: 40 },
      { name: 'Bronze', color: 'orange', count: 73, percentage: 32 }
    ];

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Crown className="w-3 h-3" />
          고객 등급
        </h4>
        
        <div className="space-y-2">
          {tiers.slice(0, isCompact ? 3 : 4).map((tier, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-white">
              <div className={`w-3 h-3 rounded-full ${getTierDotColor(tier.color)}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">{tier.name}</span>
                  <span className="text-xs text-gray-500">{tier.count}명</span>
                </div>
                <div className="mt-1">
                  <Progress value={tier.percentage} className="h-1" />
                </div>
              </div>
              <div className="text-xs text-gray-500">{tier.percentage}%</div>
            </div>
          ))}
        </div>

        {/* 등급 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.loyaltyProgram.pointSystem && (
            <Badge variant="outline" className="text-xs h-4">
              <Star className="w-2 h-2 mr-1" />
              포인트
            </Badge>
          )}
          {config.loyaltyProgram.rewardProgram && (
            <Badge variant="outline" className="text-xs h-4">
              <Gift className="w-2 h-2 mr-1" />
              리워드
            </Badge>
          )}
          {config.loyaltyProgram.stampSystem && (
            <Badge variant="outline" className="text-xs h-4">
              <Award className="w-2 h-2 mr-1" />
              스탬프
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 고객 세분화 미리보기 렌더링
  const renderSegmentation = () => {
    if (!config.segmentation?.behavioralSegmentation || plan === 'Basic') return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Target className="w-3 h-3" />
          고객 세분화
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {mockSegments.slice(0, isCompact ? 2 : 4).map((segment, index) => (
            <div key={index} className="p-2 border rounded-lg bg-white">
              <div className="flex items-center gap-1 mb-1">
                <div className={`w-2 h-2 rounded-full ${getSegmentDotColor(segment.color)}`} />
                <span className="text-xs font-medium text-gray-900 truncate">
                  {segment.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{segment.count}명</span>
                <span className={`text-xs ${segment.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {segment.growth > 0 ? '+' : ''}{segment.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 세분화 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.segmentation.behavioralSegmentation && (
            <Badge variant="outline" className="text-xs h-4">
              행동 기반
            </Badge>
          )}
          {config.segmentation.demographicSegmentation && (
            <Badge variant="outline" className="text-xs h-4">
              인구 통계
            </Badge>
          )}
          {config.segmentation.customSegments && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Sparkles className="w-2 h-2 mr-1" />
              커스텀
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 마케팅 도구 미리보기 렌더링
  const renderMarketing = () => {
    if (!config.marketing?.emailMarketing || plan === 'Basic') return null;

    const channels = [];
    if (config.marketing.emailMarketing) channels.push({ type: 'email', name: '이메일', icon: Mail, count: 1250 });
    if (config.marketing.smsMarketing) channels.push({ type: 'sms', name: 'SMS', icon: MessageSquare, count: 890 });
    if (config.marketing.pushNotifications) channels.push({ type: 'push', name: '푸시', icon: Bell, count: 2340 });

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Mail className="w-3 h-3" />
          마케팅 도구
        </h4>
        
        <div className="space-y-2">
          {channels.slice(0, isCompact ? 2 : 3).map((channel, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <channel.icon className="w-3 h-3 text-blue-500" />
              <span className="text-gray-600 flex-1">{channel.name}</span>
              <span className="text-gray-500">{channel.count}명</span>
            </div>
          ))}
        </div>

        {/* 마케팅 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.marketing.campaignManagement && (
            <Badge variant="outline" className="text-xs h-4">
              <Activity className="w-2 h-2 mr-1" />
              캠페인 관리
            </Badge>
          )}
          {config.marketing.personalizedCampaigns && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Brain className="w-2 h-2 mr-1" />
              개인화
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 최근 고객 미리보기 렌더링
  const renderRecentCustomers = () => {
    if (!config.customerManagement.customerList) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          최근 고객
        </h4>
        
        <div className="space-y-2">
          {mockCustomers.slice(0, isCompact ? 3 : 4).map((customer, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-white">
              <div className={`w-3 h-3 rounded-full ${getTierColor(customer.tier)}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900">{customer.name}</span>
                  <span className="text-xs text-gray-500">({getTierName(customer.tier)})</span>
                </div>
                <div className="text-xs text-gray-500">
                  {customer.visits}회 방문 • ₩{customer.spent.toLocaleString()}
                </div>
              </div>
              {config.loyaltyProgram?.pointSystem && plan !== 'Basic' && (
                <div className="text-xs text-purple-600">
                  {customer.points}P
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 고객 분석 미리보기 렌더링
  const renderAnalytics = () => {
    if (!config.analytics?.customerBehavior || plan === 'Basic') return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          고객 분석
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 border rounded-lg bg-white text-center">
            <div className="text-xs font-medium text-blue-800">평균 방문</div>
            <div className="text-xs text-blue-600">8.5회</div>
          </div>
          
          <div className="p-2 border rounded-lg bg-white text-center">
            <div className="text-xs font-medium text-green-800">생애 가치</div>
            <div className="text-xs text-green-600">₩156K</div>
          </div>
          
          {!isCompact && (
            <>
              <div className="p-2 border rounded-lg bg-white text-center">
                <div className="text-xs font-medium text-purple-800">재방문율</div>
                <div className="text-xs text-purple-600">74%</div>
              </div>
              
              <div className="p-2 border rounded-lg bg-white text-center">
                <div className="text-xs font-medium text-orange-800">만족도</div>
                <div className="text-xs text-orange-600">4.2/5</div>
              </div>
            </>
          )}
        </div>

        {/* 분석 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.analytics.purchasePatterns && (
            <Badge variant="outline" className="text-xs h-4">
              <TrendingUp className="w-2 h-2 mr-1" />
              구매 패턴
            </Badge>
          )}
          {config.analytics.retentionAnalysis && (
            <Badge variant="outline" className="text-xs h-4">
              <Heart className="w-2 h-2 mr-1" />
              고객 유지
            </Badge>
          )}
          {config.analytics.predictiveInsights && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Brain className="w-2 h-2 mr-1" />
              예측 분석
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderCustomerManagement()}
      {renderCustomerTiers()}
      {renderRecentCustomers()}
      {renderSegmentation()}
      {renderMarketing()}
      {renderAnalytics()}
    </div>
  );
}

// 헬퍼 함수들
function getTierColor(tier: string) {
  const colors: Record<string, string> = {
    vip: 'bg-purple-500',
    gold: 'bg-yellow-500',
    silver: 'bg-gray-400',
    bronze: 'bg-orange-500'
  };
  return colors[tier] || 'bg-gray-400';
}

function getTierName(tier: string) {
  const names: Record<string, string> = {
    vip: 'VIP',
    gold: 'Gold',
    silver: 'Silver',
    bronze: 'Bronze'
  };
  return names[tier] || 'Bronze';
}

function getTierDotColor(color: string) {
  const colors: Record<string, string> = {
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-400',
    orange: 'bg-orange-500'
  };
  return colors[color] || 'bg-gray-400';
}

function getSegmentDotColor(color: string) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500'
  };
  return colors[color] || 'bg-gray-500';
}