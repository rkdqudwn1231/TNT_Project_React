import { useState } from "react";

function ShareButton({ title, description, imageUrl, linkPath }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!window.Kakao) {
      alert("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    const safeLink = window.location.origin + linkPath;
    const safeTitle = (title && title.toString().slice(0, 40)) || "TNT 체형 진단 결과";
    const safeDescription = (description || "")
      .toString()
      .replace(/\s+/g, " ")
      .slice(0, 200);
    const safeImage =
      imageUrl ||
      "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/6587e1f40100001.png";

    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: safeTitle,
        description: safeDescription,
        imageUrl: safeImage,
        link: { mobileWebUrl: safeLink, webUrl: safeLink }
      },
      buttons: [
        {
          title: "🔍 결과 보기",
          link: { mobileWebUrl: safeLink, webUrl: safeLink }
        },
        {
          title: "✨ 나도 분석하기",
          link: {
            mobileWebUrl: window.location.origin + "/body",
            webUrl: window.location.origin + "/body"
          }
        }
      ]
    });
  };

  const handleCopyLink = async () => {
    const url = window.location.origin + linkPath;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("복사 실패! 브라우저 설정을 확인해주세요.");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",    // 🟢 한 줄 가로 정렬
        justifyContent: "center",
        alignItems: "center",
        gap: "14px",              // 버튼 간 간격
      }}
    >
      <button
        onClick={handleShare}
        style={{
          padding: "12px 22px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          backgroundColor: "#FEE500",
          color: "#3A1D1D",
          fontWeight: "bold",
          fontSize: 15,
          minWidth: 190
        }}
      >
        카카오톡 공유하기
      </button>

      <button
        onClick={handleCopyLink}
        style={{
          padding: "12px 22px",
          borderRadius: 10,
          border: "1px solid #ccc",
          background: "white",
          fontSize: 15,
          minWidth: 190
        }}
      >
        🔗 링크 복사하기
      </button>

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
          }}
        >
          링크가 복사되었습니다!
        </div>
      )}
    </div>
  );
}

export default ShareButton;
