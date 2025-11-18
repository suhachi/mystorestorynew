import React, { useState, useEffect, useMemo } from 'react';
import { useApiIntegration, NotificationTemplate, NotificationRequest, NotificationResponse } from './api-integration-system';
import { useRealtimeData } from './realtime-data-context';
import { InteractiveButton } from '../interactions/interactive-button';
import { InteractiveModal } from '../interactions/interactive-modal';
import { InteractiveInput } from '../interactions/interactive-input';
import { 
  Bell, Send, MessageSquare, Mail, Smartphone, 
  Users, Calendar, Clock, CheckCircle, XCircle,
  AlertTriangle, Settings, Plus, Edit, Trash2,
  Eye, MoreVertical, Filter, Download, Upload,
  Zap, Target, TrendingUp, BarChart3, Activity,
  Globe, Shield, RefreshCw, Search, Play, Pause,
  Volume2, VolumeX, User, Tag, FileText, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// 알림 타입별 색상
const notificationTypeColors = {
  push: 'bg-blue-500',
  email: 'bg-green-500',
  sms: 'bg-purple-500'
} as const;

const notificationTypeTexts = {
  push: '푸시 알림',
  email: '이메일',
  sms: 'SMS'
} as const;

// 우선순위별 색상
const priorityColors = {
  low: 'bg-gray-500',
  normal: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
} as const;

const priorityTexts = {
  low: '낮음',
  normal: '보통',
  high: '높음',
  urgent: '긴급'
} as const;

// 알림 API 대시보드
export function NotificationApiDashboard() {
  const { 
    sendNotification, 
    sendBulkNotifications,
    scheduleNotification,
    getNotificationTemplates,
    createNotificationTemplate,
    state
  } = useApiIntegration();
  const { state: realtimeState } = useRealtimeData();

  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'templates' | 'history' | 'analytics' | 'settings'>('overview');
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false);
  
  // 알림 통계 데이터
  const notificationStats = {
    totalSent: 15420,
    todaySent: 245,
    deliveryRate: 94.5,
    openRate: 23.8,
    clickRate: 3.2,
    avgResponseTime: 0.85, // 초
    activeTemplates: 12,
    scheduledNotifications: 8,
    totalRecipients: 5280,
    monthlyGrowth: 18.3
  };

  // 알림 발송 현황 데이터
  const hourlyNotificationData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}시`,
    push: Math.floor(Math.random() * 50) + 10,
    email: Math.floor(Math.random() * 30) + 5,
    sms: Math.floor(Math.random() * 20) + 2
  }));

  // 알림 타입별 성과 데이터
  const typePerformanceData = [
    { name: '푸시 알림', sent: 8500, delivered: 8100, opened: 2400, clicked: 280, rate: 95.3 },
    { name: '이메일', sent: 4200, delivered: 3980, opened: 950, clicked: 180, rate: 94.8 },
    { name: 'SMS', sent: 2720, delivered: 2650, opened: 1200, clicked: 95, rate: 97.4 }
  ];

  // 최근 알림 히스토리
  const recentNotifications = Array.from({ length: 10 }, (_, i) => ({
    id: `notif_${1000 + i}`,
    template: templates[Math.floor(Math.random() * templates.length)]?.name || '주문 확인',
    type: ['push', 'email', 'sms'][Math.floor(Math.random() * 3)] as 'push' | 'email' | 'sms',
    recipients: Math.floor(Math.random() * 500) + 50,
    status: ['sent', 'delivered', 'failed'][Math.floor(Math.random() * 3)] as 'sent' | 'delivered' | 'failed',
    sentAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    deliveryRate: Math.floor(Math.random() * 10) + 90
  }));

  // 컴포넌트 마운트 시 템플릿 로드
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templateList = await getNotificationTemplates();
        setTemplates(templateList);
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    };

    loadTemplates();
  }, [getNotificationTemplates]);

  // 단일 알림 발송
  const handleSendNotification = async (request: NotificationRequest) => {
    try {
      const result = await sendNotification(request);
      console.log('Notification sent:', result);
      alert('알림이 성공적으로 발송되었습니다!');
      setIsSendModalOpen(false);
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('알림 발송 중 오류가 발생했습니다.');
    }
  };

  // 대량 알림 발송
  const handleBulkSend = async (requests: NotificationRequest[]) => {
    try {
      const results = await sendBulkNotifications(requests);
      console.log('Bulk notifications sent:', results);
      alert(`${results.length}개의 알림이 성공적으로 발송되었습니다!`);
    } catch (error) {
      console.error('Failed to send bulk notifications:', error);
      alert('대량 알림 발송 중 오류가 발생했습니다.');
    }
  };

  // 예약 알림 설정
  const handleScheduleNotification = async (request: NotificationRequest, scheduledAt: Date) => {
    try {
      const scheduleId = await scheduleNotification(request, scheduledAt);
      console.log('Notification scheduled:', scheduleId);
      alert('알림이 성공적으로 예약되었습니다!');
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      alert('알림 예약 중 오류가 발생했습니다.');
    }
  };

  // 템플릿 생성
  const handleCreateTemplate = async (templateData: Omit<NotificationTemplate, 'id'>) => {
    try {
      const newTemplate = await createNotificationTemplate(templateData);
      setTemplates(prev => [...prev, newTemplate]);
      setIsTemplateModalOpen(false);
      alert('템플릿이 성공적으로 생성되었습니다!');
    } catch (error) {
      console.error('Failed to create template:', error);
      alert('템플릿 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-heading-2 text-gray-900">알림 API 관리</h2>
          <p className="text-body text-gray-600">
            푸시, 이메일, SMS 알림을 통합 관리하세요
          </p>
        </div>
        
        <div className="flex gap-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('알림 데이터 내보내기')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            리포트 다운로드
          </InteractiveButton>
          <InteractiveButton
            variant="primary"
            size="sm"
            onClick={() => setIsSendModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            알림 보내기
          </InteractiveButton>
        </div>
      </div>

      {/* API 연결 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NotificationServiceStatus 
          name="FCM (Firebase)"
          type="push"
          status="healthy"
          responseTime={120}
          dailyQuota={100000}
          usedQuota={8500}
        />
        <NotificationServiceStatus 
          name="SendGrid"
          type="email"
          status="healthy"
          responseTime={850}
          dailyQuota={50000}
          usedQuota={4200}
        />
        <NotificationServiceStatus 
          name="Twilio SMS"
          type="sms"
          status="degraded"
          responseTime={2300}
          dailyQuota={10000}
          usedQuota={2720}
        />
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">개요</span>
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">발송</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">템플릿</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">히스토리</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">분석</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">설정</span>
          </TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <NotificationOverview 
            stats={notificationStats}
            hourlyData={hourlyNotificationData}
            typePerformanceData={typePerformanceData}
            recentNotifications={recentNotifications}
          />
        </TabsContent>

        {/* 발송 탭 */}
        <TabsContent value="send" className="space-y-6">
          <NotificationSender 
            templates={templates}
            onSendNotification={handleSendNotification}
            onBulkSend={handleBulkSend}
            onScheduleNotification={handleScheduleNotification}
          />
        </TabsContent>

        {/* 템플릿 탭 */}
        <TabsContent value="templates" className="space-y-6">
          <NotificationTemplatesManagement 
            templates={templates}
            onCreateTemplate={() => setIsTemplateModalOpen(true)}
            onEditTemplate={(template) => {
              setSelectedTemplate(template);
              setIsEditTemplateModalOpen(true);
            }}
            onDeleteTemplate={(templateId) => {
              setTemplates(prev => prev.filter(t => t.id !== templateId));
            }}
          />
        </TabsContent>

        {/* 히스토리 탭 */}
        <TabsContent value="history" className="space-y-6">
          <NotificationHistory 
            notifications={recentNotifications}
          />
        </TabsContent>

        {/* 분석 탭 */}
        <TabsContent value="analytics" className="space-y-6">
          <NotificationAnalytics 
            hourlyData={hourlyNotificationData}
            typePerformanceData={typePerformanceData}
            stats={notificationStats}
          />
        </TabsContent>

        {/* 설정 탭 */}
        <TabsContent value="settings" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>

      {/* 모달들 */}
      <InteractiveModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="알림 보내기"
        size="lg"
      >
        <NotificationSendModal 
          templates={templates}
          onSend={handleSendNotification}
          onClose={() => setIsSendModalOpen(false)}
        />
      </InteractiveModal>

      <InteractiveModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="새 템플릿 만들기"
        size="md"
      >
        <NotificationTemplateModal 
          onSave={handleCreateTemplate}
          onClose={() => setIsTemplateModalOpen(false)}
        />
      </InteractiveModal>

      <InteractiveModal
        isOpen={isEditTemplateModalOpen}
        onClose={() => setIsEditTemplateModalOpen(false)}
        title="템플릿 편집"
        size="md"
      >
        {selectedTemplate && (
          <NotificationTemplateModal 
            template={selectedTemplate}
            onSave={(templateData) => {
              const updatedTemplate = { ...selectedTemplate, ...templateData };
              setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
              setIsEditTemplateModalOpen(false);
            }}
            onClose={() => setIsEditTemplateModalOpen(false)}
          />
        )}
      </InteractiveModal>
    </div>
  );
}

// 알림 서비스 상태 컴포넌트
function NotificationServiceStatus({ 
  name, 
  type, 
  status, 
  responseTime, 
  dailyQuota, 
  usedQuota 
}: {
  name: string;
  type: 'push' | 'email' | 'sms';
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  dailyQuota: number;
  usedQuota: number;
}) {
  const statusColors = {
    healthy: 'bg-green-100 text-green-700 border-green-200',
    degraded: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    down: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    healthy: CheckCircle,
    degraded: AlertTriangle,
    down: XCircle
  };

  const typeIcons = {
    push: Bell,
    email: Mail,
    sms: Smartphone
  };

  const StatusIcon = statusIcons[status];
  const TypeIcon = typeIcons[type];
  const usagePercentage = (usedQuota / dailyQuota) * 100;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${notificationTypeColors[type]} bg-opacity-10`}>
              <TypeIcon className={`w-4 h-4 text-${type === 'push' ? 'blue' : type === 'email' ? 'green' : 'purple'}-600`} />
            </div>
            <div>
              <h3 className="text-body text-gray-900">{name}</h3>
              <p className="text-caption text-gray-500">{notificationTypeTexts[type]}</p>
            </div>
          </div>
          <Badge className={statusColors[status]}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status === 'healthy' ? '정상' : status === 'degraded' ? '지연' : '오류'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-body-small">
            <span className="text-gray-600">응답 시간</span>
            <span className="text-gray-900">{responseTime}ms</span>
          </div>
          <div className="flex justify-between text-body-small">
            <span className="text-gray-600">일일 사용량</span>
            <span className="text-gray-900">
              {usedQuota.toLocaleString()} / {dailyQuota.toLocaleString()}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

