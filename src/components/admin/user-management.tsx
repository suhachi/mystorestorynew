import React, { useState } from 'react';
import { 
  Users, TrendingUp, TrendingDown, UserPlus, UserCheck, UserX, 
  Building, User, Shield, Search, Edit, Trash2, Eye, X, Save,
  Calendar, Phone, Mail, MapPin, BarChart3, Settings, Star,
  ShoppingCart, Activity, Clock, ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { CustomerAccountDetail } from './customer-account-detail';
import { UserAnalyticsDashboard } from './user-analytics-dashboard';

export function UserManagement() {
  return <UserManagementSystem />;
}

function UserManagementSystem() {
  const [activeUserTab, setActiveUserTab] = useState('전체');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [activityFilter, setActivityFilter] = useState('전체');
  const [joinDateFilter, setJoinDateFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('가입일');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">사용자 관리</h1>
        <p className="text-gray-600">등록된 사용자들의 현황을 관리하고 모니터링하세요</p>
      </div>

      {/* 사용자 타입별 탭 */}
      <UserTypeTabs activeTab={activeUserTab} setActiveTab={setActiveUserTab} />

      {/* 사용자 현황 대시보드 */}
      <UserOverviewDashboard activeTab={activeUserTab} />

      {/* 사용자 목록 관리 */}
      <UserListManagement
        activeTab={activeUserTab}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        activityFilter={activityFilter}
        setActivityFilter={setActivityFilter}
        joinDateFilter={joinDateFilter}
        setJoinDateFilter={setJoinDateFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onUserSelect={setSelectedUser}
      />

      {/* 사장님 계정 상세 정보 */}
      {selectedUser && activeUserTab === '사장님' && (
        <OwnerAccountDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* 이용자 계정 상세 정보 */}
      {selectedUser && activeUserTab === '이용자' && (
        <CustomerAccountDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* 사용자 분석 대시보드 */}
      {activeUserTab === '전체' && (
        <UserAnalyticsDashboard activeUserType={activeUserTab} />
      )}
      
      {activeUserTab === '이용자' && (
        <UserAnalyticsDashboard activeUserType={activeUserTab} />
      )}
      
      {activeUserTab === '사장님' && (
        <UserAnalyticsDashboard activeUserType={activeUserTab} />
      )}
      
      {activeUserTab === '관리자' && (
        <UserAnalyticsDashboard activeUserType={activeUserTab} />
      )}
    </div>
  );
}

function UserTypeTabs({ activeTab, setActiveTab }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { 
      id: '전체', 
      label: '전체 사용자', 
      icon: <Users className="w-5 h-5" />,
      count: 13023,
      color: 'text-blue-600 bg-blue-50'
    },
    { 
      id: '사장님', 
      label: '사장님 계정', 
      icon: <Building className="w-5 h-5" />,
      count: 567,
      color: 'text-blue-600 bg-blue-50'
    },
    { 
      id: '이용자', 
      label: '이용자 계정', 
      icon: <User className="w-5 h-5" />,
      count: 12234,
      color: 'text-green-600 bg-green-50'
    },
    { 
      id: '관리자', 
      label: '관리자 계정', 
      icon: <Shield className="w-5 h-5" />,
      count: 8,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                activeTab === tab.id ? tab.color : 'text-gray-400 bg-gray-100'
              }`}>
                {tab.icon}
              </div>
              <div className="text-left">
                <p className="font-medium">{tab.label}</p>
                <p className="text-xs">{tab.count.toLocaleString()}명</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </Card>
  );
}

function UserOverviewDashboard({ activeTab }: { activeTab: string }) {
  const getOverviewData = () => {
    if (activeTab === '사장님') {
      return [
        {
          title: '전체 사장님',
          value: '567',
          change: '+8.3%',
          changeType: 'positive' as const,
          icon: <Building className="w-6 h-6" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          description: '총 등록된 사장님 수'
        },
        {
          title: '활성 사장님',
          value: '523',
          change: '+5.2%',
          changeType: 'positive' as const,
          icon: <UserCheck className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: '현재 운영 중인 사장님'
        },
        {
          title: '신규 가입',
          value: '23',
          change: '+18.3%',
          changeType: 'positive' as const,
          icon: <UserPlus className="w-6 h-6" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          description: '이번 달 신규 사장님'
        },
        {
          title: '월 매출',
          value: '₩2,450,000,000',
          change: '+15.7%',
          changeType: 'positive' as const,
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: '전체 사장님 월 매출'
        }
      ];
    } else if (activeTab === '이용자') {
      return [
        {
          title: '전체 이용자',
          value: '12,234',
          change: '+12.1%',
          changeType: 'positive' as const,
          icon: <User className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: '총 등록된 이용자 수'
        },
        {
          title: '활성 이용자',
          value: '8,234',
          change: '+8.3%',
          changeType: 'positive' as const,
          icon: <UserCheck className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: '최근 30일 활동 이용자'
        },
        {
          title: '신규 가입',
          value: '433',
          change: '+18.7%',
          changeType: 'positive' as const,
          icon: <UserPlus className="w-6 h-6" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          description: '이번 달 신규 이용자'
        },
        {
          title: '월 주문량',
          value: '23,456',
          change: '+15.7%',
          changeType: 'positive' as const,
          icon: <ShoppingCart className="w-6 h-6" />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          description: '이용자 월 주문'
        }
      ];
    } else if (activeTab === '관리자') {
      return [
        {
          title: '전체 관리자',
          value: '8',
          change: '0%',
          changeType: 'neutral' as const,
          icon: <Shield className="w-6 h-6" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          description: '총 등록된 관리자 수'
        },
        {
          title: '활성 관리자',
          value: '7',
          change: '0%',
          changeType: 'neutral' as const,
          icon: <UserCheck className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: '현재 활동 중인 관리자'
        },
        {
          title: '오늘 로그인',
          value: '5',
          change: '+25%',
          changeType: 'positive' as const,
          icon: <Activity className="w-6 h-6" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          description: '오늘 로그인한 관리자'
        },
        {
          title: '평균 세션',
          value: '2.5시간',
          change: '+0.3h',
          changeType: 'positive' as const,
          icon: <Clock className="w-6 h-6" />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          description: '평균 작업 시간'
        }
      ];
    } else {
      // 전체 사용자
      return [
        {
          title: '전체 사용자',
          value: '13,023',
          change: '+12.5%',
          changeType: 'positive' as const,
          icon: <Users className="w-6 h-6" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          description: '총 등록된 사용자 수'
        },
        {
          title: '활성 사용자',
          value: '8,234',
          change: '+8.3%',
          changeType: 'positive' as const,
          icon: <UserCheck className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: '최근 30일 활동 사용자'
        },
        {
          title: '신규 가입',
          value: '456',
          change: '+18.3%',
          changeType: 'positive' as const,
          icon: <UserPlus className="w-6 h-6" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          description: '이번 달 신규 가입자'
        },
        {
          title: '월 주문량',
          value: '23,456',
          change: '+15.7%',
          changeType: 'positive' as const,
          icon: <ShoppingCart className="w-6 h-6" />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          description: '전체 사용자 월 주문'
        }
      ];
    }
  };

  const overviewData = getOverviewData();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {activeTab === '전체' ? '전체 사용자 현황' : `${activeTab} 현황`}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color}`}>
                {item.icon}
              </div>
              <div className={`flex items-center gap-1 ${
                item.changeType === 'positive' ? 'text-green-600' : 
                item.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {item.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : item.changeType === 'negative' ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{item.change}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function UserListManagement({
  activeTab,
  selectedUsers,
  setSelectedUsers,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  activityFilter,
  setActivityFilter,
  joinDateFilter,
  setJoinDateFilter,
  sortBy,
  setSortBy,
  onUserSelect
}: any) {
  // Mock data for different user types
  const mockUsers = {
    전체: [
      {
        id: '1',
        name: '김사장',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        type: '사장님',
        status: '활성',
        joinDate: '2024-01-15',
        lastActivity: '2024-01-25',
        stores: 1,
        orders: 234,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: '2',
        name: '이고객',
        email: 'lee@example.com',
        phone: '010-2345-6789',
        type: '이용자',
        status: '활성',
        joinDate: '2024-01-20',
        lastActivity: '2024-01-25',
        stores: 0,
        orders: 45,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: '3',
        name: '박관리자',
        email: 'admin@example.com',
        phone: '010-3456-7890',
        type: '관리자',
        status: '활성',
        joinDate: '2023-12-01',
        lastActivity: '2024-01-25',
        stores: 0,
        orders: 0,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      }
    ],
    사장님: [
      {
        id: '1',
        name: '김사장',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        type: '사장님',
        status: '활성',
        joinDate: '2024-01-15',
        lastActivity: '2024-01-25',
        stores: 1,
        orders: 234,
        revenue: 12500000,
        plan: 'Pro',
        storeName: '김치찌개 전문점',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: '4',
        name: '최사장',
        email: 'choi@example.com',
        phone: '010-4567-8901',
        type: '사장님',
        status: '승인대기',
        joinDate: '2024-01-22',
        lastActivity: '2024-01-24',
        stores: 1,
        orders: 0,
        revenue: 0,
        plan: 'Basic',
        storeName: '피자나라',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
      }
    ],
    이용자: [
      {
        id: '2',
        name: '이고객',
        email: 'lee@example.com',
        phone: '010-2345-6789',
        type: '이용자',
        status: '활성',
        joinDate: '2024-01-20',
        lastActivity: '2024-01-25',
        stores: 0,
        orders: 45,
        totalSpent: 567000,
        favoriteCategory: '한식',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      {
        id: '5',
        name: '정고객',
        email: 'jung@example.com',
        phone: '010-5678-9012',
        type: '이용자',
        status: '활성',
        joinDate: '2024-01-18',
        lastActivity: '2024-01-23',
        stores: 0,
        orders: 23,
        totalSpent: 234000,
        favoriteCategory: '중식',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      }
    ],
    관리자: [
      {
        id: '3',
        name: '박관리자',
        email: 'admin@example.com',
        phone: '010-3456-7890',
        type: '관리자',
        status: '활성',
        joinDate: '2023-12-01',
        lastActivity: '2024-01-25',
        stores: 0,
        orders: 0,
        role: '시스템 관리자',
        permissions: ['전체'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      }
    ]
  };

  const currentUsers = mockUsers[activeTab as keyof typeof mockUsers] || [];

  const filteredUsers = currentUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === '전체' || user.status === statusFilter;
    const matchesType = typeFilter === '전체' || user.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      '활성': 'bg-green-100 text-green-800',
      '승인대기': 'bg-orange-100 text-orange-800',
      '정지': 'bg-red-100 text-red-800',
      '비활성': 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      '사장님': 'bg-blue-100 text-blue-800',
      '이용자': 'bg-green-100 text-green-800',
      '관리자': 'bg-purple-100 text-purple-800'
    };
    return typeConfig[type as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeTab === '전체' ? '전체 사용자 목록' : `${activeTab} 목록`}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={selectedUsers.length === 0}
          >
            선택된 사용자 활성화 ({selectedUsers.length})
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={selectedUsers.length === 0}
          >
            선택된 사용자 정지 ({selectedUsers.length})
          </Button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="이름, 이메일, 전화번호 검색"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="전체">모든 상태</option>
              <option value="활성">활성</option>
              <option value="승인대기">승인대기</option>
              <option value="정지">정지</option>
              <option value="비활성">비활성</option>
            </select>
            {activeTab === '전체' && (
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="전체">모든 유형</option>
                <option value="사장님">사장님</option>
                <option value="이용자">이용자</option>
                <option value="관리자">관리자</option>
              </select>
            )}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
            >
              <option value="전체">모든 활동</option>
              <option value="최근활동">최근 활동</option>
              <option value="비활동">비활동</option>
            </select>
          </div>
        </div>
      </div>

      {/* 사용자 목록 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(filteredUsers.map(user => user.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">사용자 정보</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">연락처</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">유형</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">상태</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                {activeTab === '사장님' ? '상점/매출' : activeTab === '이용자' ? '주문/지출' : '권한'}
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">가입일</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                  />
                </td>
                <td className="py-4 px-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => onUserSelect(user)}>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {activeTab === '사장님' && (user as any).storeName && (
                        <p className="text-xs text-blue-600">{(user as any).storeName}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-gray-900">{user.phone}</p>
                  <p className="text-sm text-gray-500">최근: {user.lastActivity}</p>
                </td>
                <td className="py-4 px-4">
                  <Badge className={getTypeBadge(user.type)}>
                    {user.type}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge className={getStatusBadge(user.status)}>
                    {user.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  {activeTab === '사장님' ? (
                    <div>
                      <p className="font-medium text-gray-900">{user.stores}개 상점</p>
                      <p className="text-sm text-gray-500">
                        ₩{((user as any).revenue / 10000).toLocaleString()}만원
                      </p>
                    </div>
                  ) : activeTab === '이용자' ? (
                    <div>
                      <p className="font-medium text-gray-900">{user.orders}건 주문</p>
                      <p className="text-sm text-gray-500">
                        ₩{((user as any).totalSpent / 1000).toLocaleString()}천원
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-gray-900">{(user as any).role}</p>
                      <p className="text-sm text-gray-500">
                        {(user as any).permissions?.join(', ') || '없음'}
                      </p>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-500">{user.joinDate}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onUserSelect(user)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          총 {filteredUsers.length}명 중 1-{Math.min(10, filteredUsers.length)}명 표시
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            이전
          </Button>
          <Button variant="outline" size="sm">
            다음
          </Button>
        </div>
      </div>
    </Card>
  );
}

function OwnerAccountDetail({ user, onClose }: { user: any; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('기본정보');

  const tabs = [
    { id: '기본정보', label: '기본 정보', icon: <User className="w-4 h-4" /> },
    { id: '상점정보', label: '상점 정보', icon: <Building className="w-4 h-4" /> },
    { id: '매출분석', label: '매출 분석', icon: <BarChart3 className="w-4 h-4" /> },
    { id: '계정관리', label: '계정 관리', icon: <Settings className="w-4 h-4" /> }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      '활성': 'bg-green-100 text-green-800',
      '승인대기': 'bg-orange-100 text-orange-800',
      '정지': 'bg-red-100 text-red-800',
      '비활성': 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{user.name} 사장님 상세 정보</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
          닫기
        </Button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === '기본정보' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">개인 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">이름</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">이메일</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">전화번호</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">가입일</p>
                      <p className="font-medium">{user.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 현황</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">계정 상태</span>
                    <Badge className={getStatusBadge(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">구독 플랜</span>
                    <span className="font-medium text-green-600">{user.plan}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600">운영 상점</span>
                    <span className="font-medium text-purple-600">{user.stores}개</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">월 매출</span>
                    <span className="font-medium text-orange-600">
                      ₩{(user.revenue / 10000).toLocaleString()}만원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === '상���정보' && (
          <div>
            <p className="text-gray-600">상점 정보 탭 내용이 여기에 표시됩니다.</p>
          </div>
        )}
        {activeTab === '매출분석' && (
          <div>
            <p className="text-gray-600">매출 분석 탭 내용이 여기에 표시됩니다.</p>
          </div>
        )}
        {activeTab === '계정관리' && (
          <div>
            <p className="text-gray-600">계정 관리 탭 내용이 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </Card>
  );
}