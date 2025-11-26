import {
  AlertTriangle,
  Bell, Database,
  Download,
  Mail, MessageSquare,
  Monitor,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Smartphone,
  Upload
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState('기본설정');
  const [settings, setSettings] = useState({
    siteInfo: {
      name: 'MyStoreStory',
      description: '대형 배달플랫폼의 높은수수료에 대응하기위한 획기적인 플랫폼',
      logo: '',
      favicon: '',
      theme: 'light',
      language: 'ko',
      timezone: 'Asia/Seoul',
      currency: 'KRW'
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireSpecialChar: true,
        requireNumber: true,
        requireUppercase: false,
        maxAge: 90
      },
      twoFactorAuth: true,
      loginRestrictions: {
        maxAttempts: 5,
        lockoutDuration: 30,
        ipWhitelist: false
      },
      sessionTimeout: 30,
      dataEncryption: true
    },
    notifications: {
      email: {
        enabled: true,
        smtp: {
          server: 'smtp.gmail.com',
          port: 587,
          username: '',
          password: '',
          ssl: true
        }
      },
      sms: {
        enabled: true,
        provider: 'twilio',
        apiKey: '',
        fromNumber: '+821234567890'
      },
      push: {
        enabled: true,
        fcmKey: '',
        apnsKey: ''
      }
    },
    system: {
      maintenance: false,
      backupFrequency: 'daily',
      logRetention: 30,
      performanceMonitoring: true,
      errorTracking: true
    }
  });

  const handleSaveSettings = () => {
    // 설정 저장 로직
    toast.success('설정이 저장되었습니다.');
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">시스템 설정</h1>
        <p className="text-gray-600">시스템 전반의 설정을 관리하세요</p>
      </div>

      {/* 설정 탭 */}
      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 설정 콘텐츠 */}
      <div className="min-h-[600px]">
        {activeTab === '기본설정' && (
          <BasicSettings
            settings={settings}
            onSettingsChange={setSettings}
            onSave={handleSaveSettings}
          />
        )}
        {activeTab === '보안설정' && (
          <SecuritySettings
            settings={settings}
            onSettingsChange={setSettings}
            onSave={handleSaveSettings}
          />
        )}
        {activeTab === '알림설정' && (
          <NotificationSettings
            settings={settings}
            onSettingsChange={setSettings}
            onSave={handleSaveSettings}
          />
        )}
        {activeTab === '시스템로그' && (
          <SystemLogs />
        )}
      </div>
    </div>
  );
}

function SettingsTabs({ activeTab, setActiveTab }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { id: '기본설정', label: '기본 설정', icon: <Settings className="w-4 h-4" /> },
    { id: '보안설정', label: '보안 설정', icon: <Shield className="w-4 h-4" /> },
    { id: '알림설정', label: '알림 설정', icon: <Bell className="w-4 h-4" /> },
    { id: '시스템로그', label: '시스템 로그', icon: <Database className="w-4 h-4" /> }
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </Card>
  );
}

