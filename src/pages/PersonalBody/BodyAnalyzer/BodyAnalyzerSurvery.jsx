import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // navigate import
import styles from "./BodyAnalyzerSurvery.module.css";
import { caxios } from "../../../config/config";

const BodyAnalyzerSurvery = () => {
  const navigate = useNavigate(); // 훅 초기화

  const [form, setForm] = useState({
    gender: "",
    answer_q1: "",
    answer_q2: "",
    answer_q3: "",
    answer_q4: "",
    answer_q5: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!form.gender || !form.answer_q1 || !form.answer_q2 || !form.answer_q3 || !form.answer_q4 || !form.answer_q5) {
      alert("모든 문항에 응답해 주세요.");
      return;
    }

    try {
      setLoading(true);
      const res = await caxios.post("/api/body/survey", form);
      
      // [핵심 변경] 결과 페이지로 이동하면서 데이터(res.data)를 state로 넘김
      navigate("/body/result", { state: { result: res.data } });

    } catch (err) {
      console.error(err);
      alert("진단 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <div className={styles.title}>체형 설문 진단</div>

      {/* 성별 */}
      <section className={styles.block}>
        <h3 className={styles.question}>1. 성별을 선택해 주세요.</h3>
        <div className={styles.optionsRow}>
          <label className={styles.optionCard}>
            <input type="radio" name="gender" value="F"
              checked={form.gender === "F"}
              onChange={() => handleChange("gender", "F")} />
            <span>여성</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="gender" value="M"
              checked={form.gender === "M"}
              onChange={() => handleChange("gender", "M")} />
            <span>남성</span>
          </label>
        </div>
      </section>

      {/* Q1 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          2. 전체적으로 봤을 때 상체와 하체 중 어느 쪽이 더 먼저 눈에 띄나요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q1" value="UPPER_DOMINANT"
              checked={form.answer_q1 === "UPPER_DOMINANT"}
              onChange={() => handleChange("answer_q1", "UPPER_DOMINANT")} />
            <span>
              상체(어깨·가슴)가 먼저 보이고 상대적으로 하체는 덜 부각된다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q1" value="LOWER_DOMINANT"
              checked={form.answer_q1 === "LOWER_DOMINANT"}
              onChange={() => handleChange("answer_q1", "LOWER_DOMINANT")} />
            <span>
              하체(골반·엉덩이·허벅지)가 먼저 보이고 상체는 덜 부각된다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q1" value="BALANCED"
              checked={form.answer_q1 === "BALANCED"}
              onChange={() => handleChange("answer_q1", "BALANCED")} />
            <span>
              상체와 하체가 전체적으로 비슷한 비중으로 보인다.
            </span>
          </label>
        </div>
      </section>

      {/* Q2 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          3. 어깨 라인은 어떤 느낌인가요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q2" value="WIDE_SHOULDER"
              checked={form.answer_q2 === "WIDE_SHOULDER"}
              onChange={() => handleChange("answer_q2", "WIDE_SHOULDER")} />
            <span>어깨가 넓거나 각지고 직선적인 느낌이다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q2" value="NARROW_SLOPE_SHOULDER"
              checked={form.answer_q2 === "NARROW_SLOPE_SHOULDER"}
              onChange={() => handleChange("answer_q2", "NARROW_SLOPE_SHOULDER")} />
            <span>어깨가 좁거나 살짝 내려가 보인다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q2" value="NORMAL_SHOULDER"
              checked={form.answer_q2 === "NORMAL_SHOULDER"}
              onChange={() => handleChange("answer_q2", "NORMAL_SHOULDER")} />
            <span>어깨선이 자연스럽고 크게 튀지 않는다.</span>
          </label>
        </div>
      </section>

      {/* Q3 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          4. 허리 라인은 어떤가요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q3" value="CURVED_WAIST"
              checked={form.answer_q3 === "CURVED_WAIST"}
              onChange={() => handleChange("answer_q3", "CURVED_WAIST")} />
            <span>허리가 잘록하다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q3" value="STRAIGHT_WAIST"
              checked={form.answer_q3 === "STRAIGHT_WAIST"}
              onChange={() => handleChange("answer_q3", "STRAIGHT_WAIST")} />
            <span>허리 굴곡이 거의 없다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q3" value="BELLY_CENTER"
              checked={form.answer_q3 === "BELLY_CENTER"}
              onChange={() => handleChange("answer_q3", "BELLY_CENTER")} />
            <span>허리보다 배 중심으로 보인다.</span>
          </label>
        </div>
      </section>

      {/* Q4 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          5. 하체의 비중은 어떤가요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q4" value="WIDE_HIP"
              checked={form.answer_q4 === "WIDE_HIP"}
              onChange={() => handleChange("answer_q4", "WIDE_HIP")} />
            <span>골반·엉덩이가 크고 부각된다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q4" value="NARROW_HIP"
              checked={form.answer_q4 === "NARROW_HIP"}
              onChange={() => handleChange("answer_q4", "NARROW_HIP")} />
            <span>하체가 슬림하고 상체가 더 눈에 띈다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q4" value="NORMAL_HIP"
              checked={form.answer_q4 === "NORMAL_HIP"}
              onChange={() => handleChange("answer_q4", "NORMAL_HIP")} />
            <span>골반·엉덩이가 과도하게 크거나 작지 않다.</span>
          </label>
        </div>
      </section>

      {/* Q5 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          6. 다리 라인이 가장 가까운 모습은?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q5" value="O_LEG"
              checked={form.answer_q5 === "O_LEG"}
              onChange={() => handleChange("answer_q5", "O_LEG")} />
            <span>다리가 바깥으로 휘어 보인다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q5" value="X_LEG"
              checked={form.answer_q5 === "X_LEG"}
              onChange={() => handleChange("answer_q5", "X_LEG")} />
            <span>무릎은 붙고 종아리가 벌어진다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q5" value="NORMAL_LEG"
              checked={form.answer_q5 === "NORMAL_LEG"}
              onChange={() => handleChange("answer_q5", "NORMAL_LEG")} />
            <span>다리가 비교적 곧고 특이하게 휘어 보이지 않는다</span>
          </label>
        </div>
      </section>

      <button className={styles.submitBtn} type="submit" disabled={loading}>
        {loading ? "진단 중..." : "체형 진단하기"}
      </button>
    </form>
  );
};

export default BodyAnalyzerSurvery;
