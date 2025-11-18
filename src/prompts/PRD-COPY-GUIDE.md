# 📋 PRD 파일 복사 가이드

## 📍 현재 위치

PRD 파일은 다음 위치에 있습니다:
```
/docs/PRD-PRODUCT-REQUIREMENTS.md
```

## 🎯 복사 방법

### 방법 1: 터미널 사용 (가장 빠름)

```bash
# 프로젝트 루트에서 실행
cp docs/PRD-PRODUCT-REQUIREMENTS.md prompts/PRD-PRODUCT-REQUIREMENTS.md
```

### 방법 2: 스크립트 사용

```bash
# 실행 권한 부여
chmod +x scripts/copy-prd.sh

# 스크립트 실행
./scripts/copy-prd.sh
```

### 방법 3: 수동 복사

1. `/docs/PRD-PRODUCT-REQUIREMENTS.md` 파일 열기
2. 전체 내용 복사 (Ctrl+A, Ctrl+C)
3. `/prompts/PRD-PRODUCT-REQUIREMENTS.md` 새 파일 생성
4. 붙여넣기 (Ctrl+V)
5. 저장

---

## ✅ 복사 후 확인

복사가 완료되면 다음 위치에 파일이 있어야 합니다:

```
prompts/
└── PRD-PRODUCT-REQUIREMENTS.md  ✅
```

---

**참고**: 파일 크기가 매우 크므로 (60+ 페이지) 터미널 명령어 사용을 권장합니다.
