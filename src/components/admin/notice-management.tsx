import React, { useState } from 'react';
import { 
  Bell, Users, Store, User, Send, Eye, Edit, Trash2, Plus, Search,
  Calendar, Clock, Target, Mail, MessageSquare, Smartphone, X, Save,
  CheckCircle, AlertCircle, Filter, MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';

export function NoticeManagement() {
  const [notices, setNotices] = useState([
    {
      id: '1',
      title: '새로운 결제 시스템 도입 안내',
      content: '더욱 안전하고 편리한 결제 서비스를 제공하기 위해...',
      target: '전체',
      type: 'system',
      status: '발송완료',
      createdAt: '2024-01-25',
      sentAt: '2024-01-25 14:30',
      recipients: 13023,
      readCount: 8945,
      channels: ['email', 'push']
    },
    {
      id: '2',
      title: '상점 운영 가이드라인 업데이트',
      content: '상점 운영과 관련된 새로운 가이드라인이 업데이트되었습니다...',
      target: '사장님',
      type: 'policy',
      status: '예약발송',
      createdAt: '2024-01-24',
      sentAt: '2024-01-26 09:00',
      recipients: 567,
      readCount: 0,
      channels: ['email', 'sms']
    }
  ]);
  
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [targetFilter, setTargetFilter] = useState('전체');

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">공지사항 관리</h1>
        <p className="text-gray-600">공지사항을 작성하고 타겟팅하여 발송하세요</p>
      </div>

      {/* 공지사항 현황 대시보드 */}
      <NoticeStatsDashboard notices={notices} />

      {/* 공지사항 목록 */}
      <NoticeListManagement 
        notices={notices}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        targetFilter={targetFilter}
        setTargetFilter={setTargetFilter}
        onNoticeSelect={setSelectedNotice}
        onCreateNew={() => setIsCreateDialogOpen(true)}
      />

      {/* 공지사항 작성/편집 다이얼로그 */}
      <NoticeCreateDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={(notice) => {
          setNotices([...notices, { ...notice, id: Date.now().toString() }]);
          setIsCreateDialogOpen(false);
          toast.success('공지사항이 저장되었습니다.');
        }}
      />

      {/* 공지사항 상세 정보 */}
      {selectedNotice && (
        <NoticeDetailView 
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
          onEdit={() => {
            setSelectedNotice(null);
            setIsCreateDialogOpen(true);
          }}
        />
      )}
    </div>
  );
}

