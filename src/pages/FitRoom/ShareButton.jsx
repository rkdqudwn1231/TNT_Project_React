import { useState } from "react";


function ShareButton({ imageUrl }) {

  // const [copied, setCopied] = useState(false); // 토스트 상태


  const handleShare = () => {

    if (!window.Kakao) {
      alert("Kakao SDK가 로드되지 않았습니다.");
      return;
    }


    const defaultImage = "https://i.imgur.com/n4A51Av.png";

    const shareImage = imageUrl || defaultImage;
    //const BASE_URL = window.location.origin;
    // const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    // const BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000`;

    const BASE_URL = "https://tnt5.store";

    const sharePageUrl = `${BASE_URL}/fitroom/share?img=${encodeURIComponent(shareImage)}`;

    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: `가상 피팅룸`,
        description: "나만의 FitRoom 결과 이미지 공유",
        imageUrl: shareImage,
        link: {
          mobileWebUrl: sharePageUrl,
          webUrl: sharePageUrl,
        },
      },
      buttons: [
        {
          title: "🔍 결과 보기",
          link: {
            mobileWebUrl: sharePageUrl,
            webUrl: sharePageUrl,
          }
        },
        {
          title: "✨ 이용하러가기",
          link: {
            mobileWebUrl: `${BASE_URL}/fitroom`,
            webUrl: `${BASE_URL}/fitroom`,
          }
        }
      ]
    });
  }

  // const handleCopyLink = async () => {
  //   const defaultImage = "https://i.imgur.com/n4A51Av.png";
  //   const shareImage = imageUrl || defaultImage;

  //   const BASE_URL = "https://tnt5.store";
  //   const sharePageUrl = `${BASE_URL}/fitroom/share?img=${encodeURIComponent(shareImage)}`;

  //   try {
  //     await navigator.clipboard.writeText(sharePageUrl);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 1800);
  //   } catch (err) {
  //     alert("복사 실패! 브라우저 설정을 확인해주세요.");
  //   }
  // };


  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>

      {/* 카카오톡 공유 버튼 */}
      <button
        type="button"
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

      {/* //링크 복사 버튼
      <button
        type="button"
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

      토스트 메시지
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
      )} */}

    </div>
  );
}

export default ShareButton;
