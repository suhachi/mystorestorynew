import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigation } from '../system/app-router';
import { Loader2, CheckCircle, Settings, Code, Rocket } from 'lucide-react';

export function AppCreationProcessPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-heading-1 text-gray-900 mb-2">앱 생성 진행 중</h1>
          <p className="text-body-large text-gray-600">
            승인이 완료되어 앱을 생성하고 있습니다
          </p>
        </div>

        <div className="space-y-6">
          {/* 진행 상태 */}
          <Card className="p-6">
            <h2 className="text-heading-4 text-gray-900 mb-4">생성 진행 상황</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-body text-gray-900">설정 검토 완료</span>
              </div>
              <div className="flex items-center gap-4">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-body text-gray-900">앱 구성 요소 생성 중...</span>
              </div>
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-body text-gray-500">데이터베이스 설정 대기</span>
              </div>
              <div className="flex items-center gap-4">
                <Code className="w-5 h-5 text-gray-400" />
                <span className="text-body text-gray-500">앱 빌드 대기</span>
              </div>
              <div className="flex items-center gap-4">
                <Rocket className="w-5 h-5 text-gray-400" />
                <span className="text-body text-gray-500">배포 대기</span>
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