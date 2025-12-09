import { useState } from "react";
import styles from "./BodyAnalyzerSize.module.css";
import { caxios } from "../../../config/config";
import { useNavigate } from "react-router-dom";

const BodyAnalyzerSize = () => {

  const navigate = useNavigate();

  const [highlight, setHighlight] = useState(null);

  const [size, setSize] = useState({
    gender: "F",
    shoulder: "",
    bust: "",
    waist: "",
    hip: ""
  });

// 치수 입력 상태변수
const handleChange = (e) => {
  const { name, value } = e.target;

  // 숫자만 허용
  let onlyNum = value.replace(/[^0-9]/g, "");

  // 3자리 이상 입력 불가
  if (onlyNum.length > 3) return;

  setSize({ ...size, [name]: onlyNum });
};

  const diagnose = () => {

    // 입력값 검증
    for (const key of ["shoulder", "bust", "waist", "hip"]) {
      if (!size[key]) {
        setHighlight(key);
        alert("모든 치수를 입력해 주세요.");
        return;
      }
    }

    caxios
      .post("/bodySize/insert", size)
      .then((res) => {
        navigate("/body/result", { state: { result: res.data } });
      })
      .catch(console.error);
  };

  return (

    <div className={styles.container}>
      <div className={styles.pbHeader}>Body Analysis by Size</div>
  
      <div className={styles.layoutRow}>
        <div className={styles.left}>
          <img
            className={styles.guideImg}
            src="/images/body/치수측정도움UI.png"
            alt="측정 가이드"
          />
        </div>

        <div className={styles.middle}>
          <SizeCard
            title="어깨 (Shoulder)"
            summary="넓이 측정"
            text="왼쪽 어깨 끝에서 오른쪽 어깨 끝까지 일직선으로 측정"
            onClick={() => setHighlight("shoulder")}
          />
          <SizeCard
            title="가슴 (Bust)"
            summary="둘레 측정"
            text="가슴이 가장 넓은 부분을 줄자로 한 바퀴 둘러 측정"
            onClick={() => setHighlight("bust")}
          />
          <SizeCard
            title="허리 (Waist)"
            summary="둘레 측정"
            text="배꼽 위 2~3cm, 가장 잘록한 부분을 줄자로 측정"
            onClick={() => setHighlight("waist")}
          />
          <SizeCard
            title="엉덩이 (Hip)"
            summary="둘레 측정"
            text="엉덩이가 가장 넓은 부분을 줄자로 한 바퀴 둘러 측정"
            onClick={() => setHighlight("hip")}
          />
        </div>

        <div className={styles.right}>

          <div className={styles.genderBox}>
            <button
              className={`${styles.genderBtn} ${size.gender === "F" && styles.active}`}
              onClick={() => setSize({ ...size, gender: "F" })}
            >여성</button>
            <button
              className={`${styles.genderBtn} ${size.gender === "M" && styles.active}`}
              onClick={() => setSize({ ...size , gender: "M" })}
            >남성</button>
          </div>

          {/* 입력 칸 */}
          {["shoulder", "bust", "waist", "hip"].map((key) => (
            <div
              key={key}
              className={`${styles.inputGroup} ${highlight === key && styles.inputActive}`}
            >
              <label>
                {key === "shoulder" && "어깨"}
                {key === "bust" && "가슴 둘레"}
                {key === "waist" && "허리 둘레"}
                {key === "hip" && "엉덩이 둘레"}
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name={key}
                placeholder="cm"
                value={size[key]}
                onChange={handleChange}
              />
            </div>

          ))}
          <div className={styles.btnBox}>
            <button className={styles.submitBtn} onClick={diagnose}>
              진단하기
            </button>
            <button className={styles.backBtn} type="button" onClick={() => navigate("/body/main")}>
              뒤로가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 카드 분리 컴포넌트
const SizeCard = ({ icon, title, summary, text, onClick }) => (
  <div className={styles.sizeCard} onClick={onClick}>
    <div className={styles.cardHeader}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.badge}>{summary}</span>
    </div>
    <h4>{title}</h4>
    <p>{text}</p>
  </div>
);

export default BodyAnalyzerSize;
