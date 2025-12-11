import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { caxios } from "../../config/config";
import styles from "./MyPage.module.css";

const MyPage = () => {
  const navigate = useNavigate();

  const loginId = sessionStorage.getItem("id");

  const [userData, setUserData] = useState(null); // 서버에서 온 원본 DTO (snake_case)
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // 프론트에서만 쓰는 편한 폼 상태 (camelCase)
  const [editForm, setEditForm] = useState({
    phone: "",
    nickname: "",
    personalColor: "",
    bodyShape: "",
    profileImageFile: null,
    removeImage: false, // 이미지 삭제 여부
  });

  const [saving, setSaving] = useState(false);

  // ★ 회원가입과 동일한 전화번호 정규식
  const phoneRegex = /^010-\d{4}-\d{4}$/;

  // 공통 input 변경
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ★ 전화번호는 회원가입처럼 포맷팅 함수로 처리
    if (name === "phone") {
      handlePhoneChange(value);
      return;
    }

    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // ★ 회원가입과 동일한 전화번호 포맷팅 로직
  const handlePhoneChange = (rawValue) => {
    // 숫자만 추출
    const digits = rawValue.replace(/\D/g, "");

    let formatted = digits;

    if (digits.startsWith("010")) {
      if (digits.length <= 3) {
        formatted = digits; // 010
      } else if (digits.length <= 7) {
        // 010-1234
        formatted = digits.slice(0, 3) + "-" + digits.slice(3);
      } else {
        // 010-1234-5678
        formatted =
          digits.slice(0, 3) +
          "-" +
          digits.slice(3, 7) +
          "-" +
          digits.slice(7, 11);
      }
    }

    setEditForm((prev) => ({
      ...prev,
      phone: formatted,
    }));
  };

  // 프로필 이미지 변경
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditForm((prev) => ({
      ...prev,
      profileImageFile: file,
      removeImage: false, 
    }));
    setPreviewImage(URL.createObjectURL(file));
  };

  // 프로필 이미지 제거
  const handleClearImage = () => {
    setEditForm((prev) => ({
      ...prev,
      profileImageFile: null,
      removeImage: true,
    }));
    setPreviewImage("");
  };

  // 마이페이지 정보 불러오기
  useEffect(() => {
    if (!loginId) {
      alert("로그인 후 이용해주세요.");
      navigate("/Login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await caxios.get(`/member/mypage/${loginId}`);
        const data = res.data;

        setUserData(data);
        setPreviewImage(data.image_url || "");

        setEditForm({
          phone: data.phone || "",
          nickname: data.nickname || "",
          personalColor: data.personal_color || "",
          bodyShape: data.body_shape || "",
          profileImageFile: null,
          removeImage: false,
        });
      } catch (err) {
        console.error(err);
        alert("회원 정보를 불러오지 못했습니다.");
        if (err.response) {
          console.error("status:", err.response.status);
          console.error("data:", err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [loginId, navigate]);

  // 저장
  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);

    // ★ 회원가입과 동일하게 저장 전 전화번호 형식 검사
    if (editForm.phone && !phoneRegex.test(editForm.phone)) {
      alert("전화번호는 010-0000-0000 형식으로 입력해주세요.");
      setSaving(false);
      return;
    }

    try {
      let uploadedImage = null;

      if (editForm.profileImageFile) {
        const formData = new FormData();
        formData.append("file", editForm.profileImageFile);

        const uploadRes = await caxios.post(
          `/member/mypage/${loginId}/profile`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        uploadedImage = uploadRes.data;
      }

      let finalImageUrl = userData.image_url;
      let finalImageUuid = userData.image_uuid;
      let finalImageOriginal = userData.image_original;

      if (editForm.removeImage) {
        finalImageUrl = null;
        finalImageUuid = null;
        finalImageOriginal = null;
      } else if (uploadedImage) {
        finalImageUrl = uploadedImage.url;
        finalImageUuid = uploadedImage.uuid;
        finalImageOriginal = uploadedImage.original;
      }

      // 여기가 personal_color DB 저장에 영향을 줌
      const updateBody = {
        id: userData.id,

        nickname: editForm.nickname,
        phone: editForm.phone,

        personal_color: editForm.personalColor || null,
        body_shape: editForm.bodyShape || null,

        image_url: finalImageUrl,
        image_uuid: finalImageUuid,
        image_original: finalImageOriginal,
      };

      await caxios.put(`/member/mypage/${loginId}`, updateBody);

      setUserData((prev) => ({
        ...prev,
        nickname: updateBody.nickname,
        phone: updateBody.phone,
        personal_color: updateBody.personal_color,
        body_shape: updateBody.body_shape,
        image_url: updateBody.image_url,
        image_uuid: updateBody.image_uuid,
        image_original: updateBody.image_original,
      }));

      setPreviewImage(updateBody.image_url || "");

      alert("수정이 완료되었습니다.");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 성별 변환
  const renderGender = (g) => (g === "female" ? "여성" : "남성");


  const renderColor = (c) =>
    ({
      "Bright Spring": "봄 브라이트",
      "Light Spring": "봄 라이트",
      "Warm Spring": "봄 웜",

      "Warm Autumn": "가을 웜",
      "Soft Autumn": "가을 소프트",
      "Deep Autumn": "가을 딥",

      "Light Summer": "여름 라이트",
      "Soft Summer": "여름 소프트",
      "Cool Summer": "여름 쿨",

      "Bright Winter": "겨울 브라이트",
      "Deep Winter": "겨울 딥",
      "Cool Winter": "겨울 쿨",
    }[c] || "-");

  // 체형 변환
  const renderBody = (b) =>
    ({
      A: "삼각형",
      V: "역삼각형",
      H: "직사각형",
      O: "원형",
      X: "모래시계형",
    }[b] || "-");

  if (loading) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (!userData) {
    return <div className={styles.container}>회원 정보를 찾을 수 없습니다.</div>;
  }

  const data = userData;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>마이페이지</h2>

      {/* 프로필 영역 */}
      <div className={styles.header}>
        <div className={styles.profileImageBox}>
          {previewImage ? (
            <img
              src={previewImage}
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
            <span className={styles.userId}>@{data.id}</span>
          </div>
          <div className={styles.subInfo}>
            <span>{renderGender(data.gender)}</span>
            <span>·</span>
            <span>{data.birth}</span>
          </div>
        </div>
      </div>

      {/* 이미지 업로드 */}
      {isEditing && (
        <div className={styles.section}>
          <div className={styles.formGroup}>
            <span className={styles.infoLabel}>프로필 이미지</span>
            <div className={styles.fileControls}>
              <label className={styles.fileButton}>
                프로필 선택
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </label>
              {(previewImage || data.image_url) && (
                <button
                  type="button"
                  className={styles.removeImageButton}
                  onClick={handleClearImage}
                >
                  X
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 기본 정보 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>

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

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>이메일</span>
          <span className={styles.infoValue}>{data.email}</span>
        </div>

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
              <option value="">선택하세요</option>

              
              <option value="Bright Spring">봄 브라이트</option>
              <option value="Light Spring">봄 라이트</option>
              <option value="Warm Spring">봄 웜</option>

              <option value="Warm Autumn">가을 웜</option>
              <option value="Soft Autumn">가을 소프트</option>
              <option value="Deep Autumn">가을 딥</option>

              <option value="Light Summer">여름 라이트</option>
              <option value="Soft Summer">여름 소프트</option>
              <option value="Cool Summer">여름 쿨</option>

              <option value="Bright Winter">겨울 브라이트</option>
              <option value="Deep Winter">겨울 딥</option>
              <option value="Cool Winter">겨울 쿨</option>
            </select>
          ) : (
            <span className={styles.infoValue}>
              {renderColor(data.personal_color)}
            </span>
          )}
        </div>

        {/* 퍼스널 체형 */}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>퍼스널 체형</span>
          {isEditing ? (
            <select
              name="bodyShape"
              className={styles.select}
              value={editForm.bodyShape}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="A">삼각형</option>
              <option value="V">역삼각형</option>
              <option value="H">직사각형</option>
              <option value="O">원형</option>
              <option value="X">모래시계형</option>
            </select>
          ) : (
            <span className={styles.infoValue}>{renderBody(data.body_shape)}</span>
          )}
        </div>
      </div>

      {/* 버튼 */}
      {!isEditing ? (
        <button
          className={styles.editButton}
          onClick={() => setIsEditing(true)}
        >
          정보 수정
        </button>
      ) : (
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "저장 중..." : "수정 저장"}
        </button>
      )}
    </div>
  );
};

export default MyPage;
