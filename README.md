# 쇼핑몰 데모 — 빌더 쇼핑몰 자체 구축 리뉴얼

크몽 기업 의뢰 #225526 제안용 데모 쇼핑몰입니다.

---

## GitHub Pages 배포

### 1. GitHub 레포지토리 생성

```bash
gh repo create kmong-225526-demo --public
cd demo-app
git init
git remote add origin https://github.com/{username}/kmong-225526-demo.git
```

### 2. gh-pages 패키지 설치

```bash
npm install --save-dev gh-pages
```

### 3. GitHub Pages용 빌드

```bash
GITHUB_PAGES=true npm run build
```

> `next.config.ts`에서 `GITHUB_PAGES=true`일 때 `basePath: "/kmong-225526-demo"`가 자동 적용됩니다.

### 4. 배포

```bash
npx gh-pages -d out
```

### 5. GitHub Pages 설정

1. GitHub 레포 → **Settings** → **Pages**
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` / `/ (root)`
4. **Save**

### 6. 접속

```
https://{username}.github.io/kmong-225526-demo
```

배포 후 반영까지 1~2분 소요될 수 있습니다.

---

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 으로 접속

## 로컬 빌드 & 서빙

```bash
npm run build
npx serve out -p 3456
```

http://localhost:3456 으로 접속
