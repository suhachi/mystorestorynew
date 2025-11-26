import {
  Award,
  Building,
  Calendar,
  CheckCircle,
  Eye,
  MessageSquare,
  MoreHorizontal, Search,
  Settings,
  Star,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  User,
  X,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function ReviewManagement() {
  const [appBuildReviews, setAppBuildReviews] = useState([
    {
      id: '1',
      ownerName: '김사장',
      storeName: '김치찌개 전문점',
      ownerEmail: 'kim@example.com',
      appBuildRating: 5,
      buildExperience: '매우 만족',
      content: '앱빌드 시스템이 정말 편리합니다! 메뉴 관리부터 주문 처리까지 모든 기능이 직관적이고 사용하기 쉬워요. 특히 결제 시스템 연동이 자동으로 되어서 정말 편했습니다.',
      buildDate: '2024-01-20',
      reviewDate: '2024-01-25',
      status: '승인',
      likes: 12,
      features: ['메뉴 관리', '주문 처리', '결제 시스템', '고객 관리'],
      buildTime: '2시간 30분',
      difficulty: '쉬움',
      supportRating: 5,
      recommendation: true
    },
    {
      id: '2',
      ownerName: '이고객',
      storeName: '피자나라',
      ownerEmail: 'lee@example.com',
      appBuildRating: 3,
      buildExperience: '보통',
      content: '앱빌드 자체는 괜찮지만 몇 가지 기능이 복잡했습니다. 특히 메뉴 이미지 업로드 부분에서 시간이 오래 걸렸어요. 하지만 고객 지원팀이 잘 도와주셔서 완성할 수 있었습니다.',
      buildDate: '2024-01-18',
      reviewDate: '2024-01-24',
      status: '검토중',
      likes: 5,
      features: ['메뉴 관리', '주문 처리'],
      buildTime: '4시간 15분',
      difficulty: '보통',
      supportRating: 4,
      recommendation: true
    },
    {
      id: '3',
      ownerName: '박사장',
      storeName: '중국집',
      ownerEmail: 'park@example.com',
      appBuildRating: 4,
      buildExperience: '만족',
      content: '전반적으로 만족스럽습니다. 앱 디자인이 깔끔하고 고객들이 주문하기 편하다고 하네요. 다만 일부 기능을 더 추가하면 좋을 것 같습니다.',
      buildDate: '2024-01-15',
      reviewDate: '2024-01-22',
      status: '승인',
      likes: 8,
      features: ['메뉴 관리', '주문 처리', '결제 시스템', '리뷰 관리'],
      buildTime: '3시간 45분',
      difficulty: '쉬움',
      supportRating: 5,
      recommendation: true
    }
  ]);

  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [ratingFilter, setRatingFilter] = useState('전체');
  const [experienceFilter, setExperienceFilter] = useState('전체');
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const reviewStats = {
    total: 12500,
    average: 4.2,
    pending: 1,
    thisMonth: 450
  };

  const handleReviewAction = (action: string, reviewId: string) => {
    setAppBuildReviews(appBuildReviews.map(review =>
      review.id === reviewId
        ? { ...review, status: action === 'approve' ? '승인' : action === 'reject' ? '거부' : '숨김' }
        : review
    ));

    const actionText = action === 'approve' ? '승인' : action === 'reject' ? '거부' : '숨김';
    toast.success(`리뷰가 ${actionText} 처리되었습니다.`);
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">앱빌드 리뷰 관리</h1>
        <p className="text-gray-600">상점 사장님들의 앱빌드 경험 리뷰를 관리하고 분석하세요</p>
      </div>

      {/* 앱빌드 리뷰 현황 대시보드 */}
      <AppBuildReviewStatsDashboard stats={reviewStats} />

      {/* 앱빌드 리뷰 목록 관리 */}
      <AppBuildReviewListManagement
        reviews={appBuildReviews}
        selectedReviews={selectedReviews}
        setSelectedReviews={setSelectedReviews}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        experienceFilter={experienceFilter}
        setExperienceFilter={setExperienceFilter}
        onReviewSelect={setSelectedReview}
        onReviewAction={handleReviewAction}
      />

      {/* 앱빌드 리뷰 상세 정보 */}
      {selectedReview && (
        <AppBuildReviewDetail
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}

      {/* 앱빌드 리뷰 분석 */}
      <AppBuildReviewAnalysis reviews={appBuildReviews} />
    </div>
  );
}

function AppBuildReviewStatsDashboard({ stats }: { stats: any }) {
  const kpiData = [
    {
      title: '총 리뷰',
      value: '12,500',
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '전체 앱빌드 리뷰 수'
    },
    {
      title: '평균 평점',
      value: '4.2',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: <Star className="w-6 h-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: '앱빌드 시스템 만족도'
    },
    {
      title: '검토 대기',
      value: '1',
      change: '-5.2%',
      changeType: 'negative' as const,
      icon: <Eye className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '승인 대기 중인 리뷰'
    },
    {
      title: '이번 달',
      value: '450',
      change: '+12.1%',
      changeType: 'positive' as const,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '이번 달 새 리뷰'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">앱빌드 리뷰 현황</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color}`}>
                {item.icon}
              </div>
              <div className={`flex items-center gap-1 ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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
          </div>
        ))}
      </div>
    </Card>
  );
}

function AppBuildReviewListManagement({
  reviews,
  selectedReviews,
  setSelectedReviews,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  ratingFilter,
  setRatingFilter,
  experienceFilter,
  setExperienceFilter,
  onReviewSelect,
  onReviewAction
}: any) {
  const filteredReviews = reviews.filter((review: any) => {
    const matchesSearch = review.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || review.status === statusFilter;
    const matchesRating = ratingFilter === '전체' || review.appBuildRating.toString() === ratingFilter;
    const matchesExperience = experienceFilter === '전체' || review.buildExperience === experienceFilter;

    return matchesSearch && matchesStatus && matchesRating && matchesExperience;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      '승인': 'bg-green-100 text-green-800',
      '검토중': 'bg-orange-100 text-orange-800',
      '거부': 'bg-red-100 text-red-800',
      '숨김': 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getExperienceBadge = (experience: string) => {
    const experienceConfig = {
      '매우 만족': 'bg-green-100 text-green-800',
      '만족': 'bg-blue-100 text-blue-800',
      '보통': 'bg-yellow-100 text-yellow-800',
      '불만족': 'bg-red-100 text-red-800'
    };
    return experienceConfig[experience as keyof typeof experienceConfig] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">앱빌드 리뷰 목록</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedReviews.length === 0}
          >
            선택된 리뷰 승인 ({selectedReviews.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selectedReviews.length === 0}
          >
            선택된 리뷰 거부 ({selectedReviews.length})
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
                placeholder="사장님명, 상점명, 리뷰 내용 검색"
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
              <option value="승인">승인</option>
              <option value="검토중">검토중</option>
              <option value="거부">거부</option>
              <option value="숨김">숨김</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="전���">모든 평점</option>
              <option value="5">5점</option>
              <option value="4">4점</option>
              <option value="3">3점</option>
              <option value="2">2점</option>
              <option value="1">1점</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
            >
              <option value="전체">모든 경험</option>
              <option value="매우 만족">매우 만족</option>
              <option value="만족">만족</option>
              <option value="보통">보통</option>
              <option value="불만족">불만족</option>
            </select>
          </div>
        </div>
      </div>

      {/* 앱빌드 리뷰 목록 */}
      <div className="space-y-4">
        {filteredReviews.map((review: any) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{review.ownerName}</span>
                    <span className="text-gray-500">({review.storeName})</span>
                  </div>
                  <Badge className={getStatusBadge(review.status)}>
                    {review.status}
                  </Badge>
                  <Badge className={getExperienceBadge(review.buildExperience)}>
                    {review.buildExperience}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(review.appBuildRating)}
                  </div>
                  <span className="text-sm text-gray-500">앱빌드 만족도</span>
                </div>

                <p className="text-gray-700 mb-3">{review.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>빌드일: {review.buildDate}</span>
                  <span>리뷰일: {review.reviewDate}</span>
                  <span>빌드시간: {review.buildTime}</span>
                  <span>난이도: {review.difficulty}</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.likes}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReviewSelect(review)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {review.status === '검토중' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReviewAction('approve', review.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReviewAction('reject', review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          총 {filteredReviews.length}개 리뷰 중 1-{Math.min(10, filteredReviews.length)}개 표시
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

function AppBuildReviewDetail({ review, onClose }: { review: any; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('기본정보');

  const tabs = [
    { id: '기본정보', label: '기본 정보', icon: <User className="w-4 h-4" /> },
    { id: '빌드경험', label: '빌드 경험', icon: <Zap className="w-4 h-4" /> },
    { id: '기능평가', label: '기능 평가', icon: <Settings className="w-4 h-4" /> },
    { id: '지원평가', label: '지원 평가', icon: <Award className="w-4 h-4" /> }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{review.ownerName} 사장님의 앱빌드 리뷰</h2>
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
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">사장님 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">이름</p>
                      <p className="font-medium">{review.ownerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">상점명</p>
                      <p className="font-medium">{review.storeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">빌드일</p>
                      <p className="font-medium">{review.buildDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">앱빌드 현황</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">앱빌드 만족도</span>
                    <div className="flex items-center gap-1">
                      {renderStars(review.appBuildRating)}
                      <span className="font-medium text-blue-600">{review.appBuildRating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">빌드 경험</span>
                    <span className="font-medium text-green-600">{review.buildExperience}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600">빌드 시간</span>
                    <span className="font-medium text-purple-600">{review.buildTime}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">난이도</span>
                    <span className="font-medium text-orange-600">{review.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === '빌드경험' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">빌드 경험 상세</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{review.content}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{review.likes}명이 도움이 되었다고 평가</span>
            </div>
          </div>
        )}

        {activeTab === '기능평가' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">사용한 기능들</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {review.features.map((feature: string, index: number) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg text-center">
                  <span className="text-sm font-medium text-blue-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === '지원평가' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">고객 지원 평가</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">지원 만족도</span>
                <div className="flex items-center gap-1">
                  {renderStars(review.supportRating)}
                  <span className="font-medium text-green-600">{review.supportRating}/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">추천 여부</span>
                <span className="font-medium text-blue-600">
                  {review.recommendation ? '추천함' : '추천 안함'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function AppBuildReviewAnalysis({ reviews }: { reviews: any[] }) {
  const analysisData = {
    totalReviews: reviews.length,
    averageRating: reviews.reduce((sum, r) => sum + r.appBuildRating, 0) / reviews.length,
    experienceDistribution: {
      '매우 만족': reviews.filter(r => r.buildExperience === '매우 만족').length,
      '만족': reviews.filter(r => r.buildExperience === '만족').length,
      '보통': reviews.filter(r => r.buildExperience === '보통').length,
      '불만족': reviews.filter(r => r.buildExperience === '불만족').length
    },
    difficultyDistribution: {
      '쉬움': reviews.filter(r => r.difficulty === '쉬움').length,
      '보통': reviews.filter(r => r.difficulty === '보통').length,
      '어려움': reviews.filter(r => r.difficulty === '어려움').length
    },
    topFeatures: ['메뉴 관리', '주문 처리', '결제 시스템', '고객 관리', '리뷰 관리']
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">앱빌드 리뷰 분석</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 평균 평점 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">평균 평점</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-blue-600">{analysisData.averageRating.toFixed(1)}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${index < Math.floor(analysisData.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 경험 분포 */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">빌드 경험 분포</h3>
          <div className="space-y-2">
            {Object.entries(analysisData.experienceDistribution).map(([experience, count]) => (
              <div key={experience} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{experience}</span>
                <span className="font-medium text-green-600">{count}개</span>
              </div>
            ))}
          </div>
        </div>

        {/* 난이도 분포 */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">빌드 난이도 분포</h3>
          <div className="space-y-2">
            {Object.entries(analysisData.difficultyDistribution).map(([difficulty, count]) => (
              <div key={difficulty} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{difficulty}</span>
                <span className="font-medium text-orange-600">{count}개</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 인기 기능 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 기능 TOP 5</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {analysisData.topFeatures.map((feature, index) => (
            <div key={index} className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">#{index + 1}</div>
              <span className="text-sm font-medium text-purple-800">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
