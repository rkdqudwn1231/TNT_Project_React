import { useState } from "react";

function ShareButton({ title, description, imageUrl, linkPath }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!window.Kakao) {
      alert("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    // 1) 안전한 값으로 정리 (길이 제한 등)
    const safeLink = window.location.origin + linkPath;

    const safeTitle =
      (title && title.toString().slice(0, 40)) || "TNT 체형 진단 결과";

    // 카카오 description 최대 200자 권장 → 자르기
    const safeDescription = (description || "")
      .toString()
      .replace(/\s+/g, " ")
      .slice(0, 200);

    const safeImage =
      imageUrl ||
      "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/6587e1f40100001.png"; // 아무 공개 썸네일 하나

    try {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: safeTitle,
          description: safeDescription,
          imageUrl: safeImage,
          link: {
            mobileWebUrl: safeLink,
            webUrl: safeLink,
          },
        },
        buttons: [
          {
            title: "🔍 결과 보기",
            link: {
              mobileWebUrl: safeLink,
              webUrl: safeLink,
            },
          },
          {
            title: "✨ 나도 분석하기",
            link: {
              mobileWebUrl: window.location.origin + "/body",
              webUrl: window.location.origin + "/body",
            },
          },
        ],
      });
    } catch (e) {
      console.error("[Kakao share error]", e);
      alert(e.message || "카카오톡 공유 중 오류가 발생했습니다.");
    }
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
        flexDirection: "column",
        gap: 10,
      }}
    >
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
        }}
      >
        카카오톡 공유하기
      </button>

      <button
        onClick={handleCopyLink}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "white",
          fontSize: 14,
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
