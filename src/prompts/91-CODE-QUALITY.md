# 91 - Code Quality Metrics

## 📌 목표
코드 품질 메트릭을 측정하고 개선합니다.

**결과물**: 코드 품질 리포트, 린트 규칙, 개선 계획

---

## 프롬프트

```
MyStoreStory의 코드 품질을 측정하고 개선합니다.

## 📊 Code Quality Metrics

### 1. ESLint 설정

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["error"] }]
  }
}
```

### 2. 코드 메트릭

#### 복잡도
| 파일 | 라인 수 | 복잡도 | 상태 |
|------|---------|--------|------|
| orders.ts | 245 | 12 | ✅ |
| app-builder.tsx | 580 | 18 | ⚠️ |
| dashboard.tsx | 420 | 15 | ✅ |

**목표**: 복잡도 < 15

#### 중복 코드
```bash
npx jscpd src/

# 결과
Total duplications: 2.3%  ✅
Target: < 5%
```

### 3. TypeScript 엄격 모드

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 4. Prettier

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 5. Husky Pre-commit

```bash
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

### 6. SonarQube (선택)

```bash
# 코드 품질 분석
npx sonarqube-scanner

# 메트릭
- Bugs: 0
- Code Smells: 12
- Technical Debt: 2h
- Coverage: 85%
```

### 7. 개선 계획

**Phase 1**: ESLint 에러 0개
**Phase 2**: TypeScript strict 모드
**Phase 3**: 복잡도 < 15
**Phase 4**: 중복 코드 < 3%

IMPORTANT: ESLint 에러 0개, TypeScript strict, 복잡도 < 15, 중복 < 5%
```

---

## 📝 다음: **92-BUNDLE-ANALYSIS.md**
