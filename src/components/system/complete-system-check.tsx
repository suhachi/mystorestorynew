import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FinalShowcase } from '../final-showcase';
import { FinalConnectedApp } from './final-connected-app';
import { 
  CheckCircle, XCircle, AlertTriangle, 
  Monitor, Smartphone, Tablet, Layout,
  Code, Layers, Zap, Settings, ArrowRight,
  Play, Eye, BookOpen
} from 'lucide-react';

type ViewMode = 'showcase' | 'connected-app' | 'system-check';

export function CompleteSystemCheck() {
  const [viewMode, setViewMode] = useState<ViewMode>('showcase');

  return (
    <div className="min-h-screen bg-background">
      {/* Mode Selector */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
          <div className="flex gap-2">
            <ModeButton
              active={viewMode === 'showcase'}
              onClick={() => setViewMode('showcase')}
              icon={<Eye size={16} />}
              label="완성 쇼케이스"
            />
            <ModeButton
              active={viewMode === 'connected-app'}
              onClick={() => setViewMode('connected-app')}
              icon={<Play size={16} />}
              label="실제 앱 시스템"
            />
            <ModeButton
              active={viewMode === 'system-check'}
              onClick={() => setViewMode('system-check')}
              icon={<CheckCircle size={16} />}
              label="시스템 체크"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={viewMode === 'system-check' ? 'pt-20' : ''}
        >
          {viewMode === 'showcase' && <FinalShowcase />}
          {viewMode === 'connected-app' && <FinalConnectedApp />}
          {viewMode === 'system-check' && <SystemCheck />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ModeButton({ active, onClick, icon, label }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-body-small
        ${active 
          ? 'bg-primary-blue text-white shadow-md' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SystemCheck() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-heading-1 text-gray-900 mb-4">🔍 MyStoreStory 시스템 체크</h1>
        <p className="text-body-large text-gray-600">완성된 시스템의 모든 구성요소를 확인해보세요</p>
      </div>

      {/* Phase 1: 디자인 시스템 */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-success-green-50 rounded-xl flex items-center justify-center">
            <Settings size={24} className="text-success-green" />
          </div>
          <div>
            <h2 className="text-heading-2 text-gray-900">Phase 1: 디자인 시스템</h2>
            <p className="text-body text-gray-600">기본 토큰과 컴포넌트 시스템</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CheckItem
            title="색상 시스템"
            description="Primary Blue 기반 색상 팔레트"
            status="완료"
            details={[
              "Primary: #2563eb",
              "10단계 Neutral Gray",
              "Status Colors (성공/경고/오류)",
              "50% 투명도 변형"
            ]}
          />
          
          <CheckItem
            title="타이포그래피"
            description="Inter/Pretendard 폰트 시스템"
            status="완료"
            details={[
              "8단계 크기 시스템",
              "6단계 굵기 시스템", 
              "3단계 줄간격",
              "시맨틱 클래스"
            ]}
          />
          
          <CheckItem
            title="간격 시스템"
            description="8px 기준 간격 시스템"
            status="완료"
            details={[
              "4px~64px 범위",
              "일관된 간격 적용",
              "컴포넌트 내부 간격",
              "레이아웃 간격"
            ]}
          />
          
          <CheckItem
            title="그림자 & 모서리"
            description="5단계 시스템"
            status="완료"
            details={[
              "5단계 그림자 (sm~xl)",
              "5단계 모서리 (2px~12px)",
              "일관된 적용",
              "접근성 고려"
            ]}
          />
        </div>
      </section>

      {/* Phase 2: 레이아웃 구조 */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-blue-50 rounded-xl flex items-center justify-center">
            <Layout size={24} className="text-primary-blue" />
          </div>
          <div>
            <h2 className="text-heading-2 text-gray-900">Phase 2: 레이아웃 구조</h2>
            <p className="text-body text-gray-600">4가지 레이아웃과 반응형 시스템</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CheckItem
            title="통합관리자 레이아웃"
            description="플랫폼 전체 관리"
            status="완료"
            details={[
              "고정 사이드바",
              "상단 헤더",
              "브레드크럼",
              "메인 콘텐츠 영역"
            ]}
          />
          
          <CheckItem
            title="상점관리자 레이아웃"
            description="개별 상점 관리"
            status="완료"
            details={[
              "상점 선택 영역",
              "메뉴 네비게이션",
              "상태 표시",
              "액션 버튼 영역"
            ]}
          />
          
          <CheckItem
            title="고객용 앱 레이아웃"
            description="모바일 최적화"
            status="완료"
            details={[
              "하단 네비게이션",
              "상단 헤더",
              "스크롤 영역",
              "터치 최적화"
            ]}
          />
          
          <CheckItem
            title="앱빌더 레이아웃"
            description="8단계 마법사"
            status="완료"
            details={[
              "진행률 표시",
              "단계 네비게이션",
              "실시간 미리보기",
              "이전/다음 버튼"
            ]}
          />
        </div>
      </section>

      {/* Phase 3: 페이지 디자인 */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-warning-yellow-50 rounded-xl flex items-center justify-center">
            <Monitor size={24} className="text-warning-yellow" />
          </div>
          <div>
            <h2 className="text-heading-2 text-gray-900">Phase 3: 페이지 디자인</h2>
            <p className="text-body text-gray-600">완성된 주요 페이지들</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CheckItem
            title="랜딩 페이지"
            description="마케팅 홈페이지"
            status="완료"
            details={[
              "히어로 섹션",
              "기능 소개 (6개)",
              "성공 사례 (4개)",
              "고객 후기 (3개)",
              "가격 플랜 (3개)"
            ]}
          />
          
          <CheckItem
            title="인증 시스템"
            description="로그인/회원가입"
            status="완료"
            details={[
              "로그인 페이지",
              "회원가입 페이지",
              "플랜 승인 대기",
              "소셜 로그인 지원"
            ]}
          />
          
          <CheckItem
            title="관리자 대시보드"
            description="통합/상점 관리"
            status="완료"
            details={[
              "통합관리자 대시보드",
              "상점관리자 대시보드", 
              "실시간 통계",
              "활동 로그"
            ]}
          />
        </div>
      </section>

      {/* Phase 4: 최종 연결 */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-success-green-50 rounded-xl flex items-center justify-center">
            <Zap size={24} className="text-success-green" />
          </div>
          <div>
            <h2 className="text-heading-2 text-gray-900">Phase 4: 최종 연결</h2>
            <p className="text-body text-gray-600">네비게이션, 애니메이션, 최적화</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CheckItem
            title="라우팅 시스템"
            description="완전한 네비게이션"
            status="완료"
            details={[
              "React 기반 라우팅",
              "상태 관리",
              "페이지 전환 애니메이션",
              "브레드크럼"
            ]}
          />
          
          <CheckItem
            title="반응형 최적화"
            description="모든 디바이스 지원"
            status="완료"
            details={[
              "Mobile: 0-767px",
              "Tablet: 768-1023px", 
              "Desktop: 1024px+",
              "터치 최적화"
            ]}
          />
          
          <CheckItem
            title="애니메이션"
            description="부드러운 인터랙션"
            status="완료"
            details={[
              "Motion 라이브러리",
              "60fps 애니메이션",
              "호버/클릭 효과",
              "로딩 상태"
            ]}
          />
          
          <CheckItem
            title="접근성"
            description="WCAG 2.1 AA 준수"
            status="완료"
            details={[
              "키보드 네비게이션",
              "스크린 리더 지원",
              "색상 대비 4.5:1",
              "44px 터치 영역"
            ]}
          />
        </div>
      </section>

      {/* 기술 스택 */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <Code size={24} className="text-gray-600" />
          </div>
          <div>
            <h2 className="text-heading-2 text-gray-900">기술 스택</h2>
            <p className="text-body text-gray-600">사용된 기술과 라이브러리</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-heading-4 text-gray-900 mb-4">프론트엔드</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                React 18+ (Hooks, Context)
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                TypeScript (타입 안전성)
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                Motion/React (애니메이션)
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                Lucide React (아이콘)
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-heading-4 text-gray-900 mb-4">스타일링</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                Tailwind CSS v4.0
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                CSS Custom Properties
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                Inter/Pretendard 폰트
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                Shadcn/ui 컴포넌트
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-heading-4 text-gray-900 mb-4">개발 도구</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                모듈식 컴포넌트 구조
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                재사용 가능한 훅
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                에러 바운더리
              </li>
              <li className="flex items-center gap-2 text-body-small text-gray-700">
                <CheckCircle size={16} className="text-success-green" />
                성능 모니터링
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 전체 통계 */}
      <section className="bg-primary-blue-50 rounded-2xl p-8">
        <h2 className="text-heading-2 text-gray-900 mb-8 text-center">📊 전체 시스템 통계</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-heading-1 text-primary-blue mb-2">65+</div>
            <div className="text-body text-gray-700">컴포넌트</div>
          </div>
          <div className="text-center">
            <div className="text-heading-1 text-primary-blue mb-2">20+</div>
            <div className="text-body text-gray-700">페이지</div>
          </div>
          <div className="text-center">
            <div className="text-heading-1 text-primary-blue mb-2">4</div>
            <div className="text-body text-gray-700">레이아웃</div>
          </div>
          <div className="text-center">
            <div className="text-heading-1 text-primary-blue mb-2">100%</div>
            <div className="text-body text-gray-700">완성도</div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface CheckItemProps {
  title: string;
  description: string;
  status: '완료' | '진행중' | '대기중';
  details: string[];
}

function CheckItem({ title, description, status, details }: CheckItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    '완료': { icon: CheckCircle, color: 'text-success-green', bg: 'bg-success-green-50' },
    '진행중': { icon: AlertTriangle, color: 'text-warning-yellow', bg: 'bg-warning-yellow-50' },
    '대기중': { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-50' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center`}>
            <Icon size={16} className={config.color} />
          </div>
          <div className={`px-2 py-1 rounded text-caption ${config.color} ${config.bg}`}>
            {status}
          </div>
        </div>
        
        <h3 className="text-heading-4 text-gray-900 mb-2">{title}</h3>
        <p className="text-body-small text-gray-600">{description}</p>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 pt-4">
              <ul className="space-y-2">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2 text-body-small text-gray-600">
                    <div className="w-1.5 h-1.5 bg-primary-blue rounded-full flex-shrink-0"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}