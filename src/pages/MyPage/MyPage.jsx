// src/components/MyPage/MyPage.jsx
import React, { useState } from "react";
import { caxios } from "../../config/config";
import styles from "./MyPage.module.css";

const MyPage = ({ user }) => {
  // 기본 템플릿 (백엔드 연동 전)
  const defaultUser = {
    profileImageUrl: "",
    name: "홍길동",
    nickname: "핑키스타",
    gender: "female",
    userId: "pinky123",
    email: "pinky@example.com",
    phone: "010-0000-0000",
    birth: "1995-01-01",
    personalColor: "spring",
    bodyType: "hourglass",
  };

  const data = user || defaultUser;

  // 수정모드 변경
  const [isEditing, setIsEditing] = useState(false);

  // 이미지 미리보기
  const [previewImage, setPreviewImage] = useState(data.profileImageUrl);

  // 수정 중인 정보
  const [editForm, setEditForm] = useState({
    phone: data.phone,
    nickname: data.nickname,
    personalColor: data.personalColor,
    bodyType: data.bodyType,
    profileImageFile: null, // 실제 파일 저장
  });

  // INFO: 텍스트 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // INFO: 프로필 이미지 변경
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditForm((prev) => ({ ...prev, profileImageFile: file }));
    setPreviewImage(URL.createObjectURL(file)); // 미리보기
  };

  // ⭐ 저장하기 — GCP 업로드 + DB UPDATE
  const handleSave = async () => {
    try {
      let uploadedImage = null;

      // 1) 이미지가 있다면 업로드 진행
      if (editForm.profileImageFile) {
        const formData = new FormData();
        formData.append("file", editForm.profileImageFile);

        const uploadRes = await caxios.post("/api/upload/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImage = uploadRes.data;
      }

      // 2) 수정 데이터 전송 (DB 업데이트)
      const updateBody = {
        nickname: editForm.nickname,
        phone: editForm.phone,
        personalColor: editForm.personalColor,
        bodyType: editForm.bodyType,

        // 새로 업로드하지 않았으면 기존 URL 유지
        profile_image_url: uploadedImage?.url || data.profileImageUrl,
        profile_image_uuid: uploadedImage?.uuid || null,
        profile_image_original: uploadedImage?.original || null,
      };

      await caxios.put("/api/users/update-profile", updateBody);

      alert("수정이 완료되었습니다!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

  // 표시용 변환기 
  const renderGender = (g) => (g === "female" ? "여성" : "남성");

  const renderColor = (c) =>
    ({
      spring: "봄웜",
      summer: "여름쿨",
      autumn: "가을웜",
      winter: "겨울쿨",
    }[c] || "-");

  const renderBody = (b) =>
    ({
      hourglass: "모래시계형",
      triangle: "삼각형",
      invertedTriangle: "역삼각형",
      rectangle: "직사각형",
      apple: "사과형",
    }[b] || "-");

  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>마이페이지</h2>

      {/* 프로필 */}
      <div className={styles.header}>
        <div className={styles.profileImageBox}>
          {previewImage ? (
            <img src={previewImage} alt="프로필" className={styles.profileImage} />
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

      {/* 이미지 업로드 (수정 모드일 때만) */}
      {isEditing && (
        <div className={styles.formGroup}>
          <label className={styles.label}>프로필 이미지 변경</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      )}

      {/* 기본 정보 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>

        {/* 닉네임 */}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>닉네임</span>
          {isEditing ? (
            <input
              type="text"
              name="nickname"
              className={styles.input}
              value={editForm.nickname}
              onChange={handleChange}
            />
          ) : (
            <span className={styles.infoValue}>{data.nickname}</span>
          )}
        </div>

        {/* 이메일 */}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>이메일</span>
          <span className={styles.infoValue}>{data.email}</span>
        </div>

        {/* 휴대전화 */}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>휴대전화</span>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              className={styles.input}
              value={editForm.phone}
              onChange={handleChange}
            />
          ) : (
            <span className={styles.infoValue}>{data.phone}</span>
          )}
        </div>
      </div>

      {/* 퍼스널 정보 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>퍼스널 정보</h3>

        {/* 퍼스널 컬러 */}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>퍼스널 컬러</span>
          {isEditing ? (
            <select
              name="personalColor"
              className={styles.select}
              value={editForm.personalColor}
              onChange={handleChange}
            >
              <option value="spring">봄웜</option>
              <option value="summer">여름쿨</option>
              <option value="autumn">가을웜</option>
              <option value="winter">겨울쿨</option>
            </select>
          ) : (
            <span className={styles.infoValue}>
              {renderColor(data.personalColor)}
            </span>
          )}
        </div>

        {/* 퍼스널 체형 */}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>퍼스널 체형</span>
          {isEditing ? (
            <select
              name="bodyType"
              className={styles.select}
              value={editForm.bodyType}
              onChange={handleChange}
            >
              <option value="hourglass">모래시계형</option>
              <option value="triangle">삼각형</option>
              <option value="invertedTriangle">역삼각형</option>
              <option value="rectangle">직사각형</option>
              <option value="apple">사과형</option>
            </select>
          ) : (
            <span className={styles.infoValue}>{renderBody(data.bodyType)}</span>
          )}
        </div>
      </div>

      {/* 버튼 */}
      {!isEditing ? (
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
          정보 수정
        </button>
      ) : (
        <button className={styles.saveButton} onClick={handleSave}>
          수정 저장
        </button>
      )}
    </div>
  );
};

export default MyPage;
