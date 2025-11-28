import styles from "./BodyAnalyzerImg.module.css";
import React, { useState } from "react";
import { getPoseLandmarker } from "../MediaPipe/poseLandmarker"; // MediaPipe Pose 모델을 가져오는 유틸
import { bodyMetrics } from "../MediaPipe/bodyMetrics"; // 랜드마크에서 비율 계산하는 유틸

const BodyAnalyzerMain = () => {

    // 사용자가 업로드한 파일 상태
    const [file, setFile] = useState(null);

    // 성별(분석 시 참고용)
    // const [gender, setGender] = useState("female");

    // 분석 진행 여부(버튼 비활성화 / "분석 중..." 표시용)
    const [loading, setLoading] = useState(false);

    // 서버에서 받은 결과 전체 저장
    const [result, setResult] = useState(null);

    // 에러 메시지 상태
    const [errorMsg, setErrorMsg] = useState("");

    const handleFileChange = () => {

    }

      const handleAnalyze = () => {

    }

    return (

        <div className={styles.imgContainer}>
            <div className={styles.uploadBox}>
                <div className={styles.imgLabel}>이미지 업로드</div>
                <input type="file" accept="image/**" onChange={handleFileChange}  />
                {/* <div className={styles.genderBox}>
                    <span>성별</span>
                    <label className={styles.imgLabel}>
                        <input type="radio" value={female} checked={gender === "female"} />
                    </label>
                </div> */}
                <button className={styles.analyzeBtn} onClick={handleAnalyze} disabled={loading} >
                   {loading ? "AI 분석 중..." : "체형 분석하기"}
                </button>
            </div>

        </div>
    )
}

export default BodyAnalyzerMain;