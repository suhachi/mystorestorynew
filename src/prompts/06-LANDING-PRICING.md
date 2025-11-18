# 06 - 랜딩 페이지 요금제 섹션

## 📌 목표
4가지 플랜을 비교할 수 있는 요금제 섹션을 구축합니다.

**결과물**:
- 요금제 비교 카드 (4개)
- 기능 비교 테이블
- 플랜 선택 CTA

---

## 🔄 STEP 1: Pricing 섹션

### 프롬프트 템플릿

```
랜딩 페이지에 요금제 섹션을 추가합니다.

## 요구사항

/components/pages/landing-page.tsx 업데이트 - Pricing 섹션 추가:

기존 파일에 다음 섹션을 Features 섹션 다음에 추가:

```typescript
{/* Pricing Section */}
<section id="pricing" className="py-20 bg-slate-50">
  <Container>
    <div className="text-center mb-16">
      <h2 className="mb-4">성장에 맞는 플랜을 선택하세요</h2>
      <p className="text-xl text-slate-600">
        언제든지 플랜을 변경할 수 있습니다
      </p>
    </div>

    <Grid cols={4} gap={6} className="lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
      {[
        {
          name: 'FREE',
          displayName: '무료 플랜',
          price: 0,
          period: '영구 무료',
          description: '시작하는 소상공인을 위한',
          features: [
            { text: '최대 상품 10개', included: true },
            { text: '월 주문 50건', included: true },
            { text: '기본 분석', included: true },
            { text: 'Push 알림', included: true },
            { text: '고급 분석', included: false },
            { text: '커스텀 브랜딩', included: false },
            { text: 'API 접근', included: false },
          ],
          cta: '무료 시작',
          popular: false,
        },
        {
          name: 'BASIC',
          displayName: '베이직 플랜',
          price: 29000,
          period: '월',
          description: '성장하는 비즈니스를 위한',
          features: [
            { text: '최대 상품 50개', included: true },
            { text: '월 주문 300건', included: true },
            { text: '기본 분석', included: true },
            { text: 'Push/Email 알림', included: true },
            { text: '커스텀 브랜딩', included: true },
            { text: '포인트 시스템', included: true },
            { text: 'API 접근', included: false },
          ],
          cta: '14일 무료 체험',
          popular: false,
        },
        {
          name: 'PREMIUM',
          displayName: '프리미엄 플랜',
          price: 79000,
          period: '월',
          description: '전문 비즈니스를 위한',
          features: [
            { text: '최대 상품 200개', included: true },
            { text: '월 주문 1,000건', included: true },
            { text: '고급 분석', included: true },
            { text: 'Push/Email/SMS', included: true },
            { text: '커스텀 브랜딩', included: true },
            { text: 'API 접근', included: true },
            { text: '우선 지원', included: true },
          ],
          cta: '14일 무료 체험',
          popular: true,
        },
        {
          name: 'ENTERPRISE',
          displayName: '엔터프라이즈',
          price: null,
          period: '맞춤 견적',
          description: '대규모 비즈니스를 위한',
          features: [
            { text: '무제한 상품', included: true },
            { text: '무제한 주문', included: true },
            { text: '고급 분석', included: true },
            { text: '모든 알림 채널', included: true },
            { text: '다중 매장 지원', included: true },
            { text: 'API 접근', included: true },
            { text: '전담 매니저', included: true },
          ],
          cta: '영업팀 문의',
          popular: false,
        },
      ].map((plan, index) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm rounded-full">
              인기
            </div>
          )}
          
          <div className={`h-full bg-white rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
            plan.popular ? 'border-primary shadow-lg' : 'border-border'
          }`}>
            <div className="mb-6">
              <h5 className="mb-2">{plan.displayName}</h5>
              <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
              
              <div className="mb-2">
                {plan.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <h2 className="text-primary">{plan.price.toLocaleString()}</h2>
                    <span className="text-slate-600">원</span>
                  </div>
                ) : (
                  <h3 className="text-primary">문의</h3>
                )}
              </div>
              <p className="text-sm text-slate-500">{plan.period}</p>
            </div>

            <Button 
              className="w-full mb-6"
              variant={plan.popular ? 'default' : 'outline'}
            >
              {plan.cta}
            </Button>

            <div className="space-y-3">
              {plan.features.map((feature, idx) => (
                <Flex key={idx} align="center" gap={2}>
                  {feature.included ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${
                    feature.included ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {feature.text}
                  </span>
                </Flex>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </Grid>

    <div className="text-center mt-12">
      <p className="text-slate-600 mb-4">
        모든 플랜에는 무료 SSL, 무제한 대역폭, 24/7 지원이 포함됩니다
      </p>
      <a href="/pricing" className="text-primary hover:underline">
        전체 기능 비교 보기 →
      </a>
    </div>
  </Container>
</section>

{/* CTA Section */}
<section className="py-20 bg-primary text-white">
  <Container>
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="mb-4 text-white">지금 바로 시작하세요</h2>
      <p className="text-xl text-white/90 mb-8">
        5분이면 나만의 배달앱이 완성됩니다.<br />
        신용카드 없이 무료로 시작하세요.
      </p>
      <Flex gap={4} justify="center" className="flex-wrap">
        <Button size="lg" variant="secondary">
          무료로 시작하기
        </Button>
        <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
          데모 체험하기
        </Button>
      </Flex>
    </div>
  </Container>
</section>

{/* Footer */}
<footer className="py-12 bg-slate-900 text-white">
  <Container>
    <Grid cols={4} gap={8} className="md:grid-cols-4 grid-cols-2 mb-8">
      <div>
        <h6 className="mb-4 text-white">제품</h6>
        <div className="space-y-2 text-sm text-slate-400">
          <p><a href="#" className="hover:text-white">기능</a></p>
          <p><a href="#" className="hover:text-white">요금제</a></p>
          <p><a href="#" className="hover:text-white">사례</a></p>
          <p><a href="#" className="hover:text-white">업데이트</a></p>
        </div>
      </div>
      <div>
        <h6 className="mb-4 text-white">회사</h6>
        <div className="space-y-2 text-sm text-slate-400">
          <p><a href="#" className="hover:text-white">소개</a></p>
          <p><a href="#" className="hover:text-white">블로그</a></p>
          <p><a href="#" className="hover:text-white">채용</a></p>
          <p><a href="#" className="hover:text-white">파트너</a></p>
        </div>
      </div>
      <div>
        <h6 className="mb-4 text-white">지원</h6>
        <div className="space-y-2 text-sm text-slate-400">
          <p><a href="#" className="hover:text-white">고객센터</a></p>
          <p><a href="#" className="hover:text-white">가이드</a></p>
          <p><a href="#" className="hover:text-white">API 문서</a></p>
          <p><a href="#" className="hover:text-white">상태</a></p>
        </div>
      </div>
      <div>
        <h6 className="mb-4 text-white">법적 고지</h6>
        <div className="space-y-2 text-sm text-slate-400">
          <p><a href="#" className="hover:text-white">이용약관</a></p>
          <p><a href="#" className="hover:text-white">개인정보처리방침</a></p>
          <p><a href="#" className="hover:text-white">보안</a></p>
        </div>
      </div>
    </Grid>
    
    <div className="pt-8 border-t border-slate-800 flex justify-between items-center flex-wrap gap-4">
      <p className="text-sm text-slate-400">
        © 2025 MyStoreStory. All rights reserved.
      </p>
      <Flex gap={4}>
        <a href="#" className="text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        </a>
        <a href="#" className="text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </Flex>
    </div>
  </Container>
</footer>
```

필요한 import 추가:
```typescript
import { XCircle } from 'lucide-react';
```

IMPORTANT:
- 4가지 플랜 카드
- 인기 플랜 배지
- 기능 체크리스트
- Footer 포함
```

### 예상 결과

```
업데이트된 /components/pages/landing-page.tsx
```

### 검증 체크리스트

- [ ] Pricing 카드 4개 표시
- [ ] 인기 플랜 강조
- [ ] 기능 체크마크 표시
- [ ] CTA 섹션 렌더링
- [ ] Footer 표시

---

## ✅ 완료 체크리스트

- [ ] Pricing 섹션 추가
- [ ] 4가지 플랜 카드
- [ ] CTA 섹션
- [ ] Footer
- [ ] 애니메이션 작동

---

## 📝 다음 단계

**07-AUTH-LOGIN-SIGNUP.md**로 이동하여 인증 페이지를 구축합니다.
