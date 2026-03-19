/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "차현준",
    nameEn: "ChaHyunJune",
    father: "차달오",
    mother: "임영임",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "오은애",
    nameEn: "OhEunAe",
    father: "오장록",
    mother: "김경순",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-09-19",
    time: "12:40",
    venue: "영등포 위더스",
    hall: "7층 펠리체홀",
    address: "서울특별시 영등포구 영중로 55",
    tel: "0507-1384-3006",
    // --- 카카오 지도 설정 (API 키와 좌표 입력) ---
    kakaoMapKey: "ac206ca8d340a8d7c9b47d2266fc9d27", // 카카오 개발자 센터에서 발급받은 JavaScript 키
    lat: 37.5214, // 위도 (영등포 위더스)
    lng: 126.9054, // 경도 (영등포 위더스)
    // ------------------------------------------
    route:"",
    transport: {
      subway: "5호선 영등포시장역 4번 출구 (도보 1분 거리)\n1호선 영등포역 6번 출구 (도보 10분 거리)",
      bus: "영등포시장역 4번 출구 정류장 하차\n간선: 605, 661, 760, 761\n지선: 5616, 5714, 6514",
      car: "웨딩홀 내 지하 주차장 이용\n만차 시 영남 주차장 이용(셔틀버스 운행)"
    },
    mapLinks: {
      kakao: "https://kko.to/TjtLz5RgBK",
      naver: "https://naver.me/Gqs4koNB"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "서로 다른 길을 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해 주시면 감사하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑"  , name: "차현준", bank: "국민은행", number: "000-000-000000" },
      { role: "아버지", name: "차달오", bank: "신한은행", number: "000-000-000000" },
      { role: "어머니", name: "임영임", bank: "우리은행", number: "000-000-000000" }
    ],
    bride: [
      { role: "신부"  , name: "오은애", bank: "하나은행", number: "000-000-000000" },
      { role: "아버지", name: "오장록", bank: "기업은행", number: "000-000-000000" },
      { role: "어머니", name: "김경순", bank: "농협은행", number: "000-000-000000" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "차현준 ♥ 오은애 결혼합니다",
    description: "2026년 9월 19일, 소중한 분들을 초대합니다."
  }
};
