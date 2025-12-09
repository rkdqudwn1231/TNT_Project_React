import React, { useState } from "react";
import { caxios } from "../../config/config";
import styles from "./FindId.module.css";

const FindId = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [emailVerifyMessage, setEmailVerifyMessage] = useState(
    "이메일 인증을 완료해주세요."
  );
  const [foundId, setFoundId] = useState("");

  const emailRegex = /^[A-Za-z0-9]{1,15}@[A-Za-z]{3,15}\.com$/;

  const sendVerifyLink = async () => {
    if (!emailRegex.test(email)) {
      setEmailError("이메일 형식을 확인해주세요.");
      return;
    }

    try {
      await caxios.post("/auth/send-verify-link/find-id", { email });
      setEmailLinkSent(true);
      setEmailVerifyMessage(
        "메일이 전송되었습니다. 인증 후 '인증 완료' 버튼을 눌러주세요."
      );
    } catch (err) {
      alert("메일 전송 실패");
    }
  };

  const confirmEmailVerified = async () => {
    try {
      const res = await caxios.get("/auth/email-verified", {
        params: { email },
      });

      if (res.data.verified) {
        setEmailVerified(true);
        setEmailVerifyMessage("이메일 인증 완료되었습니다.");
      } else {
        setEmailVerifyMessage("아직 이메일 인증이 완료되지 않았습니다.");
      }
    } catch (err) {
      alert("확인 오류");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    try {
      const res = await caxios.get("/member/find-id", {
        params: { email },
      });

      if (res.data.id) {
        setFoundId(res.data.id);
      } else {
        alert("해당 이메일로 가입한 아이디가 없습니다.");
        setFoundId("");
      }
    } catch (err) {
      alert("조회 실패");
      setFoundId("");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>아이디 찾기</h2>

        <form className={styles.form} onSubmit={onSubmit}>
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
              onClick={() => {
                if (!emailLinkSent) sendVerifyLink();
                else confirmEmailVerified();
              }}
            >
              {emailVerified
                ? "완료"
                : emailLinkSent
                ? "인증 완료"
                : "인증 요청"}
            </button>
          </div>

          {emailError && (
            <p className={styles.notMatchMessage}>{emailError}</p>
          )}

          <p
            className={
              emailVerified ? styles.matchMessage : styles.notMatchMessage
            }
          >
            {emailVerifyMessage}
          </p>

          {/* ▶ 여기: 결과를 버튼 위에 표시 */}
          {foundId && (
            <p className={styles.matchMessage}>
              등록된 아이디는 "<strong>{foundId}</strong>" 입니다.
            </p>
          )}

          <button type="submit" className={styles.submitButton}>
            아이디 찾기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindId;
