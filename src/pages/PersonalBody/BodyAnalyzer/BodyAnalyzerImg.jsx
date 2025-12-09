import React, { useState, useEffect, useRef } from "react";
import styles from "./BodyAnalyzerImg.module.css";
import { caxios } from "../../../config/config";

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

    const [dots, setDots] = useState("");

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
            setError(true);
            setErrorMsg("이미지를 먼저 선택해주세요.");
            return;
        }

        setLoading(true);
        setError(false);
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

            if (response.data?.error === true) {
                console.log("error쪽 들어옴");
                setError(true);
                setErrorMsg("사람이 인식되지 않았습니다. 다시 시도 부탁드립니다.");
                setResult(null);
                setFile(null);
                return;
            }

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

            setError(true);   // ✅ 이거 반드시 추가
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
        setError(false);   // ✅ 이거 반드시 추가
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // input 강제 초기화
        }
    };

    useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
    }, [loading]);

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
                                        onChange={(e) => {
                                            setFile(e.target.files?.[0] || null);
                                            setError(false);
                                            setErrorMsg("");
                                        }}
                                        style={{ display: "none" }}
                                    />
                                </>
                            ) : (
                                <>
                                    <img src={preview} alt="미리보기" className={styles.previewImg} />

                                </>
                            )}

                            {errorMsg && <div className={styles.error}>{errorMsg}</div>}
                            {!result && (
                                <button
                                    className={styles.analyzeBtn}
                                    onClick={handleAnalyze}
                                    disabled={loading || !file}
                                >
                                    {loading ? `AI 분석 중${dots}` : "체형 분석하기"}
                                </button>)}

                            <div className="buttonGroup">
                                {preview && <button className={styles.analyzeNextBtn} onClick={handleReset} disabled={loading}>
                                    다시 선택하기
                                </button>}
                                <button className={preview ? styles.analyzeNextBtn1 : styles.analyzeNextBtn1Big} onClick={() => navigate("/body/main")}>
                                    뒤로가기
                                </button>
                            </div>

                        </div>
                    </div>
                    {/* ✅ 우측: 설명 전체 */}
                    {!result && (
                        <div className={`col-md-8 col-12 ${styles.infoContainer}`}>
                            <div>
                                1. 쉽고 빠른 사용 안내
                            </div>
                            <div>
                                복잡한 입력 없이 단 한 장의 사진으로 체형을 인식하고 맞춤 스타일을 추천받을 수 있습니다. 좌측 이미지 선택을 클릭해 사진을 업로드 한 후 체형 분석하기를 클릭해 보세요.
                            </div>
                            
                            <div>2. AI 체형 분석 안내</div>
                            <div>
                                사진 한 장으로 AI가 당신의 체형을 빠르고 정확하게 분석합니다. 업로드한 이미지는 서버에 저장되지 않고, 분석 후 즉시 삭제됩니다.
                            </div>
                            <div>
                                3. 분석 결과 안내
                            </div>
                            <div>
                                체형 분석 결과와 함께 상의, 하의 스타일 추천을 제공합니다. 각 스타일의 장단점을 확인하며 나에게 맞는 패션을 쉽게 찾아보세요.
                            </div>
                            <div>
                                4. 보안·프라이버시 안내
                            </div>
                            <div>
                                사진은 분석 즉시 처리되며, 어떠한 경우에도 외부로 공유되지 않습니다. 안심하고 AI 체형 분석을 이용할 수 있습니다.
                            </div>
                            
                            <div>
                                5. 맞춤 스타일 제안 안내
                            </div>
                            <div>
                                분석 결과를 바탕으로 체형에 어울리는 스타일 팁과 추천 아이템을 확인하고, 옷 선택에 실질적인 도움을 받아보세요.
                            </div>

                        </div>
                    )}

                    {/* ✅ 우측: 결과 전체 */}
                    {result && !error && (
                        <div className="col-md-8 col-12">

                            {/* ✅ 위 1칸 */}
                            <div className={styles.resultBox}>
                                <div className={styles.footResultTitle}>당신의 체형 타입은 {result.bodyType} 입니다.</div>
                                <div className={styles.result}>{result.bodyAnalysis}</div>
                            </div>

                            {/* ✅ 아래 2칸 */}
                            <div className={`row mt-4 ${styles.footResultContainer}`}>
                                <div className="col-md-6 col-12">
                                    <div className={styles.footResultBox}>
                                        <div className={styles.footResultTitle}>상의 추천</div>
                                        <div className={styles.result}>{result.topRecommendation}</div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-12">
                                    <div className={styles.footResultBox}>
                                        <div className={styles.footResultTitle}>하의 추천</div>
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