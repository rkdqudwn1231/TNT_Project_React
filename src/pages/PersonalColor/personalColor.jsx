import { useState, useRef } from "react";
import { colorPalettes } from "./palettes";
import { caxios } from "../../config/config";
import ShareButton from "./ShareButton";

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

    imageRendering: "-webkit-optimize-contrast",
    imageRendering: "crisp-edges",
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
  return (
    <div style={{ marginTop: 25 }}>
      <h3 style={{ marginBottom: 12 }}>당신과 비슷한 톤의 연예인</h3>
      <div style={{ display: "flex", gap: 20, flexWrap: "nowrap" }}>
        {list.map((celeb, i) => (
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
        width: 350,
        height: 350,
        border: "2px dashed #ccc",
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
    width: 140,
    height: 140,
    borderRadius: "50%",
    backgroundColor: "#eee",
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
    src="/images/실루엣.png"   
    alt="profile"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  />

        
      </div>

      {/* 안내 문구 */}
      <div style={{ fontSize: 15, color: "#666", marginTop: 6 }}>
        얼굴이 잘 나온 사진을 업로드하세요
      </div>

    </div>
  );
}

// =================== 메인 컴포넌트 ===================
function PersonalColor() {
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 40,
          padding: 20,
          width: "100%",
        }}
      >
        {/* ========== 왼쪽: 이미지 영역 ========== */}
        <div>
          {!imageSrc && <FileUploadBox />}

          {imageSrc && (
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: 350,
                height: 350,
                overflow: "hidden",
                borderRadius: 12,
              }}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                onMouseMove={handleMouseMove}
                onClick={handleImageClick}
                onMouseLeave={() => setHoverColor(null)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  cursor: "none",
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: "transform 0.15s ease-out",
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
        <div style={{ width: 480 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setMode("Skin")}>Skin</button>
            <button onClick={() => setMode("Hair")}>Hair</button>
            <button onClick={() => setMode("Eye")}>Eye</button>
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
              </div>

              <div
                style={{
                  background: "white",
                  padding: 24,
                  borderRadius: 14,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  width: "1000px",
                  marginLeft: "-420px",
                }}
              >
                {season && <ExplanationBox season={season} />}

                {baseSeasonForUI && (
                  <>
                    <ColorPalette
                      title="어울리는 색상 (BEST)"
                      colors={colorPalettes[baseSeasonForUI].best}
                    />

                    <ColorPalette
                      title="피해야 하는 색상 (WORST)"
                      colors={colorPalettes[baseSeasonForUI].worst}
                    />

                    <CelebritySection season={baseSeasonForUI} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// =================== UI 컴포넌트 ===================
function ColorBox({ label, color }) {
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
      <span>{label}</span>
    </div>
  );
}

function ColorPalette({ title, colors }) {
  return (
    <div style={{ marginTop: 10 }}>
      <strong>{title}</strong>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 8,
          flexWrap: "wrap"
        }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
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

export default PersonalColor;
