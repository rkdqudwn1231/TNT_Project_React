import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BodyAnalyzerResult.module.css";

const BodyAnalyzerResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. navigate로 넘겨받은 데이터(state) 꺼내기
  const result = location.state?.result;

  // 2. 데이터 없이 URL로 직접 접근했을 때 방어 로직
  useEffect(() => {
    if (!result) {
      alert("잘못된 접근입니다. 진단을 먼저 진행해 주세요.");
      navigate("/body/survery"); // 설문 페이지로 리다이렉트
    }
  }, [result, navigate]);

  if (!result) return null;

  // 3. 데이터 파싱 (대소문자 처리 + 콤마 분리)
  // DB 컬럼명이 IMAGE_URL (대문자)일 확률이 높으므로 둘 다 체크
  const bodyType = result.BODY_TYPE || result.body_type;
  const summary = result.SUMMARY || result.summary;
  const imageUrl = result.IMAGE_URL || result.image_url; // GCS URL

  // 텍스트("팁1, 팁2")를 배열로 변환하는 함수
  const parseTips = (text) => {
    if (!text) return [];
    return Array.isArray(text) ? text : text.split(",");
  };

  const topTips = parseTips(result.TOP_TIPS || result.top_tips);
  const bottomTips = parseTips(result.BOTTOM_TIPS || result.bottom_tips);
  const outerTips = parseTips(result.OUTER_TIPS || result.outer_tips);
  const patternTips = parseTips(result.PATTERN_TIPS || result.pattern_tips);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title} style={{ textAlignlign: "center" }}> 나의 체형 타입은? </h2>
 
      {/* 이미지 영역: GCS URL 사용 */}
      <div className={styles.typeContainer}>
        <div className={styles.imageBox}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${bodyType} 체형`}
              className={styles.bodyImage}
            />
          ) : (
            <div style={{ color: "#999", padding: "20px" }}>이미지 준비 중</div>
          )}
        </div>
        {/* 체형 타입  */}
        <div className={styles.typeBox}>
          <span className={styles.typeValue}>{bodyType} 타입</span>
          <p className={styles.typeDesc}>  {summary.split('.').map((line, idx) =>
            line.trim() ? (
              <span key={idx}>
                {line.trim()}.
                <br />
              </span>
            ) : null
          )}</p>
        </div>

      </div>
      {/* 팁 카드 리스트 */}
      <div className={styles.recommendContainer}>
        <TipCard title="👚 상의 스타일 추천" tips={topTips} />
        <TipCard title="👖 하의 스타일 추천" tips={bottomTips} />
        <TipCard title="🧥 아우터 추천" tips={outerTips} />
        <TipCard title="🎨 패턴 & 컬러 팁" tips={patternTips} />
      </div>

      <button className={styles.retryBtn} onClick={() => navigate("/body/main")}>
        메인으로 돌아가기
      </button>
    </div>
  );
};

// 반복되는 카드 UI를 위한 내부 컴포넌트
const TipCard = ({ title, tips }) => (
  <div className={styles.card}>
    <h3>{title}</h3>
    <ul>
      {tips.map((tip, idx) => (
        <li key={idx}>{tip.trim()}</li>
      ))}
    </ul>
  </div>
);

export default BodyAnalyzerResult;