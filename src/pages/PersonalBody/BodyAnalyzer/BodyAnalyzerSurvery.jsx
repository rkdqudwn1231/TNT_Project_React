import React, { useState } from "react";
import styles from "./BodyAnalyzerSurvery.module.css";
import { caxios } from "../../../config/config";

const BodyAnalyzerSurvery = ({ onResult }) => {
  const [form, setForm] = useState({
    gender: "",      // 'F' or 'M'
    answer_q1: "",
    answer_q2: "",
    answer_q3: "",
    answer_q4: "",
    answer_q5: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 간단 검증
    if (!form.gender || !form.answer_q1 || !form.answer_q2 || !form.answer_q3 || !form.answer_q4 || !form.answer_q5) {
      alert("모든 문항에 응답해 주세요.");
      return;
    }

    try {
      setLoading(true);
      const res = await caxios.post("/api/body/survey", form);
      if (onResult) onResult(res.data);
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
            <input
              type="radio"
              name="gender"
              value="F"
              checked={form.gender === "F"}
              onChange={() => handleChange("gender", "F")}
            />
            <span>여성</span>
          </label>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="gender"
              value="M"
              checked={form.gender === "M"}
              onChange={() => handleChange("gender", "M")}
            />
            <span>남성</span>
          </label>
        </div>
      </section>

      {/* Q1 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          2. 거울이나 사진에서 봤을 때,<br />
          상체와 하체 중 어떤 쪽이 더 먼저 눈에 띄나요?
        </h3>
        <p className={styles.helper}>
          평소 옷을 입었을 때 느낌을 기준으로 가장 가까운 것을 골라주세요.
        </p>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q1"
              value="UPPER_DOMINANT"
              checked={form.answer_q1 === "UPPER_DOMINANT"}
              onChange={() => handleChange("answer_q1", "UPPER_DOMINANT")}
            />
            <span>
              상체(어깨·가슴)가 더 넓거나 먼저 보인다.<br />
              티셔츠/셔츠는 잘 맞는데, 바지는 비교적 여유롭거나 잘 맞는 편이다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q1"
              value="LOWER_DOMINANT"
              checked={form.answer_q1 === "LOWER_DOMINANT"}
              onChange={() => handleChange("answer_q1", "LOWER_DOMINANT")}
            />
            <span>
              하체(골반·엉덩이·허벅지)가 더 넓거나 먼저 보인다.<br />
              바지는 자주 꽉 끼거나 사이즈를 올려야 하고, 상의는 비교적 잘 맞는 편이다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q1"
              value="BALANCED"
              checked={form.answer_q1 === "BALANCED"}
              onChange={() => handleChange("answer_q1", "BALANCED")}
            />
            <span>
              상체와 하체가 비슷한 너비로 보이고,<br />
              상의/하의 모두 크게 불편한 부분 없이 비슷한 사이즈로 맞는다.
            </span>
          </label>
        </div>
      </section>

      {/* Q2 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          3. 상의를 입었을 때 어깨 부분은 어떤 편인가요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q2"
              value="WIDE_SHOULDER"
              checked={form.answer_q2 === "WIDE_SHOULDER"}
              onChange={() => handleChange("answer_q2", "WIDE_SHOULDER")}
            />
            <span>
              어깨선이 자주 튀어나오거나 각져 보인다.<br />
              상의의 어깨선이 바깥쪽으로 벌어지거나 위로 올라오는 편이다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q2"
              value="NARROW_SLOPE_SHOULDER"
              checked={form.answer_q2 === "NARROW_SLOPE_SHOULDER"}
              onChange={() => handleChange("answer_q2", "NARROW_SLOPE_SHOULDER")}
            />
            <span>
              어깨선이 안쪽으로 들어가거나 내려가 보인다.<br />
              어깨가 둥글고 라운드형이며, 어깨선이 아래로 떨어지는 편이다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q2"
              value="NORMAL_SHOULDER"
              checked={form.answer_q2 === "NORMAL_SHOULDER"}
              onChange={() => handleChange("answer_q2", "NORMAL_SHOULDER")}
            />
            <span>
              어깨선이 크게 튀어나오거나 내려간 느낌 없이<br />
              옷의 어깨선과 자연스럽게 잘 맞는 편이다.
            </span>
          </label>
        </div>
      </section>

      {/* Q3 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          4. 정면/옆에서 보았을 때 허리 라인은 어떤가요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q3"
              value="CURVED_WAIST"
              checked={form.answer_q3 === "CURVED_WAIST"}
              onChange={() => handleChange("answer_q3", "CURVED_WAIST")}
            />
            <span>
              허리가 눈에 띄게 잘록하고, 상의나 원피스를 입으면<br />
              허리 라인이 또렷하게 드러난다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q3"
              value="STRAIGHT_WAIST"
              checked={form.answer_q3 === "STRAIGHT_WAIST"}
              onChange={() => handleChange("answer_q3", "STRAIGHT_WAIST")}
            />
            <span>
              허리 굴곡이 거의 없고, 상체가 일자 실루엣에 가깝다.<br />
              허리를 조이는 옷보다는 일자 핏이 더 편하다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q3"
              value="BELLY_CENTER"
              checked={form.answer_q3 === "BELLY_CENTER"}
              onChange={() => handleChange("answer_q3", "BELLY_CENTER")}
            />
            <span>
              허리보다 배 부분이 더 먼저 보인다.<br />
              상의를 넣어 입으면 복부가 부각되는 편이다.
            </span>
          </label>
        </div>
      </section>

      {/* Q4 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          5. 바지/스커트를 입었을 때 골반·엉덩이 느낌은 어떤가요?
        </h3>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q4"
              value="WIDE_HIP"
              checked={form.answer_q4 === "WIDE_HIP"}
              onChange={() => handleChange("answer_q4", "WIDE_HIP")}
            />
            <span>
              골반·엉덩이 부분이 자주 꽉 끼거나 도드라져 보인다.<br />
              힙 라인이 너무 부각되어 바지/스커트 사이즈를 올리는 편이다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q4"
              value="NARROW_HIP"
              checked={form.answer_q4 === "NARROW_HIP"}
              onChange={() => handleChange("answer_q4", "NARROW_HIP")}
            />
            <span>
              골반·엉덩이는 슬림한 편이고,<br />
              상체 쪽이 더 먼저 보이거나 부각된다고 느낀다.
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q4"
              value="NORMAL_HIP"
              checked={form.answer_q4 === "NORMAL_HIP"}
              onChange={() => handleChange("answer_q4", "NORMAL_HIP")}
            />
            <span>
              골반·엉덩이가 지나치게 크거나 작게 느껴지지 않고<br />
              상체와 비슷한 비중으로 보인다.
            </span>
          </label>
        </div>
      </section>

      {/* Q5 */}
      <section className={styles.block}>
        <h3 className={styles.question}>
          6. 다리 라인은 어떤 모습에 더 가깝나요?
        </h3>
        <p className={styles.helper}>
          맨다리 또는 슬림한 바지를 입었을 때 정면에서 봤을 때를 기준으로 골라주세요.
        </p>
        <div className={styles.optionsColumn}>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q5"
              value="O_LEG"
              checked={form.answer_q5 === "O_LEG"}
              onChange={() => handleChange("answer_q5", "O_LEG")}
            />
            <span>
              다리를 붙이고 섰을 때 무릎 안쪽이 잘 붙지 않고,<br />
              허벅지와 종아리 사이가 바깥으로 휘어 보인다. (O 다리)
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q5"
              value="X_LEG"
              checked={form.answer_q5 === "X_LEG"}
              onChange={() => handleChange("answer_q5", "X_LEG")}
            />
            <span>
              다리를 붙이고 섰을 때 무릎은 먼저 붙는데,<br />
              종아리 아래가 벌어져 보인다. (X 다리)
            </span>
          </label>

          <label className={styles.optionCard}>
            <input
              type="radio"
              name="answer_q5"
              value="NORMAL_LEG"
              checked={form.answer_q5 === "NORMAL_LEG"}
              onChange={() => handleChange("answer_q5", "NORMAL_LEG")}
            />
            <span>
              다리가 비교적 일자로 곧게 보이고,<br />
              특이하게 휘어 보이는 부분은 없다.
            </span>
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
