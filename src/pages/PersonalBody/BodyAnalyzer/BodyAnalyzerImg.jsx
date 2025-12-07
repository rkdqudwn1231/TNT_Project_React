import React, { useState, useEffect } from "react";
import styles from "./BodyAnalyzerImg.module.css";
import { caxios } from "../../../config/config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BodyAnalyzerImg = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 파일 선택 시 미리보기 설정
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl); // 메모리 해제
    }, [file]);

    const handleAnalyze = async () => {
        if (!file) {
            setErrorMsg("이미지를 먼저 선택해주세요.");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("image", file);

            // 스프링부트 API 주소로 POST 요청
            const response = await caxios.post("/bodyAnalyze", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(response);
            setResult(response.data.answer);
        } catch (error) {
            console.error(error);
            setErrorMsg("분석 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.imgContainer}>
            <div className={styles.uploadBox}>
                <div className={styles.imgLabel}>AI 이미지 진단</div>

                <label htmlFor="file" className={styles.uploadBtn}>
                    파일 선택
                </label>
                <input
                    type="file"
                    accept="image/*"
                    id="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}

                    style={{ display: "none" }}
                />

                <button
                    className={styles.analyzeBtn}
                    onClick={handleAnalyze}
                    disabled={loading || !file}
                >
                    {loading ? "AI 분석 중..." : "체형 분석하기"}
                </button>
            </div>

            {/* 미리보기 */}
            {preview && (
                <img
                    src={preview}
                    alt="미리보기"
                    className={styles.previewImg}
                />
            )}





            {/* 에러 메시지 */}
            {errorMsg && <div className={styles.error}>{errorMsg}</div>}

            {result && (
                <div className={styles.result}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {`
                     ${result.bodyAnalysis}

                     ${result.topRecommendation}

                    ${result.bottomRecommendation}
                    `}
                    </ReactMarkdown>
                </div>
            )}
        </div >

    );
};

export default BodyAnalyzerImg;