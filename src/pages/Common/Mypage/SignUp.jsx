// src/components/SignUp.jsx
import React, { useState } from "react";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [form, setForm] = useState({
    profileImage: null,
    name: "",
    gender: "",
    userId: "",
    password: "",
    phone: "",
    birth: "",
    personalColor: "",
    bodyType: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];
      setForm((prev) => ({ ...prev, profileImage: file }));
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 form 데이터를 서버로 전송하면 됨
    console.log("회원가입 데이터:", form);
    alert("회원가입 요청이 콘솔에 출력되었습니다.");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원가입</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 프로필 이미지 */}
        <div className={styles.profileWrapper}>
          <div className={styles.profileImageBox}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="프로필 미리보기"
                className={styles.profileImage}
              />
            ) : (
              <span className={styles.profilePlaceholder}>이미지 없음</span>
            )}
          </div>
          <label className={styles.fileLabel}>
            프로필 이미지 업로드
            <input
              type="file"
              accept="image/*"
              name="profileImage"
              onChange={handleChange}
            />
          </label>
        </div>

        {/* 이름 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>이름</label>
          <input
            type="text"
            name="name"
            className={styles.input}
            value={form.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        {/* 성별 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>성별</label>
          <select
            name="gender"
            className={styles.select}
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="female">여성</option>
            <option value="male">남성</option>
            <option value="other">기타</option>
          </select>
        </div>

        {/* 아이디 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>아이디</label>
          <input
            type="text"
            name="userId"
            className={styles.input}
            value={form.userId}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            required
          />
        </div>

        {/* 비밀번호 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>비밀번호</label>
          <input
            type="password"
            name="password"
            className={styles.input}
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        {/* 휴대전화 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>휴대전화</label>
          <input
            type="tel"
            name="phone"
            className={styles.input}
            value={form.phone}
            onChange={handleChange}
            placeholder="예: 010-1234-5678"
            required
          />
        </div>

        {/* 생년월일 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>생년월일</label>
          <input
            type="date"
            name="birth"
            className={styles.input}
            value={form.birth}
            onChange={handleChange}
            required
          />
        </div>

        {/* 퍼스널 컬러 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>퍼스널 컬러</label>
          <select
            name="personalColor"
            className={styles.select}
            value={form.personalColor}
            onChange={handleChange}
          >
            <option value="">선택하세요</option>
            <option value="spring">봄웜</option>
            <option value="summer">여름쿨</option>
            <option value="autumn">가을웜</option>
            <option value="winter">겨울쿨</option>
          </select>
        </div>

        {/* 퍼스널 체형 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>퍼스널 체형</label>
          <select
            name="bodyType"
            className={styles.select}
            value={form.bodyType}
            onChange={handleChange}
          >
            <option value="">선택하세요</option>
            <option value="triangle">삼각형</option>
            <option value="invertedTriangle">역삼각형</option>
            <option value="rectangle">스트레이트형</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;
