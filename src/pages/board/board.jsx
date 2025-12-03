import React, { useState, useEffect } from "react";
import styles from "./Board.module.css";
import { caxios } from "../../config/config";

export default function Board() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    photo: null,
    title: "",
    tag: "",
    color: "",
    body: "",
    desc: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  // ------------------------------
  // ✔ DB에서 게시글 전체 가져오기
  // ------------------------------
  const fetchPosts = async () => {
    try {
      const res = await caxios.get("/board/list");
      setPosts(res.data);
    } catch (err) {
      console.error("게시글 로드 실패", err);
    }
  };

  // ------------------------------
  // ✔ 페이지 처음 로딩될 때 실행
  // ------------------------------
  useEffect(() => {
    fetchPosts();
  }, []);

  // ------------------------------
  // ✔ 게시글 + 이미지 업로드
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.photo) {
      alert("사진을 선택하세요.");
      return;
    }

    try {
      const formData = new FormData();

      // 파일 추가
      formData.append("photo", form.photo);

      // JSON 데이터 추가
      const boardJson = JSON.stringify({
        id: sessionStorage.getItem("id"), // 작성자 ID
        title: form.title,
        text: form.desc,
        color: form.color,
        body_shape: form.body,
        tag: form.tag,
      });

      formData.append(
        "board",
        new Blob([boardJson], { type: "application/json" })
      );

      // 서버 전송
      await caxios.post("/board/write", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // DB에서 새 목록 다시 불러오기
      await fetchPosts();

      alert("게시글이 등록되었습니다!");

      // 폼 초기화
      setForm({
        photo: null,
        title: "",
        tag: "",
        color: "",
        body: "",
        desc: "",
      });

    } catch (err) {
      console.error("업로드 실패:", err);
      alert("게시글 등록 실패");
    }
  };

  return (
    <div className={styles.boardContainer}>
      {/* 업로드 영역 */}
      <section className={styles.uploadBox}>
        <form onSubmit={handleSubmit}>
          <div className={styles.uploadRow}>

            {/* 왼쪽 영역 */}
            <div>
              <div className={styles.formGroup}>
                <label>코디 사진</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>퍼스널 컬러</label>
                <select name="color" onChange={handleChange} value={form.color}>
                  <option value="">선택해주세요</option>
                  <option value="봄 웜">봄 웜</option>
                  <option value="여름 쿨">여름 쿨</option>
                  <option value="가을 웜">가을 웜</option>
                  <option value="겨울 쿨">겨울 쿨</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>퍼스널 체형</label>
                <select name="body" onChange={handleChange} value={form.body}>
                  <option value="">체형 선택</option>
                  <option value="삼각형">삼각형</option>
                  <option value="역삼각형">역삼각형</option>
                  <option value="직사각형">직사각형</option>
                  <option value="원형">원형</option>
                  <option value="모래시계형">모래시계형</option>
                </select>
              </div>
            </div>

            {/* 오른쪽 영역 */}
            <div>
              <div className={styles.formGroup}>
                <label>제목</label>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={form.title}
                />
              </div>

              <div className={styles.formGroup}>
                <label>스타일 태그</label>
                <input
                  type="text"
                  name="tag"
                  placeholder="예: 데일리룩"
                  onChange={handleChange}
                  value={form.tag}
                />
              </div>

              <div className={styles.formGroup}>
                <label>코디 설명</label>
                <textarea
                  name="desc"
                  onChange={handleChange}
                  value={form.desc}
                ></textarea>
              </div>
            </div>

          </div>

          <div className={styles.uploadActions}>
            <button type="reset" className={styles.btnSecondary}>
              초기화
            </button>
            <button type="submit" className={styles.btnPrimary}>
              등록하기
            </button>
          </div>
        </form>
      </section>

      {/* 이미지 카드 영역 */}
      <section className={styles.cardGrid}>
        {posts.map((post) => (
          <article key={post.seq} className={styles.card}>
            <div className={styles.cardThumb}>
              <img src={post.image_url} alt="preview" />
              <div className={styles.badgeGroup}>
                {post.color && (
                  <span className={styles.badge}>{post.color}</span>
                )}
                {post.body_shape && (
                  <span className={styles.badge}>{post.body_shape}</span>
                )}
              </div>
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardDesc}>{post.text}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
