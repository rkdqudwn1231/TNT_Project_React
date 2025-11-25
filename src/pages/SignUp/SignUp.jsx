import React, { useState } from "react";
import { caxios } from "../../config/config";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    nickname: "",
    userId: "",
    password: "",
    phone: "",
    birth: "",
    email: "",
    personalColor: "",
    bodyType: "",
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 실시간 비밀번호 일치 여부
  const isPasswordMatch =
    form.password && passwordConfirm
      ? form.password === passwordConfirm
      : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 📩 이메일 인증번호 요청
  const sendAuthCode = async () => {
    if (!form.email) {
      alert("이메일을 입력하세요.");
      return;
    }

    try {
      const res = await caxios.post("/auth/send-code", {
        email: form.email,
      });

      alert(res.data.message || "인증번호가 발송되었습니다.");
    } catch (err) {
      console.error(err);
      alert("인증번호 발송 실패");
    }
  };

  // 🔍 인증코드 체크
  const checkAuthCode = async () => {
    try {
      const res = await caxios.post("/auth/verify-code", {
        email: form.email,
        code: authCode,
      });

      if (res.data.verified === true) {
        alert("이메일 인증 완료!");
        setEmailVerified(true);
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("인증 확인 실패");
    }
  };

  // 📝 회원가입
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (form.password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await caxios.post("/auth/signup", form);
      alert(res.data.message || "회원가입 성공");
    } catch (err) {
      console.error(err);
      alert("회원가입 실패");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원가입</h2>

      <form className={styles.form} onSubmit={handleSubmit}>

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
          </select>
        </div>

        {/* 닉네임 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>닉네임</label>
          <input
            type="text"
            name="nickname"
            className={styles.input}
            value={form.nickname}
            onChange={handleChange}
            placeholder="예: pinky"
            required
          />
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

        {/* 비밀번호 확인 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>비밀번호 확인</label>
          <input
            type="password"
            className={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />

          {/* ✔ 실시간 문구 복원 */}
          {passwordConfirm.length > 0 && (
            <p
              className={
                isPasswordMatch
                  ? styles.matchMessage
                  : styles.notMatchMessage
              }
            >
              {isPasswordMatch
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </p>
          )}
        </div>

        {/* 이메일 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>이메일</label>
          <div className={styles.emailRow}>
            <input
              type="email"
              name="email"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              placeholder="예: pinky@example.com"
              required
              disabled={emailVerified}
            />

            <button
              type="button"
              className={styles.verifyButton}
              onClick={sendAuthCode}
              disabled={emailVerified}
            >
              {emailVerified ? "완료" : "인증 요청"}
            </button>
          </div>
        </div>

        {/* 인증코드 */}
        {!emailVerified && (
          <div className={styles.formGroup}>
            <label className={styles.label}>인증코드</label>
            <div className={styles.emailRow}>
              <input
                type="text"
                className={styles.input}
                placeholder="인증번호 입력"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <button
                type="button"
                className={styles.verifyButton}
                onClick={checkAuthCode}
              >
                확인
              </button>
            </div>
          </div>
        )}

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
