import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // navigate import
import styles from "./BodyAnalyzerSurvery.module.css";
import { caxios } from "../../../config/config";

const BodyAnalyzerSurvery = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    gender: "",
    answer_q1: "",
    answer_q2: "",
    answer_q3: "",
    answer_q4: "",
    answer_q5: "",
    answer_q6: "",
    answer_q7: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (
      !form.gender ||
      !form.answer_q1 ||
      !form.answer_q2 ||
      !form.answer_q3 ||
      !form.answer_q4 ||
      !form.answer_q5 ||
      !form.answer_q6 ||
      !form.answer_q7) {
      alert("모든 문항에 응답해 주세요.");
      return;
    }

    try {
      setLoading(true);
      const res = await caxios.post("/bodySurvey/insert", form);

      // 결과 페이지로 이동하면서 데이터(res.data)를 state로 넘김
      navigate("/body/result", { state: { result: res.data } });

    } catch (err) {
      console.error(err);
      alert("진단 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
     <>
    <div className={styles.pbHeader}>Body Analysis by Survey</div>
    <form className={styles.wrapper} onSubmit={handleSubmit}>
    
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
            <span>어깨가 넓거나 각지고 직선적인 느낌이다. (T자 느낌)</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q2" value="NARROW_SLOPE_SHOULDER"
              checked={form.answer_q2 === "NARROW_SLOPE_SHOULDER"}
              onChange={() => handleChange("answer_q2", "NARROW_SLOPE_SHOULDER")} />
            <span>어깨가 좁거나 라인이 아래로 살짝 내려가 보인다.</span>
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
          4. 허리 라인은 어떤 편인가요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q3" value="CURVED_WAIST"
              checked={form.answer_q3 === "CURVED_WAIST"}
              onChange={() => handleChange("answer_q3", "CURVED_WAIST")} />
            <span>허리 굴곡이 뚜렷해 잘록하다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q3" value="STRAIGHT_WAIST"
              checked={form.answer_q3 === "STRAIGHT_WAIST"}
              onChange={() => handleChange("answer_q3", "STRAIGHT_WAIST")} />
            <span>허리 굴곡이 거의 없고 일자에 가깝다.</span>
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
          5. 골반 또는 엉덩이가 상체에 비해 어떤 비중인가요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q4" value="WIDE_HIP"
              checked={form.answer_q4 === "WIDE_HIP"}
              onChange={() => handleChange("answer_q4", "WIDE_HIP")} />
            <span>골반·엉덩이가 넓고 볼륨이 있다.</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q4" value="NARROW_HIP"
              checked={form.answer_q4 === "NARROW_HIP"}
              onChange={() => handleChange("answer_q4", "NARROW_HIP")} />
            <span>골반·엉덩이가 큰 볼륨은 없다.</span>
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
          6. 다리 모양은 어떤 모습에 더 가까운가요?
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

      {/* Q6 */}
      <section className={styles.block}>
        <h3 className={styles.question}>7. 앉아 있을 때 상체와 하체 중 어느 쪽이 더 길어 보이나요?</h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q6" value="UPPER_LONG"
              checked={form.answer_q6 === "UPPER_LONG"}
              onChange={() => handleChange("answer_q6", "UPPER_LONG")} />
            <span>상체가 더 길다</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q6" value="LOWER_LONG"
              checked={form.answer_q6 === "LOWER_LONG"}
              onChange={() => handleChange("answer_q6", "LOWER_LONG")} />
            <span>하체가 더 길다</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q6" value="BALANCED"
              checked={form.answer_q6 === "BALANCED"}
              onChange={() => handleChange("answer_q6", "BALANCED")} />
            <span>비슷하다</span>
          </label>
        </div>
      </section>

      {/* Q7 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          8. 체중이 증가하면 어느 부위에 먼저 살이 붙나요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input type="radio" name="answer_q7" value="UPPER_GAIN"
              checked={form.answer_q7 === "UPPER_GAIN"}
              onChange={() => handleChange("answer_q7", "UPPER_GAIN")} />
            <span>상체(어깨·가슴·배)부터 먼저 붙는 편</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q7" value="LOWER_GAIN"
              checked={form.answer_q7 === "LOWER_GAIN"}
              onChange={() => handleChange("answer_q7", "LOWER_GAIN")} />
            <span>하체(엉덩이·허벅지)부터 먼저 붙는 편</span>
          </label>

          <label className={styles.optionCard}>
            <input type="radio" name="answer_q7" value="EVEN_GAIN"
              checked={form.answer_q7 === "EVEN_GAIN"}
              onChange={() => handleChange("answer_q7", "EVEN_GAIN")} />
            <span>전체적으로 고르게 붙는 편</span>
          </label>
        </div>
      </section>
<div className={styles.btnBox}>
      <button className={styles.submitBtn} type="submit" disabled={loading}>
        {loading ? "진단 중..." : "진단하기"}
      </button>
      <button className={styles.backBtn} type="button" onClick={() => navigate("/body/main")}>뒤로가기</button>
      </div>
    </form>
    </>
  );
};

export default BodyAnalyzerSurvery;
