# LingoFlow 📱

> **A sleek, dark-themed mobile flashcard app for mastering conversational English expressions — built with Expo, React Native, and Firebase.**

---

## 스크린샷 / Screenshots

| Home | Study | Profile |
|------|-------|---------|
| Dark category list with neon accents | Flip-card with prev/next navigation | Stats & achievements |

---

## 기능 / Features

- 🗂️ **6개 카테고리**, 246개 실용 영어 표현 (일상, 관용어, 식당, 비즈니스, 여행, 감정)
- 🃏 **3D 플립 카드** — 탭으로 뒤집어 번역 확인
- 🎯 **퀴즈 모드** — 한국어를 먼저 보고 영어를 맞히는 훈련
- ⬅️➡️ **앞뒤 이동** — 카드를 자유롭게 넘기기 / 돌아가기
- 🔊 **원어민 음성** — ElevenLabs TTS MP3 재생 (없는 경우 디바이스 TTS 자동 대체)
- 🔥 **학습 진도** — 스트릭(연속 학습일), 하트(에너지), XP 추적
- 🔐 **Firebase 인증** — 이메일/비밀번호 로그인 & 회원가입

---

## 기술 스택 / Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 54 + Expo Router |
| Language | TypeScript |
| UI | React Native (dark theme) |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| TTS (primary) | ElevenLabs API (`eleven_multilingual_v2`) |
| TTS (fallback) | `expo-speech` |
| Audio | `expo-av` |
| Icons | `@expo/vector-icons` (Ionicons + FontAwesome5) |
| Secrets | Google Cloud Secret Manager |

---

## 시작하기 / Getting Started

### 사전 요구사항

- **Node.js** ≥ 18
- **Expo CLI** — `npm install -g expo-cli`
- **Expo Go** 앱 (iOS / Android)
- Firebase 프로젝트

### 1. 클론 & 패키지 설치

```bash
git clone https://github.com/your-username/LingoFlow.git
cd LingoFlow
npm install
```

### 2. Firebase 설정

`app.json`의 `extra.firebase` 블록을 본인의 Firebase 프로젝트 값으로 채웁니다:

```json
"extra": {
  "firebase": {
    "apiKey": "YOUR_API_KEY",
    "authDomain": "YOUR_PROJECT.firebaseapp.com",
    "projectId": "YOUR_PROJECT_ID",
    "storageBucket": "YOUR_PROJECT.firebasestorage.app",
    "messagingSenderId": "YOUR_SENDER_ID",
    "appId": "YOUR_APP_ID"
  }
}
```

> Firebase Console → 프로젝트 설정 → 앱에서 구성 파일을 확인하세요.

### 3. 앱 실행

```bash
# 개발 서버 시작 (캐시 초기화)
npx expo start --clear

# 특정 플랫폼 실행
npx expo start --android
npx expo start --ios
npx expo start --web
```

QR코드를 Expo Go 앱으로 스캔하면 실행됩니다.

---

## ElevenLabs 음성 생성 (선택사항)

기본 제공 MP3 10개 외에 추가 음성을 생성하려면:

### Google Cloud Secret Manager에 API 키 저장

```bash
# 시크릿 생성
echo -n "YOUR_ELEVENLABS_KEY" | gcloud secrets create ELEVENLABS_API_KEY --data-file=-

# 또는 기존 시크릿 버전 추가
echo -n "YOUR_ELEVENLABS_KEY" | gcloud secrets versions add ELEVENLABS_API_KEY --data-file=-
```

### 음성 일괄 생성

```bash
# expressions.csv의 모든 표현에 대한 MP3 생성
node scripts/seedExpressions.js
```

생성된 MP3는 `scripts/audio/`에 저장된 후 `assets/audio/`로 복사됩니다.
`src/utils/audioPlayer.ts`에 새 ID를 추가하면 앱에서 사용됩니다.

---

## 표현 데이터 관리

모든 표현은 `scripts/expressions.csv`에서 관리합니다:

```csv
id,english,korean,category
exp_001,Don't be intimidated,겁먹지 마세요.,Daily & Casual
exp_002,Are you up for it?,할 마음이 있어?,Daily & Casual
...
```

CSV를 수정한 뒤 JSON으로 변환:

```bash
node scripts/csvToJson.js
# → src/data/expressions.json 업데이트
```

---

## 프로젝트 구조

```
LingoFlow/
├── app/                    # Expo Router 화면
│   ├── _layout.tsx         # 루트 레이아웃 & 인증 가드
│   ├── index.tsx           # 홈 화면 (카테고리 목록)
│   ├── study.tsx           # 플립카드 학습 화면
│   ├── profile.tsx         # 프로필 & 통계
│   ├── login.tsx           # 로그인
│   └── signup.tsx          # 회원가입
├── src/
│   ├── components/         # 재사용 UI 컴포넌트
│   │   ├── FlashCard.tsx   # 3D 플립 카드
│   │   └── CategoryCard.tsx
│   ├── constants/          # 디자인 토큰 & 데이터 상수
│   │   ├── theme.ts        # 색상, 반경, 그림자
│   │   └── categories.ts   # 카테고리 목록
│   ├── contexts/           # React Context
│   │   ├── AuthContext.tsx
│   │   └── ProgressContext.tsx
│   ├── data/
│   │   └── expressions.json # 246개 표현 데이터
│   ├── hooks/
│   │   └── useStudyCard.ts  # 플립카드 커스텀 훅
│   ├── types/
│   │   └── index.ts         # TypeScript 타입 정의
│   └── utils/
│       └── audioPlayer.ts   # 음성 재생 유틸리티
├── assets/
│   ├── audio/              # ElevenLabs 생성 MP3
│   └── icon.png            # 앱 아이콘
├── scripts/
│   ├── expressions.csv     # 마스터 표현 데이터
│   └── seedExpressions.js  # ElevenLabs 배치 TTS 생성기
├── firebaseConfig.ts       # Firebase 초기화
└── app.json                # Expo + Firebase 설정
```

---

## 라이선스 / License

MIT © 2026 LingoFlow