function BasicSettings({ settings, onSettingsChange, onSave }: {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onSave: () => void;
}) {
  const updateSiteInfo = (field: string, value: any) => {
    onSettingsChange({
      ...settings,
      siteInfo: {
        ...settings.siteInfo,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* 사이트 정보 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">사이트 정보</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="siteName">사이트 이름</Label>
            <Input
              id="siteName"
              value={settings.siteInfo.name}
              onChange={(e) => updateSiteInfo('name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="language">기본 언어</Label>
            <Select value={settings.siteInfo.language} onValueChange={(value) => updateSiteInfo('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">사이트 설명</Label>
            <Textarea
              id="description"
              value={settings.siteInfo.description}
              onChange={(e) => updateSiteInfo('description', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="timezone">시간대</Label>
            <Select value={settings.siteInfo.timezone} onValueChange={(value) => updateSiteInfo('timezone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Seoul">서울 (UTC+9)</SelectItem>
                <SelectItem value="Asia/Tokyo">도쿄 (UTC+9)</SelectItem>
                <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currency">기본 통화</Label>
            <Select value={settings.siteInfo.currency} onValueChange={(value) => updateSiteInfo('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KRW">한국 원 (₩)</SelectItem>
                <SelectItem value="USD">미국 달러 ($)</SelectItem>
                <SelectItem value="JPY">일본 엔 (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="theme">테마</Label>
            <Select value={settings.siteInfo.theme} onValueChange={(value) => updateSiteInfo('theme', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">라이트</SelectItem>
                <SelectItem value="dark">다크</SelectItem>
                <SelectItem value="auto">자동</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* 파일 업로드 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">로고 및 파일</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>사이트 로고</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">로고 파일을 업로드하세요</p>
              <Button variant="outline" size="sm" className="mt-2">
                파일 선택
              </Button>
            </div>
          </div>

          <div>
            <Label>파비콘</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">파비콘 파일을 업로드하세요</p>
              <Button variant="outline" size="sm" className="mt-2">
                파일 선택
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}

function SecuritySettings({ settings, onSettingsChange, onSave }: {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onSave: () => void;
}) {
  const updateSecurity = (field: string, value: any) => {
    onSettingsChange({
      ...settings,
      security: {
        ...settings.security,
        [field]: value
      }
    });
  };

  const updatePasswordPolicy = (field: string, value: any) => {
    onSettingsChange({
      ...settings,
      security: {
        ...settings.security,
        passwordPolicy: {
          ...settings.security.passwordPolicy,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* 비밀번호 정책 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">비밀번호 정책</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="minLength">최소 길이</Label>
              <Input
                id="minLength"
                type="number"
                value={settings.security.passwordPolicy.minLength}
                onChange={(e) => updatePasswordPolicy('minLength', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="maxAge">비밀번호 만료 (일)</Label>
              <Input
                id="maxAge"
                type="number"
                value={settings.security.passwordPolicy.maxAge}
                onChange={(e) => updatePasswordPolicy('maxAge', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>특수문자 포함</Label>
                <p className="text-sm text-gray-500">비밀번호에 특수문자를 포함해야 합니다</p>
              </div>
              <Switch
                checked={settings.security.passwordPolicy.requireSpecialChar}
                onCheckedChange={(checked) => updatePasswordPolicy('requireSpecialChar', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>숫자 포함</Label>
                <p className="text-sm text-gray-500">비밀번호에 숫자를 포함해야 합니다</p>
              </div>
              <Switch
                checked={settings.security.passwordPolicy.requireNumber}
                onCheckedChange={(checked) => updatePasswordPolicy('requireNumber', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>대문자 포함</Label>
                <p className="text-sm text-gray-500">비밀번호에 대문자를 포함해야 합니다</p>
              </div>
              <Switch
                checked={settings.security.passwordPolicy.requireUppercase}
                onCheckedChange={(checked) => updatePasswordPolicy('requireUppercase', checked)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 인증 설정 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">인증 설정</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>2단계 인증</Label>
              <p className="text-sm text-gray-500">SMS 또는 앱을 통한 2단계 인증을 활성화합니다</p>
            </div>
            <Switch
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) => updateSecurity('twoFactorAuth', checked)}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="maxAttempts">최대 로그인 시도 횟수</Label>
              <Input
                id="maxAttempts"
                type="number"
                value={settings.security.loginRestrictions.maxAttempts}
                onChange={(e) => updateSecurity('loginRestrictions', {
                  ...settings.security.loginRestrictions,
                  maxAttempts: parseInt(e.target.value)
                })}
              />
            </div>

            <div>
              <Label htmlFor="lockoutDuration">잠금 시간 (분)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={settings.security.loginRestrictions.lockoutDuration}
                onChange={(e) => updateSecurity('loginRestrictions', {
                  ...settings.security.loginRestrictions,
                  lockoutDuration: parseInt(e.target.value)
                })}
              />
            </div>

            <div>
              <Label htmlFor="sessionTimeout">세션 타임아웃 (분)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>데이터 암호화</Label>
              <p className="text-sm text-gray-500">민감한 데이터를 암호화하여 저장합니다</p>
            </div>
            <Switch
              checked={settings.security.dataEncryption}
              onCheckedChange={(checked) => updateSecurity('dataEncryption', checked)}
            />
          </div>
        </div>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}

function NotificationSettings({ settings, onSettingsChange, onSave }: {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onSave: () => void;
}) {
  const updateNotifications = (type: string, field: string, value: any) => {
    onSettingsChange({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: {
          ...settings.notifications[type],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* 이메일 설정 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">이메일 알림</h3>
          </div>
          <Switch
            checked={settings.notifications.email.enabled}
            onCheckedChange={(checked) => updateNotifications('email', 'enabled', checked)}
          />
        </div>

        {settings.notifications.email.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpServer">SMTP 서버</Label>
                <Input
                  id="smtpServer"
                  value={settings.notifications.email.smtp.server}
                  onChange={(e) => updateNotifications('email', 'smtp', {
                    ...settings.notifications.email.smtp,
                    server: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">포트</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.notifications.email.smtp.port}
                  onChange={(e) => updateNotifications('email', 'smtp', {
                    ...settings.notifications.email.smtp,
                    port: parseInt(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label htmlFor="smtpUsername">사용자명</Label>
                <Input
                  id="smtpUsername"
                  value={settings.notifications.email.smtp.username}
                  onChange={(e) => updateNotifications('email', 'smtp', {
                    ...settings.notifications.email.smtp,
                    username: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword">비밀번호</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.notifications.email.smtp.password}
                  onChange={(e) => updateNotifications('email', 'smtp', {
                    ...settings.notifications.email.smtp,
                    password: e.target.value
                  })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>SSL 사용</Label>
              <Switch
                checked={settings.notifications.email.smtp.ssl}
                onCheckedChange={(checked) => updateNotifications('email', 'smtp', {
                  ...settings.notifications.email.smtp,
                  ssl: checked
                })}
              />
            </div>
          </div>
        )}
      </Card>

      {/* SMS 설정 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">SMS 알림</h3>
          </div>
          <Switch
            checked={settings.notifications.sms.enabled}
            onCheckedChange={(checked) => updateNotifications('sms', 'enabled', checked)}
          />
        </div>

        {settings.notifications.sms.enabled && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="smsProvider">SMS 제공업체</Label>
              <Select value={settings.notifications.sms.provider} onValueChange={(value) => updateNotifications('sms', 'provider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws">AWS SNS</SelectItem>
                  <SelectItem value="naver">네이버 클라우드</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smsApiKey">API 키</Label>
                <Input
                  id="smsApiKey"
                  type="password"
                  value={settings.notifications.sms.apiKey}
                  onChange={(e) => updateNotifications('sms', 'apiKey', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="smsFromNumber">발신 번호</Label>
                <Input
                  id="smsFromNumber"
                  value={settings.notifications.sms.fromNumber}
                  onChange={(e) => updateNotifications('sms', 'fromNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 푸시 알림 설정 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">푸시 알림</h3>
          </div>
          <Switch
            checked={settings.notifications.push.enabled}
            onCheckedChange={(checked) => updateNotifications('push', 'enabled', checked)}
          />
        </div>

        {settings.notifications.push.enabled && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fcmKey">FCM 서버 키 (Android)</Label>
              <Input
                id="fcmKey"
                type="password"
                value={settings.notifications.push.fcmKey}
                onChange={(e) => updateNotifications('push', 'fcmKey', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="apnsKey">APNS 키 (iOS)</Label>
              <Input
                id="apnsKey"
                type="password"
                value={settings.notifications.push.apnsKey}
                onChange={(e) => updateNotifications('push', 'apnsKey', e.target.value)}
              />
            </div>
          </div>
        )}
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}

function SystemLogs() {
  const [logs] = useState([
    {
      timestamp: '2024-01-25 14:30:25',
      level: 'INFO',
      category: 'AUTH',
      message: '사용자 로그인 성공: admin@mystoresory.com',
      ip: '192.168.1.100'
    },
    {
      timestamp: '2024-01-25 14:25:15',
      level: 'WARN',
      category: 'SECURITY',
      message: '비정상적인 로그인 시도 감지',
      ip: '203.156.45.78'
    },
    {
      timestamp: '2024-01-25 14:20:10',
      level: 'ERROR',
      category: 'DATABASE',
      message: '데이터베이스 연결 실패 (재시도 중)',
      ip: 'localhost'
    },
    {
      timestamp: '2024-01-25 14:15:30',
      level: 'INFO',
      category: 'SYSTEM',
      message: '자동 백업 완료',
      ip: 'localhost'
    }
  ]);

  const getLevelBadge = (level: string) => {
    const config = {
      'INFO': 'bg-blue-100 text-blue-800',
      'WARN': 'bg-orange-100 text-orange-800',
      'ERROR': 'bg-red-100 text-red-800',
      'DEBUG': 'bg-gray-100 text-gray-800'
    };
    return config[level as keyof typeof config] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* 시스템 모니터링 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">시스템 상태</p>
              <p className="text-lg font-bold text-green-600">정상</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">데이터베이스</p>
              <p className="text-lg font-bold text-blue-600">연결됨</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">경고</p>
              <p className="text-lg font-bold text-orange-600">2건</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 시스템 로그 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">시스템 로그</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              로그 다운로드
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg text-sm">
              <span className="text-gray-500 font-mono w-32">{log.timestamp}</span>
              <Badge className={getLevelBadge(log.level)}>
                {log.level}
              </Badge>
              <span className="text-blue-600 font-medium w-20">{log.category}</span>
              <span className="flex-1">{log.message}</span>
              <span className="text-gray-500 w-24">{log.ip}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm">
            더 보기
          </Button>
        </div>
      </Card>
    </div>
  );
}
