# 05 - 랜딩 페이지 Hero 섹션

## 📌 목표
메인 랜딩 페이지의 Hero 섹션과 Features 섹션을 구축합니다.

**결과물**:
- Hero 섹션 (헤드라인, CTA, 이미지)
- Features 그리드 (3x2)
- 스크롤 애니메이션

---

## 🔄 STEP 1: Hero 섹션 컴포넌트

### 프롬프트 템플릿

```
랜딩 페이지의 Hero 섹션을 만듭니다.

## 요구사항

/components/pages/landing-page.tsx 생성:

```typescript
import React, { useState } from 'react';
import { Container, Flex, Grid } from '../common';
import { Button } from '../ui/button';
import { 
  Store, 
  Smartphone, 
  TrendingUp, 
  Zap, 
  Heart, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <Container>
          <Flex justify="between" align="center" className="h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-primary">MyStoreStory</h4>
            </div>
            
            <Flex gap={6} align="center" className="hidden md:flex">
              <a href="#features" className="text-slate-600 hover:text-primary transition-colors">
                기능
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-primary transition-colors">
                요금제
              </a>
              <a href="#examples" className="text-slate-600 hover:text-primary transition-colors">
                사례
              </a>
              <a href="/auth/login">
                <Button variant="ghost">로그인</Button>
              </a>
              <a href="/auth/signup">
                <Button>시작하기</Button>
              </a>
            </Flex>
          </Flex>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
                <p className="text-sm text-primary">✨ 배달 수수료 0원, 이제 시작하세요</p>
              </div>
              
              <h1 className="mb-6">
                나만의 배달앱을<br />
                <span className="text-primary">5분</span>만에 만드세요
              </h1>
              
              <p className="text-xl text-slate-600 mb-8">
                복잡한 코딩 없이, 클릭 몇 번으로 완성되는<br />
                소상공인을 위한 배달앱 빌더
              </p>

              <Flex gap={4} className="mb-8">
                <a href="/auth/signup">
                  <Button size="lg" className="group">
                    무료로 시작하기
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <a href="#demo">
                  <Button size="lg" variant="outline">
                    데모 보기
                  </Button>
                </a>
              </Flex>

              <Flex gap={6} className="text-sm text-slate-600">
                <Flex align="center" gap={2}>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>신용카드 불필요</span>
                </Flex>
                <Flex align="center" gap={2}>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>5분 만에 구축</span>
                </Flex>
                <Flex align="center" gap={2}>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>무료 플랜 제공</span>
                </Flex>
              </Flex>
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                {/* Mock App Screen */}
                <div className="bg-white p-8">
                  <div className="space-y-4">
                    <div className="h-12 bg-primary rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-slate-100 rounded-lg" />
                      <div className="h-32 bg-slate-100 rounded-lg" />
                      <div className="h-32 bg-slate-100 rounded-lg" />
                      <div className="h-32 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-border"
              >
                <p className="text-sm text-slate-600 mb-1">월 평균 주문</p>
                <h4 className="text-primary">1,234건</h4>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-border"
              >
                <p className="text-sm text-slate-600 mb-1">수수료 절감</p>
                <h4 className="text-green-600">₩180만</h4>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="mb-4">왜 MyStoreStory인가요?</h2>
            <p className="text-xl text-slate-600">
              소상공인을 위한 완벽한 배달앱 솔루션
            </p>
          </div>

          <Grid cols={3} gap={8} className="md:grid-cols-3 grid-cols-1">
            {[
              {
                icon: Zap,
                title: '5분 만에 완성',
                description: '복잡한 설정 없이 클릭 몇 번으로 앱 생성. 코딩 지식 불필요.',
                color: 'text-yellow-600',
                bg: 'bg-yellow-50',
              },
              {
                icon: TrendingUp,
                title: '수수료 0원',
                description: '배달 플랫폼 수수료 없이 100% 매출을 가져가세요.',
                color: 'text-green-600',
                bg: 'bg-green-50',
              },
              {
                icon: Smartphone,
                title: '모바일 최적화',
                description: 'iOS, Android 모두 지원. 고객이 언제 어디서나 주문 가능.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: Heart,
                title: '고객 충성도',
                description: '포인트, 스탬프, 쿠폰으로 단골 고객 확보.',
                color: 'text-pink-600',
                bg: 'bg-pink-50',
              },
              {
                icon: Shield,
                title: '안전한 결제',
                description: '카드, 현금, 계좌이체 등 다양한 결제 수단 지원.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
              {
                icon: Store,
                title: '완벽한 관리',
                description: '주문, 메뉴, 고객을 하나의 대시보드에서 관리.',
                color: 'text-primary',
                bg: 'bg-primary/10',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h4 className="mb-2">{feature.title}</h4>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </Grid>
        </Container>
      </section>
    </div>
  );
};
```

IMPORTANT:
- Motion(Framer Motion) 애니메이션 사용
- 반응형 그리드
- 스크롤 애니메이션 (whileInView)
- 실제 사용 가능한 네비게이션 링크
```

### 예상 결과

```
/components/pages/landing-page.tsx
```

### 검증 체크리스트

- [ ] Hero 섹션 렌더링
- [ ] 애니메이션 작동
- [ ] Features 그리드 표시
- [ ] 네비게이션 링크 작동
- [ ] 반응형 확인

---

## ✅ 완료 체크리스트

- [ ] LandingPage 컴포넌트 생성
- [ ] Hero 섹션 완성
- [ ] Features 섹션 완성
- [ ] 애니메이션 적용
- [ ] 반응형 동작

---

## 📝 다음 단계

**06-LANDING-PRICING.md**로 이동하여 요금제 섹션을 추가합니다.
