import React, { useState } from "react";
import styles from "./Board.module.css";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.photo) return;

    const photoURL = URL.createObjectURL(form.photo);
    const newPost = { id: Date.now(), ...form, photoURL };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className={styles.boardContainer}>
      {/* 업로드 영역 */}
      <section className={styles.uploadBox}>
        <form onSubmit={handleSubmit}>
          <div className={styles.uploadRow}>
            {/* 왼쪽 */}
            <div>
              <div className={styles.formGroup}>
                <label>코디 사진</label>
                <input type="file" name="photo" accept="image/*" onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label>퍼스널 컬러</label>
                <select name="color" onChange={handleChange}>
                  <option value="">선택해주세요</option>
                  <option value="봄 웜">봄 웜</option>
                  <option value="여름 쿨">여름 쿨</option>
                  <option value="가을 웜">가을 웜</option>
                  <option value="겨울 쿨">겨울 쿨</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>퍼스널 체형</label>
                <select name="body" onChange={handleChange}>
                  <option value="">체형 선택</option>
                  <option value="사과형">사과형</option>
                  <option value="배형">배형</option>
                  <option value="역삼각형">역삼각형</option>
                  <option value="직사각형">직사각형</option>
                  <option value="모래시계형">모래시계형</option>
                </select>
              </div>
            </div>

            {/* 오른쪽 */}
            <div>
              <div className={styles.formGroup}>
                <label>제목</label>
                <input type="text" name="title" onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label>스타일 태그</label>
                <input type="text" name="tag" placeholder="예: 데일리룩" onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label>코디 설명</label>
                <textarea name="desc" onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          <div className={styles.uploadActions}>
            <button type="reset" className={styles.btnSecondary}>초기화</button>
            <button type="submit" className={styles.btnPrimary}>등록하기</button>
          </div>
        </form>
      </section>

      {/* 이미지 카드 */}
      <section className={styles.cardGrid}>
        {posts.map((post) => (
          <article key={post.id} className={styles.card}>
            <div className={styles.cardThumb}>
              <img src={post.photoURL} alt="preview" />
              <div className={styles.badgeGroup}>
                {post.color && <span className={styles.badge}>{post.color}</span>}
                {post.body && <span className={styles.badge}>{post.body}</span>}
                {post.tag && <span className={styles.badge}>#{post.tag}</span>}
              </div>
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardDesc}>{post.desc}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
