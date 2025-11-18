import { useState, useRef } from "react";
import { colorPalettes } from "./palettes";

import {caxios} from "../../config/config";


//  연예인 데이터 (기존 HEAD 유지)
const celebrityMap = {
  spring: [
    {
      name: "아이유",
      img: "https://i.imgur.com/4Z8wQ2F.jpeg",
      desc: "맑고 밝은 라이트 스프링 대표 톤"
    },
    {
      name: "태연",
      img: "https://i.imgur.com/m4Zytnp.jpeg",
      desc: "중명도의 따뜻한 봄톤"
    }
  ],
  summer: [
    {
      name: "수지",
      img: "https://i.imgur.com/e8M2D1v.jpeg",
      desc: "부드럽고 차분한 여름 라이트톤"
    },
    {
      name: "이영애",
      img: "https://i.imgur.com/2lfHwqy.jpeg",
      desc: "청초하고 투명한 쿨톤 대표"
    }
  ],
  autumn: [
    {
      name: "제니",
      img: "https://i.imgur.com/B2xjGgK.jpeg",
      desc: "고급스럽고 딥한 가을톤"
    },
    {
      name: "한지민",
      img: "https://i.imgur.com/0X9y4bT.jpeg",
      desc: "부드럽고 따뜻한 뮤트톤"
    }
  ],
  winter: [
    {
      name: "송혜교",
      img: "https://i.imgur.com/0AvmLdM.jpeg",
      desc: "선명하고 대비 강한 겨울 딥톤"
    },
    {
      name: "윤아",
      img: "https://i.imgur.com/K1LLVwk.jpeg",
      desc: "깨끗하고 투명한 아이시 쿨톤"
    }
  ]
};

// ⭐ 연예인 카드
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
        style={{ width: "100%", height: 150, objectFit: "cover" }}
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
  return (
    <div style={{ marginTop: 25 }}>
      <h3 style={{ marginBottom: 12 }}>당신과 비슷한 톤의 연예인</h3>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {list.map((celeb, i) => (
          <CelebrityCard key={i} celeb={celeb} />
        ))}
      </div>
    </div>
  );
}

// ========= 기존 기능 =========

//색조 기반 정확도 
function getHue([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
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
  return 0.2126*r + 0.7152*g + 0.0722*b;
}

function detectPersonalColor(skinRGB, hairRGB, eyeRGB) {
  const tone = getToneAdvanced(skinRGB);
  const light = getLightness(skinRGB);
  const isBright = light >= 150;

  let finalTone = tone;
  if (tone === "neutral") {
    const hairTone = getToneAdvanced(hairRGB);
    finalTone = hairTone === "cool" ? "cool" : "warm";
  }

  let season = "";
  if (finalTone === "warm") {
    season = isBright ? "spring" : "autumn";
  } else {
    season = isBright ? "summer" : "winter";
  }

  return { tone: finalTone, season };
}

function parseRgb(rgbString){
  if(!rgbString) return null;
  const matches = rgbString.match(/\d+/g);
  if(!matches) return null;
  return matches.map(Number);
}

function rgbArrayToHex([r,g,b]) {
  const toHex=(v)=>v.toString(16).padStart(2,"0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

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
        backgroundColor: "#fafafa"
      }}
      onClick={() => document.getElementById("uploadInput").click()}
    >
      <div style={{ fontSize: 60, opacity: 0.4 }}>📷</div>
      <button
        type="button"
        style={{
          marginTop: 20,
          backgroundColor: "#e91e63",
          color: "white",
          padding: "10px 22px",
          borderRadius: 20,
          border: "none",
          cursor: "pointer",
        }}
      >
        Choose Photo
      </button>
      <input id="uploadInput" type="file" accept="image/*" onChange={onChange} style={{ display: "none" }} />
    </div>
  );
}

function PersonalColor() {

  const [imageSrc, setImageSrc] = useState(null);
  const [mode, setMode] = useState("Skin");
  const [skin, setSkin] = useState(null);
  const [hair, setHair] = useState(null);
  const [eye, setEye] = useState(null);
  const [hoverColor, setHoverColor] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [season,Setseaon]=useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const[tone,setTone]=useState(null);

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
    if(!skin || !hair || !eye){
      alert("색을 모두 선택해주세요!");
      return;
    }

    const skinRGB=parseRgb(skin);
    const hairRGB=parseRgb(hair);
    const eyeRGB=parseRgb(eye);

    if(!skinRGB || !hairRGB || !eyeRGB){
      alert("색 불러오기 실패 ㅠㅠ");
      return;
    }

    const seasonResult = detectPersonalColor(skinRGB, hairRGB, eyeRGB);
    Setseaon(seasonResult.season);
    setTone(seasonResult.tone);

    caxios.post("/Personalcolor",{
      season: seasonResult.season,
      tone_type: seasonResult.tone,
      best_color: colorPalettes[seasonResult.season].best.join(","),
      worst_color: colorPalettes[seasonResult.season].worst.join(",")
    })
  };

  const getPixelColor = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
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

  return (
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
      <div>
        <h2>이미지 색 추출</h2>

        {!imageSrc && <FileUploadBox onChange={handleFileChange} />}

        {imageSrc && (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              ref={imgRef}
              src={imageSrc}
              alt="upload"
              onMouseMove={handleMouseMove}
              onClick={handleImageClick}
              style={{
                width: "350px",
                height: "auto",
                objectFit: "contain",
                marginTop: 20,
                cursor: "none"
              }}
            />

            {hoverColor && (
              <div
                style={{
                  position: "fixed",
                  top: cursorPos.y - 10,
                  left: cursorPos.x - 10,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "2px solid white",
                  backgroundColor: hoverColor,
                  pointerEvents: "none"
                }}
              />
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}
      </div>

      <div>
        <h3>색 선택</h3>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button onClick={() => setMode("Skin")}>Skin</button>
          <button onClick={() => setMode("Hair")}>Hair</button>
          <button onClick={() => setMode("Eye")}>Eye</button>
        </div>

        {imageSrc && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <ColorBox label="Skin" color={skin} />
            <ColorBox label="Hair" color={hair} />
            <ColorBox label="Eye" color={eye} />

            <button
              onClick={handleAnalyze}
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                border: "none",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                background: "linear-gradient(135deg, #ff7096 0%, #ff4d6d 100%)",
                color: "white",
                boxShadow: "0 4px 12px rgba(255, 109, 132, 0.4)",
                transition: "0.2s"
              }}
            >
              퍼스널 컬러 분석하기
            </button>

            {tone && (
              <div style={{ marginTop: 10, letterSpacing: "1px", lineHeight: "1.8" }}>
                <strong>당신은 </strong>{tone === "warm" ? "웜톤" : "쿨톤"}입니다.
              </div>
            )}

            {season && (
              <div style={{ marginTop: 10, letterSpacing: "1px", lineHeight: "1.8" }}>
                <strong>당신의 퍼스널 컬러: </strong>
                {season === "spring" && "봄(Spring)"}
                {season === "summer" && "여름(Summer)"}
                {season === "autumn" && "가을(Autumn)"}
                {season === "winter" && "겨울(Winter)"}
              </div>
            )}

            {season && (
              <>
                <ColorPalette
                  title="어울리는 색상 (BEST)"
                  colors={colorPalettes[season].best}
                />

                <ColorPalette
                  title="피해야 하는 색상 (WORST)"
                  colors={colorPalettes[season].worst}
                />

                {/* 연예인 카드 */}
                <CelebritySection season={season} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
      <div style={{
        display: "flex",
        gap: 8,
        marginTop: 8,
        flexWrap: "wrap"
      }}>
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
