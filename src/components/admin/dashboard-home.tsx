import React, { useState, useEffect } from 'react';
import { 
  Store, Users, TrendingUp, TrendingDown, Activity, Clock, Bell, 
  Search, Settings, Zap, UserPlus, Star, ShoppingCart, AlertCircle, 
  RefreshCw, CheckCircle, Edit, Trash2, Download, MoreHorizontal,
  Calendar, DollarSign, Package, Phone, Mail, MapPin, User,
  Eye, X, Save, Plus, Filter, Target, BarChart3, PieChart, LineChart,
  BarChart, Award, ArrowRight, UserCheck, UserX, Shield, Building
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { useNavigation } from '../system/app-router';

export function DashboardHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSystemNormal, setIsSystemNormal] = useState(true);
  const [widgetSettings, setWidgetSettings] = useState({
    kpiSize: [100],
    monitoringVisible: true,
    actionsVisible: true
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 긴급 알림 헤더 */}
      <UrgentNotificationHeader 
        isSystemNormal={isSystemNormal} 
        currentTime={currentTime}
        onRefresh={() => window.location.reload()}
      />

      {/* 메인 콘텐츠 */}
      <div className="p-6 pt-24">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 좌측: 핵심 KPI 카드 그리드 */}
          <div className="xl:col-span-2">
            <KPICardsGrid widgetSize={widgetSettings.kpiSize[0]} />
          </div>

          {/* 우측: 실시간 모니터링 패널 */}
          <div className="space-y-6">
            <RealtimeMonitoringPanel 
              visible={widgetSettings.monitoringVisible}
              actionsVisible={widgetSettings.actionsVisible}
            />
          </div>
        </div>

        {/* 하단: 위젯 커스터마이징 영역 */}
        <WidgetCustomizationArea 
          settings={widgetSettings}
          onSettingsChange={setWidgetSettings}
        />
      </div>
    </div>
  );
}

function UrgentNotificationHeader({ isSystemNormal, currentTime, onRefresh }: {
  isSystemNormal: boolean;
  currentTime: Date;
  onRefresh: () => void;
}) {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 ${
      isSystemNormal 
        ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
        : 'bg-gradient-to-r from-red-600 to-red-700'
    } text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSystemNormal ? (
            <Activity className="w-5 h-5 text-green-300" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-300" />
          )}
          <span className="font-semibold">
            {isSystemNormal ? '시스템 정상' : '긴급 알림: 결제 시스템 지연 발생'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm">
            {currentTime.toLocaleString('ko-KR')}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function KPICardsGrid({ widgetSize }: { widgetSize: number }) {
  const kpiData = [
    {
      title: '플랫폼 총 매출',
      value: '₩45,000,000,000',
      change: '+15.7%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '전체 상점 월 매출'
    },
    {
      title: '활성 상점',
      value: '523',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: <Store className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '현재 운영 중인 상점'
    },
    {
      title: '활성 사용자',
      value: '12,456',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '월간 활성 사용자'
    },
    {
      title: '일일 주문',
      value: '2,345',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '오늘 처리된 주문'
    },
    {
      title: '승인 대기',
      value: '23',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: <Clock className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '상점 승인 대기 중'
    },
    {
      title: '시스템 가용률',
      value: '99.8%',
      change: '+0.1%',
      changeType: 'positive' as const,
      icon: <Activity className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '전체 시스템 가용률'
    },
    {
      title: '월 신규 가입',
      value: '456',
      change: '+18.3%',
      changeType: 'positive' as const,
      icon: <UserPlus className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '이번 달 신규 가입자'
    },
    {
      title: '고객 만족도',
      value: '4.7/5.0',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: <Star className="w-6 h-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: '평균 고객 만족도'
    }
  ];

  const scaleFactor = widgetSize / 100;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">핵심 KPI</h2>
      <div 
        className="flex flex-col gap-4" 
        style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'top left' }}
      >
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
    </div>
  );
}

