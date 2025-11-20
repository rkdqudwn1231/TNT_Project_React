// src/pages/PersonalColor/ColorResult.jsx

import { useLocation } from "react-router-dom";
import { colorPalettes } from "./palettes";   

// =================== 연예인 데이터 ===================
const celebrityMap = {
  spring: [
    { name: "아이유", img: "/images/celebrity/아이유.png", desc: "맑고 밝은 라이트 스프링 대표 톤" },
    { name: "태연", img: "/images/celebrity/태연.png", desc: "중명도의 따뜻한 봄톤" },
    { name: "박보검", img: "/images/celebrity/박보검.png", desc: "부드럽고 깨끗한 봄 라이트톤" },
    { name: "차은우", img: "/images/celebrity/차은우.png", desc: "맑고 선명한 봄 브라이트톤" }
  ],

  summer: [
    { name: "수지", img: "/images/celebrity/수지.png", desc: "부드럽고 차분한 여름 라이트톤" },
    { name: "이영애", img: "/images/celebrity/이영애.png", desc: "청초하고 투명한 쿨톤 대표" },

    { name: "정해인", img: "/images/celebrity/정해인.png", desc: "맑고 깨끗한 여름 라이트톤" },
    { name: "뷔", img: "/images/celebrity/뷔.png", desc: "시원하고 부드러운 여름 쿨톤" }
  ],
  autumn: [
    { name: "제니", img: "/images/celebrity/제니.png", desc: "고급스럽고 딥한 가을톤" },
    { name: "한지민", img: "/images/celebrity/한지민.png", desc: "부드럽고 따뜻한 뮤트톤" },

    { name: "공유", img: "/images/celebrity/공유.png", desc: "따뜻하고 차분한 가을 소프트톤" },
    { name: "남주혁", img: "/images/celebrity/남주혁.png", desc: "깊고 안정적인 가을 딥톤" }
  ],
  winter: [
    { name: "송혜교", img: "/images/celebrity/송혜교.png", desc: "선명하고 대비 강한 겨울 딥톤" },
    { name: "윤아", img: "/images/celebrity/윤아.png", desc: "깨끗하고 투명한 아이시 쿨톤" },

    { name: "현빈", img: "/images/celebrity/현빈.png", desc: "차갑고 강렬한 겨울 딥톤" },
    { name: "정우성", img: "/images/celebrity/정우성.png", desc: "선명한 대비의 겨울 브라이트톤" }
  ]
};

