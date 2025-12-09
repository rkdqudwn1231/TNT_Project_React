import { useState, useRef } from "react";
import { colorPalettes } from "./palettes";
import { caxios } from "../../config/config";
import ShareButton from "./ShareButton";
import ColorModal from "./modal/ColorModal";
import {jwtDecode} from "jwt-decode";
import styles from "./PersonalColor.module.css";



//모바일 감지 
const useIsMobile = () => window.innerWidth < 768;

// =================== 연예인 데이터 ===================
const celebrityMap = {
  spring: {
    male: [
      { name: "박보검", img: "/images/celebrity/박보검.png", desc: "부드럽고 깨끗한 봄 라이트톤" },
      { name: "차은우", img: "/images/celebrity/차은우.png", desc: "맑고 선명한 봄 브라이트톤" },
      { name: "유승호", img: "/images/celebrity/유승호.png", desc: "순하고 맑은 봄 라이트톤" },   // 추가
      { name: "지수", img: "/images/celebrity/지수.png", desc: "부드럽고 따뜻한 봄 웜톤" }     // 추가
    ],
    female: [
      { name: "아이유", img: "/images/celebrity/아이유.png", desc: "맑고 밝은 라이트 스프링 대표 톤" },
      { name: "태연", img: "/images/celebrity/태연.png", desc: "중명도의 따뜻한 봄톤" },
      { name: "김유정", img: "/images/celebrity/김유정.png", desc: "상큼하고 화사한 봄 라이트톤" },   // 추가
      { name: "박민영", img: "/images/celebrity/박민영.png", desc: "맑고 깨끗한 브라이트 스프링" }    // 추가
    ]
  },

  summer: {
    male: [
      { name: "정해인", img: "/images/celebrity/정해인.png", desc: "맑고 깨끗한 여름 라이트톤" },
      { name: "뷔", img: "/images/celebrity/뷔.png", desc: "시원하고 부드러운 여름 쿨톤" },
      { name: "이도현", img: "/images/celebrity/이도현.png", desc: "부드럽고 차분한 서머 소프트톤" }, // 추가
      { name: "서강준", img: "/images/celebrity/서강준.png", desc: "맑고 청량한 여름 쿨톤" }        // 추가
    ],
    female: [
      { name: "수지", img: "/images/celebrity/수지.png", desc: "부드럽고 차분한 여름 라이트톤" },
      { name: "이영애", img: "/images/celebrity/이영애.png", desc: "청초하고 투명한 쿨톤 대표" },
      { name: "정은지", img: "/images/celebrity/정은지.png", desc: "부드럽고 안정적인 서머 뮤트톤" },  // 추가
      { name: "신세경", img: "/images/celebrity/신세경.png", desc: "차분하고 맑은 여름 쿨톤" }        // 추가
    ]
  },

  autumn: {
    male: [
      { name: "공유", img: "/images/celebrity/공유.png", desc: "따뜻하고 차분한 가을 소프트톤" },
      { name: "남주혁", img: "/images/celebrity/남주혁.png", desc: "깊고 안정적인 가을 딥톤" },
      { name: "하정우", img: "/images/celebrity/하정우.png", desc: "묵직하고 따뜻한 가을 딥톤" },        // 추가
      { name: "마동석", img: "/images/celebrity/마동석.png", desc: "강한 대비의 가을 브라운톤" }        // 추가
    ],
    female: [
      { name: "제니", img: "/images/celebrity/제니.png", desc: "고급스럽고 딥한 가을톤" },
      { name: "한지민", img: "/images/celebrity/한지민.png", desc: "부드럽고 따뜻한 뮤트톤" },
      { name: "고윤정", img: "/images/celebrity/고윤정.png", desc: "부드럽고 따뜻한 가을 소프트톤" },  // 추가
      { name: "전지현", img: "/images/celebrity/전지현.png", desc: "선명하고 깊은 딥 오텀" }          // 추가
    ]
  },

  winter: {
    male: [
      { name: "현빈", img: "/images/celebrity/현빈.png", desc: "차갑고 강렬한 겨울 딥톤" },
      { name: "정우성", img: "/images/celebrity/정우성.png", desc: "선명한 대비의 겨울 브라이트톤" },
      { name: "강동원", img: "/images/celebrity/강동원.png", desc: "선명하고 차가운 겨울 브라이트톤" }, // 추가
      { name: "이정재", img: "/images/celebrity/이정재.png", desc: "고급스러운 겨울 딥톤" }           // 추가
    ],
    female: [
      { name: "송혜교", img: "/images/celebrity/송혜교.png", desc: "선명하고 대비 강한 겨울 딥톤" },
      { name: "윤아", img: "/images/celebrity/윤아.png", desc: "깨끗하고 투명한 아이시 쿨톤" },
      { name: "크리스탈", img: "/images/celebrity/크리스탈.png", desc: "차갑고 선명한 브라이트 윈터" }, // 추가
      { name: "아이린", img: "/images/celebrity/아이린.png", desc: "맑고 차가운 겨울 쿨톤" }           // 추가
    ]
  }
};




