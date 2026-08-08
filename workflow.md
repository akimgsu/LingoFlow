# LingoFlow — Architecture & Workflow

> 개발자를 위한 코드베이스 구조, 데이터 흐름, 파일별 역할 설명서

---

## 📐 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                      Expo Router                        │
│   app/_layout.tsx  ──  auth guard  ──  navigation       │
│       │                                                 │
│   index.tsx   study.tsx   profile.tsx                   │
│   login.tsx   signup.tsx                                │
└──────────────┬──────────────────────────────────────────┘
               │ imports
┌──────────────▼──────────────────────────────────────────┐
│                     src/ (코어 레이어)                    │
│                                                         │
│  components/        hooks/          contexts/           │
│  FlashCard.tsx      useStudyCard.ts AuthContext.tsx      │
│  CategoryCard.tsx                   ProgressContext.tsx  │
│                                                         │
│  constants/         types/          utils/              │
│  theme.ts           index.ts        audioPlayer.ts      │
│  categories.ts                                          │
│                                                         │
│  data/                                                  │
│  expressions.json  (246개 표현)                          │
└──────────────┬──────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────┐
│              외부 서비스 / External Services              │
│  Firebase Auth + Firestore  │  ElevenLabs TTS API       │
│  Google Cloud Secret Manager│  expo-speech (TTS fallback)│
└─────────────────────────────────────────────────────────┘
```

---

## 📁 파일 & 디렉토리 상세

### `app/` — 화면 (Expo Router)

| 파일 | 역할 | 주요 로직 |
|------|------|-----------|
| `_layout.tsx` | 루트 레이아웃 | `AuthProvider` + `ProgressProvider` 주입. `useSegments`로 미인증 사용자를 `/login`으로 리다이렉트 |
| `index.tsx` | **홈 화면** | `CATEGORIES` 목록 → `CategoryCard` 렌더링. 상단에 스트릭/하트 표시 |
| `study.tsx` | **학습 화면** | `useStudyCard` 훅 사용. `FlashCard` 렌더링. 앞/뒤 이동 + Review/Mastered 액션 |
| `profile.tsx` | 프로필 화면 | `useProgress()`로 XP/스트릭 표시. 업적 리스트. 로그아웃 |
| `login.tsx` | 로그인 화면 | Firebase `signInWithEmailAndPassword`. 비밀번호 표시 토글 |
| `signup.tsx` | 회원가입 화면 | Firebase `createUserWithEmailAndPassword` |

---

### `src/components/` — 재사용 UI

#### `FlashCard.tsx`
3D 뒤집기 카드 컴포넌트.

**Props:**
```typescript
interface Props {
  frontText: string;      // 앞면 텍스트 (영어 or 한국어)
  backText: string;       // 뒷면 텍스트
  frontLabel: 'EN' | 'KO';
  backLabel: 'EN' | 'KO';
  isFlipped: boolean;
  showAudioOnFront: boolean;
  showAudioOnBack: boolean;
  frontAnimStyle: object; // useStudyCard에서 전달
  backAnimStyle: object;
  onFlip: () => void;
  onAudio: () => void;
}
```

**렌더 구조:**
```
<View container>
  <Animated.View front>  ← rotateY: 0→180deg
    <TouchableOpacity onFlip>
    <TouchableOpacity audio>  (showAudioOnFront일 때만)
  <Animated.View back>   ← rotateY: 180→360deg
    <TouchableOpacity onFlip>
    <TouchableOpacity audio>  (showAudioOnBack일 때만)