// =================== 설명 데이터 ===================
const toneDescriptions = {
  "Bright Spring": {
    title: "화사하고 생동감 넘치는 Bright Spring",
    desc: [
      "맑고 비비드한 색이 얼굴을 가장 밝게 해주는 톤입니다.",
      "피부가 깨끗하고 혈색이 잘 도는 인상이 강합니다.",
      "탁하거나 회색 기운이 많은 색은 얼굴이 칙칙해 보일 수 있습니다."
    ],
    style: [
      "비비드 코랄, 라임, 민트, 선명한 옐로우 계열 추천",
      "아이 메이크업은 골드·샴페인 계열이 잘 어울립니다.",
      "상의는 크림화이트, 라이트 베이지, 파스텔톤 추천"
    ]
  },
  "Light Spring": {
    title: "부드럽고 화사한 Light Spring",
    desc: [
      "밝고 연한 파스텔 계열이 잘 어울립니다.",
      "강한 색보다 부드러운 색이 얼굴과 조화롭습니다.",
      "짙은 컬러는 얼굴을 눌러 보이게 할 수 있습니다."
    ],
    style: [
      "살구, 라이트 코랄, 피치 핑크 추천",
      "립은 맑은 핑크·코랄, 아이는 밝은 브라운 계열",
      "화이트보다는 크림 아이보리 계열이 더 자연스럽습니다."
    ]
  },
  "Warm Autumn": {
    title: "따뜻하고 깊이 있는 Warm Autumn",
    desc: [
      "가을 단풍처럼 따뜻하고 풍부한 색감이 잘 어울립니다.",
      "노랑·주황·브라운 계열이 전체적인 분위기를 살려줍니다.",
      "차가운 쿨톤 색은 얼굴이 붉거나 칙칙해 보일 수 있습니다."
    ],
    style: [
      "머스타드, 테라코타, 카멜, 카키 추천",
      "립은 브릭, 오렌지 브라운 계열이 잘 어울립니다.",
      "골드 액세서리가 분위기를 더 살려줍니다."
    ]
  },
  "Soft Autumn": {
    title: "부드럽고 차분한 Soft Autumn",
    desc: [
      "채도가 낮고 부드러운 색이 가장 잘 어울리는 톤입니다.",
      "전체적으로 잔잔하고 편안한 인상을 줍니다.",
      "너무 선명한 색은 얼굴만 둥둥 떠 보일 수 있습니다."
    ],
    style: [
      "더스티 로즈, 올리브, 모카, 웜 그레이 추천",
      "매트한 피부 표현 + 브라운 섀도우가 잘 어울립니다.",
      "코트나 자켓은 베이지·모카 계열이 무난하게 잘 맞습니다."
    ]
  },
  "Deep Autumn": {
    title: "무게감 있고 고급스러운 Deep Autumn",
    desc: [
      "짙고 깊은 컬러가 얼굴과 잘 어울리는 톤입니다.",
      "눈·머리·피부 대비가 비교적 뚜렷한 편입니다.",
      "연하고 흐릿한 색은 피곤해 보일 수 있습니다."
    ],
    style: [
      "딥 브라운, 버건디, 카키, 진한 카멜 추천",
      "스모키 메이크업, 버건디 립도 소화 가능합니다.",
      "블랙보다는 다크 브라운/다크 올리브 계열이 자연스럽습니다."
    ]
  },
  "Light Summer": {
    title: "맑고 부드러운 Light Summer",
    desc: [
      "여름 안개처럼 은은하고 맑은 색이 어울립니다.",
      "피부가 비교적 밝고, 쿨톤 기운이 느껴지는 톤입니다.",
      "진한 색이나 너무 노란 색은 둔탁해 보일 수 있습니다."
    ],
    style: [
      "라일락, 라이트 블루, 시폰 핑크 추천",
      "립은 쿨 핑크·로즈, 아이는 그레이 브라운 계열",
      "실버·화이트골드 액세서리가 잘 어울립니다."
    ]
  },
  "Soft Summer": {
    title: "안정적이고 차분한 Soft Summer",
    desc: [
      "탁하고 부드러운 톤이 잘 어울립니다.",
      "선명한 색보다 그레이가 섞인 컬러가 조화롭습니다.",
      "강한 대비는 인상을 너무 날카롭게 만들 수 있습니다."
    ],
    style: [
      "더스티 핑크, 스틸 블루, 라벤더 그레이 추천",
      "메이크업은 로즈·몰드 와인 계열을 은은하게 사용",
      "패턴보다는 심플한 디자인이 잘 어울립니다."
    ]
  },
  "Cool Summer": {
    title: "맑고 차분한 Cool Summer",
    desc: [
      "푸른 기운이 도는 쿨톤 색이 잘 어울립니다.",
      "피부가 붉거나 노란 기가 많지 않은 편입니다.",
      "노란 기가 강한 색은 피부 톤을 불균형하게 보이게 할 수 있습니다."
    ],
    style: [
      "쿨 핑크, 로즈, 블루, 라벤더 추천",
      "립은 로즈·베리 계열, 아이섀도는 쿨 브라운·그레이",
      "실버/화이트골드 주얼리와 궁합이 좋습니다."
    ]
  },
  "Bright Winter": {
    title: "선명하고 화려한 Bright Winter",
    desc: [
      "고채도의 선명한 색이 얼굴을 또렷하게 보이게 합니다.",
      "피부 대비가 강하고 존재감 있는 톤입니다.",
      "애매한 파스텔톤은 얼굴이 떠 보일 수 있습니다."
    ],
    style: [
      "비비드 블루, 마젠타, 푸시아 핑크, 아이시 컬러 추천",
      "또렷한 아이라인, 선명한 립 컬러도 잘 어울립니다.",
      "흰색은 아이보리보다 퓨어 화이트가 더 잘 맞습니다."
    ]
  },
  "Deep Winter": {
    title: "강렬하고 카리스마 있는 Deep Winter",
    desc: [
      "대비가 강하고 진한 색이 잘 어울립니다.",
      "눈·머리카락이 짙고 선명한 편입니다.",
      "연한 색만 쓰면 힘이 빠져 보일 수 있습니다."
    ],
    style: [
      "블랙, 딥 네이비, 와인, 딥 퍼플 추천",
      "레드 립, 딥 버건디 립도 잘 어울리는 타입입니다.",
      "올블랙 룩도 부담 없이 소화할 수 있습니다."
    ]
  },
  "Cool Winter": {
    title: "차갑고 선명한 Cool Winter",
    desc: [
      "청량한 푸른 기의 쿨톤 컬러가 잘 어울립니다.",
      "선명하고 또렷한 대비가 인상을 살아나게 합니다.",
      "노란 기가 강한 웜톤 컬러는 다소 둔탁해 보일 수 있습니다."
    ],
    style: [
      "쿨 레드, 푸시아, 로열 블루 추천",
      "립은 푸시아·쿨 레드, 아이섀도는 그레이·차콜",
      "실버 주얼리, 아이시 톤과 특히 잘 어울립니다."
    ]
  }
};