function KPICard({ title, value, change, changeType, icon, color, bgColor, description }: {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}) {
  return (
    <Card className="h-[120px] px-0 py-0 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 w-full relative overflow-hidden">
      {/* 상단 영역 (20px 높이) */}
      <div className="absolute top-0 left-0 right-0 h-[20px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${bgColor} ${color}`}>
            {icon}
          </div>
          <h3 className="text-base font-semibold text-gray-700">{title}</h3>
        </div>
        <div className={`flex items-center gap-1 ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'positive' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">{change}</span>
        </div>
      </div>
      
      {/* 중앙 영역 (60px 높이) */}
      <div className="absolute top-[20px] left-0 right-0 h-[60px] flex items-center justify-center">
        <p className="text-3xl font-bold text-gray-900 text-center">{value}</p>
      </div>
      
      {/* 하단 영역 (20px 높이) */}
      <div className="absolute bottom-0 left-0 right-0 h-[20px] flex items-center justify-center px-4">
        <p className="text-sm text-gray-500 text-center">{description}</p>
      </div>
    </Card>
  );
}

function RealtimeMonitoringPanel({ visible, actionsVisible }: {
  visible: boolean;
  actionsVisible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">실시간 모니터링</h2>
      
      {/* 시스템 상태 카드 */}
      <SystemStatusCard />
      
      {/* 실시간 알림 카드 */}
      <RealtimeNotificationsCard />
      
      {/* 빠른 액션 카드 */}
      {actionsVisible && <QuickActionsCard />}
    </div>
  );
}

function SystemStatusCard() {
  const systemStatus = [
    { name: '앱빌더', status: '정상', uptime: '99.9%', statusType: 'success' as const },
    { name: '결제 시스템', status: '정상', uptime: '99.8%', statusType: 'success' as const },
    { name: '알림 서비스', status: '점검 중', uptime: '98.5%', statusType: 'warning' as const },
    { name: '데이터베이스', status: '정상', uptime: '99.7%', statusType: 'success' as const }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">시스템 상태</h3>
      </div>
      
      <div className="space-y-3">
        {systemStatus.map((system, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{system.name}</p>
              <p className="text-sm text-gray-500">가동률: {system.uptime}</p>
            </div>
            <Badge 
              variant={system.statusType === 'success' ? 'default' : 'secondary'}
              className={
                system.statusType === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }
            >
              {system.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RealtimeNotificationsCard() {
  const notifications = [
    { type: '새로운 주문', content: '김치찌개 전문점', time: '2분 전', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { type: '상점 승인 요청', content: '피자나라', time: '5분 전', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { type: '신규 사용자', content: '홍길동', time: '10분 전', color: 'text-green-600', bgColor: 'bg-green-50' },
    { type: '시스템 오류', content: '결제 서비스 지연', time: '15분 전', color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">실시간 알림</h3>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${notification.bgColor.replace('bg-', 'bg-')}`} />
            <div className="flex-1">
              <p className={`font-medium ${notification.color}`}>{notification.type}</p>
              <p className="text-sm text-gray-600">{notification.content}</p>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function QuickActionsCard() {
  const { navigate } = useNavigation();
  
  const actions = [
    { 
      label: '상점 승인하기', 
      color: 'bg-blue-600 hover:bg-blue-700', 
      icon: <Store className="w-4 h-4" />,
      onClick: () => navigate('admin-stores'),
      description: '상점 관리 페이지로 이동'
    },
    { 
      label: '공지사항 작성', 
      color: 'bg-green-600 hover:bg-green-700', 
      icon: <Bell className="w-4 h-4" />,
      onClick: () => navigate('admin-notices'),
      description: '공지사항 관리 페이지로 이동'
    },
    { 
      label: '시스템 점검', 
      color: 'bg-orange-600 hover:bg-orange-700', 
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate('admin-settings'),
      description: '시스템 설정 페이지로 이동'
    },
    { 
      label: '데이터 백업', 
      color: 'bg-purple-600 hover:bg-purple-700', 
      icon: <Activity className="w-4 h-4" />,
      onClick: () => navigate('admin-settings'),
      description: '시스템 설정 페이지로 이동'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">빠른 액션</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            className={`w-full justify-start gap-2 text-white ${action.color} focus:ring-2 focus:ring-blue-300 transition-all duration-200`}
            size="sm"
            aria-label={action.description}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
      
      {/* 빠른 액션 도움말 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 각 버튼을 클릭하면 해당 관리 페이지로 바로 이동합니다
        </p>
      </div>
    </Card>
  );
}

function WidgetCustomizationArea({ settings, onSettingsChange }: {
  settings: any;
  onSettingsChange: (settings: any) => void;
}) {
  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">대시보드 설정</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 위젯 크기 조절 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">KPI 카드 크기</label>
          <Slider
            value={settings.kpiSize}
            onValueChange={(value) => onSettingsChange({
              ...settings,
              kpiSize: value
            })}
            max={150}
            min={50}
            step={10}
            className="w-full"
          />
          <p className="text-xs text-gray-500">{settings.kpiSize[0]}%</p>
        </div>
        
        {/* 모니터링 패널 표시/숨김 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">모니터링 패널</label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.monitoringVisible}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                monitoringVisible: checked
              })}
            />
            <span className="text-sm text-gray-600">
              {settings.monitoringVisible ? '표시' : '숨김'}
            </span>
          </div>
        </div>
        
        {/* 빠른 액션 표시/숨김 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">빠른 액션</label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.actionsVisible}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                actionsVisible: checked
              })}
            />
            <span className="text-sm text-gray-600">
              {settings.actionsVisible ? '표시' : '숨김'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm">
          설정 초기화
        </Button>
        <Button size="sm">
          개인화 설정 저장
        </Button>
      </div>
    </div>
  );
}