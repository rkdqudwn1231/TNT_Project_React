import { useState } from "react";
import styles from "./BodyAnalyzerSize.module.css";
import { caxios } from "../../../config/config";
import { useNavigate } from "react-router-dom";

const BodyMeasurePage = () => {
  const navigate = useNavigate();
  const [isInch, setIsInch] = useState(false);

  const [measure, setMeasure] = useState({
    gender: "F",
    shoulder: "",
    bust: "",
    waist: "",
    hip: "",
    height: ""
  });

  // cm ↔ inch 변환
  const convertValue = (value, toInch) => {
    return toInch ? (value / 2.54).toFixed(1) : (value * 2.54).toFixed(1);
  };

  const toggleUnit = () => {
    const updated = { ...measure };
    Object.keys(updated).forEach((k) => {
      if (k !== "gender" && updated[k] !== "") {
        updated[k] = convertValue(updated[k], !isInch);
      }
    });
    setIsInch((prev) => !prev);
    setMeasure(updated);
  };

  const handleChange = (e) => {
    setMeasure({ ...measure, [e.target.name]: e.target.value });
  };

  // 입력값 이상치 감지
  const validateMeasure = () => {
    const { shoulder, bust, waist, hip, height } = measure;

    if (shoulder && hip && Math.abs(shoulder - hip) > 18) {
      return "어깨 또는 골반 치수가 비정상적으로 큰 차이가 있어요. 다시 확인해주세요!";
    }

    if (+waist > +bust && +waist > +hip) {
      return "허리 치수가 가슴·엉덩이보다 큰 경우는 매우 드뭅니다. 다시 입력해주세요!";
    }

    if (height && +height < 130) {
      return "키를 잘못 입력한 것 같아요. 130cm 이상인지 확인해주세요.";
    }

    return null;
  };

  const diagnose = () => {
    const warn = validateMeasure();
    if (warn) {
      alert(warn);
      return;
    }

    // 단위 전환 후 서버는 cm 기준이므로 inch → cm 변환 후 전송
    const payload = { ...measure };
    if (isInch) {
      Object.keys(payload).forEach((k) => {
        if (k !== "gender" && payload[k] !== "") {
          payload[k] = convertValue(payload[k], false);
        }
      });
    }

    caxios.post("/body/size", payload)
      .then(res => {
        navigate("/body/result", {
          state: { result: res.data }
        });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>치수로 체형 분석하기</h2>

      {/* 성별 선택 */}
      <div className={styles.genderBox}>
        <button
          className={`${styles.genderBtn} ${measure.gender === "F" && styles.active}`}
          onClick={() => setMeasure({ ...measure, gender: "F" })}
        >여성</button>
        <button
          className={`${styles.genderBtn} ${measure.gender === "M" && styles.active}`}
          onClick={() => setMeasure({ ...measure, gender: "M" })}
        >남성</button>
      </div>

      {/* 단위 전환 */}
      <div className={styles.unitToggle}>
        <span>단위:</span>
        <button onClick={toggleUnit}>
          {isInch ? "inch → cm 변환" : "cm → inch 변환"}
        </button>
      </div>

      {/* 입력 영역 */}
      <div className={styles.form}>
        {[
          { key: "shoulder", label: "어깨" },
          { key: "bust", label: "가슴/가슴둘레" },
          { key: "waist", label: "허리" },
          { key: "hip", label: "엉덩이" },
          { key: "height", label: "키" }
        ].map((field) => (
          <div key={field.key} className={styles.inputGroup}>
            <label>{field.label}</label>
            <input
              type="number"
              name={field.key}
              value={measure[field.key]}
              onChange={handleChange}
              placeholder={isInch ? "inch" : "cm"}
            />
          </div>
        ))}
      </div>

      <button className={styles.submitBtn} onClick={diagnose}>체형 진단하기</button>
    </div>
  );
};

export default BodyMeasurePage;
