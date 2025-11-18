import React, { useState } from 'react';
import { 
  Users, TrendingUp, TrendingDown, Activity, Target, BarChart3, 
  PieChart, LineChart, ArrowRight, UserPlus, UserMinus, UserCheck,
  Calendar, Clock, MapPin, Smartphone, Monitor, Filter, Download,
  RefreshCw, Settings, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface UserAnalyticsDashboardProps {
  activeUserType: string;
}

export function UserAnalyticsDashboard({ activeUserType }: UserAnalyticsDashboardProps) {
  const [selectedDateRange, setSelectedDateRange] = useState('30days');
  const [selectedSegment, setSelectedSegment] = useState('all');

  return (
    <div className="space-y-6">
      {/* 헤더 및 필터 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">사용자 분석 대시보드</h2>
          <p className="text-gray-600">{activeUserType} 대상 분석 및 인사이트</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">최근 7일</SelectItem>
              <SelectItem value="30days">최근 30일</SelectItem>
              <SelectItem value="90days">최근 90일</SelectItem>
              <SelectItem value="1year">최근 1년</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">전체 현황</TabsTrigger>
          <TabsTrigger value="acquisition">가입 경로</TabsTrigger>
          <TabsTrigger value="behavior">행동 패턴</TabsTrigger>
          <TabsTrigger value="churn">이탈 분석</TabsTrigger>
          <TabsTrigger value="segments">세그먼트</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <UserOverviewAnalytics 
            userType={activeUserType} 
            dateRange={selectedDateRange}
          />
        </TabsContent>

        <TabsContent value="acquisition">
          <AcquisitionAnalytics 
            userType={activeUserType} 
            dateRange={selectedDateRange}
          />
        </TabsContent>

        <TabsContent value="behavior">
          <BehaviorPatternAnalytics 
            userType={activeUserType} 
            dateRange={selectedDateRange}
          />
        </TabsContent>

        <TabsContent value="churn">
          <ChurnPredictionAnalytics 
            userType={activeUserType} 
            dateRange={selectedDateRange}
          />
        </TabsContent>

        <TabsContent value="segments">
          <UserSegmentAnalytics 
            userType={activeUserType} 
            dateRange={selectedDateRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserOverviewAnalytics({ userType, dateRange }: { userType: string; dateRange: string }) {
  const overviewData = {
    totalUsers: userType === '이용자' ? 12234 : userType === '사장님' ? 567 : 13023,
    activeUsers: userType === '이용자' ? 8234 : userType === '사장님' ? 523 : 8757,
    newUsers: userType === '이용자' ? 433 : userType === '사장님' ? 23 : 456,
    retentionRate: userType === '이용자' ? 78.5 : userType === '사장님' ? 92.3 : 80.1,
    engagementScore: userType === '이용자' ? 72 : userType === '사장님' ? 85 : 74
  };

  const dailyActiveUsersData = [
    { date: '01/01', users: 1200, newUsers: 45 },
    { date: '01/02', users: 1350, newUsers: 52 },
    { date: '01/03', users: 1180, newUsers: 38 },
    { date: '01/04', users: 1420, newUsers: 67 },
    { date: '01/05', users: 1680, newUsers: 89 },
    { date: '01/06', users: 1850, newUsers: 94 },
    { date: '01/07', users: 1920, newUsers: 76 },
    { date: '01/08', users: 1456, newUsers: 58 },
    { date: '01/09', users: 1234, newUsers: 42 },
    { date: '01/10', users: 1567, newUsers: 71 }
  ];

  const conversionFunnelData = [
    { stage: '방문', users: 10000, percentage: 100 },
    { stage: '회원가입', users: 3500, percentage: 35 },
    { stage: '첫 주문', users: 2100, percentage: 21 },
    { stage: '재주문', users: 1470, percentage: 14.7 },
    { stage: '충성고객', users: 980, percentage: 9.8 }
  ];

  return (
    <div className="space-y-6">
      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">전체 사용자</p>
              <p className="text-xl font-bold text-gray-900">{overviewData.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">활성 사용자</p>
              <p className="text-xl font-bold text-gray-900">{overviewData.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">신규 사용자</p>
              <p className="text-xl font-bold text-gray-900">{overviewData.newUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">유지율</p>
              <p className="text-xl font-bold text-gray-900">{overviewData.retentionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">참여도</p>
              <p className="text-xl font-bold text-gray-900">{overviewData.engagementScore}/100</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 일별 활성 사용자 추이 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">일별 활성 사용자 추이</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">활성 사용자</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">신규 사용자</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyActiveUsersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 전환 퍼널 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">사용자 전환 퍼널</h3>
        <div className="space-y-4">
          {conversionFunnelData.map((stage, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{stage.users.toLocaleString()}명</span>
                  <span className="text-sm text-gray-600">({stage.percentage}%)</span>
                </div>
              </div>
              <Progress value={stage.percentage} className="h-3" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AcquisitionAnalytics({ userType, dateRange }: { userType: string; dateRange: string }) {
  const acquisitionChannels = [
    { channel: '직접 접속', users: 4500, percentage: 35, cost: 0, conversion: 8.5 },
    { channel: '소셜 미디어', users: 3200, percentage: 25, cost: 125000, conversion: 6.2 },
    { channel: '검색 엔진', users: 2800, percentage: 22, cost: 89000, conversion: 7.8 },
    { channel: '추천인', users: 1500, percentage: 12, cost: 45000, conversion: 12.3 },
    { channel: '광고', users: 800, percentage: 6, cost: 234000, conversion: 4.1 }
  ];

  const channelPerformanceData = [
    { month: '9월', direct: 1200, social: 800, search: 650, referral: 320, ads: 180 },
    { month: '10월', direct: 1350, social: 920, search: 780, referral: 380, ads: 220 },
    { month: '11월', direct: 1580, social: 1100, search: 890, referral: 450, ads: 280 },
    { month: '12월', direct: 1800, social: 1280, search: 980, referral: 520, ads: 340 },
    { month: '1월', direct: 1650, social: 1150, search: 920, referral: 480, ads: 310 }
  ];

  const cohortData = [
    { cohort: '2023-10', month1: 100, month2: 65, month3: 45, month4: 32, month5: 28, month6: 25 },
    { cohort: '2023-11', month1: 100, month2: 68, month3: 48, month4: 35, month5: 31, month6: null },
    { cohort: '2023-12', month1: 100, month2: 72, month3: 52, month4: 38, month5: null, month6: null },
    { cohort: '2024-01', month1: 100, month2: 75, month3: 55, month4: null, month5: null, month6: null }
  ];

  return (
    <div className="space-y-6">
      {/* 가입 경로별 통계 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">가입 경로별 분석</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 파이 차트 */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={acquisitionChannels}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="percentage"
                  label={({ channel, percentage }) => `${channel} ${percentage}%`}
                >
                  {acquisitionChannels.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 상세 데이터 */}
          <div className="space-y-3">
            {acquisitionChannels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{channel.channel}</p>
                  <p className="text-sm text-gray-600">{channel.users.toLocaleString()}명 ({channel.percentage}%)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">전환율: {channel.conversion}%</p>
                  <p className="text-sm text-gray-600">
                    {channel.cost > 0 ? `비용: ₩${channel.cost.toLocaleString()}` : '무료'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 채널별 성과 추이 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">채널별 가입자 추이</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="direct" stackId="a" fill="#3B82F6" name="직접 접속" />
              <Bar dataKey="social" stackId="a" fill="#10B981" name="소셜 미디어" />
              <Bar dataKey="search" stackId="a" fill="#F59E0B" name="검색 엔진" />
              <Bar dataKey="referral" stackId="a" fill="#EF4444" name="추천인" />
              <Bar dataKey="ads" stackId="a" fill="#8B5CF6" name="광고" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 코호트 분석 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">코호트 유지율 분석</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">가입 월</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">1개월</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">2개월</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">3개월</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">4개월</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">5개월</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">6개월</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{cohort.cohort}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-8 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                      {cohort.month1}%
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {cohort.month2 && (
                      <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${
                        cohort.month2 >= 70 ? 'bg-green-100 text-green-800' :
                        cohort.month2 >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month2}%
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {cohort.month3 && (
                      <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${
                        cohort.month3 >= 50 ? 'bg-green-100 text-green-800' :
                        cohort.month3 >= 30 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month3}%
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {cohort.month4 && (
                      <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${
                        cohort.month4 >= 40 ? 'bg-green-100 text-green-800' :
                        cohort.month4 >= 25 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month4}%
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {cohort.month5 && (
                      <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${
                        cohort.month5 >= 30 ? 'bg-green-100 text-green-800' :
                        cohort.month5 >= 20 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month5}%
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {cohort.month6 && (
                      <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium ${
                        cohort.month6 >= 25 ? 'bg-green-100 text-green-800' :
                        cohort.month6 >= 15 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month6}%
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function BehaviorPatternAnalytics({ userType, dateRange }: { userType: string; dateRange: string }) {
  const activityPatternData = [
    { hour: '00', logins: 120, orders: 45 },
    { hour: '01', logins: 80, orders: 25 },
    { hour: '02', logins: 60, orders: 15 },
    { hour: '03', logins: 45, orders: 8 },
    { hour: '04', logins: 35, orders: 5 },
    { hour: '05', logins: 40, orders: 8 },
    { hour: '06', logins: 85, orders: 25 },
    { hour: '07', logins: 150, orders: 55 },
    { hour: '08', logins: 280, orders: 120 },
    { hour: '09', logins: 380, orders: 180 },
    { hour: '10', logins: 420, orders: 220 },
    { hour: '11', logins: 480, orders: 280 },
    { hour: '12', logins: 650, orders: 450 },
    { hour: '13', logins: 580, orders: 380 },
    { hour: '14', logins: 520, orders: 320 },
    { hour: '15', logins: 480, orders: 280 },
    { hour: '16', logins: 520, orders: 320 },
    { hour: '17', logins: 680, orders: 480 },
    { hour: '18', logins: 850, orders: 650 },
    { hour: '19', logins: 920, orders: 720 },
    { hour: '20', logins: 880, orders: 680 },
    { hour: '21', logins: 680, orders: 480 },
    { hour: '22', logins: 480, orders: 280 },
    { hour: '23', logins: 280, orders: 120 }
  ];

  const deviceUsageData = [
    { device: '모바일', users: 8500, percentage: 75 },
    { device: '데스크톱', users: 2200, percentage: 19 },
    { device: '태블릿', users: 680, percentage: 6 }
  ];

  const sessionDurationData = [
    { duration: '0-1분', users: 1200, percentage: 15 },
    { duration: '1-5분', users: 2800, percentage: 35 },
    { duration: '5-15분', users: 2400, percentage: 30 },
    { duration: '15-30분', users: 1200, percentage: 15 },
    { duration: '30분+', users: 400, percentage: 5 }
  ];

  const featureUsageData = [
    { feature: '메뉴 검색', usage: 92, satisfaction: 4.6 },
    { feature: '주문하기', usage: 88, satisfaction: 4.5 },
    { feature: '즐겨찾기', usage: 65, satisfaction: 4.3 },
    { feature: '리뷰 작성', usage: 45, satisfaction: 4.1 },
    { feature: '쿠폰 사용', usage: 38, satisfaction: 4.4 },
    { feature: '재주문', usage: 72, satisfaction: 4.7 },
    { feature: '고객센터', usage: 12, satisfaction: 3.8 }
  ];

  return (
    <div className="space-y-6">
      {/* 시간대별 활동 패턴 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">시간대별 활동 패턴</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityPatternData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="logins" stroke="#3B82F6" strokeWidth={2} name="로그인" />
              <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} name="주문" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 디바이스 & 세션 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">디바이스별 사용률</h3>
          <div className="space-y-4">
            {deviceUsageData.map((device, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {device.device === '모바일' ? <Smartphone className="w-4 h-4 text-gray-600" /> : 
                     device.device === '데스크톱' ? <Monitor className="w-4 h-4 text-gray-600" /> :
                     <Monitor className="w-4 h-4 text-gray-600" />}
                    <span className="font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{device.users.toLocaleString()}명</span>
                    <span className="text-sm text-gray-600 ml-2">({device.percentage}%)</span>
                  </div>
                </div>
                <Progress value={device.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">세션 지속 시간</h3>
          <div className="space-y-4">
            {sessionDurationData.map((session, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{session.duration}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{session.users.toLocaleString()}명</span>
                    <span className="text-sm text-gray-600 ml-2">({session.percentage}%)</span>
                  </div>
                </div>
                <Progress value={session.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 기능별 사용률 및 만족도 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">기능별 사용률 및 만족도</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">기능</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">사용률</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">사용률 바</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">만족도</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">상태</th>
              </tr>
            </thead>
            <tbody>
              {featureUsageData.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{feature.feature}</td>
                  <td className="py-3 px-4 text-center font-medium text-blue-600">{feature.usage}%</td>
                  <td className="py-3 px-4">
                    <div className="w-full max-w-24 mx-auto">
                      <Progress value={feature.usage} className="h-2" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-medium text-yellow-600">{feature.satisfaction}</span>
                      <span className="text-sm text-gray-600">/5.0</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feature.usage >= 70 && feature.satisfaction >= 4.0 ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        우수
                      </Badge>
                    ) : feature.usage >= 50 || feature.satisfaction >= 3.5 ? (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        보통
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        개선 필요
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ChurnPredictionAnalytics({ userType, dateRange }: { userType: string; dateRange: string }) {
  const churnRiskData = [
    { risk: '높음', users: 850, percentage: 7, color: 'bg-red-100 text-red-800' },
    { risk: '보통', users: 2340, percentage: 19, color: 'bg-yellow-100 text-yellow-800' },
    { risk: '낮음', users: 9044, percentage: 74, color: 'bg-green-100 text-green-800' }
  ];

  const churnFactorsData = [
    { factor: '비활성화 (30일+)', impact: 85, users: 420 },
    { factor: '주문 감소', impact: 72, users: 680 },
    { factor: '앱 사용 감소', impact: 68, users: 520 },
    { factor: '고객 지원 문의', impact: 45, users: 180 },
    { factor: '결제 실패', impact: 38, users: 120 },
    { factor: '배송 지연 경험', impact: 35, users: 280 }
  ];

  const retentionActionsData = [
    { 
      action: '맞춤형 할인 쿠폰 제공',
      targetUsers: 850,
      expectedRetention: 65,
      cost: '₩425,000',
      roi: '320%'
    },
    { 
      action: '재참여 캠페인 실행',
      targetUsers: 650,
      expectedRetention: 45,
      cost: '₩180,000',
      roi: '580%'
    },
    { 
      action: '개인화된 푸시 알림',
      targetUsers: 1200,
      expectedRetention: 35,
      cost: '₩50,000',
      roi: '840%'
    },
    { 
      action: 'VIP 고객 혜택 제공',
      targetUsers: 300,
      expectedRetention: 80,
      cost: '₩600,000',
      roi: '150%'
    }
  ];

  const churnTrendData = [
    { month: '9월', churned: 420, total: 11850, rate: 3.54 },
    { month: '10월', churned: 380, total: 12100, rate: 3.14 },
    { month: '11월', churned: 450, total: 12380, rate: 3.64 },
    { month: '12월', churned: 520, total: 12580, rate: 4.13 },
    { month: '1월', churned: 480, total: 12234, rate: 3.92 }
  ];

  return (
    <div className="space-y-6">
      {/* 이탈 위험도 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">이탈 위험도 분포</h3>
          <div className="space-y-4">
            {churnRiskData.map((risk, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">위험도 {risk.risk}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{risk.users.toLocaleString()}명</span>
                    <span className="text-sm text-gray-600 ml-2">({risk.percentage}%)</span>
                  </div>
                </div>
                <Progress value={risk.percentage} className="h-3" />
                <div className="flex justify-end">
                  <Badge className={risk.color}>
                    {risk.risk} 위험군
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">이탈율 추이</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={churnTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'rate') return [`${value}%`, '이탈율'];
                  return [value.toLocaleString(), name === 'churned' ? '이탈 사용자' : '전체 사용자'];
                }} />
                <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={3} name="이탈율" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 이탈 원인 분석 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">이탈 원인 분석</h3>
        <div className="space-y-4">
          {churnFactorsData.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{factor.factor}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{factor.users}명 영향</span>
                  <span className="font-bold text-red-600">위험도 {factor.impact}%</span>
                </div>
              </div>
              <Progress value={factor.impact} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* 이탈 방지 액션 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">이탈 방지 액션</h3>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            액션 설정
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">액션</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">대상 사용자</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">예상 유지율</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">비용</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">ROI</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">액션</th>
              </tr>
            </thead>
            <tbody>
              {retentionActionsData.map((action, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{action.action}</td>
                  <td className="py-3 px-4 text-center">{action.targetUsers.toLocaleString()}명</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium text-green-600">{action.expectedRetention}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">{action.cost}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={
                      parseInt(action.roi) >= 500 ? 'bg-green-100 text-green-800' :
                      parseInt(action.roi) >= 300 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {action.roi}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button size="sm" variant="outline">
                      실행하기
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function UserSegmentAnalytics({ userType, dateRange }: { userType: string; dateRange: string }) {
  const userSegments = [
    {
      name: '신규 사용자',
      description: '가입 후 30일 이내',
      users: 1850,
      percentage: 15.1,
      characteristics: ['높은 활동성', '학습 중', '첫 주문 유도 필요'],
      avgOrderValue: 15000,
      retentionRate: 45,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: '활성 사용자',
      description: '정기적 주문 고객',
      users: 4680,
      percentage: 38.3,
      characteristics: ['안정적 주문', '브랜드 충성도', '재주문율 높음'],
      avgOrderValue: 22000,
      retentionRate: 85,
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'VIP 사용자',
      description: '고가치 충성 고객',
      users: 980,
      percentage: 8.0,
      characteristics: ['높은 구매력', '프리미엄 선호', '추천 활동'],
      avgOrderValue: 45000,
      retentionRate: 95,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: '휴면 위험 사용자',
      description: '활동 감소 고객',
      users: 2340,
      percentage: 19.1,
      characteristics: ['주문 빈도 감소', '재참여 필요', '이탈 위험'],
      avgOrderValue: 18000,
      retentionRate: 35,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      name: '이탈 위험 사용자',
      description: '30일+ 비활성',
      users: 2384,
      percentage: 19.5,
      characteristics: ['장기 비활성', '높은 이탈 확률', '재활성화 필요'],
      avgOrderValue: 12000,
      retentionRate: 15,
      color: 'bg-red-100 text-red-800'
    }
  ];

  const segmentTrendData = [
    { month: '9월', 신규: 420, 활성: 4200, VIP: 850, 휴면위험: 2100, 이탈위험: 2280 },
    { month: '10월', 신규: 580, 활성: 4350, VIP: 920, 휴면위험: 2200, 이탈위험: 2050 },
    { month: '11월', 신규: 680, 활성: 4480, VIP: 980, 휴면위험: 2150, 이탈위험: 2090 },
    { month: '12월', 신규: 720, 활성: 4520, VIP: 1020, 휴면위험: 2180, 이탈위험: 2140 },
    { month: '1월', 신규: 850, 활성: 4680, VIP: 980, 휴면위험: 2340, 이탈위험: 2384 }
  ];

  const segmentActionsData = [
    {
      segment: '신규 사용자',
      action: '온보딩 프로그램',
      description: '앱 사용법 가이드 및 첫 주문 할인',
      targetMetric: '첫 주문율 60% 달성',
      status: 'active'
    },
    {
      segment: '활성 사용자',
      action: '로열티 프로그램',
      description: '포인트 적립 및 멤버십 혜택',
      targetMetric: '재주문율 90% 유지',
      status: 'active'
    },
    {
      segment: 'VIP 사용자',
      action: '프리미엄 서비스',
      description: '우선 배송 및 전용 고객센터',
      targetMetric: 'NPS 9점 이상 유지',
      status: 'active'
    },
    {
      segment: '휴면 위험 사용자',
      action: '재참여 캠페인',
      description: '맞춤형 메뉴 추천 및 할인 쿠폰',
      targetMetric: '30% 재활성화',
      status: 'planning'
    },
    {
      segment: '이탈 위험 사용자',
      action: '윈백 캠페인',
      description: '특별 할인 및 개인화된 혜택',
      targetMetric: '15% 복귀율',
      status: 'planning'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 세그먼트 개요 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userSegments.map((segment, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                <Badge className={segment.color}>
                  {segment.percentage}%
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600">{segment.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">사용자 수</span>
                  <span className="font-medium">{segment.users.toLocaleString()}명</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">평균 주문금액</span>
                  <span className="font-medium">₩{segment.avgOrderValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">유지율</span>
                  <span className="font-medium">{segment.retentionRate}%</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-600">주요 특성:</p>
                <div className="flex flex-wrap gap-1">
                  {segment.characteristics.map((char, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 세그먼트 추이 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">세그먼트별 사용자 추이</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={segmentTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="신규" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="활성" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="VIP" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="휴면위험" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="이탈위험" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 세그먼트별 액션 계획 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">세그먼트별 액션 계획</h3>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            액션 관리
          </Button>
        </div>

        <div className="space-y-4">
          {segmentActionsData.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900">{action.segment}</h4>
                  <Badge className={action.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {action.status === 'active' ? '실행 중' : '계획 중'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">{action.action}</p>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  <p className="text-sm text-blue-600">목표: {action.targetMetric}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {action.status === 'active' ? (
                  <Button size="sm" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    성과 보기
                  </Button>
                ) : (
                  <Button size="sm">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    실행하기
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}