// 알림 개요 컴포넌트
function NotificationOverview({ 
  stats, 
  hourlyData, 
  typePerformanceData, 
  recentNotifications 
}: {
  stats: typeof notificationStats;
  hourlyData: any[];
  typePerformanceData: any[];
  recentNotifications: any[];
}) {
  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">총 발송</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.totalSent.toLocaleString()}
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  오늘: {stats.todaySent}건
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">전달률</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.deliveryRate}%
                </p>
                <div className="mt-2">
                  <Progress value={stats.deliveryRate} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">열람률</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.openRate}%
                </p>
                <p className="text-body-small text-gray-500 mt-1">
                  클릭률: {stats.clickRate}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-small text-gray-600">수신자</p>
                <p className="text-heading-3 text-gray-900">
                  {stats.totalRecipients.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-body-small text-green-500">
                    +{stats.monthlyGrowth}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 시간별 발송 현황 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              시간별 발송 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="push" fill="#3b82f6" name="푸시" />
                  <Bar dataKey="email" fill="#10b981" name="이메일" />
                  <Bar dataKey="sms" fill="#8b5cf6" name="SMS" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              타입별 성과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typePerformanceData.map(item => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-gray-900">{item.name}</span>
                    <div className="flex items-center gap-4 text-body-small">
                      <span className="text-gray-600">발송: {item.sent.toLocaleString()}</span>
                      <span className="text-green-600">전달률: {item.rate}%</span>
                    </div>
                  </div>
                  <Progress value={item.rate} className="h-2" />
                  <div className="flex justify-between text-caption text-gray-500">
                    <span>전달: {item.delivered.toLocaleString()}</span>
                    <span>열람: {item.opened.toLocaleString()}</span>
                    <span>클릭: {item.clicked.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 알림 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            최근 발송 알림
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.slice(0, 5).map(notification => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${notificationTypeColors[notification.type]}`} />
                  <div>
                    <p className="text-body-small text-gray-900">{notification.template}</p>
                    <p className="text-caption text-gray-500">
                      {notification.recipients.toLocaleString()}명 · {notification.sentAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={
                    notification.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    notification.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {notification.status === 'delivered' ? '전달완료' :
                     notification.status === 'sent' ? '발송완료' : '실패'}
                  </Badge>
                  <p className="text-caption text-gray-500 mt-1">
                    전달률: {notification.deliveryRate}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 알림 발송 컴포넌트
function NotificationSender({ 
  templates, 
  onSendNotification, 
  onBulkSend, 
  onScheduleNotification 
}: {
  templates: NotificationTemplate[];
  onSendNotification: (request: NotificationRequest) => void;
  onBulkSend: (requests: NotificationRequest[]) => void;
  onScheduleNotification: (request: NotificationRequest, scheduledAt: Date) => void;
}) {
  const [selectedMode, setSelectedMode] = useState<'single' | 'bulk' | 'scheduled'>('single');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">알림 발송</h3>
        <div className="flex gap-2">
          <InteractiveButton
            variant={selectedMode === 'single' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedMode('single')}
          >
            개별 발송
          </InteractiveButton>
          <InteractiveButton
            variant={selectedMode === 'bulk' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedMode('bulk')}
          >
            대량 발송
          </InteractiveButton>
          <InteractiveButton
            variant={selectedMode === 'scheduled' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedMode('scheduled')}
          >
            예약 발송
          </InteractiveButton>
        </div>
      </div>

      {selectedMode === 'single' && (
        <SingleNotificationSender 
          templates={templates}
          onSend={onSendNotification}
        />
      )}

      {selectedMode === 'bulk' && (
        <BulkNotificationSender 
          templates={templates}
          onSend={onBulkSend}
        />
      )}

      {selectedMode === 'scheduled' && (
        <ScheduledNotificationSender 
          templates={templates}
          onSchedule={onScheduleNotification}
        />
      )}
    </div>
  );
}

// 개별 알림 발송 컴포넌트
function SingleNotificationSender({ 
  templates, 
  onSend 
}: {
  templates: NotificationTemplate[];
  onSend: (request: NotificationRequest) => void;
}) {
  const [formData, setFormData] = useState({
    templateId: '',
    recipient: '',
    recipientType: 'email' as 'user' | 'phone' | 'email',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    variables: {} as Record<string, string>
  });

  const selectedTemplate = templates.find(t => t.id === formData.templateId);

  const handleSend = () => {
    if (!formData.templateId || !formData.recipient) return;

    const request: NotificationRequest = {
      templateId: formData.templateId,
      recipients: [{
        type: formData.recipientType,
        value: formData.recipient
      }],
      variables: formData.variables,
      priority: formData.priority
    };

    onSend(request);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-label text-gray-700 mb-2 block">템플릿 선택 *</label>
            <Select value={formData.templateId} onValueChange={(value) => setFormData({...formData, templateId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="템플릿을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {templates.filter(t => t.isActive).map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({notificationTypeTexts[template.type]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-label text-gray-700 mb-2 block">수신자 타입 *</label>
            <Select value={formData.recipientType} onValueChange={(value) => setFormData({...formData, recipientType: value as typeof formData.recipientType})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">이메일</SelectItem>
                <SelectItem value="phone">전화번호</SelectItem>
                <SelectItem value="user">사용자 ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-label text-gray-700 mb-2 block">수신자 *</label>
            <InteractiveInput
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({...formData, recipient: e.target.value})}
              placeholder={
                formData.recipientType === 'email' ? 'user@example.com' :
                formData.recipientType === 'phone' ? '010-1234-5678' :
                'user_id'
              }
            />
          </div>

          <div>
            <label className="text-label text-gray-700 mb-2 block">우선순위</label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as typeof formData.priority})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">낮음</SelectItem>
                <SelectItem value="normal">보통</SelectItem>
                <SelectItem value="high">높음</SelectItem>
                <SelectItem value="urgent">긴급</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedTemplate && (
          <div>
            <h4 className="text-heading-4 text-gray-900 mb-3">템플릿 미리보기</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {selectedTemplate.subject && (
                <div className="mb-2">
                  <span className="text-body-small text-gray-600">제목: </span>
                  <span className="text-body text-gray-900">{selectedTemplate.subject}</span>
                </div>
              )}
              <div>
                <span className="text-body-small text-gray-600">내용: </span>
                <p className="text-body text-gray-900 whitespace-pre-wrap">{selectedTemplate.content}</p>
              </div>
              {selectedTemplate.variables.length > 0 && (
                <div className="mt-3">
                  <span className="text-body-small text-gray-600">변수: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTemplate.variables.map(variable => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTemplate && selectedTemplate.variables.length > 0 && (
          <div>
            <h4 className="text-heading-4 text-gray-900 mb-3">변수 설정</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTemplate.variables.map(variable => (
                <div key={variable}>
                  <label className="text-label text-gray-700 mb-2 block">{variable}</label>
                  <InteractiveInput
                    type="text"
                    value={formData.variables[variable] || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      variables: { ...formData.variables, [variable]: e.target.value }
                    })}
                    placeholder={`${variable} 값을 입력하세요`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <InteractiveButton
            variant="primary"
            onClick={handleSend}
            disabled={!formData.templateId || !formData.recipient}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            알림 발송
          </InteractiveButton>
        </div>
      </CardContent>
    </Card>
  );
}

// 대량 알림 발송 컴포넌트
function BulkNotificationSender({ 
  templates, 
  onSend 
}: {
  templates: NotificationTemplate[];
  onSend: (requests: NotificationRequest[]) => void;
}) {
  const [formData, setFormData] = useState({
    templateId: '',
    recipients: '',
    recipientType: 'email' as 'user' | 'phone' | 'email',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    variables: {} as Record<string, string>
  });

  const recipientList = formData.recipients.split('\n').filter(r => r.trim());

  const handleSend = () => {
    if (!formData.templateId || recipientList.length === 0) return;

    const requests: NotificationRequest[] = recipientList.map(recipient => ({
      templateId: formData.templateId,
      recipients: [{
        type: formData.recipientType,
        value: recipient.trim()
      }],
      variables: formData.variables,
      priority: formData.priority
    }));

    onSend(requests);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-label text-gray-700 mb-2 block">템플릿 선택 *</label>
            <Select value={formData.templateId} onValueChange={(value) => setFormData({...formData, templateId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="템플릿을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {templates.filter(t => t.isActive).map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({notificationTypeTexts[template.type]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-label text-gray-700 mb-2 block">수신자 타입 *</label>
            <Select value={formData.recipientType} onValueChange={(value) => setFormData({...formData, recipientType: value as typeof formData.recipientType})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">이메일</SelectItem>
                <SelectItem value="phone">전화번호</SelectItem>
                <SelectItem value="user">사용자 ID</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">
            수신자 목록 * ({recipientList.length}명)
          </label>
          <Textarea
            value={formData.recipients}
            onChange={(e) => setFormData({...formData, recipients: e.target.value})}
            placeholder={`한 줄에 하나씩 입력하세요:\n${
              formData.recipientType === 'email' ? 'user1@example.com\nuser2@example.com' :
              formData.recipientType === 'phone' ? '010-1234-5678\n010-9876-5432' :
              'user_id_1\nuser_id_2'
            }`}
            rows={8}
            className="font-mono text-body-small"
          />
          <p className="text-caption text-gray-500 mt-1">
            각 줄에 하나씩 입력하세요. 현재 {recipientList.length}명의 수신자가 입력되었습니다.
          </p>
        </div>

        <div>
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => {
              // CSV 파일 업로드 시뮬레이션
              const sampleData = Array.from({length: 50}, (_, i) => 
                formData.recipientType === 'email' ? `user${i+1}@example.com` :
                formData.recipientType === 'phone' ? `010-${String(i+1).padStart(4, '0')}-5678` :
                `user_${i+1}`
              ).join('\n');
              
              setFormData({...formData, recipients: sampleData});
            }}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            CSV 파일에서 가져오기
          </InteractiveButton>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <InteractiveButton
            variant="primary"
            onClick={handleSend}
            disabled={!formData.templateId || recipientList.length === 0}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {recipientList.length}명에게 대량 발송
          </InteractiveButton>
        </div>
      </CardContent>
    </Card>
  );
}

// 예약 알림 발송 컴포넌트
function ScheduledNotificationSender({ 
  templates, 
  onSchedule 
}: {
  templates: NotificationTemplate[];
  onSchedule: (request: NotificationRequest, scheduledAt: Date) => void;
}) {
  const [formData, setFormData] = useState({
    templateId: '',
    recipients: '',
    recipientType: 'email' as 'user' | 'phone' | 'email',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    scheduledDate: '',
    scheduledTime: '',
    variables: {} as Record<string, string>
  });

  const handleSchedule = () => {
    if (!formData.templateId || !formData.recipients || !formData.scheduledDate || !formData.scheduledTime) return;

    const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
    const recipients = formData.recipients.split('\n').filter(r => r.trim());

    const request: NotificationRequest = {
      templateId: formData.templateId,
      recipients: recipients.map(recipient => ({
        type: formData.recipientType,
        value: recipient.trim()
      })),
      variables: formData.variables,
      priority: formData.priority
    };

    onSchedule(request, scheduledAt);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-label text-gray-700 mb-2 block">템플릿 선택 *</label>
            <Select value={formData.templateId} onValueChange={(value) => setFormData({...formData, templateId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="템플릿을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {templates.filter(t => t.isActive).map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({notificationTypeTexts[template.type]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-label text-gray-700 mb-2 block">수신자 타입 *</label>
            <Select value={formData.recipientType} onValueChange={(value) => setFormData({...formData, recipientType: value as typeof formData.recipientType})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">이메일</SelectItem>
                <SelectItem value="phone">전화번호</SelectItem>
                <SelectItem value="user">사용자 ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-label text-gray-700 mb-2 block">예약 날짜 *</label>
            <InteractiveInput
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="text-label text-gray-700 mb-2 block">예약 시간 *</label>
            <InteractiveInput
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">수신자 목록 *</label>
          <Textarea
            value={formData.recipients}
            onChange={(e) => setFormData({...formData, recipients: e.target.value})}
            placeholder={`한 줄에 하나씩 입력하세요:\n${
              formData.recipientType === 'email' ? 'user1@example.com\nuser2@example.com' :
              formData.recipientType === 'phone' ? '010-1234-5678\n010-9876-5432' :
              'user_id_1\nuser_id_2'
            }`}
            rows={6}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <InteractiveButton
            variant="primary"
            onClick={handleSchedule}
            disabled={!formData.templateId || !formData.recipients || !formData.scheduledDate || !formData.scheduledTime}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            알림 예약
          </InteractiveButton>
        </div>
      </CardContent>
    </Card>
  );
}

// 템플릿 관리 컴포넌트
function NotificationTemplatesManagement({ 
  templates, 
  onCreateTemplate, 
  onEditTemplate, 
  onDeleteTemplate 
}: {
  templates: NotificationTemplate[];
  onCreateTemplate: () => void;
  onEditTemplate: (template: NotificationTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-heading-3 text-gray-900">알림 템플릿</h3>
        <InteractiveButton
          variant="primary"
          size="sm"
          onClick={onCreateTemplate}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 템플릿
        </InteractiveButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className={`border-2 ${template.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-heading-4 text-gray-900">{template.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${notificationTypeColors[template.type]} text-white text-xs`}>
                      {notificationTypeTexts[template.type]}
                    </Badge>
                    <Badge className={template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {template.isActive ? '활성' : '비활성'}
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InteractiveButton variant="ghost" size="sm" className="p-2">
                      <MoreVertical className="w-4 h-4" />
                    </InteractiveButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTemplate(template)}>
                      <Edit className="w-4 h-4 mr-2" />
                      편집
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteTemplate(template.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {template.subject && (
                <div>
                  <p className="text-body-small text-gray-600">제목</p>
                  <p className="text-body text-gray-900 line-clamp-1">{template.subject}</p>
                </div>
              )}
              
              <div>
                <p className="text-body-small text-gray-600">내용</p>
                <p className="text-body text-gray-900 line-clamp-3">{template.content}</p>
              </div>

              {template.variables.length > 0 && (
                <div>
                  <p className="text-body-small text-gray-600 mb-1">변수</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map(variable => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                    {template.variables.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.variables.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-heading-4 text-gray-600 mb-2">템플릿이 없습니다</p>
            <p className="text-body text-gray-500 mb-4">
              새로운 알림 템플릿을 만들어보세요.
            </p>
            <InteractiveButton variant="primary" onClick={onCreateTemplate}>
              첫 템플릿 만들기
            </InteractiveButton>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 알림 히스토리 컴포넌트
function NotificationHistory({ notifications }: { notifications: any[] }) {
  const [filter, setFilter] = useState<'all' | 'sent' | 'delivered' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.status === filter;
    const matchesSearch = notification.template.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h3 className="text-heading-3 text-gray-900">발송 히스토리</h3>
        
        <div className="flex gap-2">
          <InteractiveInput
            type="text"
            placeholder="템플릿명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="w-64"
          />
          
          <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="sent">발송완료</SelectItem>
              <SelectItem value="delivered">전달완료</SelectItem>
              <SelectItem value="failed">실패</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-body-small text-gray-600">알림 ID</th>
                  <th className="p-4 text-left text-body-small text-gray-600">템플릿</th>
                  <th className="p-4 text-left text-body-small text-gray-600">타입</th>
                  <th className="p-4 text-left text-body-small text-gray-600">수신자</th>
                  <th className="p-4 text-left text-body-small text-gray-600">상태</th>
                  <th className="p-4 text-left text-body-small text-gray-600">전달률</th>
                  <th className="p-4 text-left text-body-small text-gray-600">발송일시</th>
                  <th className="p-4 text-left text-body-small text-gray-600">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map(notification => (
                  <tr key={notification.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-body-small text-gray-900 font-mono">
                      {notification.id}
                    </td>
                    <td className="p-4 text-body text-gray-900">
                      {notification.template}
                    </td>
                    <td className="p-4">
                      <Badge className={`${notificationTypeColors[notification.type]} text-white`}>
                        {notificationTypeTexts[notification.type]}
                      </Badge>
                    </td>
                    <td className="p-4 text-body text-gray-900">
                      {notification.recipients.toLocaleString()}명
                    </td>
                    <td className="p-4">
                      <Badge className={
                        notification.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        notification.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {notification.status === 'delivered' ? '전달완료' :
                         notification.status === 'sent' ? '발송완료' : '실패'}
                      </Badge>
                    </td>
                    <td className="p-4 text-body text-gray-900">
                      {notification.deliveryRate}%
                    </td>
                    <td className="p-4 text-body-small text-gray-600">
                      {notification.sentAt.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <InteractiveButton
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('알림 상세 보기', notification)}
                      >
                        <Eye className="w-4 h-4" />
                      </InteractiveButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 알림 분석 컴포넌트
function NotificationAnalytics({ 
  hourlyData, 
  typePerformanceData, 
  stats 
}: {
  hourlyData: any[];
  typePerformanceData: any[];
  stats: typeof notificationStats;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">알림 분석</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간별 발송 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle>시간별 발송 트렌드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="push" stroke="#3b82f6" name="푸시" />
                  <Line type="monotone" dataKey="email" stroke="#10b981" name="이메일" />
                  <Line type="monotone" dataKey="sms" stroke="#8b5cf6" name="SMS" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 타입별 성과 비교 */}
        <Card>
          <CardHeader>
            <CardTitle>타입별 성과 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#e5e7eb" name="발송" />
                  <Bar dataKey="delivered" fill="#3b82f6" name="전달" />
                  <Bar dataKey="opened" fill="#10b981" name="열람" />
                  <Bar dataKey="clicked" fill="#f59e0b" name="클릭" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-body">참여율 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">전달률</span>
                <span className="text-body text-green-600">{stats.deliveryRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">열람률</span>
                <span className="text-body text-blue-600">{stats.openRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">클릭률</span>
                <span className="text-body text-purple-600">{stats.clickRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">성능 지표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">평균 응답 시간</span>
                <span className="text-body text-gray-900">{stats.avgResponseTime}초</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">활성 템플릿</span>
                <span className="text-body text-gray-900">{stats.activeTemplates}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">예약 알림</span>
                <span className="text-body text-gray-900">{stats.scheduledNotifications}개</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">성장 지표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">총 수신자</span>
                <span className="text-body text-gray-900">{stats.totalRecipients.toLocaleString()}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">월간 성장률</span>
                <span className="text-body text-green-600">+{stats.monthlyGrowth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-small text-gray-600">오늘 발송</span>
                <span className="text-body text-primary-blue">{stats.todaySent}건</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 알림 설정 컴포넌트
function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-heading-3 text-gray-900">알림 설정</h3>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              푸시 알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                FCM 서버 키
              </label>
              <div className="flex gap-2">
                <InteractiveInput
                  type="password"
                  value="AAAAxxxxxx:APA91bH••••••••••••••••"
                  readOnly
                  className="flex-1"
                />
                <InteractiveButton variant="secondary" size="sm">
                  갱신
                </InteractiveButton>
              </div>
            </div>
            
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                프로젝트 ID
              </label>
              <InteractiveInput
                type="text"
                value="mystorystory-app"
                readOnly
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">사운드 알림</p>
                <p className="text-body-small text-gray-600">푸시 알림 시 사운드 재생</p>
              </div>
              <Checkbox defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              이메일 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                SendGrid API 키
              </label>
              <div className="flex gap-2">
                <InteractiveInput
                  type="password"
                  value="SG.••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"
                  readOnly
                  className="flex-1"
                />
                <InteractiveButton variant="secondary" size="sm">
                  갱신
                </InteractiveButton>
              </div>
            </div>
            
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                발신자 이메일
              </label>
              <InteractiveInput
                type="email"
                value="noreply@mystorystory.com"
              />
            </div>

            <div>
              <label className="text-label text-gray-700 mb-2 block">
                발신자 이름
              </label>
              <InteractiveInput
                type="text"
                value="MyStoreStory"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              SMS 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                Twilio Account SID
              </label>
              <div className="flex gap-2">
                <InteractiveInput
                  type="password"
                  value="AC••••••••••••••••••••••••••••••••"
                  readOnly
                  className="flex-1"
                />
                <InteractiveButton variant="secondary" size="sm">
                  갱신
                </InteractiveButton>
              </div>
            </div>
            
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                Auth Token
              </label>
              <div className="flex gap-2">
                <InteractiveInput
                  type="password"
                  value="••••••••••••••••••••••••••••••••"
                  readOnly
                  className="flex-1"
                />
                <InteractiveButton variant="secondary" size="sm">
                  갱신
                </InteractiveButton>
              </div>
            </div>

            <div>
              <label className="text-label text-gray-700 mb-2 block">
                발신 번호
              </label>
              <InteractiveInput
                type="tel"
                value="+15551234567"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>고급 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">발송 제한</p>
                <p className="text-body-small text-gray-600">분당 최대 발송 건수 제한</p>
              </div>
              <div className="flex items-center gap-2">
                <InteractiveInput
                  type="number"
                  value={100}
                  min={1}
                  max={1000}
                  className="w-20"
                />
                <span className="text-body-small text-gray-600">건/분</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">실패 재시도</p>
                <p className="text-body-small text-gray-600">발송 실패 시 자동 재시도</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-900">발송 로그</p>
                <p className="text-body-small text-gray-600">모든 발송 내역 로그 저장</p>
              </div>
              <Checkbox defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 알림 발송 모달
function NotificationSendModal({ 
  templates, 
  onSend, 
  onClose 
}: {
  templates: NotificationTemplate[];
  onSend: (request: NotificationRequest) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    templateId: '',
    recipient: '',
    recipientType: 'email' as 'user' | 'phone' | 'email',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    variables: {} as Record<string, string>
  });

  const selectedTemplate = templates.find(t => t.id === formData.templateId);

  const handleSend = () => {
    if (!formData.templateId || !formData.recipient) return;

    const request: NotificationRequest = {
      templateId: formData.templateId,
      recipients: [{
        type: formData.recipientType,
        value: formData.recipient
      }],
      variables: formData.variables,
      priority: formData.priority
    };

    onSend(request);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">템플릿 선택 *</label>
          <Select value={formData.templateId} onValueChange={(value) => setFormData({...formData, templateId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="템플릿을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {templates.filter(t => t.isActive).map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} ({notificationTypeTexts[template.type]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">수신자 타입 *</label>
          <Select value={formData.recipientType} onValueChange={(value) => setFormData({...formData, recipientType: value as typeof formData.recipientType})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">이메일</SelectItem>
              <SelectItem value="phone">전화번호</SelectItem>
              <SelectItem value="user">사용자 ID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="text-label text-gray-700 mb-2 block">수신자 *</label>
          <InteractiveInput
            type="text"
            value={formData.recipient}
            onChange={(e) => setFormData({...formData, recipient: e.target.value})}
            placeholder={
              formData.recipientType === 'email' ? 'user@example.com' :
              formData.recipientType === 'phone' ? '010-1234-5678' :
              'user_id'
            }
          />
        </div>
      </div>

      {selectedTemplate && selectedTemplate.variables.length > 0 && (
        <div>
          <h4 className="text-heading-4 text-gray-900 mb-3">변수 설정</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTemplate.variables.map(variable => (
              <div key={variable}>
                <label className="text-label text-gray-700 mb-2 block">{variable}</label>
                <InteractiveInput
                  type="text"
                  value={formData.variables[variable] || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    variables: { ...formData.variables, [variable]: e.target.value }
                  })}
                  placeholder={`${variable} 값을 입력하세요`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          취소
        </InteractiveButton>
        <InteractiveButton
          variant="primary"
          onClick={handleSend}
          disabled={!formData.templateId || !formData.recipient}
          className="flex-1"
        >
          알림 발송
        </InteractiveButton>
      </div>
    </div>
  );
}

// 템플릿 모달
function NotificationTemplateModal({ 
  template, 
  onSave, 
  onClose 
}: {
  template?: NotificationTemplate;
  onSave: (template: Omit<NotificationTemplate, 'id'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    type: template?.type || 'push' as 'push' | 'email' | 'sms',
    subject: template?.subject || '',
    content: template?.content || '',
    variables: template?.variables.join(', ') || '',
    isActive: template?.isActive ?? true
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.content.trim()) return;

    onSave({
      name: formData.name.trim(),
      type: formData.type,
      subject: formData.subject.trim() || undefined,
      content: formData.content.trim(),
      variables: formData.variables.split(',').map(v => v.trim()).filter(Boolean),
      isActive: formData.isActive
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">템플릿 이름 *</label>
          <InteractiveInput
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="템플릿 이름을 입력하세요"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">알림 타입 *</label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as typeof formData.type})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="push">푸시 알림</SelectItem>
              <SelectItem value="email">이메일</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === 'email' && (
          <div className="md:col-span-2">
            <label className="text-label text-gray-700 mb-2 block">제목</label>
            <InteractiveInput
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="이메일 제목을 입력하세요"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="text-label text-gray-700 mb-2 block">내용 *</label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="알림 내용을 입력하세요. {{변수명}}으로 변수를 사용할 수 있습니다."
            rows={6}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">변수 (쉼표로 구분)</label>
          <InteractiveInput
            type="text"
            value={formData.variables}
            onChange={(e) => setFormData({...formData, variables: e.target.value})}
            placeholder="orderNumber, customerName, amount"
          />
          <p className="text-caption text-gray-500 mt-1">
            내용에서 {`{{변수명}}`} 형태로 사용할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({...formData, isActive: checked as boolean})}
          />
          <label className="text-label text-gray-700">템플릿 활성화</label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          취소
        </InteractiveButton>
        <InteractiveButton
          variant="primary"
          onClick={handleSave}
          disabled={!formData.name.trim() || !formData.content.trim()}
          className="flex-1"
        >
          {template ? '수정' : '생성'}
        </InteractiveButton>
      </div>
    </div>
  );
}