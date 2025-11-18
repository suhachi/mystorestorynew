import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigation } from '../system/app-router';
import { Rocket, CheckCircle, Clock } from 'lucide-react';

export function AppDeploymentPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-heading-1 text-gray-900 mb-2">앱 배포 중</h1>
          <p className="text-body-large text-gray-600">
            생성된 앱을 배포하고 있습니다
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-heading-4 text-gray-900 mb-4">배포 진행 상황</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-body text-gray-900">앱 빌드 완료</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-body text-gray-900">서버 배포 진행 중...</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-body text-gray-500">다운로드 게시판 등록 대기</span>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button onClick={() => navigate('home')}>
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}