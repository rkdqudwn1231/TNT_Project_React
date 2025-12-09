import React, { useState } from "react";
import { caxios } from "../../config/config";
import { useNavigate } from "react-router-dom";   /* ← 추가 */
import styles from "./FindPassword.module.css";

const FindPassword = () => {
  const navigate = useNavigate();  /* ← 추가 */

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [emailVerifyMessage, setEmailVerifyMessage] = useState("이메일 인증을 완료해주세요.");

  // 새 비밀번호 관련 상태
  const [showResetInputs, setShowResetInputs] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwMatchMessage, setPwMatchMessage] = useState("");

  const emailRegex = /^[A-Za-z0-9]{1,15}@[A-Za-z]{3,15}\.com$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

  // 이메일 인증 링크 요청
  const sendVerifyLink = async () => {
    if (!emailRegex.test(email)) {
      setEmailError("이메일 형식을 확인해주세요.");
      return;
    }

    try {
      await caxios.post("/auth/send-verify-link/reset-password", { email });
      setEmailLinkSent(true);
      setEmailVerifyMessage("메일이 전송되었습니다. 인증 후 '인증 완료' 버튼을 눌러주세요.");
    } catch {
      alert("메일 전송 실패");
    }
  };

  // 이메일 인증 여부 확인
  const confirmEmailVerified = async () => {
    try {
      const res = await caxios.get("/auth/email-verified", { params: { email } });

      if (res.data.verified) {
        setEmailVerified(true);
        setEmailVerifyMessage("이메일 인증이 완료되었습니다.");
      } else {
        setEmailVerifyMessage("아직 이메일 인증이 완료되지 않았습니다.");
      }
    } catch {
      alert("확인 오류");
    }
  };

  // 새비밀번호 입력 시 검증
  const handleNewPwChange = (v) => {
    setNewPw(v);

    if (!passwordRegex.test(v)) {
      setPwError("영문+숫자+특수문자 포함 8~15자로 입력해주세요.");
    } else {
      setPwError("");
    }

    if (newPwConfirm.length > 0) {
      if (v === newPwConfirm) setPwMatchMessage("비밀번호가 일치합니다.");
      else setPwMatchMessage("비밀번호가 일치하지 않습니다.");
    }
  };

  // 새비밀번호 확인 입력 시 검증
  const handleNewPwConfirmChange = (v) => {
    setNewPwConfirm(v);

    if (newPw === v) setPwMatchMessage("비밀번호가 일치합니다.");
    else setPwMatchMessage("비밀번호가 일치하지 않습니다.");
  };

  // 비밀번호 재설정 버튼 눌렀을 때
  const onResetPassword = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    if (!passwordRegex.test(newPw)) {
      alert("비밀번호 형식을 확인해주세요.");
      return;
    }

    if (newPw !== newPwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await caxios.post("/member/reset-password", {
        email: email,
        newPassword: newPw
      });

      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/");   /* ← 변경 후 홈으로 이동 */
    } catch {
      alert("비밀번호 변경 실패");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>비밀번호 재설정</h2>

        <form className={styles.form} onSubmit={onResetPassword}>
          <label className={styles.label}>가입한 이메일</label>

          <div className={styles.emailRow}>
            <input
              type="email"
              className={styles.emailInput}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              placeholder="가입한 이메일 입력"
            />

            <button
              type="button"
              className={styles.verifyButton}
              disabled={emailVerified}
              onClick={() =>
                !emailLinkSent ? sendVerifyLink() : confirmEmailVerified()
              }
            >
              {emailVerified ? "완료" : emailLinkSent ? "인증 완료" : "인증 요청"}
            </button>
          </div>

          {emailError && <p className={styles.notMatchMessage}>{emailError}</p>}

          <p
            className={
              emailVerified ? styles.matchMessage : styles.notMatchMessage
            }
          >
            {emailVerifyMessage}
          </p>

          {/* 이메일 인증 완료되면 비밀번호 입력창 나타남 */}
          {emailVerified && (
            <>
              <button
                type="button"
                className={styles.submitButton}
                onClick={() => setShowResetInputs(true)}
              >
                비밀번호 재설정
              </button>
            </>
          )}

          {/* 새 비밀번호 입력 영역 */}
          {showResetInputs && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>새 비밀번호</label>
                <input
                  type="password"
                  className={styles.input}
                  value={newPw}
                  onChange={(e) => handleNewPwChange(e.target.value)}
                  placeholder="새 비밀번호"
                />
                {pwError && <p className={styles.notMatchMessage}>{pwError}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>새 비밀번호 확인</label>
                <input
                  type="password"
                  className={styles.input}
                  value={newPwConfirm}
                  onChange={(e) => handleNewPwConfirmChange(e.target.value)}
                  placeholder="새 비밀번호 확인"
                />
                {pwMatchMessage && (
                  <p
                    className={
                      pwMatchMessage.includes("일치합니다")
                        ? styles.matchMessage
                        : styles.notMatchMessage
                    }
                  >
                    {pwMatchMessage}
                  </p>
                )}
              </div>

              {/* 최종 완료 버튼 */}
              <button type="submit" className={styles.submitButton}>
                재설정 완료
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default FindPassword;
