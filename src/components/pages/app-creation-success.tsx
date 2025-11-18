import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigation } from '../system/app-router';
import { CheckCircle, Download, Settings, Star } from 'lucide-react';

export function AppCreationSuccessPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-heading-1 text-gray-900 mb-2">🎉 축하합니다!</h1>
          <p className="text-body-large text-gray-600">
            배달앱이 성공적으로 생성되어 사용할 준비가 완료되었습니다
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-8 text-center">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-heading-3 text-gray-900 mb-2">MyStoreStory 여정을 시작하세요</h2>
            <p className="text-body text-gray-600 mb-6">
              이제 고객들이 앱을 통해 주문하고, 매출을 늘려보세요!
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                size="lg"
                onClick={() => navigate('downloads')}
                className="flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                앱 다운로드 받기
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('store-dashboard')}
                className="flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                상점 관리 시작하기
              </Button>
            </div>
          </Card>

          <div className="text-center">
            <Button 
              variant="ghost"
              onClick={() => navigate('home')}
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}