// =================== UI 컴포넌트 ===================
function ExplanationBox({ season }) {
  const info = toneDescriptions[season];
  if (!info) return null;

  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#fff5f7",
        border: "1px solid #ffc2ce"
      }}
    >
      <h3>{info.title}</h3>
      <ul>{info.desc.map((t, i) => <li key={i}>{t}</li>)}</ul>
      <strong>스타일 TIP</strong>
      <ul>{info.style.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  );
}

function ColorPalette({ title, colors }) {
  return (
    <div style={{ marginTop: 16 }}>
      <strong>{title}</strong>
      <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
        {colors.map((c, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: c,
              border: "1px solid #ccc"
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CelebritySection({ season }) {
  const list = celebrityMap[season];
  if (!list) return null;

  return (
    <div style={{ marginTop: 40 }}>
      <h3 style={{ marginBottom: 16, fontSize: 22 }}>당신과 비슷한 톤의 연예인</h3>

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "flex-start"
        }}
      >
        {list.map((celeb, i) => (
          <div
            key={i}
            style={{
              width: 160,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: 12,
              textAlign: "center"
            }}
          >
            <img
              src={celeb.img}
              alt={celeb.name}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 10
              }}
            />

            {/* 연예인 이름 */}
            <div style={{ marginTop: 10, fontWeight: "bold", fontSize: 15 }}>
              {celeb.name}
            </div>

            {/* 연예인 퍼스널컬러 설명 */}
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "#666",
                lineHeight: "1.4"
              }}
            >
              {celeb.desc}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// =================== 최종 결과 페이지 ===================
function ColorResult() {
  const query = new URLSearchParams(useLocation().search);
  const season = query.get("season");

  if (!season) return <h2>결과가 없습니다.</h2>;

  const baseSeason =
    season.includes("Spring") ? "spring" :
    season.includes("Summer") ? "summer" :
    season.includes("Autumn") ? "autumn" :
    "winter";

  return (
    <div style={{ padding: 30 }}>
      <h2>당신의 퍼스널 컬러: {season}</h2>

      <ExplanationBox season={season} />

      <ColorPalette
        title="어울리는 색상 (BEST)"
        colors={colorPalettes[baseSeason].best}
      />

      <ColorPalette
        title="피해야 하는 색상 (WORST)"
        colors={colorPalettes[baseSeason].worst}
      />

      <CelebritySection season={baseSeason} />

      <div style={{ marginTop: 40 }}>
        <a href="/color">다시 분석하기</a>
      </div>
    </div>
  );
}

export default ColorResult;
