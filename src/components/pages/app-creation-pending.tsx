import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAppBuilder } from '../system/data-context';
import { useNavigation } from '../system/app-router';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, Home, Mail, Phone } from 'lucide-react';

export function AppCreationPendingPage() {
  const { data } = useAppBuilder();
  const { navigate } = useNavigation();

  const requestData = {
    requestId: data.finalSettings?.appRequestId || 'APP-' + Date.now(),
    requestDate: data.finalSettings?.requestDate || new Date().toISOString(),
    status: data.finalSettings?.status || 'pending',
    storeName: data.storeInfo?.name || '미입력',
    subdomain: data.subdomain || '미입력',
    ownerEmail: data.storeInfo?.ownerInfo?.email || '미입력'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('home')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                홈으로
              </Button>
              <div>
                <h1 className="text-heading-2 text-gray-900">앱 생성 요청 완료</h1>
                <p className="text-body-small text-gray-600">승인 처리 중입니다</p>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock className="w-3 h-3 mr-1" />
              승인 대기중
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 요청 상태 카드 */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-heading-4 text-gray-900 mb-2">앱 생성 요청이 접수되었습니다</h2>
                <p className="text-body text-gray-600 mb-4">
                  통합관리자가 요청을 검토하고 승인 처리할 예정입니다. 
                  승인 완료 시 이메일로 알림을 드립니다.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">요청 번호:</span>
                      <span className="font-medium">{requestData.requestId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">요청 일시:</span>
                      <span className="font-medium">
                        {new Date(requestData.requestDate).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">상점명:</span>
                      <span className="font-medium">{requestData.storeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">도메인:</span>
                      <span className="font-medium">{requestData.subdomain}.mystory.kr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 진행 단계 */}
          <Card className="p-6">
            <h3 className="text-heading-4 text-gray-900 mb-4">처리 단계</h3>
            <div className="space-y-4">
              {/* 1단계 - 완료 */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">앱 생성 요청</span>
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">완료</Badge>
                  </div>
                  <p className="text-sm text-gray-600">앱 정보가 성공적으로 접수되었습니다</p>
                </div>
              </div>

              {/* 2단계 - 진행중 */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">관리자 검토</span>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">진행중</Badge>
                  </div>
                  <p className="text-sm text-gray-600">통합관리자가 앱 설정을 검토하고 있습니다</p>
                </div>
              </div>

              {/* 3단계 - 대기 */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-500">앱 생성</span>
                    <Badge variant="outline" className="text-gray-500">대기</Badge>
                  </div>
                  <p className="text-sm text-gray-500">승인 후 앱이 자동으로 생성됩니다</p>
                </div>
              </div>

              {/* 4단계 - 대기 */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-500">배포 완료</span>
                    <Badge variant="outline" className="text-gray-500">대기</Badge>
                  </div>
                  <p className="text-sm text-gray-500">다운로드 게시판에 앱이 등록됩니다</p>
                </div>
              </div>
            </div>
          </Card>

          {/* 알림 설정 */}
          <Card className="p-6">
            <h3 className="text-heading-4 text-gray-900 mb-4">알림 설정</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Mail className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">이메일 알림</p>
                  <p className="text-xs text-blue-700">
                    {requestData.ownerEmail}로 승인 완료 알림을 발송합니다
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Phone className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">SMS 알림 (선택)</p>
                  <p className="text-xs text-gray-700">
                    전화번호가 등록된 경우 SMS로도 알림을 발송합니다
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* 예상 처리 시간 */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-2">예상 처리 시간</h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 일반적으로 1-2 영업일 내에 검토가 완료됩니다</li>
                  <li>• 추가 정보가 필요한 경우 이메일로 연락드립니다</li>
                  <li>• 승인 완료 시 즉시 알림을 발송합니다</li>
                  <li>• 긴급한 경우 고객지원으로 문의해주세요</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('home')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              홈으로 돌아가기
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('support')}
              className="flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              고객지원 문의
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}