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

  const [loading, setLoading] = useState(false);
useEffect(() => {
    if (!result) return;
    const bodyType = result.BODY_TYPE;
    const gender = result.GENDER || localStorage.getItem("gender");

   // 상의 추천 가져오기
    caxios.get("/BodyRecommend/list", {
      params: { body_type: bodyType, gender, cloth_type: "upper" }
    })
      .then(res => setUpperList(res.data))
      .catch(err => console.log("상의 추천 오류", err));

    // 하의 추천 가져오기
    caxios.get("/BodyRecommend/list", {
      params: { body_type: bodyType, gender, cloth_type: "lower" }
    })
      .then(res => setLowerList(res.data))
      .catch(err => console.log("하의 추천 오류", err));
 }, [result]); 

const goCloset = () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    navigate("/login", { state: { from: "/fitroom/closet" } });
    return;
  }

  navigate("/fitroom/closet");
};

  const handleSave = (item) => {
    caxios.post("/BodyRecommend/saveRecommend", {
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

  // 카카오톡 공유하기
useEffect(() => {

  if (result) return;

  setLoading(true);
  let typeFromUrl = null;

  // 일반 쿼리 파라미터 방식 (?type=H)
  const queryParams = new URLSearchParams(location.search);
  typeFromUrl = queryParams.get("body_type");
  let genderFromUrl = null;
  genderFromUrl = queryParams.get("gender");

  // 카카오 인앱 브라우저 해시 방식 (#/body/result?type=H)
  if (!typeFromUrl && window.location.hash.includes("body_type=")) {
    const hashPart = window.location.hash.split("?")[1];
    if (hashPart) {
      const hashParams = new URLSearchParams(hashPart);
      typeFromUrl = hashParams.get("body_type");
    }
  }

  // React Router의 location.search도 체크 (혹시 모를 경우 대비)
  if (!typeFromUrl && location.pathname.includes("result")) {
    const pathParams = new URLSearchParams(location.search);
    typeFromUrl = pathParams.get("body_type");
  }

  console.log("디버깅 정보:");
  console.log("location.search:", location.search);
  console.log("window.location.hash:", window.location.hash);
  console.log("추출된 type:", typeFromUrl);

  if (!typeFromUrl) {
    alert("잘못된 접근입니다. 진단을 먼저 진행해 주세요.");
    navigate("/body/main");
    setLoading(false);
    return;
  }

  console.log("공유 링크 접속 확인. 타입:", typeFromUrl);

  // 공유 링크 재접속 → 해당 타입의 체형 데이터 불러오기
  caxios
    .get(`/bodyType/result`, { params: { body_type: typeFromUrl , gender :genderFromUrl } })
    .then((res) => {
      console.log("API 응답:", res.data);
      setResult(res.data);
      if (res.data.GENDER || res.data.gender) {
        localStorage.setItem("gender", res.data.GENDER || res.data.gender);
      }
    })
    .catch((err) => {
      console.error("공유 결과 불러오기 오류:", err);
      console.error("에러 상세:", err.response?.data);
      alert("결과를 불러올 수 없습니다.");
      navigate("/body/main");
    })
    .finally(() => {
      setLoading(false);
    });
}, [location.search, location.pathname, navigate, result]);

  if (!result) return <div>결과를 불러오는 중입니다...</div>;

  const body_type = result.BODY_TYPE || result.body_type;
  const gender = result.GENDER || result.gender;
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

  if (loading) {
  return (
    <div className={styles.wrapper}>
      <div style={{ textAlign: "center", padding: "50px" }}>
        결과를 불러오는 중입니다...
      </div>
    </div>
  );
}

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
              linkPath={`/body/result?body_type=${body_type}&gender=${gender}`}

            />
          </div>
        </div>
      </div>

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