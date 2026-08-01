
# Flag Royale - 1080x1920 Battle Royale

## 로컬 실행
```bash
npm install
npm run dev
# http://localhost:5173
```

## 빌드
```bash
npm run build
npm run preview
```

## 특징
- 195개국 전체
- 시작 전 완전 밀폐, START 후 구멍 오픈
- 중력 제거, 완전 탄성 물리
- 1080x1920 방송 최적화 레이아웃
- TTS: 우승자 "{Country} won!" 음성 (Web Speech API)
- 토스트 + 티커 + 하단 정보판

## OBS 설정
1. 브라우저 소스 -> 로컬 파일 index.html 또는 http://localhost:5173
2. 너비 1080 높이 1920
3. 1920px 아래 컨트롤 영역은 크롭해서 제외

## TTS
- Chrome/Edge에서 가장 자연스러움
- START 버튼 클릭 후 활성화 (브라우저 정책)
- 설정에서 ON/OFF, 볼륨 조절
