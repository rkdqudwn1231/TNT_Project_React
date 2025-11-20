import { colorPalettes } from "./palettes";

function ShareButton({ season }) {

  const handleShare = () => {
    if (!season) {
      alert("색을 먼저 분석해주세요!");
      return;
    }

    if (!window.Kakao) {
      alert("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    const isWarm =
      season.includes("Spring") || season.includes("Autumn");

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

  return (
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
  );
}

export default ShareButton;
