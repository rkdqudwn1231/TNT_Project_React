import React, { useState, useEffect, useRef } from "react";
import styles from "./BodyAnalyzerImg.module.css";
import { caxios } from "../../../config/config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navigate, useNavigate } from "react-router-dom";



const BodyAnalyzerImg = () => {

    // 훅 초기화
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [error, setError] = useState(false);

    const fileInputRef = useRef(null);




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
            const data = response.data.answer;
            if (
                !data?.bodyAnalysis?.trim() ||
                !data?.topRecommendation?.trim() ||
                !data?.bottomRecommendation?.trim()
            ) {
                setError(true);
                setErrorMsg("분석 중 오류가 발생했습니다. 다시 시도 부탁드립니다.");
                setResult(null);
                return;
            }

            setError(false);
            setResult(data);

        } catch (error) {
            console.error(error);
            setErrorMsg("분석 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };


    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setErrorMsg("");
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // input 강제 초기화
        }
    };

    return (
        <div className="totalContainer">
            <div className={styles.pbHeader}>AI Body Analysis</div>

            <div className="container mt-4">
                <div className="row justify-content-center">

                    {/* ✅ 좌측: 이미지 */}
                    <div className="col-md-4 col-12 d-flex justify-content-center">
                        <div className={styles.uploadBox}>
                            {!preview ? (
                                <>
                                    <label htmlFor="file" className={styles.uploadBtn}>
                                        이미지 선택
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="file"
                                        ref={fileInputRef}
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        style={{ display: "none" }}
                                    />
                                </>
                            ) : (
                                <>
                                    <img src={preview} alt="미리보기" className={styles.previewImg} />

                                </>
                            )}

                            {errorMsg && <div className={styles.error}>{errorMsg}</div>}
                            <button
                                className={styles.analyzeBtn}
                                onClick={handleAnalyze}
                                disabled={loading || !file}
                            >
                                {loading ? "AI 분석 중..." : "체형 분석하기"}
                            </button>
                            <div>
                                {preview && <button className={styles.analyzeNextBtn} onClick={handleReset} disabled={loading}>
                                    다시 선택하기
                                </button>}
                                <button className={preview ? styles.analyzeNextBtn1 : styles.analyzeNextBtn1Big } onClick={() => navigate("/body/main")}>
                                    뒤로가기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ✅ 우측: 결과 전체 */}
                    {result && !error && (
                        <div className="col-md-8 col-12">

                            {/* ✅ 위 1칸 */}
                            <div className={styles.resultBox}>
                                <h1 style={{ textAlign: "center" }}>{result.bodyType}</h1>
                                <div className={styles.result}>{result.bodyAnalysis}</div>
                            </div>

                            {/* ✅ 아래 2칸 */}
                            <div className="row mt-4">
                                <div className="col-md-6 col-12 mb-3">
                                    <div className={styles.footResultBox}>
                                        <div>상의 추천</div>
                                        <div className={styles.result}>{result.topRecommendation}</div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-12">
                                    <div className={styles.footResultBox}>
                                        <div>하의 추천</div>
                                        <div className={styles.result}>{result.bottomRecommendation}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default BodyAnalyzerImg;