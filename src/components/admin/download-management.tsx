import React, { useState } from 'react';
import { 
  Download, Smartphone, Apple, Play, QrCode, Globe, BarChart3,
  TrendingUp, TrendingDown, MapPin, Calendar, Share, Eye, Copy,
  Settings, RefreshCw, ExternalLink, Users, Package
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';
import { BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function DownloadManagement() {
  const [downloadStats, setDownloadStats] = useState({
    total: 125000,
    ios: 75000,
    android: 50000,
    thisMonth: 15000,
    dailyAverage: 485,
    conversionRate: 3.2
  });

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">다운로드 관리</h1>
        <p className="text-gray-600">앱 다운로드 현황과 QR 코드 기능을 관리하세요</p>
      </div>

      {/* 다운로드 현황 대시보드 */}
      <DownloadStatsDashboard stats={downloadStats} />

      {/* 탭 네비게이션 */}
      <DownloadTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 탭별 콘텐츠 */}
      {activeTab === 'overview' && <DownloadOverview />}
      {activeTab === 'qrcode' && <QRCodeManagement />}
      {activeTab === 'analytics' && <DownloadAnalytics />}
      {activeTab === 'versions' && <AppVersionManagement />}
    </div>
  );
}

function DownloadStatsDashboard({ stats }: { stats: any }) {
  const dashboardData = [
    {
      title: '총 다운로드',
      value: stats.total.toLocaleString(),
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: <Download className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '누적 다운로드 수'
    },
    {
      title: 'iOS 다운로드',
      value: stats.ios.toLocaleString(),
      change: '+12.1%',
      changeType: 'positive' as const,
      icon: <Apple className="w-6 h-6" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'App Store 다운로드'
    },
    {
      title: 'Android 다운로드',
      value: stats.android.toLocaleString(),
      change: '+5.7%',
      changeType: 'positive' as const,
      icon: <Play className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Google Play 다운로드'
    },
    {
      title: '이번 달 다운로드',
      value: stats.thisMonth.toLocaleString(),
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '이번 달 신규 다운로드'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardData.map((item, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color}`}>
              {item.icon}
            </div>
            <div className={`flex items-center gap-1 ${
              item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{item.change}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{item.title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function DownloadTabs({ activeTab, setActiveTab }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { id: 'overview', label: '다운로드 현황', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'qrcode', label: 'QR 코드 관리', icon: <QrCode className="w-4 h-4" /> },
    { id: 'analytics', label: '상세 분석', icon: <Globe className="w-4 h-4" /> },
    { id: 'versions', label: '버전 관리', icon: <Package className="w-4 h-4" /> }
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
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

function DownloadOverview() {
  const platformData = [
    { name: 'iOS', downloads: 75000, percentage: 60, color: '#6b7280' },
    { name: 'Android', downloads: 50000, percentage: 40, color: '#10b981' }
  ];

  const monthlyData = [
    { month: '1월', downloads: 8500 },
    { month: '2월', downloads: 9200 },
    { month: '3월', downloads: 11800 },
    { month: '4월', downloads: 10500 },
    { month: '5월', downloads: 12800 },
    { month: '6월', downloads: 15000 }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 플랫폼별 다운로드 분포 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">플랫폼별 다운로드</h3>
          <div className="space-y-4">
            {platformData.map((platform, index) => (
              <div key={platform.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {platform.name === 'iOS' ? (
                      <Apple className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Play className="w-5 h-5 text-green-600" />
                    )}
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{platform.downloads.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{platform.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${platform.percentage}%`, 
                      backgroundColor: platform.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 다운로드 링크 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">앱 다운로드 링크</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Apple className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="font-medium">App Store</p>
                  <p className="text-sm text-gray-500">iOS 앱 다운로드</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                바로가기
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Play className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">Google Play</p>
                  <p className="text-sm text-gray-500">Android 앱 다운로드</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                바로가기
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">웹 앱</p>
                  <p className="text-sm text-gray-500">브라우저에서 바로 사용</p>
                </div>
              </div>
              <Button size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                열기
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 월별 다운로드 트렌드 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 다운로드 트렌드</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value.toLocaleString()}건`, '다운로드']} />
            <Bar dataKey="downloads" fill="#3b82f6" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function QRCodeManagement() {
  const [qrCodes, setQrCodes] = useState([
    {
      id: '1',
      name: '기본 앱 다운로드',
      type: 'download',
      url: 'https://mystoresory.com/download',
      scans: 12450,
      createdAt: '2024-01-15',
      isActive: true
    },
    {
      id: '2',
      name: '상점 등록 페이지',
      type: 'register',
      url: 'https://mystoresory.com/register/store',
      scans: 3200,
      createdAt: '2024-01-20',
      isActive: true
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateQR = (qrData: any) => {
    const newQR = {
      ...qrData,
      id: Date.now().toString(),
      scans: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };
    setQrCodes([...qrCodes, newQR]);
    toast.success('QR 코드가 생성되었습니다.');
  };

  return (
    <div className="space-y-8">
      {/* QR 코드 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">총 QR 코드</p>
              <p className="text-2xl font-bold text-gray-900">{qrCodes.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">총 스캔 수</p>
              <p className="text-2xl font-bold text-gray-900">
                {qrCodes.reduce((sum, qr) => sum + qr.scans, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">이번 달 스캔</p>
              <p className="text-2xl font-bold text-gray-900">2,350</p>
            </div>
          </div>
        </Card>
      </div>

      {/* QR 코드 목록 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">QR 코드 목록</h3>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <QrCode className="w-4 h-4 mr-2" />
                새 QR 코드 생성
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 QR 코드 생성</DialogTitle>
              </DialogHeader>
              <QRCodeCreateForm 
                onSave={handleCreateQR}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* QR 코드 미리보기 */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-gray-600" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{qr.name}</h4>
                    <p className="text-sm text-gray-500">{qr.url}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">스캔: {qr.scans.toLocaleString()}회</span>
                      <span className="text-xs text-gray-500">생성일: {qr.createdAt}</span>
                      <Badge variant={qr.isActive ? 'default' : 'secondary'}>
                        {qr.isActive ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function QRCodeCreateForm({ onSave, onCancel }: {
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'download',
    url: '',
    description: ''
  });

  const handleSave = () => {
    if (formData.name && formData.url) {
      onSave(formData);
      onCancel();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">QR 코드 이름</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="QR 코드의 이름을 입력하세요"
        />
      </div>

      <div>
        <Label htmlFor="type">QR 코드 유형</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="download">앱 다운로드</SelectItem>
            <SelectItem value="register">상점 등록</SelectItem>
            <SelectItem value="promotion">프로모션</SelectItem>
            <SelectItem value="support">고객 지원</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="url">연결 URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} className="flex-1">
          생성
        </Button>
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}

function DownloadAnalytics() {
  const regionData = [
    { region: '서울', downloads: 45000, percentage: 36 },
    { region: '부산', downloads: 18000, percentage: 14.4 },
    { region: '대구', downloads: 12000, percentage: 9.6 },
    { region: '인천', downloads: 10000, percentage: 8 },
    { region: '광주', downloads: 8000, percentage: 6.4 },
    { region: '기타', downloads: 32000, percentage: 25.6 }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 지역별 다운로드 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">지역별 다운로드</h3>
          <div className="space-y-4">
            {regionData.map((region, index) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{region.region}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{region.downloads.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{region.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 다운로드 소스 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">다운로드 소스</h3>
          <div className="space-y-4">
            {[
              { source: '직접 접속', downloads: 52000, percentage: 41.6 },
              { source: 'QR 코드', downloads: 28000, percentage: 22.4 },
              { source: '소셜 미디어', downloads: 25000, percentage: 20 },
              { source: '검색 엔진', downloads: 15000, percentage: 12 },
              { source: '기타', downloads: 5000, percentage: 4 }
            ].map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <span className="font-medium">{source.source}</span>
                <div className="text-right">
                  <p className="font-bold">{source.downloads.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AppVersionManagement() {
  const versions = [
    {
      version: '2.1.0',
      platform: 'both',
      status: '배포완료',
      downloads: 45000,
      releaseDate: '2024-01-20',
      features: ['새로운 결제 시스템', 'UI 개선', '성능 최적화']
    },
    {
      version: '2.0.5',
      platform: 'both',
      status: '지원종료',
      downloads: 23000,
      releaseDate: '2024-01-10',
      features: ['버그 수정', '보안 강화']
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">앱 버전 관리</h3>
        <Button>
          <Package className="w-4 h-4 mr-2" />
          새 버전 배포
        </Button>
      </div>

      <div className="space-y-4">
        {versions.map((version, index) => (
          <div key={version.version} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900">v{version.version}</h4>
                  <Badge variant={version.status === '배포완료' ? 'default' : 'secondary'}>
                    {version.status}
                  </Badge>
                  <div className="flex gap-1">
                    {(version.platform === 'both' || version.platform === 'ios') && (
                      <Apple className="w-4 h-4 text-gray-600" />
                    )}
                    {(version.platform === 'both' || version.platform === 'android') && (
                      <Play className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  배포일: {version.releaseDate} | 다운로드: {version.downloads.toLocaleString()}회
                </p>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">주요 기능:</p>
                  <ul className="list-disc list-inside">
                    {version.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}