import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { caxios } from "../../config/config";
import styles from "./Login.module.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from;
  const result = location.state?.result;

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await caxios.post("/auth/login", {
        id: id,
        pw: pw
      });
      console.log("로그인 응답 전체:", resp.data);
      // 받아온 토큰 저장
      const token = resp.data.token;
      sessionStorage.setItem("token", token);

      // 사용자 정보 저장할 수도 있음 (선택)
      sessionStorage.setItem("id", resp.data.id);
      sessionStorage.setItem("roles", resp.data.roles);
      sessionStorage.setItem("nickname", resp.data.nickname);
      // 로그인 성공 시 이동
      if (from) {
        navigate(from, { state: { result } });
      } else {
        navigate("/");
      }


    } catch (err) {
      console.error(err);
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>로그인</h2>
        <p className={styles.subText}>
          나에게 맞는 퍼스널컬러와 스타일을 찾아보세요
        </p>

        <form className={styles.form} onSubmit={onSubmit}>

          <div className={styles.formGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={styles.input}
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              className={styles.input}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>

          <div className={styles.links}>
            <Link to="/Login/find-id" className={styles.link}>아이디 찾기</Link>
            <Link to="/Login/find-password" className={styles.link}>비밀번호 찾기</Link>
            <span>·</span>
            <Link to="/signup" className={styles.link}>회원가입</Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