// =================== 12톤 설명 데이터 ===================
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
      "상의는 크림화이트, 라이트 베이지, 파스텔톤 추천",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
    ]
  },
  "Light Spring": {
    title: "부드럽고 화사한 Light Spring",
    desc: [
      "밝고 연한 파스텔 계열이 잘 어울립니다.",
      "강한 색보다 부드러운 색이 얼굴과 조화롭습니다.",
      "짙은 컬러는 얼굴을 눌러 보이게 할 수 있습니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
    ],
    style: [
      "살구, 라이트 코랄, 피치 핑크 추천",
      "립은 맑은 핑크·코랄, 아이는 밝은 브라운 계열",
      "화이트보다는 크림 아이보리 계열이 더 자연스럽습니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
    ]
  },
  "Warm Autumn": {
    title: "따뜻하고 깊이 있는 Warm Autumn",
    desc: [
      "가을 단풍처럼 따뜻하고 풍부한 색감이 잘 어울립니다.",
      "노랑·주황·브라운 계열이 전체적인 분위기를 살려줍니다.",
      "차가운 쿨톤 색은 얼굴이 붉거나 칙칙해 보일 수 있습니다.",
      
    ],
    style: [
      "머스타드, 테라코타, 카멜, 카키 추천",
      "립은 브릭, 오렌지 브라운 계열이 잘 어울립니다.",
      "골드 액세서리가 분위기를 더 살려줍니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
    ]
  },
  "Soft Autumn": {
    title: "부드럽고 차분한 Soft Autumn",
    desc: [
      "채도가 낮고 부드러운 색이 가장 잘 어울리는 톤입니다.",
      "전체적으로 잔잔하고 편안한 인상을 줍니다.",
      "너무 선명한 색은 얼굴만 둥둥 떠 보일 수 있습니다.",
      
    ],
    style: [
      "더스티 로즈, 올리브, 모카, 웜 그레이 추천",
      "매트한 피부 표현 + 브라운 섀도우가 잘 어울립니다.",
      "코트나 자켓은 베이지·모카 계열이 무난하게 잘 맞습니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
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
      "블랙보다는 다크 브라운/다크 올리브 계열이 자연스럽습니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
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
      "실버·화이트골드 액세서리가 잘 어울립니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
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
      "패턴보다는 심플한 디자인이 잘 어울립니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
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
      "실버/화이트골드 주얼리와 궁합이 좋습니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
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
      "흰색은 아이보리보다 퓨어 화이트가 더 잘 맞습니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
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
      "올블랙 룩도 부담 없이 소화할 수 있습니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
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
      "실버 주얼리, 아이시 톤과 특히 잘 어울립니다.",
      "퍼스널컬러 스타일링을 사용하시려면 챗봇을 사용해보세요!"
    ]
  }
};


function rgbToHex(rgbString) {
  const rgb = rgbString.match(/\d+/g);
  if (!rgb) return null;

  const hex = rgb
    .map((v) => {
      const h = parseInt(v).toString(16);
      return h.length === 1 ? "0" + h : h;
    })
    .join("");

  return "#" + hex.toUpperCase();
}

