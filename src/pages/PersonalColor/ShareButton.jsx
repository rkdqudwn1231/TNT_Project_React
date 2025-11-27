import { useState } from "react";
import { colorPalettes } from "./palettes";

function ShareButton({ season }) {
  const [copied, setCopied] = useState(false); // 토스트 상태

  const handleShare = () => {
    if (!season) {
      alert("색을 먼저 분석해주세요!");
      return;
    }

    if (!window.Kakao) {
      alert("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    const isWarm = season.includes("Spring") || season.includes("Autumn");
    const warmImage = "https://i.imgur.com/vYwZzwH.png";
    const coolImage = "https://i.imgur.com/AIFdy0N.png";
    const imageUrl = isWarm ? warmImage : coolImage;

    const baseSeason =
      season.includes("Spring") ? "spring" :
      season.includes("Summer") ? "summer" :
      season.includes("Autumn") ? "autumn" :
      "winter";

    const bestColors = colorPalettes[baseSeason].best;
    const worstColors = colorPalettes[baseSeason].worst;

    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: `나의 퍼스널컬러: ${season}`,
        description: `BEST 색: ${bestColors.join(", ")} | WORST 색: ${worstColors.join(", ")}`,
        imageUrl,
        link: {
          mobileWebUrl: window.location.origin + `/color/result?season=${encodeURIComponent(season)}`,
          webUrl: window.location.origin + `/color/result?season=${encodeURIComponent(season)}`,
        },
      },
      buttons: [
        {
          title: "🔍 결과 보기",
          link: {
            mobileWebUrl: window.location.origin + `/color/result?season=${encodeURIComponent(season)}`,
            webUrl: window.location.origin + `/color/result?season=${encodeURIComponent(season)}`
          }
        },
        {
          title: "✨ 나도 분석하기",
          link: {
            mobileWebUrl: window.location.origin + "/color",
            webUrl: window.location.origin + "/color",
          }
        }
      ]
    });
  };


  const handleCopyLink = async () => {
  const url = window.location.origin + `/color/result?season=${encodeURIComponent(season)}`;

  try {

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
    } else {
 
      const tempInput = document.createElement("input");
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1800);

  } catch (err) {
    alert("복사 실패! 브라우저 설정을 확인해주세요.");
  }
};

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>

      {/* 카카오톡 공유 버튼 */}
      <button
        onClick={handleShare}
        style={{
          padding: "12px 18px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          backgroundColor: "#FEE500",
          color: "#3A1D1D",
          fontWeight: "bold",
          fontSize: 15,
          boxShadow: "0 3px 10px rgba(0,0,0,0.15)"
        }}
      >
        카카오톡 공유하기
      </button>

      {/* 링크 복사 버튼 */}
      <button
        onClick={handleCopyLink}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "white",
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        🔗 링크 복사하기
      </button>

      {/* 토스트 메시지 */}
      {copied && (
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)",
            color: "white",
            padding: "8px 14px",
            borderRadius: 6,
            fontSize: 13,
            whiteSpace: "nowrap",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          링크가 복사되었습니다!
        </div>
      )}
    </div>
  );
}

export default ShareButton;
