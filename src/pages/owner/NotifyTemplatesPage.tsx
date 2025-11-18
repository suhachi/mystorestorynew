/**
 * Notification Templates Management Page
 * T14-11: Template CRUD + Preview + Draft/Publish workflow
 * 
 * Features:
 * - Template listing with search/filter (channel, locale, status)
 * - Editor: name, channel (slack|fcm), locale, subject/title, body (mustache)
 * - Preview modal with sample data rendering
 * - Draft/Publish toggle
 * - Change history display
 */

import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Save, 
  Send, 
  AlertCircle, 
  Check,
  Edit,
  Trash2
} from 'lucide-react';
import { renderPreviewLocally } from '../../services/templates';

interface NotificationTemplate {
  id?: string;
  name: string;
  channel: 'slack' | 'fcm';
  locale: string;
  subject?: string; // For FCM title
  body: string; // Mustache template
  status: 'draft' | 'published';
  createdAt?: number;
  updatedAt?: number;
  publishedAt?: number;
}

export default function NotifyTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'tpl_001',
      name: 'order_confirmed',
      channel: 'fcm',
      locale: 'ko-KR',
      subject: '주문이 접수되었습니다',
      body: '{{storeName}}에서 주문 {{orderNumber}}을(를) 확인했습니다. 고객님의 주문을 신속하게 준비하겠습니다.',
      status: 'published',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      publishedAt: Date.now() - 86400000
    },
    {
      id: 'tpl_002',
      name: 'order_ready',
      channel: 'fcm',
      locale: 'ko-KR',
      subject: '주문이 준비되었습니다',
      body: '주문 {{orderNumber}}이(가) 준비 완료되었습니다. 픽업해 가시거나 배달을 기다려주세요!',
      status: 'published',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000
    },
    {
      id: 'tpl_003',
      name: 'new_order_slack',
      channel: 'slack',
      locale: 'ko-KR',
      body: '🔔 새 주문 {{orderNumber}}\n고객: {{customerName}}\n총액: ₩{{total}}\n주문 시각: {{createdAt}}',
      status: 'draft',
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now() - 3600000
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  // Sample data for preview
  const sampleData = {
    storeName: '맛있는 식당',
    orderNumber: '#20241210001',
    customerName: '홍길동',
    total: '27,000',
    createdAt: new Date().toLocaleString('ko-KR')
  };

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = filterChannel === 'all' || t.channel === filterChannel;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  const handleSaveDraft = (template: NotificationTemplate) => {
    const now = Date.now();
    const updated: NotificationTemplate = {
      ...template,
      status: 'draft',
      updatedAt: now,
      createdAt: template.createdAt || now
    };

    if (template.id) {
      setTemplates(prev => prev.map(t => t.id === template.id ? updated : t));
    } else {
      updated.id = `tpl_${Date.now()}`;
      setTemplates(prev => [...prev, updated]);
    }

    setEditingTemplate(null);
  };

  const handlePublish = (template: NotificationTemplate) => {
    const now = Date.now();
    const published: NotificationTemplate = {
      ...template,
      status: 'published',
      updatedAt: now,
      publishedAt: now
    };

    setTemplates(prev => prev.map(t => t.id === template.id ? published : t));
  };

  const handlePreview = (template: NotificationTemplate) => {
    const rendered = renderPreviewLocally(template, sampleData);
    setPreviewData({ template, rendered });
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 이 템플릿을 삭제하시겠습니까?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="mb-2 flex items-center gap-2">
              <FileText className="h-8 w-8" />
              알림 템플릿 관리
            </h1>
            <p className="text-secondary-gray">
              주문 상태 변경 시 전송되는 알림 메시지 템플릿을 관리합니다.
            </p>
          </div>
          <Button onClick={() => setEditingTemplate({
            name: '',
            channel: 'fcm',
            locale: 'ko-KR',
            body: '',
            status: 'draft'
          })}>
            <Plus className="h-4 w-4 mr-2" />
            새 템플릿
          </Button>
        </div>
      </div>

      {/* Billing OFF Notice */}
      <Alert className="mb-6 bg-warning-yellow-50 border-warning-yellow">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          현재 결제 기능은 비활성화되어 있습니다 (Billing OFF). 
          알림 메시지에 결제 관련 내용을 포함하지 마세요.
        </AlertDescription>
      </Alert>

      {/* Search & Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="템플릿 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger>
              <SelectValue placeholder="채널 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 채널</SelectItem>
              <SelectItem value="fcm">FCM (Push)</SelectItem>
              <SelectItem value="slack">Slack</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="draft">초안</SelectItem>
              <SelectItem value="published">발행됨</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-1">{template.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant={template.channel === 'fcm' ? 'default' : 'secondary'}>
                      {template.channel.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{template.locale}</Badge>
                    <Badge 
                      variant={template.status === 'published' ? 'default' : 'secondary'}
                      className={template.status === 'published' ? 'bg-success-green' : ''}
                    >
                      {template.status === 'published' ? '발행됨' : '초안'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Subject (FCM only) */}
              {template.subject && (
                <div>
                  <div className="text-caption text-secondary-gray mb-1">제목</div>
                  <div className="text-body-small text-gray-700">{template.subject}</div>
                </div>
              )}

              {/* Body Preview */}
              <div>
                <div className="text-caption text-secondary-gray mb-1">내용</div>
                <div className="text-body-small text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 font-mono line-clamp-3">
                  {template.body}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePreview(template)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  미리보기
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setEditingTemplate(template)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                {template.status === 'draft' && (
                  <Button 
                    size="sm" 
                    onClick={() => handlePublish(template)}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(template.id!)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Timestamps */}
              <div className="text-caption text-secondary-gray pt-2 border-t">
                {template.publishedAt ? (
                  <div>발행: {new Date(template.publishedAt).toLocaleDateString('ko-KR')}</div>
                ) : (
                  <div>수정: {new Date(template.updatedAt || Date.now()).toLocaleDateString('ko-KR')}</div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-secondary-gray">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* Editor Dialog */}
      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate.id ? '템플릿 편집' : '새 템플릿 만들기'}
              </DialogTitle>
              <DialogDescription>
                Mustache 변수를 사용할 수 있습니다: {'{'}{'{'} storeName {'}'}{'}'},  {'{'}{'{'} orderNumber {'}'}{'}'}, {'{'}{'{'} customerName {'}'}{'}'}, {'{'}{'{'} total {'}'}{'}'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">템플릿 이름 (식별자)</Label>
                <Input
                  id="name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  placeholder="예: order_confirmed"
                />
              </div>

              {/* Channel & Locale */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="channel">채널</Label>
                  <Select 
                    value={editingTemplate.channel} 
                    onValueChange={(v: 'fcm' | 'slack') => setEditingTemplate({ ...editingTemplate, channel: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fcm">FCM (Push)</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="locale">언어</Label>
                  <Select 
                    value={editingTemplate.locale} 
                    onValueChange={(v) => setEditingTemplate({ ...editingTemplate, locale: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko-KR">한국어</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject (FCM only) */}
              {editingTemplate.channel === 'fcm' && (
                <div>
                  <Label htmlFor="subject">제목 (선택사항)</Label>
                  <Input
                    id="subject"
                    value={editingTemplate.subject || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                    placeholder="알림 제목"
                  />
                </div>
              )}

              {/* Body */}
              <div>
                <Label htmlFor="body">메시지 본문</Label>
                <Textarea
                  id="body"
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  placeholder="메시지 내용... Mustache 변수 사용 가능"
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-caption text-secondary-gray mt-1">
                  {editingTemplate.body.length} / 500 자
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingTemplate(null)} className="flex-1">
                  취소
                </Button>
                <Button 
                  onClick={() => handlePreview(editingTemplate)} 
                  variant="secondary"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  미리보기
                </Button>
                <Button 
                  onClick={() => handleSaveDraft(editingTemplate)}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  초안 저장
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Dialog */}
      {previewData && (
        <Dialog open={!!previewData} onOpenChange={() => setPreviewData(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>템플릿 미리보기</DialogTitle>
              <DialogDescription>
                샘플 데이터로 렌더링한 결과입니다.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Preview Card */}
              <Card className="p-4 bg-gray-50">
                {previewData.template.subject && (
                  <div className="mb-2">
                    <div className="text-caption text-secondary-gray">제목</div>
                    <div className="font-semibold">{previewData.rendered.subject}</div>
                  </div>
                )}
                <div>
                  <div className="text-caption text-secondary-gray mb-1">본문</div>
                  <div className="whitespace-pre-wrap text-body-small">
                    {previewData.rendered.body}
                  </div>
                </div>
              </Card>

              {/* Metadata */}
              <div className="space-y-2 text-caption text-secondary-gray">
                <div>채널: <span className="text-gray-900">{previewData.template.channel.toUpperCase()}</span></div>
                <div>언어: <span className="text-gray-900">{previewData.template.locale}</span></div>
                <div>길이: <span className="text-gray-900">{previewData.rendered.body.length} 자</span></div>
                {previewData.rendered.body.length > 500 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      메시지가 500자를 초과합니다. 일부 채널에서 잘릴 수 있습니다.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Sample Data Used */}
              <details className="text-caption">
                <summary className="cursor-pointer text-secondary-gray mb-2">
                  사용된 샘플 데이터 보기
                </summary>
                <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(sampleData, null, 2)}
                </pre>
              </details>

              <Button onClick={() => setPreviewData(null)} className="w-full">
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
