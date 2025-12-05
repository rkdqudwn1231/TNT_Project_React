import { useState } from "react";
import styles from "./BodyAnalyzerSize.module.css";
import { caxios } from "../../../config/config";
import { useNavigate } from "react-router-dom";

const BodyAnalyzerSize = () => {
  const navigate = useNavigate();
  const [measure, setMeasure] = useState({
    gender: "F", // default
    shoulder: "",
    bust: "",
    waist: "",
    hip: "",
    height: ""
  });

  const handleChange = (e) => {
    setMeasure({
      ...measure,
      [e.target.name]: e.target.value,
    });
  };

  const diagnose = () => {
    caxios.post("/body/measure", measure)
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

      <div className={styles.form}>
        {["shoulder", "bust", "waist", "hip", "height"].map((field) => (
          <div key={field} className={styles.inputGroup}>
            <label>{field.toUpperCase()}</label>
            <input
              type="number"
              name={field}
              value={measure[field]}
              onChange={handleChange}
              placeholder="cm"
            />
          </div>
        ))}
      </div>

      <button className={styles.submitBtn} onClick={diagnose}>
        체형 진단하기
      </button>
    </div>
  );
};

export default BodyAnalyzerSize;
