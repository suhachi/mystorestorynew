import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigation } from '../system/app-router';
import { CheckCircle, Download, ExternalLink, Settings } from 'lucide-react';

export function AppCreationCompletedPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-heading-1 text-gray-900 mb-2">앱 생성 완료!</h1>
          <p className="text-body-large text-gray-600">
            배달앱이 성공적으로 생성되었습니다
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-heading-4 text-gray-900 mb-4">다음 단계</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">앱 다운로드</p>
                    <p className="text-sm text-blue-700">다운로드 게시판에서 앱을 받아보세요</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => navigate('downloads')}>
                  다운로드
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">상점 관리</p>
                    <p className="text-sm text-green-700">메뉴, 주문 등을 관리해보세요</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate('store-dashboard')}>
                  관리하기
                </Button>
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