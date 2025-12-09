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

  // 공통 input 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // 프로필 이미지 변경
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditForm((prev) => ({
      ...prev,
      profileImageFile: file,
      removeImage: false, // 새로 선택했으니 삭제 플래그 해제
    }));
    setPreviewImage(URL.createObjectURL(file));
  };

  // 프로필 이미지 제거 (X 버튼)
  const handleClearImage = () => {
    setEditForm((prev) => ({
      ...prev,
      profileImageFile: null,
      removeImage: true, // 저장 시 null로 보내도록
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
        // data = MemberDTO (snake_case: image_url, personal_color, body_shape ...)

        setUserData(data);

        // 이미지 미리보기: image_url 사용
        setPreviewImage(data.image_url || "");

        // 폼에는 프론트에서 쓰기 좋은 이름으로 매핑
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

  // 저장 (닉네임, 연락처, 퍼스널 컬러, 체형만 변경 + 이미지 선택 시 업로드)
  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);

    try {
      let uploadedImage = null;

      // 이미지가 선택된 경우에만 업로드
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

        // { url, uuid, original } 형태라고 가정
        uploadedImage = uploadRes.data;
      }

      // 최종적으로 DB에 보낼 이미지 정보 결정
      let finalImageUrl = userData.image_url;
      let finalImageUuid = userData.image_uuid;
      let finalImageOriginal = userData.image_original;

      if (editForm.removeImage) {
        // 이미지 제거 요청
        finalImageUrl = null;
        finalImageUuid = null;
        finalImageOriginal = null;
      } else if (uploadedImage) {
        // 새 이미지 업로드됨
        finalImageUrl = uploadedImage.url;
        finalImageUuid = uploadedImage.uuid;
        finalImageOriginal = uploadedImage.original;
      }

      // 서버 DTO(MemberDTO)는 snake_case 필드 사용
      const updateBody = {
        id: userData.id,

        nickname: editForm.nickname,
        phone: editForm.phone,

        // DTO: personal_color / body_shape
        personal_color: editForm.personalColor || null,
        body_shape: editForm.bodyShape || null,

        // DTO: image_url / image_uuid / image_original
        image_url: finalImageUrl,
        image_uuid: finalImageUuid,
        image_original: finalImageOriginal,
      };

      await caxios.put(`/member/mypage/${loginId}`, updateBody);

      // userData도 최신 값으로 동기화 (snake_case 유지)
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

      // 미리보기 이미지도 서버 기준으로 갱신
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

  // 표시용 변환
  const renderGender = (g) => (g === "female" ? "여성" : "남성");

  // 회원가입 기준 퍼스널 컬러 코드 매핑
  const renderColor = (c) =>
    ({
      spring_bright: "봄 브라이트",
      spring_light: "봄 라이트",
      spring_warm: "봄 웜",
      summer_light: "여름 라이트",
      summer_soft: "여름 소프트",
      summer_cool: "여름 쿨",
      autumn_warm: "가을 웜",
      autumn_soft: "가을 소프트",
      autumn_deep: "가을 딥",
      winter_bright: "겨울 브라이트",
      winter_deep: "겨울 딥",
      winter_cool: "겨울 쿨",
    }[c] || "-");

  // 회원가입 기준 퍼스널 체형 코드 매핑
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

      {/* 이미지 업로드 (수정 모드일 때만) */}
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

        {/* 이메일 (수정 X) */}
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
              <option value="">선택하세요</option>
              <option value="spring_bright">봄 브라이트</option>
              <option value="spring_light">봄 라이트</option>
              <option value="spring_warm">봄 웜</option>
              <option value="summer_light">여름 라이트</option>
              <option value="summer_soft">여름 소프트</option>
              <option value="summer_cool">여름 쿨</option>
              <option value="autumn_warm">가을 웜</option>
              <option value="autumn_soft">가을 소프트</option>
              <option value="autumn_deep">가을 딥</option>
              <option value="winter_bright">겨울 브라이트</option>
              <option value="winter_deep">겨울 딥</option>
              <option value="winter_cool">겨울 쿨</option>
            </select>
          ) : (
            // 서버 DTO: personal_color
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
            // 서버 DTO: body_shape
            <span className={styles.infoValue}>
              {renderBody(data.body_shape)}
            </span>
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
