import React from "react";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>로그인</h2>
        <p className={styles.subText}>
          나에게 맞는 퍼스널컬러와 스타일을 찾아보세요
        </p>

        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={styles.input}
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              className={styles.input}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button className={styles.loginButton}>로그인</button>

          <div className={styles.links}>
            <a href="#" className={styles.link}>아이디 찾기</a>
            <span>·</span>
            <a href="#" className={styles.link}>비밀번호 찾기</a>
            <span>·</span>
            <a href="#" className={styles.link}>회원가입</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
