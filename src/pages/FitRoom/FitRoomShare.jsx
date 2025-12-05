import React from "react";
import { useLocation } from "react-router-dom";

// 공유 결과 페이지: /fitroom/share?img=이미지URL
export default function FitRoomShare() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const imageUrl = params.get("img");

  const defaultImage = "https://i.imgur.com/n4A51Av.png";
  const finalImage = imageUrl || defaultImage;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mt-6 mb-4">공유된 피팅룸 결과</h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow p-4 flex flex-col items-center">
        <img
          src={finalImage}
          alt="피팅룸 결과 이미지"
          className="w-full rounded-xl mb-4"
          onError={(e) => (e.target.src = defaultImage)} // 이미지 깨짐 방지
        />

        <p className="text-gray-600 text-center mb-4">
          친구가 공유한 가상 피팅룸 결과입니다!
        </p>
      </div>

    </div>
  );
}
