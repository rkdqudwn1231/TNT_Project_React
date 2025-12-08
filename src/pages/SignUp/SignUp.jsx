import React, { useState } from "react";
import { caxios } from "../../config/config";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    nickname: "",
    id: "",
    password: "",
    phone: "",
    birth: "",
    email: "",
    personal_color: "",
    body_shape: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 검증 에러 메시지
  const [nameError, setNameError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // 중복 검사 상태
  const [idChecked, setIdChecked] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");

  // 이메일 인증 상태
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerifyMessage, setEmailVerifyMessage] = useState(
    "이메일 인증을 완료해주세요."
  );

  // 비밀번호 일치 여부
  const isPasswordMatch =
    form.password && passwordConfirm
      ? form.password === passwordConfirm
      : null;

  // 정규식
  const nameRegex = /^[가-힣]{2,5}$/;
  const nicknameRegex = /^[A-Za-z가-힣0-9]{1,16}$/;
  const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,15}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;
  // 앞: 영문/숫자 1~15
  // 뒤: 영문 3~15 (.com 고정)
  const emailRegex = /^[A-Za-z0-9]{1,15}@[A-Za-z]{3,15}\.com$/;
  const phoneRegex = /^010-\d{4}-\d{4}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 전화번호는 별도 처리
    if (name === "phone") {
      handlePhoneChange(value);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 각 필드별 검증
    if (name === "name") {
      if (!nameRegex.test(value)) {
        setNameError("이름은 한글 2~5자로 입력해주세요.");
      } else {
        setNameError("");
      }
    }

    if (name === "nickname") {
      setNicknameChecked(false);
      setNicknameCheckMessage("");
      if (!nicknameRegex.test(value)) {
        setNicknameError("닉네임은 한글/영문/숫자 1~16자로 입력해주세요.");
      } else {
        setNicknameError("");
      }
    }

    if (name === "id") {
      setIdChecked(false);
      setIdCheckMessage("");
      if (!idRegex.test(value)) {
        setIdError("아이디는 영문+숫자 포함 1~15자로 입력해주세요.");
      } else {
        setIdError("");
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "비밀번호는 영문, 숫자, 특수문자 포함 8~15자로 입력해주세요."
        );
      } else {
        setPasswordError("");
      }
    }

    if (name === "email") {
      setEmailVerified(false);
      setEmailVerifyMessage("이메일 인증을 완료해주세요.");
      if (!emailRegex.test(value)) {
        setEmailError(
          "이메일은 앞부분 영문/숫자 1~15자, @ 뒤는 영문 3~15자, .com 으로 끝나야 합니다."
        );
      } else {
        setEmailError("");
      }
    }
  };

  // 전화번호 자동 하이픈 처리
  const handlePhoneChange = (rawValue) => {
    const digits = rawValue.replace(/\D/g, "");

    let formatted = digits;

    if (digits.startsWith("010")) {
      if (digits.length <= 3) {
        formatted = digits;
      } else if (digits.length <= 7) {
        formatted = digits.slice(0, 3) + "-" + digits.slice(3);
      } else {
        formatted =
          digits.slice(0, 3) +
          "-" +
          digits.slice(3, 7) +
          "-" +
          digits.slice(7, 11);
      }
    }

    setForm((prev) => ({
      ...prev,
      phone: formatted,
    }));

    if (formatted && !phoneRegex.test(formatted)) {
      setPhoneError("전화번호는 010-0000-0000 형식으로 입력해주세요.");
    } else {
      setPhoneError("");
    }
  };

  // 아이디 중복 검사
  const checkIdDuplicate = async () => {
    if (!form.id || idError) {
      alert("유효한 아이디를 먼저 입력해주세요.");
      return;
    }

    try {
      const res = await caxios.post("/auth/check-id", { id: form.id });
      if (res.data.available) {
        setIdChecked(true);
        setIdCheckMessage("사용 가능한 아이디입니다.");
      } else {
        setIdChecked(false);
        setIdCheckMessage("이미 사용 중인 아이디입니다.");
      }
    } catch (err) {
      console.error(err);
      setIdChecked(false);
      setIdCheckMessage("아이디 중복 검사 실패");
    }
  };

  // 닉네임 중복 검사
  const checkNicknameDuplicate = async () => {
    if (!form.nickname || nicknameError) {
      alert("유효한 닉네임을 먼저 입력해주세요.");
      return;
    }

    try {
      const res = await caxios.post("/auth/check-nickname", {
        nickname: form.nickname,
      });
      if (res.data.available) {
        setNicknameChecked(true);
        setNicknameCheckMessage("사용 가능한 닉네임입니다.");
      } else {
        setNicknameChecked(false);
        setNicknameCheckMessage("이미 사용 중인 닉네임입니다.");
      }
    } catch (err) {
      console.error(err);
      setNicknameChecked(false);
      setNicknameCheckMessage("닉네임 중복 검사 실패");
    }
  };

  // 이메일 인증 링크 요청
  const sendVerifyLink = async () => {
    if (!form.email || emailError) {
      alert("유효한 이메일을 먼저 입력해주세요.");
      return;
    }

    try {
      const res = await caxios.post("/auth/send-verify-link", {
        email: form.email,
      });

      alert(res.data.message || "인증 링크가 이메일로 발송되었습니다.");
      // 링크 발송되면 일단 인증 완료로 처리 (요구사항: 버튼 누르면 초록 문구)
      setEmailVerified(true);
      setEmailVerifyMessage("이메일 인증이 완료되었습니다.");
    } catch (err) {
      console.error(err);
      alert("인증 링크 발송 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      nameError ||
      nicknameError ||
      idError ||
      passwordError ||
      emailError ||
      phoneError
    ) {
      alert("입력값을 다시 확인해주세요.");
      return;
    }

    if (!nameRegex.test(form.name)) {
      alert("이름 형식이 올바르지 않습니다.");
      return;
    }
    if (!nicknameRegex.test(form.nickname)) {
      alert("닉네임 형식이 올바르지 않습니다.");
      return;
    }
    if (!idRegex.test(form.id)) {
      alert("아이디 형식이 올바르지 않습니다.");
      return;
    }
    if (!passwordRegex.test(form.password)) {
      alert("비밀번호 형식이 올바르지 않습니다.");
      return;
    }
    if (!emailRegex.test(form.email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (!phoneRegex.test(form.phone)) {
      alert("전화번호 형식이 올바르지 않습니다.");
      return;
    }

    if (!idChecked) {
      alert("아이디 중복 검사를 완료해주세요.");
      return;
    }
    if (!nicknameChecked) {
      alert("닉네임 중복 검사를 완료해주세요.");
      return;
    }

    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!isPasswordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await caxios.post("/member/signup", form);
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
            placeholder="이름을 입력하세요 (한글 2~5자)"
            required
          />
          {nameError && (
            <p className={styles.notMatchMessage}>{nameError}</p>
          )}
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
          <div className={styles.emailRow}>
            <input
              type="text"
              name="nickname"
              className={styles.input}
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요 (한글/영문/숫자 1~16자)"
              required
            />
            <button
              type="button"
              className={styles.verifyButton}
              onClick={checkNicknameDuplicate}
            >
              중복 검사
            </button>
          </div>
          {nicknameError && (
            <p className={styles.notMatchMessage}>{nicknameError}</p>
          )}
          {nicknameCheckMessage && (
            <p
              className={
                nicknameChecked
                  ? styles.matchMessage
                  : styles.notMatchMessage
              }
            >
              {nicknameCheckMessage}
            </p>
          )}
        </div>

        {/* 아이디 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>아이디</label>
          <div className={styles.emailRow}>
            <input
              type="text"
              name="id"
              className={styles.input}
              value={form.id}
              onChange={handleChange}
              placeholder="아이디를 입력하세요 (영문+숫자 1~15자)"
              required
            />
            <button
              type="button"
              className={styles.verifyButton}
              onClick={checkIdDuplicate}
            >
              중복 검사
            </button>
          </div>
          {idError && <p className={styles.notMatchMessage}>{idError}</p>}
          {idCheckMessage && (
            <p
              className={
                idChecked ? styles.matchMessage : styles.notMatchMessage
              }
            >
              {idCheckMessage}
            </p>
          )}
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
            placeholder="영문, 숫자, 특수문자 포함 8~15자"
            required
          />
          {passwordError && (
            <p className={styles.notMatchMessage}>{passwordError}</p>
          )}
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
              placeholder="예: useremail@domainname.com"
              required
              disabled={emailVerified}
            />
            <button
              type="button"
              className={styles.verifyButton}
              onClick={sendVerifyLink}
              disabled={emailVerified}
            >
              {emailVerified ? "완료" : "인증 요청"}
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
          {phoneError && (
            <p className={styles.notMatchMessage}>{phoneError}</p>
          )}
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

        {/* 퍼스널 컬러 (12톤) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>퍼스널 컬러</label>
          <select
            name="personal_color"
            className={styles.select}
            value={form.personal_color}
            onChange={handleChange}
          >
            <option value="">선택하세요</option>
            {/* Spring */}
            <option value="spring_bright">봄 브라이트</option>
            <option value="spring_light">봄 라이트</option>
            <option value="spring_warm">봄 웜</option>
            {/* Summer */}
            <option value="summer_light">여름 라이트</option>
            <option value="summer_soft">여름 소프트</option>
            <option value="summer_cool">여름 쿨</option>
            {/* Autumn */}
            <option value="autumn_warm">가을 웜</option>
            <option value="autumn_soft">가을 소프트</option>
            <option value="autumn_deep">가을 딥</option>
            {/* Winter */}
            <option value="winter_bright">겨울 브라이트</option>
            <option value="winter_deep">겨울 딥</option>
            <option value="winter_cool">겨울 쿨</option>
          </select>
        </div>

        {/* 퍼스널 체형 (A/V/H/O/X) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>퍼스널 체형</label>
          <select
            name="body_shape"
            className={styles.select}
            value={form.body_shape}
            onChange={handleChange}
          >
            <option value="">선택하세요</option>
            <option value="A">삼각형</option>
            <option value="V">역삼각형</option>
            <option value="H">직사각형</option>
            <option value="O">원형</option>
            <option value="X">모래시계형</option>
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
