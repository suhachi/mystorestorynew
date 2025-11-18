# 93 - Lighthouse Reports

## 📌 목표
Lighthouse 리포트를 생성하고 개선합니다.

**결과물**: Lighthouse 리포트, 개선 계획

---

## 프롬프트

```
MyStoreStory의 Lighthouse 리포트를 생성하고 개선합니다.

## 💡 Lighthouse Reports

### 1. Lighthouse CI 설정

```bash
npm install -g @lhci/cli
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: [
        'https://mystorestory.com',
        'https://mystorestory.com/features',
        'https://mystorestory.com/app-builder'
      ]
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    }
  }
};
```

### 2. 현재 점수

**홈페이지**:
```
Performance:      95/100 ✅
Accessibility:    92/100 ✅
Best Practices:   96/100 ✅
SEO:             100/100 ✅
```

**앱 빌더**:
```
Performance:      88/100 ⚠️
Accessibility:    90/100 ✅
Best Practices:   94/100 ✅
SEO:              92/100 ✅
```

### 3. 개선 항목

#### Performance (88 → 95)
- [ ] 이미지 최적화 (WebP)
- [ ] Unused JavaScript 제거
- [ ] Critical CSS 인라인
- [ ] Font preload

#### Accessibility (90 → 95)
- [ ] 모든 이미지 alt
- [ ] ARIA 레이블
- [ ] 색상 대비 개선
- [ ] Focus 스타일

#### SEO (92 → 100)
- [ ] Meta description
- [ ] Canonical URL
- [ ] Structured data

### 4. CI/CD 통합

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://mystorestory.com
    uploadArtifacts: true
```

### 5. 개선 계획

**Week 1**: Performance 88 → 92
**Week 2**: Accessibility 90 → 95
**Week 3**: SEO 92 → 100
**Week 4**: 모든 점수 95+

IMPORTANT: 모든 점수 90+ 필수, Performance 95+ 목표, CI/CD 통합
```

---

## 📝 다음: **94-USER-ACCEPTANCE.md**
