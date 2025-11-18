import { 
  Check, ChevronLeft, ChevronRight, RefreshCw, Smartphone,
  Circle, CheckCircle, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { useAppBuilder } from '../system/data-context';
import { useNavigation } from '../system/app-router';

interface AppBuilderLayoutProps {
  children?: React.ReactNode;
  mode?: 'legacy' | 'feature-cards';
}

const steps = [
  { id: 1, title: '기본 정보 설정', description: '서브도메인, 상점정보, 업종 선택' },
  { id: 2, title: '플랜 & 기능', description: '플랜 선택, 핵심 기능 설정' },
  { id: 3, title: '주문 & 결제', description: '주문 방식, 결제 설정' },
  { id: 4, title: '고객 & 마케팅', description: '고객 관리, 마케팅 도구' },
  { id: 5, title: '브랜딩', description: '로고, 색상, 폰트 설정' },
  { id: 6, title: '최종 확인', description: '미리보기, 승인 요청' }
];

export function AppBuilderLayout({ children, mode = 'legacy' }: AppBuilderLayoutProps) {
  const { data, updateStep, prevStep, nextStep, isFormValid } = useAppBuilder();
  const { navigate } = useNavigation();
  const currentStep = data.step;

  // 항상 레거시 모드로 동작 (기능카드 모드 제거)

  // 현재 단계에 따른 제목과 설명 가져오기
  const getCurrentStepInfo = (stepId: number) => {
    return steps[stepId - 1] || steps[0];
  };

  const currentStepInfo = getCurrentStepInfo(currentStep);

  // 동적으로 단계 상태 계산
  const getStepStatus = (stepId: number) => {
    if (stepId === currentStep) {
      return { completed: false, active: true };
    } else if (stepId < currentStep) {
      return { completed: true, active: false };
    } else {
      return { completed: false, active: false };
    }
  };

  // 단계 클릭 핸들러 수정
  const handleStepClick = (stepId: number) => {
    // 현재 단계 이하로만 이동 허용
    if (stepId <= currentStep) {
      updateStep(stepId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress Bar */}
      <div className="h-10 bg-gray-100 border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="text-body-small text-gray-600">
              {currentStep}/6 단계 완료
            </div>
            <div className="flex-1 mx-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-body-small text-gray-600">
              {Math.round((currentStep / 6) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 왼쪽: 단계별 네비게이션 */}
        <div className="hidden lg:block w-280 bg-white border-r border-gray-200" style={{ width: '280px' }}>
          <div className="p-6">
            <h2 className="text-heading-4 text-gray-900 mb-6">앱 만들기</h2>
            <nav className="space-y-3">
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      status.active 
                        ? 'bg-primary-blue text-white' 
                        : status.completed 
                          ? 'bg-success-green text-white' 
                          : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        status.active 
                          ? 'bg-white text-primary-blue' 
                          : status.completed 
                            ? 'bg-white text-success-green' 
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {status.completed ? <Check size={14} /> : step.id}
                      </div>
                      <div>
                        <div className="text-body-small font-medium">{step.title}</div>
                        <div className="text-caption text-gray-500">{step.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 중앙: 폼 콘텐츠 영역 */}
        <div className="flex-1 p-6">
          {children || (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-body text-gray-500 text-center">폼 콘텐츠 영역</div>
            </div>
          )}
        </div>

        {/* 오른쪽: 실시간 미리보기 */}
        <div className="hidden xl:block w-320 bg-gray-100 border-l border-gray-200 p-6" style={{ width: '320px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-4 text-gray-900">실시간 미리보기</h3>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <RefreshCw size={16} />
            </button>
          </div>
          
          {/* 모바일 프레임 */}
          <div className="bg-gray-900 rounded-3xl p-2" style={{ width: '190px', height: '380px' }}>
            <div className="bg-white rounded-2xl h-full flex flex-col">
              {/* 모바일 헤더 */}
              <div className="h-12 flex flex-col items-center justify-center border-b border-gray-100">
                <div className="text-body-small text-gray-900">
                  {data.storeInfo.name || '상점명'}
                </div>
                {data.subdomain && !data.subdomainError && (
                  <div className="text-xs text-gray-500">
                    {data.subdomain}.mystory.kr
                  </div>
                )}
              </div>
              
              {/* 모바일 콘텐츠 - 단계별로 다른 내용 표시 */}
              <div className="flex-1 p-4 overflow-y-auto">
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">상점 정보</span>
                    </div>
                    <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">업종: {data.storeInfo?.category || '미선택'}</span>
                    </div>
                    <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">주소: {data.storeInfo?.address || '미입력'}</span>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs text-blue-600">플랜: {data.planSelection?.selectedPlan || '미선택'}</span>
                    </div>
                    <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">대시보드: {data.planSelection?.selectedFeatures?.dashboard || 'basic'}</span>
                    </div>
                    <div className="h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">메뉴: {data.planSelection?.selectedFeatures?.menu || 'basic'}</span>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-3">
                    <div className="h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-xs text-green-600">주문 방식</span>
                    </div>
                    {data.orderPayment?.orderModes?.pickup && (
                      <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">✓ 포장</span>
                      </div>
                    )}
                    {data.orderPayment?.orderModes?.delivery && (
                      <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">✓ 배달</span>
                      </div>
                    )}
                    {data.orderPayment?.orderModes?.reservation && (
                      <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">✓ 예약</span>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-3">
                    <div className="h-8 bg-purple-100 rounded flex items-center justify-center">
                      <span className="text-xs text-purple-600">고객 관리</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">쿠폰: {data.customerMarketing?.marketingTools?.coupons ? '사용' : '미사용'}</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">포인트: {data.customerMarketing?.marketingTools?.points ? '사용' : '미사용'}</span>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-3">
                    <div className="h-8 bg-pink-100 rounded flex items-center justify-center">
                      <span className="text-xs text-pink-600">브랜딩</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded border"
                          style={{ backgroundColor: data.branding?.primaryColor || '#2563eb' }}
                        ></div>
                        <span className="text-xs text-gray-500">메인 컬러</span>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">폰트: {data.branding?.fontFamily || 'Inter'}</span>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-3">
                    <div className="h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-xs text-green-600">최종 확인</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">앱 준비 완료</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">승인 대기</span>
                    </div>
                  </div>
                )}

                {/* 기본 콘텐츠 (다른 단계) */}
                {currentStep > 6 && (
                  <div className="space-y-3">
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-12 bg-gray-100 rounded"></div>
                    <div className="h-12 bg-gray-100 rounded"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                  </div>
                )}
              </div>
              
              {/* 모바일 하단 네비게이션 */}
              <div className="h-12 border-t border-gray-100 flex items-center justify-around">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="text-caption text-gray-500 text-center mt-4">
            변경사항이 실시간으로 반영됩니다
          </div>
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="h-20 bg-white border-t border-gray-200 flex items-center justify-between px-6">
        <button 
          className={`flex items-center gap-2 px-6 py-3 text-body-small border border-gray-200 rounded-lg ${
            currentStep === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          disabled={currentStep === 1}
          onClick={() => currentStep > 1 && prevStep()}
        >
          <ChevronLeft size={16} />
          이전
        </button>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 text-body-small text-gray-600 hover:text-gray-900">
            임시저장
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-3 text-body-small rounded-lg transition-colors ${
              (currentStep === 1 && !isFormValid()) 
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed' 
                : 'text-white bg-primary-blue hover:bg-primary-blue-dark'
            }`}
            disabled={currentStep === 1 && !isFormValid()}
            onClick={() => {
              if (currentStep === 1 && !isFormValid()) return;
              
              if (currentStep < 6) nextStep();
            }}
          >
            {currentStep === 6 ? '완료' : '다음'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 모바일 단계 표시기 */}
      <div className="lg:hidden fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-4 py-2 border border-gray-200">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`w-2 h-2 rounded-full ${
                getStepStatus(step.id).completed ? 'bg-success-green' : 
                getStepStatus(step.id).active ? 'bg-primary-blue' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}