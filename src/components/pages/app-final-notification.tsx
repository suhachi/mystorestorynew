import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigation } from '../system/app-router';
import { Bell, CheckCircle, Download, Settings } from 'lucide-react';

export function AppFinalNotificationPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-heading-1 text-gray-900 mb-2">알림 발송 완료</h1>
          <p className="text-body-large text-gray-600">
            앱 생성 완료 알림이 발송되었습니다
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-heading-4 text-gray-900 mb-4">완료된 작업</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-body text-gray-900">앱 생성 및 배포 완료</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-body text-gray-900">다운로드 게시판 등록 완료</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-body text-gray-900">이메일 알림 발송 완료</span>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('downloads')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              앱 다운로드
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('store-dashboard')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              상점 관리
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={() => navigate('home')}>
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}