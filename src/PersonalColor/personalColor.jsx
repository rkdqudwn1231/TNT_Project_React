import { useState, useRef } from "react";
import { colorPalettes } from "./palettes";



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

//고급 윕톤/쿨론 판정
function getToneAdvanced(rgb) {
  const h = getHue(rgb);

  if (h >= 20 && h <= 85) return "warm";    // 노랑/올리브 → 웜
  if (h >= 180 && h <= 300) return "cool";  // 핑크/블루 → 쿨
  return "neutral";
}

//밝기 정확도
function getLightness([r, g, b]) {
  return 0.2126*r + 0.7152*g + 0.0722*b; // 실제 인간 눈 기준 명도
}




function detectPersonalColor(skinRGB, hairRGB, eyeRGB) {
  const tone = getToneAdvanced(skinRGB);
  const light = getLightness(skinRGB);
  const isBright = light >= 150;

  // 중립톤이면 머리색 기준으로 보정
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
  if(!rgbString) return null; //색을 클릭하지 않을 경우
  const matches =rgbString.match(/\d+/g);  //rgb 값이 숫자가 들어오면 숫자 출력
  if(!matches) return null; //rgb숫자값이 들어있지 않으면 null 값 반환
  return matches.map(Number); //문자열 배열을 숫자 배열로 변환
}

function rgbArrayToHex([r,g,b]){ // R,G,B 파라미터값에 값 저장
  const toHex=(v)=>v.toString(16).padStart(2,"0"); //숫자 V(RGB)를 16진수(HEX) 문자열로 변환(두 자리에 맞게 앞에 0을 붙어서 2자리 맞춤)
  return `#${toHex(r)}${toHex(g)}${toHex(b)}` //RGB 각각 HEX로 변환해서 붙여준다.
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

      <input
        id="uploadInput"
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
      />
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

  const handleAnalyze=()=>{
    if(!skin || !hair || !eye){
      alert("색을 모두 선택해주세요!");
      return;
    }

    const skinRGB=parseRgb(skin);
    const hairRGB=parseRgb(hair);
    const eyeRGB=parseRgb(eye);

    if(!skinRGB || !hairRGB || !eyeRGB){
      alert("색 불러오기 실패 ㅠㅠ")
      return;
    }

  const seasonResult = detectPersonalColor(skinRGB, hairRGB, eyeRGB);
    Setseaon(seasonResult.season); // 시즌 저장
    setTone(seasonResult.tone); //톤 저장
    
  }

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
    <div style={{ display: "flex", gap: 40, padding: 20 }}>

      <div>
        <h2>이미지 색 추출</h2>

        {!imageSrc && (
          <FileUploadBox onChange={handleFileChange} />
        )}

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
  onMouseOver={e => {
    e.target.style.transform = "scale(1.03)";
    e.target.style.boxShadow = "0 6px 16px rgba(255, 109, 132, 0.6)";
  }}
  onMouseOut={e => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 4px 12px rgba(255, 109, 132, 0.4)";
  }}
>
  퍼스널 컬러 분석하기
</button>

          {tone &&(
            <div style={{marginTop: 10, letterSpacing: "1px", lineHeight: "1.8"}}>
              <strong>당신은 </strong>
              {tone === "warm" ?  "웜톤":"쿨톤"}입니다.
            </div>
          )}

            {season && (
              <div style={{marginTop: 10, letterSpacing: "1px", lineHeight: "1.8" }}>
                <strong>당신의 퍼스널 컬러: </strong>{season === "spring" && "봄(Spring)"}
                {season === "summer" && "여름(Summer)"}
                {season === "autumn" &&"가을(Autumn)"}
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
            </>
          )}

          </div>
          
        )}

   
      </div>

    </div>
  );
}

function ColorBox({ label, color }) {

const rgbArray=color ? parseRgb(color) : null;
const hex=rgbArray ? rgbArrayToHex(rgbArray) : null;


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
