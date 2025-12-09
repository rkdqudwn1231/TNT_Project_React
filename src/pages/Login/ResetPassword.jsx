import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { caxios } from "../../config/config";
import styles from "./Login.module.css";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await caxios.post("/auth/reset-password", { token, pw });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/login");
    } catch (err) {
      alert("비밀번호 재설정 실패");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>비밀번호 재설정</h2>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>새 비밀번호</label>
          <input
            type="password"
            className={styles.input}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="새 비밀번호 입력"
          />

          <label className={styles.label}>비밀번호 확인</label>
          <input
            type="password"
            className={styles.input}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="비밀번호 확인"
          />

          {error && <p className={styles.notMatchMessage}>{error}</p>}

          <button type="submit" className={styles.loginButton}>
            변경하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
