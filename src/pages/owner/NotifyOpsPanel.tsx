/**
 * Notification Operations Panel (Owner)
 * T14-09, T14-10: Monitor and manage notification failures with operational controls
 * 
 * Features:
 * - Global status banner (normal/paused/partial-failure)
 * - Pause/resume toggle
 * - DLQ table with multi-select, sort, pagination
 * - Bulk retry with confirmation modal
 * - CSV export (UX only)
 * - Channel/period/error filters
 * - Accessibility: live announcements, focus management
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { 
  Bell, 
  AlertCircle, 
  RefreshCw, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Clock,
  Pause,
  Play,
  Download,
  Filter,
  Info,
  AlertTriangle
} from 'lucide-react';
import { NotificationLog } from '../../types/notification';

interface NotificationStats {
  total: number;
  sent: number;
  failed: number;
  delayed: number;
  successRate: number;
}

type SystemStatus = 'normal' | 'paused' | 'partial-failure';

export default function NotifyOpsPanel() {
  // State
  const [failedNotifications, setFailedNotifications] = useState<NotificationLog[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    sent: 0,
    failed: 0,
    delayed: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('normal');
  const [isPaused, setIsPaused] = useState(false);
  
  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filters
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [errorFilter, setErrorFilter] = useState<string>('all');
  
  // Modals
  const [showBulkRetryConfirm, setShowBulkRetryConfirm] = useState(false);
  const [showStatusDetail, setShowStatusDetail] = useState(false);
  
  // Live announcement (a11y)
  const [liveMessage, setLiveMessage] = useState('');

  // Mock data
  const mockFailedNotifications: NotificationLog[] = [
    {
      id: 'notif1',
      userId: 'user1',
      event: 'order.created',
      channel: 'fcm',
      status: 'failed',
      message: '새로운 주문이 접수되었습니다',
      metadata: { orderId: 'ord1', token: 'dGVzdF90b2tlbl8xMjM***' },
      failedAt: Date.now() - 300000,
      error: 'FCM_TOKEN_EXPIRED',
      retryCount: 2,
      createdAt: Date.now() - 600000
    },
    {
      id: 'notif2',
      userId: 'user2',
      event: 'order.confirmed',
      channel: 'slack',
      status: 'failed',
      message: '주문이 확인되었습니다',
      metadata: { orderId: 'ord2', webhookUrl: 'https://hooks.slack.com/***' },
      failedAt: Date.now() - 120000,
      error: 'TIMEOUT_5S',
      retryCount: 1,
      createdAt: Date.now() - 180000
    },
    {
      id: 'notif3',
      userId: 'user3',
      event: 'order.fulfilled',
      channel: 'fcm',
      status: 'failed',
      message: '주문이 완료되었습니다',
      metadata: { orderId: 'ord3', token: 'dGVzdF90b2tlbl80NTY***' },
      failedAt: Date.now() - 60000,
      error: 'INVALID_REGISTRATION',
      retryCount: 0,
      createdAt: Date.now() - 90000
    }
  ];

  const mockStats: NotificationStats = {
    total: 156,
    sent: 145,
    failed: 3,
    delayed: 8,
    successRate: 93.0
  };

  useEffect(() => {
    // Load failed notifications and stats from Firestore
    setLoading(true);
    
    setTimeout(() => {
      setFailedNotifications(mockFailedNotifications);
      setStats(mockStats);
      
      // Determine system status
      const failureRate = (mockStats.failed / mockStats.total) * 100;
      if (failureRate > 10) {
        setSystemStatus('partial-failure');
      } else {
        setSystemStatus('normal');
      }
      
      setLoading(false);
    }, 800);
  }, []);

  // Filter notifications
  const filteredNotifications = failedNotifications.filter(n => {
    const matchesChannel = channelFilter === 'all' || n.channel === channelFilter;
    const matchesError = errorFilter === 'all' || n.error === errorFilter;
    return matchesChannel && matchesError;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique error codes for filter
  const uniqueErrors = Array.from(new Set(failedNotifications.map(n => n.error || 'UNKNOWN')));

  // Selection handlers
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedNotifications.map(n => n.id)));
    }
  };

  // Pause/Resume handler
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    setSystemStatus(isPaused ? 'normal' : 'paused');
    
    // Live announcement
    setLiveMessage(isPaused ? '알림 전송이 재개되었습니다' : '알림 전송이 일시중지되었습니다');
    setTimeout(() => setLiveMessage(''), 3000);
  };

  // Bulk retry handler
  const handleBulkRetry = async () => {
    if (selectedIds.size === 0) return;
    
    setShowBulkRetryConfirm(false);
    setRetrying(true);

    try {
      console.log('[NotifyOps] Bulk retry:', Array.from(selectedIds));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Remove retried from failed list
      setFailedNotifications(prev => 
        prev.filter(n => !selectedIds.has(n.id))
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        failed: Math.max(0, prev.failed - selectedIds.size),
        sent: prev.sent + selectedIds.size,
        successRate: ((prev.sent + selectedIds.size) / prev.total) * 100
      }));

      // Live announcement
      setLiveMessage(`재전송 완료 (${selectedIds.size}건)`);
      setTimeout(() => setLiveMessage(''), 3000);

      setSelectedIds(new Set());
    } catch (error) {
      console.error('[NotifyOps] Bulk retry failed:', error);
      setLiveMessage('재전송 실패');
    } finally {
      setRetrying(false);
    }
  };

  // Export CSV (UX only)
  const handleExportCSV = () => {
    console.log('[NotifyOps] Export CSV (UX only)');
    setLiveMessage('CSV 내보내기 준비 중 (개발 예정)');
    setTimeout(() => setLiveMessage(''), 3000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
            <p className="text-secondary-gray">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Live announcement for screen readers */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {liveMessage}
      </div>

      {/* Global Status Banner */}
      {systemStatus === 'paused' && (
        <Alert className="mb-6 bg-warning-yellow-50 border-warning-yellow">
          <Pause className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong>알림 전송이 일시중지되었습니다.</strong> 
              새로운 알림이 큐에 저장되며 재개 시 전송됩니다.
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowStatusDetail(true)}
            >
              <Info className="h-3 w-3 mr-1" />
              자세히 보기
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {systemStatus === 'partial-failure' && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong>부분 장애 감지:</strong> FCM 전송 실패율이 높습니다. 
              토큰 갱신 또는 서버 상태를 확인하세요.
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowStatusDetail(true)}
            >
              <Info className="h-3 w-3 mr-1" />
              자세히 보기
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="mb-2 flex items-center gap-2">
              <Bell className="h-8 w-8" />
              알림 운영 패널
            </h1>
            <p className="text-secondary-gray">
              알림 전송 상태를 모니터링하고 관리합니다
            </p>
          </div>
          <Button
            onClick={handleTogglePause}
            variant={isPaused ? 'default' : 'outline'}
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                재개
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                일시정지
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="failed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="failed">
            <AlertCircle className="h-4 w-4 mr-2" />
            실패 목록 (DLQ)
            {failedNotifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {failedNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            통계
          </TabsTrigger>
        </TabsList>

        {/* DLQ Tab */}
        <TabsContent value="failed" className="space-y-6">
          {/* Action Bar */}
          <Card className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Filters */}
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="채널" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 채널</SelectItem>
                    <SelectItem value="fcm">FCM</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={errorFilter} onValueChange={setErrorFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="에러 코드" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 에러</SelectItem>
                    {uniqueErrors.map(err => (
                      <SelectItem key={err} value={err}>{err}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={filteredNotifications.length === 0}
                >
                  <Download className="h-3 w-3 mr-1" />
                  CSV 내보내기
                </Button>
                <Button
                  onClick={() => setShowBulkRetryConfirm(true)}
                  disabled={selectedIds.size === 0 || retrying}
                  size="sm"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${retrying ? 'animate-spin' : ''}`} />
                  선택 재전송 ({selectedIds.size})
                </Button>
              </div>
            </div>
          </Card>

          {/* DLQ Table */}
          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success-green mx-auto mb-3" />
              <h3 className="mb-2">실패한 알림이 없습니다</h3>
              <p className="text-secondary-gray">
                모든 알림이 정상적으로 전송되었습니다.
              </p>
            </Card>
          ) : (
            <>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-4 text-left">
                          <Checkbox
                            checked={selectedIds.size === paginatedNotifications.length && paginatedNotifications.length > 0}
                            onCheckedChange={toggleSelectAll}
                            aria-label="전체 선택"
                          />
                        </th>
                        <th className="p-4 text-left">시간</th>
                        <th className="p-4 text-left">채널</th>
                        <th className="p-4 text-left">수신자/토큰</th>
                        <th className="p-4 text-left">에러 코드</th>
                        <th className="p-4 text-left">재시도</th>
                        <th className="p-4 text-left">메시지</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedNotifications.map((notification, idx) => (
                        <tr 
                          key={notification.id}
                          className={`border-b hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                          <td className="p-4">
                            <Checkbox
                              checked={selectedIds.has(notification.id)}
                              onCheckedChange={() => toggleSelection(notification.id)}
                              aria-label={`선택: ${notification.id}`}
                            />
                          </td>
                          <td className="p-4">
                            <time 
                              dateTime={new Date(notification.failedAt!).toISOString()}
                              className="text-body-small"
                            >
                              {new Date(notification.failedAt!).toLocaleString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </time>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">
                              {notification.channel.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <code className="text-caption bg-gray-100 px-2 py-1 rounded">
                              {notification.metadata?.token || notification.metadata?.webhookUrl || notification.userId}
                            </code>
                          </td>
                          <td className="p-4">
                            <Badge variant="destructive" className="font-mono text-xs">
                              {notification.error}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-body-small">{notification.retryCount}회</span>
                          </td>
                          <td className="p-4">
                            <p className="text-body-small line-clamp-2">
                              {notification.message}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-body-small text-secondary-gray">
                    총 {filteredNotifications.length}건 중 {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredNotifications.length)}건 표시
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      이전
                    </Button>
                    <span className="px-4 py-2 text-body-small">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-gray">총 알림</span>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-gray">전송 성공</span>
                <CheckCircle className="h-5 w-5 text-success-green" />
              </div>
              <p className="text-3xl font-bold text-success-green">{stats.sent}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-gray">전송 실패</span>
                <XCircle className="h-5 w-5 text-error-red" />
              </div>
              <p className="text-3xl font-bold text-error-red">{stats.failed}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-gray">지연 대기</span>
                <Clock className="h-5 w-5 text-warning-yellow" />
              </div>
              <p className="text-3xl font-bold text-warning-yellow">{stats.delayed}</p>
            </Card>
          </div>

          {/* Success Rate */}
          <Card className="p-6">
            <h2 className="mb-4">전송 성공률</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-secondary-gray">성공률</span>
                <span className="font-bold text-primary-blue text-xl">
                  {stats.successRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-blue h-3 rounded-full transition-all"
                  style={{ width: `${stats.successRate}%` }}
                  role="progressbar"
                  aria-valuenow={stats.successRate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`전송 성공률 ${stats.successRate.toFixed(1)}%`}
                />
              </div>
              <p className="text-caption text-secondary-gray">
                최근 24시간 기준
              </p>
            </div>
          </Card>

          {/* Channel Breakdown */}
          <Card className="p-6">
            <h2 className="mb-4">채널별 통계</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">FCM (푸시 알림)</p>
                  <p className="text-caption text-secondary-gray">모바일 & 웹 알림</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">85</p>
                  <p className="text-caption text-success-green">94.4% 성공</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Slack</p>
                  <p className="text-caption text-secondary-gray">워크스페이스 알림</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">42</p>
                  <p className="text-caption text-success-green">90.5% 성공</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-caption text-secondary-gray">이메일 알림</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">29</p>
                  <p className="text-caption text-success-green">96.6% 성공</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bulk Retry Confirmation Modal */}
      <Dialog open={showBulkRetryConfirm} onOpenChange={setShowBulkRetryConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>선택한 알림 재전송</DialogTitle>
            <DialogDescription>
              {selectedIds.size}개의 실패한 알림을 재전송하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              재전송은 즉시 실행되며, 취소할 수 없습니다.
              {isPaused && ' (현재 일시정지 상태이므로 큐에 저장됩니다)'}
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkRetryConfirm(false)}>
              취소
            </Button>
            <Button onClick={handleBulkRetry} autoFocus>
              <RefreshCw className="h-4 w-4 mr-2" />
              재전송 ({selectedIds.size}건)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Detail Modal */}
      <Dialog open={showStatusDetail} onOpenChange={setShowStatusDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>시스템 상태 상세</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">현재 상태</h3>
              <Badge 
                variant={systemStatus === 'normal' ? 'default' : systemStatus === 'paused' ? 'secondary' : 'destructive'}
                className="text-base px-3 py-1"
              >
                {systemStatus === 'normal' && '정상'}
                {systemStatus === 'paused' && '일시정지'}
                {systemStatus === 'partial-failure' && '부분 장애'}
              </Badge>
            </div>

            {systemStatus === 'paused' && (
              <Alert className="bg-warning-yellow-50 border-warning-yellow">
                <Pause className="h-4 w-4" />
                <AlertDescription>
                  알림 전송이 일시중지되었습니다. 새로운 알림은 큐에 저장되며,
                  재개 버튼을 클릭하면 순차적으로 전송됩니다.
                </AlertDescription>
              </Alert>
            )}

            {systemStatus === 'partial-failure' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>FCM 전송 실패율: 15%</strong>
                  <br />
                  주요 원인: 만료된 토큰, 잘못된 등록 ID
                  <br />
                  권장 조치: 사용자 FCM 토큰 갱신 유도
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h3 className="mb-2">통계 요약</h3>
              <div className="space-y-2 text-body-small">
                <div className="flex justify-between">
                  <span>총 알림:</span>
                  <strong>{stats.total}</strong>
                </div>
                <div className="flex justify-between">
                  <span>성공:</span>
                  <strong className="text-success-green">{stats.sent}</strong>
                </div>
                <div className="flex justify-between">
                  <span>실패:</span>
                  <strong className="text-error-red">{stats.failed}</strong>
                </div>
                <div className="flex justify-between">
                  <span>지연:</span>
                  <strong className="text-warning-yellow">{stats.delayed}</strong>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowStatusDetail(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
