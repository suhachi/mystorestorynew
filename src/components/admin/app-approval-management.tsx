import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Clock, CheckCircle, XCircle, Eye, AlertCircle, 
  Filter, Search, Calendar, User, Mail, Phone,
  Building, Crown, Star, RefreshCw, Download,
  MessageSquare, FileText, Settings
} from 'lucide-react';
import { useNavigation } from '../system/app-router';

// 앱 승인 요청 데이터 타입 정의
export interface AppApprovalRequest {
  id: string;
  requestId: string;
  storeName: string;
  subdomain: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  planType: 'basic' | 'pro' | 'enterprise';
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  requestDate: string;
  reviewDate?: string;
  reviewerId?: string;
  reviewerName?: string;
  rejectionReason?: string;
  appConfig: {
    storeInfo: any;
    planSelection: any;
    orderPayment: any;
    customerMarketing: any;
    branding: any;
    finalSettings: any;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedProcessingTime: string;
  notes?: string;
}

// Mock 데이터
const mockApprovalRequests: AppApprovalRequest[] = [
  {
    id: 'req-001',
    requestId: 'APP-20240928-001',
    storeName: '카페 마이스토리',
    subdomain: 'cafe-mystory',
    ownerName: '김사장',
    ownerEmail: 'owner@cafe-mystory.com',
    ownerPhone: '010-1234-5678',
    planType: 'enterprise',
    status: 'pending',
    requestDate: '2024-09-28T10:30:00Z',
    priority: 'normal',
    estimatedProcessingTime: '1-2 영업일',
    appConfig: {
      storeInfo: { name: '카페 마이스토리', category: '카페' },
      planSelection: { plan: 'enterprise' },
      orderPayment: { paymentMethods: ['card', 'kakao', 'naver'] },
      customerMarketing: { loyaltyProgram: true },
      branding: { primaryColor: '#3B82F6' },
      finalSettings: { features: ['delivery', 'pickup', 'reservation'] }
    }
  },
  {
    id: 'req-002',
    requestId: 'APP-20240928-002',
    storeName: '피자헛 강남점',
    subdomain: 'pizzahut-gangnam',
    ownerName: '이매니저',
    ownerEmail: 'manager@pizzahut-gangnam.com',
    ownerPhone: '010-9876-5432',
    planType: 'pro',
    status: 'under-review',
    requestDate: '2024-09-27T14:20:00Z',
    reviewDate: '2024-09-28T09:15:00Z',
    reviewerId: 'admin-001',
    reviewerName: '관리자 김',
    priority: 'high',
    estimatedProcessingTime: '당일 처리',
    appConfig: {
      storeInfo: { name: '피자헛 강남점', category: '피자' },
      planSelection: { plan: 'pro' },
      orderPayment: { paymentMethods: ['card', 'kakao'] },
      customerMarketing: { loyaltyProgram: false },
      branding: { primaryColor: '#EF4444' },
      finalSettings: { features: ['delivery', 'pickup'] }
    }
  },
  {
    id: 'req-003',
    requestId: 'APP-20240927-003',
    storeName: '맛있는 치킨',
    subdomain: 'tasty-chicken',
    ownerName: '박사장',
    ownerEmail: 'owner@tasty-chicken.com',
    ownerPhone: '010-5555-1234',
    planType: 'basic',
    status: 'approved',
    requestDate: '2024-09-26T16:45:00Z',
    reviewDate: '2024-09-27T11:30:00Z',
    reviewerId: 'admin-002',
    reviewerName: '관리자 이',
    priority: 'normal',
    estimatedProcessingTime: '1 영업일',
    appConfig: {
      storeInfo: { name: '맛있는 치킨', category: '치킨' },
      planSelection: { plan: 'basic' },
      orderPayment: { paymentMethods: ['card'] },
      customerMarketing: { loyaltyProgram: false },
      branding: { primaryColor: '#F59E0B' },
      finalSettings: { features: ['delivery'] }
    }
  },
  {
    id: 'req-004',
    requestId: 'APP-20240927-004',
    storeName: '홍콩반점',
    subdomain: 'hongkong-banjeom',
    ownerName: '최원장',
    ownerEmail: 'owner@hongkong-banjeom.com',
    ownerPhone: '010-7777-8888',
    planType: 'pro',
    status: 'rejected',
    requestDate: '2024-09-25T09:15:00Z',
    reviewDate: '2024-09-26T14:20:00Z',
    reviewerId: 'admin-001',
    reviewerName: '관리자 김',
    rejectionReason: '사업자등록증 확인 불가',
    priority: 'normal',
    estimatedProcessingTime: '1 영업일',
    appConfig: {
      storeInfo: { name: '홍콩반점', category: '중식' },
      planSelection: { plan: 'pro' },
      orderPayment: { paymentMethods: ['card', 'kakao'] },
      customerMarketing: { loyaltyProgram: true },
      branding: { primaryColor: '#DC2626' },
      finalSettings: { features: ['delivery', 'pickup'] }
    }
  },
  {
    id: 'req-005',
    requestId: 'APP-20240928-005',
    storeName: '스타벅스 역삼점',
    subdomain: 'starbucks-yeoksam',
    ownerName: '정매니저',
    ownerEmail: 'manager@starbucks-yeoksam.com',
    ownerPhone: '010-3333-4444',
    planType: 'enterprise',
    status: 'pending',
    requestDate: '2024-09-28T08:00:00Z',
    priority: 'urgent',
    estimatedProcessingTime: '당일 처리',
    appConfig: {
      storeInfo: { name: '스타벅스 역삼점', category: '카페' },
      planSelection: { plan: 'enterprise' },
      orderPayment: { paymentMethods: ['card', 'kakao', 'naver', 'payco'] },
      customerMarketing: { loyaltyProgram: true },
      branding: { primaryColor: '#00704A' },
      finalSettings: { features: ['delivery', 'pickup', 'reservation', 'catering'] }
    }
  }
];

// 통계 카드 컴포넌트
function ApprovalStatsCard({ title, value, icon, color, change }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">{title}</p>
          <p className="font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-gray-500 mt-1">{change}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// 승인 요청 카드 컴포넌트
function ApprovalRequestCard({ request, onView, onApprove, onReject }: {
  request: AppApprovalRequest;
  onView: (request: AppApprovalRequest) => void;
  onApprove: (request: AppApprovalRequest) => void;
  onReject: (request: AppApprovalRequest) => void;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />대기중</Badge>;
      case 'under-review':
        return <Badge className="bg-blue-100 text-blue-800"><Eye className="w-3 h-3 mr-1" />검토중</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />승인됨</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />거부됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">긴급</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">높음</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800">보통</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">낮음</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'enterprise':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'pro':
        return <Star className="w-4 h-4 text-blue-600" />;
      case 'basic':
        return <Building className="w-4 h-4 text-gray-600" />;
      default:
        return <Building className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-200 ${
      request.priority === 'urgent' ? 'border-red-200 bg-red-50' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getPlanIcon(request.planType)}
          <div>
            <h3 className="font-semibold text-gray-900">{request.storeName}</h3>
            <p className="text-gray-600">{request.subdomain}.mystory.kr</p>
          </div>
        </div>
        <div className="flex gap-2">
          {getPriorityBadge(request.priority)}
          {getStatusBadge(request.status)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-500">사장명</p>
          <p className="font-medium text-gray-900">{request.ownerName}</p>
        </div>
        <div>
          <p className="text-gray-500">플랜</p>
          <p className="font-medium text-gray-900 capitalize">{request.planType}</p>
        </div>
        <div>
          <p className="text-gray-500">요청일</p>
          <p className="font-medium text-gray-900">
            {new Date(request.requestDate).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <div>
          <p className="text-gray-500">처리 예정</p>
          <p className="font-medium text-gray-900">{request.estimatedProcessingTime}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">{request.ownerEmail}</span>
        <Phone className="w-4 h-4 text-gray-400 ml-2" />
        <span className="text-gray-600">{request.ownerPhone}</span>
      </div>

      {request.rejectionReason && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <p className="text-red-800">
              거부 사유: {request.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {request.status === 'pending' && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onView(request)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            상세보기
          </Button>
          <Button 
            size="sm" 
            onClick={() => onApprove(request)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onReject(request)}
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      {request.status === 'under-review' && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onView(request)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            검토 계속하기
          </Button>
          <Button 
            size="sm" 
            onClick={() => onApprove(request)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onReject(request)}
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      {request.status === 'approved' && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onView(request)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            승인 내역 보기
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => console.log('앱 배포 상태 확인')}
          >
            <Download className="w-4 h-4 mr-2" />
            배포 상태
          </Button>
        </div>
      )}

      {request.status === 'rejected' && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onView(request)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            거부 사유 보기
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => console.log('재검토 요청')}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            재검토 요청
          </Button>
        </div>
      )}
    </Card>
  );
}

// 필터 컴포넌트
function ApprovalFilters({ filters, onFilterChange }: {
  filters: any;
  onFilterChange: (key: string, value: string) => void;
}) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <select 
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">전체 상태</option>
          <option value="pending">대기중</option>
          <option value="under-review">검토중</option>
          <option value="approved">승인됨</option>
          <option value="rejected">거부됨</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Crown className="w-4 h-4 text-gray-500" />
        <select 
          value={filters.planType}
          onChange={(e) => onFilterChange('planType', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">전체 플랜</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-gray-500" />
        <select 
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">전체 우선순위</option>
          <option value="urgent">긴급</option>
          <option value="high">높음</option>
          <option value="normal">보통</option>
          <option value="low">낮음</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <select 
          value={filters.dateRange}
          onChange={(e) => onFilterChange('dateRange', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">전체 기간</option>
          <option value="today">오늘</option>
          <option value="week">최근 1주일</option>
          <option value="month">최근 1개월</option>
        </select>
      </div>
    </div>
  );
}

// 메인 컴포넌트
export function AppApprovalManagement() {
  const [requests, setRequests] = useState<AppApprovalRequest[]>(mockApprovalRequests);
  const [filters, setFilters] = useState({
    status: 'all',
    planType: 'all',
    priority: 'all',
    dateRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { navigate } = useNavigation();

  // 통계 계산
  const statistics = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    underReview: requests.filter(r => r.status === 'under-review').length,
  };

  // 필터링된 요청 목록
  const filteredRequests = requests.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.planType !== 'all' && request.planType !== filters.planType) return false;
    if (filters.priority !== 'all' && request.priority !== filters.priority) return false;
    if (searchTerm && !request.storeName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !request.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleViewRequest = (request: AppApprovalRequest) => {
    console.log('상세보기:', request);
    // 상세보기 페이지로 이동 (결제 연동 설정 포함)
    navigate('admin-app-approval-detail', { requestId: request.id });
  };

  const handleApproveRequest = (request: AppApprovalRequest) => {
    console.log('승인:', request);
    setRequests(prev => 
      prev.map(r => 
        r.id === request.id 
          ? { ...r, status: 'approved' as const, reviewDate: new Date().toISOString(), reviewerName: '현재 관리자' }
          : r
      )
    );
    alert(`${request.storeName}의 앱 배포가 승인되었습니다.`);
  };

  const handleRejectRequest = (request: AppApprovalRequest) => {
    const reason = prompt('거부 사유를 입력해주세요:');
    if (reason) {
      console.log('거부:', request, '사유:', reason);
      setRequests(prev => 
        prev.map(r => 
          r.id === request.id 
            ? { ...r, status: 'rejected' as const, reviewDate: new Date().toISOString(), reviewerName: '현재 관리자', rejectionReason: reason }
            : r
        )
      );
      alert(`${request.storeName}의 앱 배포가 거부되었습니다.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900">앱 승인 요청 관리</h1>
          <p className="text-gray-600">앱빌드 완료 후 승인 요청을 검토하고 처리하세요</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ApprovalStatsCard
          title="전체 요청"
          value={statistics.total}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <ApprovalStatsCard
          title="대기중"
          value={statistics.pending}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-100"
        />
        <ApprovalStatsCard
          title="검토중"
          value={statistics.underReview}
          icon={<Eye className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <ApprovalStatsCard
          title="승인됨"
          value={statistics.approved}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <ApprovalStatsCard
          title="거부됨"
          value={statistics.rejected}
          icon={<XCircle className="w-6 h-6 text-red-600" />}
          color="bg-red-100"
        />
      </div>

      {/* 검색 및 필터 */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="상점명 또는 사장명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <ApprovalFilters filters={filters} onFilterChange={handleFilterChange} />
      </Card>

      {/* 승인 요청 목록 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            승인 요청 목록 ({filteredRequests.length}개)
          </h2>
          <div className="flex items-center gap-2 text-gray-500">
            <AlertCircle className="w-4 h-4" />
            긴급 요청은 빨간색 테두리로 표시됩니다
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">승인 요청이 없습니다</h3>
            <p className="text-gray-600">현재 필터 조건에 맞는 승인 요청이 없습니다.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
              <ApprovalRequestCard
                key={request.id}
                request={request}
                onView={handleViewRequest}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}