```

---

#### `CategoryCard.tsx`
홈 화면의 카테고리 카드. `useRouter()`를 내부에서 호출하여 클릭 시 `/study?categoryId=...`로 이동.

```typescript
interface Props {
  item: Category; // { id, title, icon, count, accent }
}
```

---

### `src/hooks/` — 커스텀 훅

#### `useStudyCard.ts`
학습 화면의 모든 상태와 로직을 캡슐화.

**내부 상태:**
| 상태 | 타입 | 설명 |
|------|------|------|
| `currentIndex` | number | 현재 표현 인덱스 |
| `isFlipped` | boolean | 카드 뒤집힘 여부 |
| `isQuizMode` | boolean | 한국어 먼저 모드 |
| `flipAnim` | Animated.Value | 3D 회전 애니메이션 값 |

**반환 액션:**
| 함수 | 설명 |
|------|------|
| `flipCard()` | 카드 뒤집기 (spring 애니메이션) |
| `toggleQuizMode()` | 퀴즈 모드 전환 (카드 초기화 포함) |
| `goNext(mastered)` | 다음 카드. mastered=true면 +10XP, false면 하트 차감 |
| `goPrev()` | 이전 카드 (XP/하트 변동 없음) |
| `goForward()` | 다음 카드 (XP/하트 변동 없음) |
| `playAudio()` | 현재 표현 발음 재생 |

---

### `src/contexts/` — 전역 상태

#### `AuthContext.tsx`
Firebase Auth 상태를 전역 공유.

```typescript
const { user, loading } = useAuth();
// user: null (비로그인) | FirebaseUser (로그인)
// loading: Firebase 초기화 대기 여부
```

#### `ProgressContext.tsx`
학습 진도 상태 관리.

```typescript
const { streak, hearts, xp, addXp, loseHeart, resetHearts } = useProgress();
```

| 상태 | 초기값 | 설명 |
|------|--------|------|
| `streak` | 0 | 연속 학습일 수 |
| `hearts` | 5 | 남은 에너지 (1 이하 → 자동 5로 리필) |
| `xp` | 0 | 누적 경험치 |

> ⚠️ **현재 인메모리 상태** — 앱 재시작 시 초기화됩니다. Firestore 영속화는 추후 개발 예정.

---

### `src/constants/` — 디자인 토큰

#### `theme.ts`
앱 전체의 단일 색상/스타일 출처(Single Source of Truth).

```typescript
COLORS.bgDeep      // '#0A0A12' — 앱 최외곽 배경
COLORS.bgCard      // '#13131F' — 카드 배경
COLORS.violet      // '#6D28D9' — 주요 버튼, 프로그레스 바
COLORS.indigo      // '#818CF8' — 아이콘, 레이블
COLORS.pink        // '#F472B6' — Review 버튼, 하트
COLORS.orange      // '#FB923C' — 스트릭 불꽃
```

#### `categories.ts`
`CATEGORIES` 배열 — 6개 카테고리 메타데이터. `index.tsx`와 `CategoryCard.tsx`에서 사용.

---

### `src/types/index.ts` — TypeScript 타입

```typescript
interface Expression { id, english, korean, category }
interface Category   { id, title, icon, count, accent }
```

---

### `src/utils/audioPlayer.ts` — 음성 재생

```
playExpressionAudio(id, text)
  ├─ Speech.stop() 으로 이전 음성 즉시 정지
  ├─ " / " 구분자를 자연스러운 쉼표 및 간격으로 변환
  └─ expo-speech로 카드에 표시된 정확한 영어 문장을 네이티브 발음으로 재생
```

246개 전체 표현이 현재 화면에 나타나는 영어 문장과 100% 일치하도록 정확하게 재생됩니다.

---

### `src/data/expressions.json` — 표현 데이터

246개 표현, 6개 카테고리.
`scripts/expressions.csv` → `scripts/seedExpressions.js` 실행으로 생성.

```json
[
  { "id": "exp_001", "english": "Don't be intimidated", "korean": "겁먹지 마세요.", "category": "Daily & Casual" },
  ...
]
```

---

### `firebaseConfig.ts` — Firebase 초기화

`app.json`의 `extra.firebase`에서 설정값을 읽어 초기화.
`.env` 파일 불필요 — 설정이 `app.json`에 집중됨.

```typescript
export const auth    // Firebase Authentication
export const db      // Firestore Database
export const storage // Firebase Storage
```

---

### `scripts/` — 개발 도구

| 파일 | 역할 | 실행 방법 |
|------|------|-----------|
| `expressions.csv` | 마스터 표현 데이터 (편집용) | 직접 편집 |
| `seedExpressions.js` | ElevenLabs MP3 배치 생성 | `node scripts/seedExpressions.js` |

`seedExpressions.js` 동작:
1. Google Cloud Secret Manager에서 `ELEVENLABS_API_KEY` 읽기
2. `expressions.csv` 파싱
3. 각 표현의 영어 텍스트 → ElevenLabs API 호출
4. MP3를 `scripts/audio/` → `assets/audio/`에 저장

---

## 🔄 데이터 흐름 (학습 화면)

```
사용자가 카테고리 선택
    │
    ▼
app/study.tsx
  categoryId 파라미터 수신
    │
    ▼
expressions.json 필터링 (해당 카테고리)
    │
    ▼
useStudyCard(list) 훅
  ┌─ currentExpression = list[currentIndex]
  ├─ isQuizMode → 앞/뒷면 텍스트 결정
  └─ flipAnim   → 3D 애니메이션 값
    │
    ▼
FlashCard 컴포넌트 렌더링
  ┌─ 앞면: frontText + 오디오 버튼
  └─ 뒷면: backText + 오디오 버튼 (퀴즈모드)
    │
    ▼
사용자 액션
  ├─ Mastered → addXp(10) → goNext()
  ├─ Review   → loseHeart() → goNext()
  ├─ ← Prev   → goPrev() (점수 변동 없음)
  └─ → Next   → goForward() (점수 변동 없음)
```

---

## 🚀 향후 개선 사항 (Roadmap)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| Firestore 진도 저장 | 재시작 후에도 XP/스트릭 유지 | 높음 |
| 나머지 236개 ElevenLabs MP3 생성 | `node scripts/seedExpressions.js` | 중간 |
| 단어 즐겨찾기 | 어려운 표현 북마크 | 중간 |
| 스와이프 제스처 | 좌/우 스와이프로 카드 이동 | 낮음 |
| 다크/라이트 모드 전환 | `theme.ts` 기반 테마 시스템 | 낮음 |
