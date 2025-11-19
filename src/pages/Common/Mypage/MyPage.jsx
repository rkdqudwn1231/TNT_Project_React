// src/components/MyPage.jsx
import React from "react";
import styles from "./MyPage.module.css";

const MyPage = ({ user }) => {
  // 예시용 기본값
  const defaultUser = {
    profileImageUrl: "",
    name: "홍길동",
    gender: "female",
    userId: "pink123",
    phone: "010-0000-0000",
    birth: "1995-01-01",
    personalColor: "spring",
    bodyType: "hourglass",
  };

  const data = user || defaultUser;

  const renderGender = (g) => {
    if (g === "female") return "여성";
    if (g === "male") return "남성";
    if (g === "other") return "기타";
    return "-";
  };

  const renderColor = (c) => {
    switch (c) {
      case "spring":
        return "봄웜";
      case "summer":
        return "여름쿨";
      case "autumn":
        return "가을웜";
      case "winter":
        return "겨울쿨";
      default:
        return "-";
    }
  };

  const renderBodyType = (b) => {
    switch (b) {
      case "hourglass":
        return "모래시계형";
      case "triangle":
        return "삼각형";
      case "invertedTriangle":
        return "역삼각형";
      case "rectangle":
        return "직사각형";
      case "round":
        return "라운드형";
      default:
        return "-";
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>마이페이지</h2>

      <div className={styles.header}>
        <div className={styles.profileImageBox}>
          {data.profileImageUrl ? (
            <img
              src={data.profileImageUrl}
              alt="프로필"
              className={styles.profileImage}
            />
          ) : (
            <span className={styles.profilePlaceholder}>이미지 없음</span>
          )}
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{data.name}</span>
            <span className={styles.userId}>@{data.userId}</span>
          </div>
          <div className={styles.subInfo}>
            <span>{renderGender(data.gender)}</span>
            <span>·</span>
            <span>{data.birth}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>휴대전화</span>
          <span className={styles.infoValue}>{data.phone}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>아이디</span>
          <span className={styles.infoValue}>{data.userId}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>퍼스널 정보</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>퍼스널 컬러</span>
          <span className={styles.infoValue}>{renderColor(data.personalColor)}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>퍼스널 체형</span>
          <span className={styles.infoValue}>{renderBodyType(data.bodyType)}</span>
        </div>
      </div>

      <button className={styles.editButton}>정보 수정</button>
    </div>
  );
};

export default MyPage;
