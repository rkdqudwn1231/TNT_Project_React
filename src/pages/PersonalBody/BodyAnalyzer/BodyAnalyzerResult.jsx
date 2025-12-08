import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BodyAnalyzerResult.module.css";
import { caxios } from "../../../config/config";
import ShareButton from "../ShareButton";
//import ShareButton from "../ShareButton";

const BodyAnalyzerResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(location.state?.result || null);

  const [upperList, setUpperList] = useState([]);
  const [lowerList, setLowerList] = useState([]);

  const [saved, setSaved] = useState(false);

useEffect(() => {
  // 원래 result가 있으면(일반 진단) -> API 호출 안 함
  if (result) return;

  const queryParams = new URLSearchParams(location.search);
  const typeFromUrl = queryParams.get("type");

  if (!typeFromUrl) {
    alert("잘못된 접근입니다. 진단을 먼저 진행해 주세요.");
    navigate("/body/main");
    return;
  }

  console.log("공유 링크 접속 확인. 타입:", typeFromUrl);

  // 🔥 공유 링크 재접속 → 해당 타입의 체형 전체 데이터 다시 불러오기
  caxios.get(`/body/result`, { params: { type: typeFromUrl } })
    .then(res => {
      setResult(res.data);
      localStorage.setItem("gender", res.data.GENDER); // 추천 호출에 사용되게 저장
    })
    .catch(err => {
      console.error("공유 결과 불러오기 오류:", err);
      alert("결과를 불러올 수 없습니다.");
      navigate("/body/main");
    });
}, [location.search, navigate, result]);

  const handleSave = (item) => {
    caxios.post("/recommend/saveRecommend", {
      clothType: item.cloth_type,     // upper / lower
      category: item.category,
      upperImageUrl: item.cloth_type === "upper" ? item.image_url : null,
      lowerImageUrl: item.cloth_type === "lower" ? item.image_url : null,
      upperName: item.cloth_type === "upper" ? item.name : null,
      lowerName: item.cloth_type === "lower" ? item.name : null
    })
      .then(res => {
        if (res.data === "SUCCESS") {
          alert("내 옷장에 저장되었습니다!");
        } else {
          alert("저장에 실패하였습니다.");
        }
      })
      .catch(err => {
        if (err.response?.status === 401) {
          alert("로그인이 필요합니다.");
          navigate("/login", { state: { from: location.pathname, result } });
        } else {
          alert("오류 발생");
        }
      });
  };

  const goCloset = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login", { state: { from: "/fitroom/closet" } });
      return;
    }

    navigate("/fitroom/closet");
  };

  // 카카오톡 공유하기
  useEffect(() => {

    if (result) return;

    const queryParams = new URLSearchParams(location.search);
    const typeFromUrl = queryParams.get("type");

    if (typeFromUrl) {
      // [수정 2] 공유 링크로 들어온 경우 처리
      // ★ 실제로는 여기서 백엔드 API를 호출해서 해당 타입의 정보를 가져와야 합니다.
      // 지금은 에러가 안 나도록 '임시 데이터'를 넣어둡니다.

      console.log("공유 링크 접속 확인. 타입:", typeFromUrl);

      const mockData = {
        BODY_TYPE: typeFromUrl,
        SUMMARY: "공유된 링크를 통해 들어오셨군요! (친구의 결과입니다)",
        IMAGE_URL: "https://via.placeholder.com/300?text=Result+Image", // 임시 이미지
        TOP_TIPS: "추천 팁을 불러오는 중...",
        BOTTOM_TIPS: "추천 팁을 불러오는 중...",
        PATTERN_TIPS: "패턴 팁을 불러오는 중..."
      };

      setResult(mockData);

    } else {
      alert("잘못된 접근입니다. 진단을 먼저 진행해 주세요.");
      navigate("/body/main");
    }
  }, [location.search, navigate, result]);

  // 데이터 로딩 중일 때 표시
  if (!result) return <div>결과를 불러오는 중입니다...</div>;

  // --- 기존 렌더링 로직 (변수명 그대로 사용) ---
  const body_type = result.BODY_TYPE || result.body_type;
  const summary = result.SUMMARY || result.summary;
  const imageUrl = result.IMAGE_URL || result.image_url;

  const parseTips = (text) => {
    if (!text) return [];
    return Array.isArray(text) ? text : text.split(",");
  };

  const topTips = parseTips(result.TOP_TIPS || result.top_tips);
  const bottomTips = parseTips(result.BOTTOM_TIPS || result.bottom_tips);
  const patternTips = parseTips(result.PATTERN_TIPS || result.pattern_tips);

  const handleSaveBodyType = () => {
    caxios.post("/member/bodyShape", { body_type })
      .then(res => {
        if (res.data === "SUCCESS") {
          setSaved(true);
          alert("나의 체형 유형이 저장되었어요.");
        }
      })
      .catch(err => {
        if (err.response?.status === 401) {
          alert("로그인이 필요합니다.");
          navigate("/login", { state: { from: location.pathname, result } });
        } else {
          alert("오류가 발생했습니다.");
        }
      });
  };


  return (
    <div className={styles.wrapper}>
      <div className={styles.pbHeader}>My Body Type</div>

      <div className={styles.typeContainer}>
        <div className={styles.imageBox}>
          <img src={imageUrl} alt={`${body_type} 체형`} className={styles.bodyImage} />
        </div>

        <div className={styles.typeInfoGroup}>
          <div className={styles.typeBox}>
            <span className={styles.typeValue}>{body_type} 타입</span>
            <p className={styles.typeDesc}>
              {summary.split('.').map((line, idx) =>
                line.trim() ? (
                  <span key={idx}>
                    {line.trim()}.
                    <br />
                  </span>
                ) : null
              )}
            </p>
          </div>

          {patternTips.length > 0 && (
            <div className={styles.patternBox}>
              <h3>패턴 & 컬러 팁</h3>
              <ul>
                {patternTips.map((tip, idx) => (
                  <li key={idx}>{tip.trim()}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles.shareWrap}>
            <button className={styles.retryBtn} disabled={saved} onClick={handleSaveBodyType}>
              {saved ? "체형 결과 이미 저장됨 ✓" : "내 체형 결과 저장하기"}
            </button>
            <ShareButton
              title={`나의 체형 타입: ${body_type}`}
              description={`${summary}`}
              imageUrl={imageUrl}
              linkPath={`/body/result?type=${body_type}`}
            />
          </div>
        </div>
      </div>

      {/* ========== 상의 텍스트 + 상의 이미지 가로 배치 ========== */}
      {topTips.length > 0 && (
        <section className={styles.recommendBlock}>
          <h3 className={styles.blockTitle}>👚 상의 스타일 추천</h3>

          <div className={styles.rowFlex}>
            <div className={styles.tipsBox}>
              <TipCard title="" tips={topTips} />
            </div>

            {upperList.length > 0 && (
              <div className={styles.imagesBox}>
                <div className={styles.recommendGrid}>
                  {upperList.map((item) => (
                    <div key={item.seq} className={styles.recommendCard}>
                      <img src={item.image_url} alt={item.name} className={styles.recommendImg} />
                      <p className={styles.recommendName}>{item.name}</p>
                      <button className={styles.saveBtn} onClick={() => handleSave(item)}>
                        저장하기
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== 하의 텍스트 + 하의 이미지 가로 배치 ========== */}
      {bottomTips.length > 0 && (
        <section className={styles.recommendBlock}>
          <h3 className={styles.blockTitle}>👖 하의 스타일 추천</h3>

          <div className={styles.rowFlex}>
            <div className={styles.tipsBox}>
              <TipCard title="" tips={bottomTips} />
            </div>

            {lowerList.length > 0 && (
              <div className={styles.imagesBox}>
                <div className={styles.recommendGrid}>
                  {lowerList.map((item) => (
                    <div key={item.seq} className={styles.recommendCard}>
                      <img src={item.image_url} alt={item.name} className={styles.recommendImg} />
                      <p className={styles.recommendName}>{item.name}</p>
                      <button className={styles.saveBtn} onClick={() => handleSave(item)}>
                        저장하기
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className={styles.buttonRow}>

        <button className={styles.retryBtn} onClick={goCloset}>
          내 옷장 가기
        </button>
        <button className={styles.retryBtn} onClick={() => navigate("/body/main")}>
          메인으로 돌아가기
        </button>

      </div>
    </div>
  );
};

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