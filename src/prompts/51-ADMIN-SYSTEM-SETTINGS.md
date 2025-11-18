# 51 - Admin System Settings

## 📌 목표
관리자용 시스템 설정 페이지를 구축합니다. (이미 system-settings.tsx 존재)

**결과물**:
- system-settings.tsx (이미 존재) - 시스템 설정

**총 1개 파일 (확인 및 문서화)**

---

## 🔄 STEP 1: System Settings 확인

### 프롬프트 템플릿

```
관리자용 시스템 설정 페이지를 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/admin/system-settings.tsx

주요 기능:
- 플랫폼 설정
- 보안 설정
- 알림 설정
- API 설정
- 플랜 관리
- 시스템 상태

## 간단 구조

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Key, 
  Globe,
  Cpu,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    platformName: 'MyStoreStory',
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    smsNotifications: false,
    autoApproval: false,
    maxStoresPerUser: 5,
    sessionTimeout: 30
  });

  const handleSave = () => {
    toast.success('설정이 저장되었습니다');
  };

  return (
    <div className="p-6 space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">시스템 설정</h1>
        <p className="text-gray-600">플랫폼 전체 설정을 관리합니다</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            일반
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            보안
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            알림
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="w-4 h-4 mr-2" />
            API
          </TabsTrigger>
          <TabsTrigger value="plans">
            <Database className="w-4 h-4 mr-2" />
            플랜
          </TabsTrigger>
          <TabsTrigger value="system">
            <Cpu className="w-4 h-4 mr-2" />
            시스템
          </TabsTrigger>
        </TabsList>

        {/* 일반 설정 */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>일반 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>플랫폼 이름</Label>
                <Input
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>점검 모드</Label>
                  <p className="text-sm text-gray-600">서비스 점검 시 활성화</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>신규 가입 허용</Label>
                  <p className="text-sm text-gray-600">새로운 사용자 가입 허용 여부</p>
                </div>
                <Switch
                  checked={settings.newRegistrations}
                  onCheckedChange={(checked) => setSettings({ ...settings, newRegistrations: checked })}
                />
              </div>

              <div>
                <Label>사용자당 최대 상점 수</Label>
                <Input
                  type="number"
                  value={settings.maxStoresPerUser}
                  onChange={(e) => setSettings({ ...settings, maxStoresPerUser: parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>세션 타임아웃 (분)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>2단계 인증 필수</Label>
                  <p className="text-sm text-gray-600">관리자 계정 2FA 필수화</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>IP 화이트리스트</Label>
                  <p className="text-sm text-gray-600">특정 IP만 관리자 접근 허용</p>
                </div>
                <Switch />
              </div>

              <div>
                <Label>허용 IP 목록</Label>
                <Input placeholder="192.168.1.1, 10.0.0.1" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>이메일 알림</Label>
                  <p className="text-sm text-gray-600">중요 이벤트 이메일 알림</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS 알림</Label>
                  <p className="text-sm text-gray-600">긴급 알림 SMS 전송</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Slack 알림</Label>
                  <p className="text-sm text-gray-600">Slack 채널로 알림 전송</p>
                </div>
                <Switch />
              </div>

              <div>
                <Label>Slack Webhook URL</Label>
                <Input placeholder="https://hooks.slack.com/..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API 설정 */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API 키</Label>
                <div className="flex gap-2">
                  <Input value="sk_live_*********************" readOnly />
                  <Button variant="outline">재생성</Button>
                </div>
              </div>

              <div>
                <Label>Rate Limiting</Label>
                <Input placeholder="1000 요청 / 시간" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>API 액세스 로그</Label>
                  <p className="text-sm text-gray-600">모든 API 요청 로깅</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <Label>허용 도메인</Label>
                <Input placeholder="example.com, *.mystore.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 플랜 설정 */}
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>플랜 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Basic', 'Pro', 'Enterprise'].map((plan) => (
                <Card key={plan}>
                  <CardHeader>
                    <CardTitle className="text-lg">{plan} 플랜</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>월 가격</Label>
                        <Input placeholder="₩29,000" />
                      </div>
                      <div>
                        <Label>최대 메뉴 수</Label>
                        <Input placeholder="50" />
                      </div>
                      <div>
                        <Label>최대 주문 수 (월)</Label>
                        <Input placeholder="1000" />
                      </div>
                      <div>
                        <Label>수수료율</Label>
                        <Input placeholder="5%" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>플랜 활성화</Label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 시스템 상태 */}
        <TabsContent value="system">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>시스템 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    <Label>서버 상태</Label>
                  </div>
                  <Badge className="bg-green-100 text-green-700">정상</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-500" />
                    <Label>데이터베이스</Label>
                  </div>
                  <Badge className="bg-green-100 text-green-700">연결됨</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    <Label>CDN</Label>
                  </div>
                  <Badge className="bg-green-100 text-green-700">활성</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <Label>디스크 사용량</Label>
                  <span>23.5 GB / 100 GB</span>
                </div>

                <div className="flex items-center justify-between">
                  <Label>메모리 사용량</Label>
                  <span>4.2 GB / 16 GB</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>캐시 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  전체 캐시 삭제
                </Button>
                <Button variant="outline" className="w-full">
                  CDN 캐시 삭제
                </Button>
                <Button variant="outline" className="w-full">
                  데이터베이스 최적화
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          설정 저장
        </Button>
      </div>
    </div>
  );
}
```

IMPORTANT:
- 6개 탭 (일반, 보안, 알림, API, 플랜, 시스템)
- 플랫폼 전체 설정
- 보안 설정 (세션, 2FA, IP)
- 알림 설정 (이메일, SMS, Slack)
- API 키 관리
- 플랜 가격 관리
- 시스템 상태 모니터링
```

---

## 📝 핵심 포인트

### 시스템 설정 구조
1. **일반**: 플랫폼명, 점검모드, 가입허용
2. **보안**: 세션, 2FA, IP 화이트리스트
3. **알림**: 이메일, SMS, Slack
4. **API**: API 키, Rate Limiting
5. **플랜**: 가격, 제한, 수수료
6. **시스템**: 상태, 캐시, 최적화

---

## ✅ 완료 체크리스트

- [ ] system-settings.tsx 확인
- [ ] 문서화 완료

---

## 📝 다음 단계

**52-HOOKS-PLAN-LIMITS.md**로 이동합니다.