// =================== 연예인 카드 UI ===================
function CelebrityCard({ celeb }) {
  return (
    <div
      style={{
        width: 160,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}
    >
    <img
  src={celeb.img}
  alt={celeb.name}
  style={{
    width: "100%",
    aspectRatio: "3 / 4",
    objectFit: "cover",
    borderRadius: "14px",
    imageRendering: "high-quality"
  }}
/>
      <div style={{ padding: 12 }}>
        <strong style={{ fontSize: 16 }}>{celeb.name}</strong>
        <p style={{ marginTop: 6, fontSize: 13, color: "#555" }}>{celeb.desc}</p>
      </div>
    </div>
  );
}
function CelebritySection({ season }) {
  const list = celebrityMap[season];
  if (!list) return null;

  const isMobile = window.innerWidth < 768;

 return (
  <div style={{ marginTop: 25, width: "100%" }}>
    {/* 여자 연예인 */}
    <h3 style={{ marginBottom: 12, textAlign: isMobile ? "center" : "left" }}>
      비슷한 톤의 여자 연예인
    </h3>
    <div
      style={{
        display: "flex",
        gap: 20,
        flexWrap: isMobile ? "wrap" : "nowrap",
        justifyContent: isMobile ? "center" : "flex-start",
      }}
    >
      {list.female?.map((celeb, i) => (
        <CelebrityCard key={i} celeb={celeb} />
      ))}
    </div>

    {/* 남자 연예인 */}
    <h3 style={{ marginTop: 30, marginBottom: 12, textAlign: isMobile ? "center" : "left" }}>
      비슷한 톤의 남자 연예인
    </h3>
    <div
      style={{
        display: "flex",
        gap: 20,
        flexWrap: isMobile ? "wrap" : "nowrap",
        justifyContent: isMobile ? "center" : "flex-start",
      }}
    >
      {list.male?.map((celeb, i) => (
        <CelebrityCard key={i} celeb={celeb} />
      ))}
    </div>
  </div>
);
  }

// =================== 설명 박스 UI ===================
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
        border: "1px solid #ffc2ce",
        lineHeight: 1.7
      }}
    >
      <h3 style={{ marginBottom: 10 }}>{info.title}</h3>

      <ul style={{ paddingLeft: 18, marginBottom: 8 }}>
        {info.desc.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>

      <strong style={{ display: "block", marginTop: 10 }}>스타일 TIP</strong>
      <ul style={{ paddingLeft: 18 }}>
        {info.style.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

// =================== 색상 계산 함수들 ===================
function getHue([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return h;
}

function getToneAdvanced(rgb) {
  const h = getHue(rgb);
  if (h >= 20 && h <= 85) return "warm";
  if (h >= 180 && h <= 300) return "cool";
  return "neutral";
}

function getLightness([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// =================== ⭐ 12톤 퍼스널컬러 계산 ===================
function detect12Tone(skinRGB, hairRGB, eyeRGB) {
  const tone = getToneAdvanced(skinRGB);
  const lightness = getLightness(skinRGB);

  const [r, g, b] = skinRGB;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : ((max - min) / max) * 100;

  const isBright = lightness > 160;
  const isDark = lightness < 100;
  const isHighSat = saturation > 40;
  const isLowSat = saturation < 20;

  // WARM
  if (tone === "warm") {
    if (isBright) return isHighSat ? "Bright Spring" : "Light Spring";
    if (isLowSat) return "Soft Autumn";
    if (isDark) return "Deep Autumn";
    return "Warm Autumn";
  }

  // COOL
  if (tone === "cool") {
    if (isBright) return "Light Summer";
    if (isLowSat) return "Soft Summer";
    return "Cool Summer";
  }

  // NEUTRAL → 겨울 보정
  if (isHighSat && isBright) return "Bright Winter";
  if (isDark) return "Deep Winter";
  return "Cool Winter";
}

// detectPersonalColor → 12톤 사용
function detectPersonalColor(skinRGB, hairRGB, eyeRGB) {
  return detect12Tone(skinRGB, hairRGB, eyeRGB);
}

// =================== 기타 유틸 ===================
function parseRgb(rgbString) {
  const matches = rgbString?.match(/\d+/g);
  return matches ? matches.map(Number) : null;
}



// =================== 이미지 업로드 박스 ===================
function FileUploadBox({ onChange }) {
  return (
    
    <div
      style={{
        width: 400,
        height: 400,
        border: "2px dashed #ccc",
        flexShrink: 0,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: "#fdfdfd",
        padding: 20,
        textAlign: "center",
        transition: "0.2s"
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm("과한 뽀샵이나 흐릿한 사진은 정확도가 떨어질 수 있어요!\n선명한 얼굴 사진을 올려주시면 더 정확하게 분석해드릴게요!")) {
          document.getElementById("uploadInput").click();
        }
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f7f7f7")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fdfdfd")}
    >

    
      <div
  style={{
    width: 300,
    height: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 20,
    overflow: "hidden",
    pointerEvents: "none"
  }}
>
  <img
    src="/images/about/실루엣.png"   
    alt="profile"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -80%)",
          fontSize: 60,
          color: "black",
          fontWeight: "bold",
          opacity: 0.8
        }}
      >
        +
      </div>

        
      </div>



    </div>
  );
}

// =================== 메인 컴포넌트 ===================
function PersonalColor() {
   // 로그인된 사용자 ID 가져오기
  const getUserId = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.sub;   // JWT의 subject = userId
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    }
    // 혹시 이상하면 fallback
    return sessionStorage.getItem("id");
  };

  const userId = getUserId();
  console.log("Final UserId:", userId);

  const isMobile = useIsMobile();

  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("Skin");
  const [skin, setSkin] = useState(null);
  const [hair, setHair] = useState(null);
  const [eye, setEye] = useState(null);
  const [hoverColor, setHoverColor] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1); // 이미지 확대 비율

  const [season, setSeason] = useState(null); // Bright Spring 등 12톤 이름
  const [tone, setTone] = useState(null); // warm / cool

  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const[showHelp,setShowHelp]=useState(false);
  const handleColorClick = (color) => {
  setSelectedColor(color);
  setShowModal(true);
};

  const imgRef = useRef(null);
  const canvasRef = useRef(null);


  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageSrc(URL.createObjectURL(file));
    setSkin(null);
    setHair(null);
    setEye(null);
    setHoverColor(null);
  };

  



  const handleAnalyze = () => {
    if (!skin || !hair || !eye) {
      alert("색을 모두 선택해주세요!");
      return;
    }

  setLoading(true);
  setTimeout(() => {
    const skinRGB = parseRgb(skin);
    const hairRGB = parseRgb(hair);
    const eyeRGB = parseRgb(eye);

    if (!skinRGB || !hairRGB || !eyeRGB) {
      alert("색 불러오기 실패 ㅠㅠ");
      setLoading(false);
      return;
    }

    const result = detectPersonalColor(skinRGB, hairRGB, eyeRGB);
    setSeason(result);

    const toneType =
      result.includes("Spring") || result.includes("Autumn") ? "warm" : "cool";
    setTone(toneType);

    const baseSeason = result.includes("Spring")
      ? "spring"
      : result.includes("Summer")
      ? "summer"
      : result.includes("Autumn")
      ? "autumn"
      : "winter";

    caxios.post("/color", {
      member_id: userId,
      season: result,
      tone_type: toneType,
      best_color: colorPalettes[baseSeason].best.join(","),
      worst_color: colorPalettes[baseSeason].worst.join(",")
    });
    setLoading(false); 
  }, 1200); 
};

 const getPixelColor = (e) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const img = imgRef.current;
  if (!img) return null;

  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;

  const rect = img.getBoundingClientRect();
  const boxW = rect.width;
  const boxH = rect.height;



  const imgRatio = naturalW / naturalH;
  const boxRatio = boxW / boxH;

  // 실제 화면에 렌더링된 이미지 크기 (scale 적용됨)
  let renderW, renderH;

  if (imgRatio > boxRatio) {
    renderW = boxW * scale;
    renderH = (boxW / imgRatio) * scale;
  } else {
    renderH = boxH * scale;
    renderW = (boxH * imgRatio) * scale;
  }

  // 이미지가 중앙 정렬되므로 여백(오프셋) 계산
  const offsetX = (boxW - renderW) / 2;
  const offsetY = (boxH - renderH) / 2;

  // 마우스 위치 변환
  const mouseX = e.clientX - rect.left - offsetX;
  const mouseY = e.clientY - rect.top - offsetY;

  // 이미지 영역 밖이면 무시
  if (mouseX < 0 || mouseY < 0 || mouseX > renderW || mouseY > renderH) {
    return null;
  }

  // 원본 비율로 변환
  const imgX = (mouseX / renderW) * naturalW;
  const imgY = (mouseY / renderH) * naturalH;

  // 픽셀 추출
  canvas.width = naturalW;
  canvas.height = naturalH;
  ctx.drawImage(img, 0, 0);

  const pixel = ctx.getImageData(imgX, imgY, 1, 1).data;

  return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
};

  const handleMouseMove = (e) => {
    if (!imageSrc) return;
    setCursorPos({ x: e.clientX, y: e.clientY });
    setHoverColor(getPixelColor(e));
  };

  const handleImageClick = (e) => {
    const color = getPixelColor(e);
    if (mode === "Skin") setSkin(color);
    if (mode === "Hair") setHair(color);
    if (mode === "Eye") setEye(color);
  };

  const handleSaveColor = () => {
  caxios.put("color/update", {
    member_id: userId,
    season: season 
  })
  .then(() => {
    alert("내 정보에 저장되었습니다!");
  })
  .catch(() => {
    alert("저장 중 오류가 발생했습니다.");
  });
};



  

  const baseSeasonForUI =
    season && season.includes("Spring")
      ? "spring"
      : season && season.includes("Summer")
      ? "summer"
      : season && season.includes("Autumn")
      ? "autumn"
      : season
      ? "winter"
      : null;

   return (
    <>
      {/* 숨겨진 파일 input (이걸 FileUploadBox에서 클릭) */}
      <input
        id="uploadInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className={styles.container}>
        {/* ========== 왼쪽: 이미지 영역 ========== */}
       <div style={{ flexShrink: 0 }}>
          {!imageSrc && <FileUploadBox />}

          {imageSrc && (
          <div className={styles.imgBox}>
  <img
  ref={imgRef}
  src={imageSrc}
  alt="uploaded face"
  onMouseMove={handleMouseMove}
  onClick={handleImageClick}
  onMouseLeave={() => setHoverColor(null)}
  className={styles.image}
  style={{
    transform: `translate(-50%, -50%) scale(${scale})`,
  }}
/>


              {hoverColor && (
                <div
                  style={{
                    position: "fixed",
                    top: cursorPos.y - 5,
                    left: cursorPos.x - 5,
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    border: "2px solid white",
                    backgroundColor: hoverColor,
                    pointerEvents: "none",
                  }}
                />
              )}

              {loading && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "350px",
                    height: "100%",
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  AI가 당신의 톤을 분석 중입니다…
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}
        </div>

        {/* ========== 오른쪽: 분석 영역 ========== */}
       <div style={{ width: isMobile ? "100%" : 480 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setMode("Skin")} 
            style={tabButtonStyle(mode === "Skin")}>
            Skin
            </button>

            <button onClick={() => setMode("Hair")} 
            style={tabButtonStyle(mode === "Hair")}>
            Hair
            </button>


            <button onClick={() => setMode("Eye")} 
            style={tabButtonStyle(mode === "Eye")}>
            Eye
            </button>


            
          </div>


          <div style={{ marginBottom: 20 }}>
  <button
    onClick={() => setShowHelp((prev) => !prev)}
    style={{
      padding: "8px 14px",
      borderRadius: 14,
      border: "1px solid #ccc",
      background: "#fff",
      fontSize: 13,
      cursor: "pointer"
    }}
  >
    색 선택 안내
  </button>

  {showHelp && (
    <div
      style={{
        marginTop: 10,
        padding: "12px 16px",
        background: "#f7f7ff",
        border: "1px solid #dcdcff",
        borderRadius: 10,
        lineHeight: 1.6
      }}
    >
      얼굴 사진에서 <strong>피부(Skin) · 머리(Hair) · 눈(Eye)</strong>에 해당하는 색을 클릭해보세요!  
      <br />
      선택된 색을 기반으로 <strong>AI가 12톤 퍼스널컬러 결과</strong>를 분석해드립니다
    </div>
  )}
</div>

          {imageSrc && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  paddingBottom: 20,
                  borderBottom: "1px solid #eee",
                  marginBottom: 20,
                }}
              >
                <ColorBox label="Skin" color={skin} />
                <ColorBox label="Hair" color={hair} />
                <ColorBox label="Eye" color={eye} />

                <button
                  onClick={handleAnalyze}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    border: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #ff7096, #ff4d6d)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255,109,132,0.4)",
                  }}
                >
                  퍼스널 컬러 분석하기
                </button>

                {tone && (
                  <div style={{ lineHeight: 1.8 }}>
                    <strong>당신은 </strong>
                    {tone === "warm" ? "웜톤" : "쿨톤"}입니다.
                  </div>
                )}

                {season && (
                  <div style={{ lineHeight: 1.8 }}>
                    <strong>당신의 퍼스널 컬러: </strong>
                    {season}
                  </div>
                )}
                


                {season && (
                 <div style={{ marginTop: 20 }}>
                <ShareButton season={season} />
                </div>
                  )}

                  {season && userId && (
  <button
    onClick={handleSaveColor}
    style={{
      padding: "10px 18px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      background: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
      color: "white",
      fontWeight: "bold",
      fontSize: 15,
      marginTop: 10
    }}
  >
    내 정보에 퍼스널 컬러 저장하기
  </button>
)}


{season && !userId && (
  <p style={{ marginTop: 10, color: "#888" }}>
    로그인하면 내 정보에 저장할 수 있어요 😊
  </p>
)}


              </div>

             <div className={styles.resultBox}>
                {season && <ExplanationBox season={season} />}

                {baseSeasonForUI && (
                  <>
                    <ColorPalette
                      title="어울리는 색상 (BEST)"
                      colors={colorPalettes[baseSeasonForUI].best}
                      handleColorClick={handleColorClick}
                    />

                    <ColorPalette
                      title="피해야 하는 색상 (WORST)"
                      colors={colorPalettes[baseSeasonForUI].worst}
                      handleColorClick={handleColorClick}
                    />

                    <CelebritySection season={baseSeasonForUI} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
  <ColorModal
      show={showModal}
      onHide={() => setShowModal(false)}
      color={selectedColor}
    />

    </>
  );
}

// =================== UI 컴포넌트 ===================
function ColorBox({ label, color }) {

  const hex=color ? rgbToHex(color) : null;
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 8,
          backgroundColor: color || "#e0e0e0",
          border: "1px solid #aaa"
        }}
      />
       <div style={{ display: "flex", flexDirection: "column" }}>
        <strong>{label}</strong>
        
        {color && (
          <>
            <span style={{ fontSize: 13, }}>{color}</span>
            <span style={{ fontSize: 13 }}>{hex}</span>
          </>
        )}
      </div>
    </div>
  );
}

function ColorPalette({ title, colors,handleColorClick }) {
  return (
    <div style={{ marginTop: 10 }}>
      <strong>{title}</strong>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 8,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        {colors.map((c, i) => (
          
          <div
            key={i}
            onClick={()=>handleColorClick(c)}
            style={{
              width: 40,
              height: 40,
              backgroundColor: c,
              borderRadius: 6,
              border: "1px solid #ddd"
            }}
          />
        ))}
      </div>

    </div>

    
  );
}

const tabButtonStyle = (active) => ({
  padding: "10px 18px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  transition: "0.25s",
  background: active
    ? "linear-gradient(135deg, #ff8fa3, #ff6f91)"  // 선택됨
    : "#f2f2f2",                                   // 기본
  color: active ? "white" : "#555",
  boxShadow: active
    ? "0 4px 10px rgba(255, 111, 145, 0.4)"
    : "0 2px 5px rgba(0,0,0,0.08)",
});


export default PersonalColor;