import React from "react";
import styles from "./BodyAnalyzerResult.module.css";

const BodyAnalyzerResult = ({ result, onRetry }) => {
  if (!result) return null;

  const {
    body_type,
    summary,
    top_tips,
    bottom_tips,
    outer_tips,
    pattern_tips
  } = result;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>📌 체형 진단 결과</h2>

      {/* 체형 타입 */}
      <div className={styles.typeBox}>
        <span className={styles.typeLabel}>나의 체형 타입</span>
        <span className={styles.typeValue}>{body_type} 타입</span>
        <p className={styles.typeDesc}>{summary}</p>
      </div>

      {/* 카드 그룹 */}
      <div className={styles.recommendContainer}>

        <div className={styles.card}>
          <h3>👚 상의 스타일 추천</h3>
          <ul>
            {top_tips?.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h3>👖 하의 스타일 추천</h3>
          <ul>
            {bottom_tips?.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h3>🧥 아우터 추천</h3>
          <ul>
            {outer_tips?.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h3>🎨 패턴 & 컬러 팁</h3>
          <ul>
            {pattern_tips?.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      <button className={styles.retryBtn} onClick={onRetry}>
        다시 진단하기
      </button>
    </div>
  );
};

export default BodyAnalyzerResult;