function NoticeStatsDashboard({ notices }: { notices: any[] }) {
  const stats = [
    {
      title: '총 공지사항',
      value: notices.length.toString(),
      icon: <Bell className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '발송 완료',
      value: notices.filter(n => n.status === '발송완료').length.toString(),
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '예약 발송',
      value: notices.filter(n => n.status === '예약발송').length.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: '평균 조회율',
      value: '68.7%',
      icon: <Eye className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function NoticeListManagement({
  notices,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  targetFilter,
  setTargetFilter,
  onNoticeSelect,
  onCreateNew
}: any) {
  const filteredNotices = notices.filter((notice: any) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || notice.status === statusFilter;
    const matchesTarget = targetFilter === '전체' || notice.target === targetFilter;
    
    return matchesSearch && matchesStatus && matchesTarget;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      '발송완료': 'bg-green-100 text-green-800',
      '예약발송': 'bg-orange-100 text-orange-800',
      '임시저장': 'bg-gray-100 text-gray-800',
      '발송실패': 'bg-red-100 text-red-800'
    };
    return config[status as keyof typeof config] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const config = {
      'system': 'bg-blue-100 text-blue-800',
      'policy': 'bg-purple-100 text-purple-800',
      'event': 'bg-green-100 text-green-800',
      'maintenance': 'bg-orange-100 text-orange-800'
    };
    return config[type as keyof typeof config] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">공지사항 목록</h2>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          새 공지사항 작성
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="제목 또는 내용 검색"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">모든 상태</SelectItem>
                <SelectItem value="발송완료">발송완료</SelectItem>
                <SelectItem value="예약발송">예약발송</SelectItem>
                <SelectItem value="임시저장">임시저장</SelectItem>
              </SelectContent>
            </Select>
            <Select value={targetFilter} onValueChange={setTargetFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">모든 대상</SelectItem>
                <SelectItem value="전체">전체 사용자</SelectItem>
                <SelectItem value="사장님">사장님만</SelectItem>
                <SelectItem value="이용자">이용자만</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 공지사항 목록 */}
      <div className="space-y-4">
        {filteredNotices.map((notice: any) => (
          <div key={notice.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => onNoticeSelect(notice)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-900">{notice.title}</h3>
                  <Badge className={getStatusBadge(notice.status)}>
                    {notice.status}
                  </Badge>
                  <Badge className={getTypeBadge(notice.type)}>
                    {notice.type === 'system' ? '시스템' :
                     notice.type === 'policy' ? '정책' :
                     notice.type === 'event' ? '이벤트' : '점검'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notice.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>대상: {notice.target}</span>
                  <span>수신자: {notice.recipients.toLocaleString()}명</span>
                  {notice.status === '발송완료' && (
                    <span>조회: {notice.readCount.toLocaleString()}명 ({((notice.readCount / notice.recipients) * 100).toFixed(1)}%)</span>
                  )}
                  <span>생성일: {notice.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="flex gap-1">
                  {notice.channels.includes('email') && <Mail className="w-4 h-4 text-blue-600" />}
                  {notice.channels.includes('sms') && <MessageSquare className="w-4 h-4 text-green-600" />}
                  {notice.channels.includes('push') && <Smartphone className="w-4 h-4 text-purple-600" />}
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function NoticeCreateDialog({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notice: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: '전체',
    type: 'system',
    channels: {
      email: true,
      sms: false,
      push: true
    },
    scheduledSend: false,
    scheduledAt: '',
    specificStores: []
  });

  const handleSave = () => {
    const notice = {
      ...formData,
      status: formData.scheduledSend ? '예약발송' : '임시저장',
      createdAt: new Date().toISOString().split('T')[0],
      sentAt: formData.scheduledSend ? formData.scheduledAt : null,
      recipients: formData.target === '전체' ? 13023 : formData.target === '사장님' ? 567 : 12234,
      readCount: 0,
      channels: Object.keys(formData.channels).filter(key => formData.channels[key as keyof typeof formData.channels])
    };
    onSave(notice);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 공지사항 작성</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 입력 영역 */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="공지사항 내용을 입력하세요"
                rows={10}
              />
            </div>
          </div>

          {/* 설정 영역 */}
          <div className="space-y-6">
            <div>
              <Label>공지 유형</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">시스템</SelectItem>
                  <SelectItem value="policy">정책</SelectItem>
                  <SelectItem value="event">이벤트</SelectItem>
                  <SelectItem value="maintenance">점검</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>발송 대상</Label>
              <Select value={formData.target} onValueChange={(value) => setFormData({ ...formData, target: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 사용자</SelectItem>
                  <SelectItem value="사장님">사장님만</SelectItem>
                  <SelectItem value="이용자">이용자만</SelectItem>
                  <SelectItem value="특정상점">특정 상점</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>발송 채널</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={formData.channels.email}
                    onCheckedChange={(checked) => 
                      setFormData({ 
                        ...formData, 
                        channels: { ...formData.channels, email: checked as boolean }
                      })
                    }
                  />
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    이메일
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={formData.channels.sms}
                    onCheckedChange={(checked) => 
                      setFormData({ 
                        ...formData, 
                        channels: { ...formData.channels, sms: checked as boolean }
                      })
                    }
                  />
                  <Label htmlFor="sms" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="push"
                    checked={formData.channels.push}
                    onCheckedChange={(checked) => 
                      setFormData({ 
                        ...formData, 
                        channels: { ...formData.channels, push: checked as boolean }
                      })
                    }
                  />
                  <Label htmlFor="push" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    푸시 알림
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Switch
                  checked={formData.scheduledSend}
                  onCheckedChange={(checked) => setFormData({ ...formData, scheduledSend: checked })}
                />
                <Label>예약 발송</Label>
              </div>
              {formData.scheduledSend && (
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {formData.scheduledSend ? '예약 발송' : '임시 저장'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NoticeDetailView({ notice, onClose, onEdit }: {
  notice: any;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">공지사항 상세</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            편집
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
            닫기
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{notice.title}</h3>
          <div className="flex items-center gap-2 mb-4">
            <Badge className={
              notice.status === '발송완료' ? 'bg-green-100 text-green-800' :
              notice.status === '예약발송' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }>
              {notice.status}
            </Badge>
            <span className="text-sm text-gray-500">
              대상: {notice.target} | 생성일: {notice.createdAt}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">내용</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
          </div>
        </div>

        {notice.status === '발송완료' && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">발송 결과</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">총 발송</p>
                <p className="text-2xl font-bold text-blue-900">{notice.recipients.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">조회 완료</p>
                <p className="text-2xl font-bold text-green-900">{notice.readCount.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">조회율</p>
                <p className="text-2xl font-bold text-purple-900">
                  {((notice.readCount / notice.recipients) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}