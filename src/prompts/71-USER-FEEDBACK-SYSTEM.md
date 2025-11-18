# 71 - User Feedback System

## 📌 목표
사용자 피드백 수집 시스템을 구축합니다.

**결과물**:
- 피드백 폼
- 평가 시스템
- 버그 리포트
- 기능 요청

**총 개념 정리**

---

## 🔄 STEP 1: 피드백 컴포넌트

### 프롬프트 템플릿

```
사용자 피드백 수집 및 관리 시스템을 구축합니다.

## 1. 피드백 버튼

components/feedback/FeedbackButton.tsx:

```typescript
import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FeedbackForm } from './FeedbackForm';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label="피드백 보내기"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* 피드백 모달 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>피드백 보내기</DialogTitle>
          </DialogHeader>
          <FeedbackForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## 2. 피드백 폼

components/feedback/FeedbackForm.tsx:

```typescript
import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../hooks/useAuth';

export function FeedbackForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [type, setType] = useState<'bug' | 'feature' | 'feedback'>('feedback');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'feedback'), {
        type,
        title,
        description,
        email,
        userId: user?.id,
        userAgent: navigator.userAgent,
        url: window.location.href,
        createdAt: Date.now(),
        status: 'new'
      });

      toast.success('피드백이 전송되었습니다. 감사합니다!');
      onClose();
    } catch (error) {
      toast.error('피드백 전송에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 피드백 타입 */}
      <div>
        <Label>피드백 유형</Label>
        <Select value={type} onValueChange={(value: any) => setType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feedback">일반 피드백</SelectItem>
            <SelectItem value="bug">버그 리포트</SelectItem>
            <SelectItem value="feature">기능 요청</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 제목 */}
      <div>
        <Label>제목</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="간단한 제목을 입력하세요"
          required
        />
      </div>

      {/* 설명 */}
      <div>
        <Label>상세 설명</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            type === 'bug' 
              ? '버그 발생 상황을 자세히 설명해주세요\n\n1. 어떤 작업을 했는지\n2. 어떤 문제가 발생했는지\n3. 예상 결과는 무엇인지' 
              : type === 'feature'
              ? '원하시는 기능을 자세히 설명해주세요'
              : '피드백을 자유롭게 작성해주세요'
          }
          rows={6}
          required
        />
      </div>

      {/* 이메일 */}
      {!user && (
        <div>
          <Label>이메일 (선택)</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="답변 받을 이메일"
          />
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? '전송중...' : '전송'}
        </Button>
      </div>
    </form>
  );
}
```

## 3. 평점 시스템

components/feedback/RatingWidget.tsx:

```typescript
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';

export function RatingWidget({ feature }: { feature: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('별점을 선택해주세요');
      return;
    }

    // Firestore에 저장
    try {
      await addDoc(collection(db, 'ratings'), {
        feature,
        rating,
        feedback,
        timestamp: Date.now()
      });

      toast.success('평가해주셔서 감사합니다!');
      setSubmitted(true);
    } catch (error) {
      toast.error('평가 전송에 실패했습니다');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 font-medium">
          ✅ 평가가 완료되었습니다!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <p className="font-medium">이 기능이 유용했나요?</p>
      
      {/* 별점 */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hover || rating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* 피드백 (선택) */}
      {rating > 0 && (
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="추가 의견이 있으시면 남겨주세요 (선택)"
          rows={3}
        />
      )}

      {/* 제출 */}
      {rating > 0 && (
        <Button onClick={handleSubmit} className="w-full">
          평가 제출
        </Button>
      )}
    </div>
  );
}
```

## 4. NPS (Net Promoter Score)

components/feedback/NPSWidget.tsx:

```typescript
import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export function NPSWidget() {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // NPS 데이터 저장
    await addDoc(collection(db, 'nps'), {
      score,
      feedback,
      timestamp: Date.now()
    });

    toast.success('감사합니다!');
    setSubmitted(true);
  };

  if (submitted) {
    return <div className="text-center py-4">✅ 평가 완료</div>;
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <p className="font-medium">
        MyStoreStory를 지인에게 추천하시겠습니까?
      </p>
      
      {/* 0-10 점수 */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => setScore(num)}
            className={`
              w-10 h-10 border rounded
              ${score === num ? 'bg-primary text-white' : 'hover:bg-gray-100'}
            `}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-gray-600">
        <span>전혀 아님</span>
        <span>매우 그렇다</span>
      </div>

      {/* 피드백 */}
      {score !== null && (
        <>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="이유를 알려주시겠어요? (선택)"
            rows={3}
          />
          <Button onClick={handleSubmit} className="w-full">
            제출
          </Button>
        </>
      )}
    </div>
  );
}
```

## 5. 관리자 피드백 대시보드

pages/admin/feedback-dashboard.tsx:

```typescript
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export function FeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadFeedbacks();
  }, [filter]);

  const loadFeedbacks = async () => {
    const q = query(
      collection(db, 'feedback'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setFeedbacks(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'feedback', id), { status });
    loadFeedbacks();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">피드백 관리</h1>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="new">신규</SelectItem>
            <SelectItem value="in-progress">처리중</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>총 피드백</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{feedbacks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>신규</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {feedbacks.filter(f => f.status === 'new').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>처리중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {feedbacks.filter(f => f.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {feedbacks.filter(f => f.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 피드백 목록 */}
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge>
                      {feedback.type === 'bug' ? '버그' : 
                       feedback.type === 'feature' ? '기능요청' : '피드백'}
                    </Badge>
                    <Badge className={
                      feedback.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      feedback.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }>
                      {feedback.status === 'new' ? '신규' :
                       feedback.status === 'in-progress' ? '처리중' : '완료'}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-lg">{feedback.title}</h3>
                  <p className="text-gray-600">{feedback.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{feedback.email || '익명'}</span>
                    <span>•</span>
                    <span>{new Date(feedback.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select
                    value={feedback.status}
                    onValueChange={(value) => updateStatus(feedback.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">신규</SelectItem>
                      <SelectItem value="in-progress">처리중</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

IMPORTANT:
- 플로팅 피드백 버튼
- 피드백 폼 (버그/기능/일반)
- 별점 평가
- NPS 설문
- 관리자 대시보드
- 상태 관리 (신규/처리중/완료)
```

---

## 📝 핵심 포인트

### 피드백 타입
1. **Bug Report**: 버그 신고
2. **Feature Request**: 기능 요청
3. **General Feedback**: 일반 피드백

### 평가 시스템
- **별점**: 1-5점
- **NPS**: 0-10점
- **만족도**: 매우 만족 ~ 매우 불만족

---

## ✅ 완료 체크리스트

- [ ] 피드백 버튼
- [ ] 피드백 폼
- [ ] 별점 시스템
- [ ] NPS 위젯
- [ ] 관리자 대시보드

---

## 📝 다음 단계

**72-AB-TESTING.md**로 이동합니다.
