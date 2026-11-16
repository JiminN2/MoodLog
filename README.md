# MoodLog

> 하루의 감정을 별로 남기고, 별자리를 완성한 한 달을 볼 수 있는 감정 기록장

<!-- TODO: 스크린샷 또는 GIF -->

## ✨ 주요 기능

- **월별 별자리 그래프**: 한 달의 기록이 하나의 별자리로 그려집니다. 
- **감정 색상 표시**: 날짜별 감정에 따라 별(노드)의 색이 바뀝니다. 
- **사이드바 상세 보기**: 별을 클릭하면 그날의 기록을 확인할 수 있습니다.
- **인터랙티브 별 배경**: Three.js 파티클 배경, 스크롤에 따라 카메라가 별 속으로 들어가는 연출
- **페이지별 배경 전환**: `/mood-log` 상세 페이지에서는 배경이 부드럽게 어두워집니다.

## ⚒️ Tech Stack

| 구분 | 사용 기술 | 
| --- | --- |
| Framework | React, Typescript, Vite | 
| Routing | React Router | 
| Graph | Cytoscpae.js | 
| 3D / Background | Three.js (WegGL, GLSL shader) | 
| Styling | CSS Modules | 

## 🚀 시작하기

```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 열면 됩니다.

```bash
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 🗺 페이지 구성

| 경로 | 설명 |
|---|---|
| `/`, `/introduction` | 소개 페이지 |
| `/mood-log` | 월 선택 화면 |
| `/mood-log/:year/:month` | 해당 월의 별자리와 기록 |

## 📁 프로젝트 구조

```
src/
├─ components/
│  ├─ Introduction.tsx
│  ├─ IntroductionBg.tsx        # Three.js 별 배경
│  ├─ ConstellationGraph.tsx    # Cytoscape 별자리 그래프
│  └─ MoodLog/
├─ data/
│  └─ Constellations/           # 월별 별자리 데이터 (노드 위치, 연결)
│     ├─ type.ts
│     └─ february.ts
├─ utils/
│  └─ cytoscapeHelpers.ts
├─ Layout.tsx
└─ App.tsx
```

## 💡 구현 포인트

**1. 데이터 기반 별자리**
별자리는 코드가 아니라 데이터(`ConstellationData`)로 정의합니다. 노드의 좌표와 연결 경로(`paths`)만 추가하면 새로운 달을 만들 수 있습니다.

**2. 하나의 그래프 컴포넌트, 두 가지 용도**
`ConstellationGraph`는 `interactive` prop으로 클릭이 가능한 그래프와 이벤트가 없는 장식용 그래프를 모두 처리합니다. 같은 데이터를 한 화면에 두 방식으로 동시에 렌더링할 수도 있습니다.

**3. 셰이더 uniform으로 만든 배경 밝기 전환**
라우트가 바뀌면 `uIntensity` uniform 값을 lerp로 보간해, 배경이 끊기지 않고 서서히 어두워집니다. 배경 컴포넌트는 라우트 레이아웃에 두어 페이지 이동 중에도 언마운트되지 않습니다.

**4. 스크롤 연동 카메라**
스크롤 진행도를 부드럽게 따라가는 카메라와 마우스 시차(parallax)로 깊이감을 줍니다.

<!-- TODO: 감정 종류와 색상 규칙, 기록 저장 방식 등을 추가하세요 -->

## 🧪 개발 참고

타입 인식 ESLint 규칙을 쓰려면 `eslint.config.js`를 다음과 같이 설정할 수 있습니다.

```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

`tseslint.configs.recommended`를 `recommendedTypeChecked` 또는 `strictTypeChecked`로 바꾸면 더 엄격한 검사를 할 수 있습니다.
