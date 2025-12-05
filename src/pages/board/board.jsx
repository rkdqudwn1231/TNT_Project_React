import React, { useState, useEffect } from "react";
import styles from "./Board.module.css";
import { caxios } from "../../config/config";
import { useNavigate } from "react-router-dom";

// 카드 위(이미지 위)에 같이 띄울 대표 태그 하나 뽑는 헬퍼 (지금은 사용 안 하지만 놔둠)
const getPrimaryTag = (post) => {
  if (Array.isArray(post.tags) && post.tags.length > 0) {
    return post.tags[0];
  }
  if (post.tag) {
    const arr = String(post.tag)
      .split(/[,#\s]+/)
      .filter(Boolean);
    return arr[0] || "";
  }
  return "";
};

export default function Board() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    photo: null,
    title: "",
    tag: "",
    color: "",
    body: "",
    desc: "",
  });

  // 필터 / 검색 상태
  const [filterColor, setFilterColor] = useState("");
  const [filterBody, setFilterBody] = useState("");
  const [searchField, setSearchField] = useState("title"); // title | text | tag
  const [searchText, setSearchText] = useState("");

  // 실제 필터링에 쓰는 값 (엔터/버튼 눌렀을 때만 갱신)
  const [appliedSearchField, setAppliedSearchField] = useState("title");
  const [appliedSearchText, setAppliedSearchText] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const fetchPosts = async () => {
    try {
      const res = await caxios.get("/board/list");
      setPosts(res.data);
      console.log("Fetched posts:", res.data);
    } catch (err) {
      console.error("게시글 로드 실패", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const memberId = sessionStorage.getItem("id");

    if (!memberId) {
      alert("로그인 해주세요.");
      return;
    }

    if (!form.photo) {
      alert("사진을 선택하세요.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("photo", form.photo);

      // 🔥 이제는 진짜 회원 ID만 서버에 전달 (닉네임은 서버에서 JOIN으로 사용)
      const boardJson = JSON.stringify({
        id: memberId,           // BoardDTO.id → board.id (FK: member.id)
        title: form.title,
        text: form.desc,
        color: form.color,
        body_shape: form.body,
        tag: form.tag,          // 태그 문자열
      });

      formData.append(
        "board",
        new Blob([boardJson], { type: "application/json" })
      );

      await caxios.post("/board/write", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchPosts();

      alert("게시글이 등록되었습니다!");

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

  // 카드 클릭 → 상세
  const handleCardClick = (post) => {
    if (!sessionStorage.getItem("id")) {
      alert("로그인 해주세요.");
      return;
    }
    navigate(`/Board/detail/${post.seq}`);
  };

  // 검색 적용 함수 (엔터 / 버튼에서 공통 사용)
  const applySearch = () => {
    setAppliedSearchField(searchField);
    setAppliedSearchText(searchText);
  };

  // 필터 / 검색 적용된 목록
  const filteredPosts = posts.filter((post) => {
    const color = (post.color || "").trim();
    const bodyShape = (post.body_shape || "").trim();

    // 퍼스널 컬러 필터
    if (filterColor && color !== filterColor) {
      return false;
    }

    // 체형 필터
    if (filterBody && bodyShape !== filterBody) {
      return false;
    }

    // 검색어 필터 (실제 적용된 값 기준)
    const keyword = appliedSearchText.trim().toLowerCase();
    if (!keyword) {
      return true;
    }

    const title = (post.title || "").toLowerCase();
    const text = (post.text || "").toLowerCase();

    // 태그: 문자열 또는 배열(예: tags[]) 대응
    let tagText = "";
    if (Array.isArray(post.tags)) {
      tagText = post.tags.join(" ");
    } else if (post.tag) {
      tagText = String(post.tag);
    }
    tagText = tagText.toLowerCase();

    if (appliedSearchField === "title") {
      return title.includes(keyword);
    }
    if (appliedSearchField === "text") {
      return text.includes(keyword);
    }
    if (appliedSearchField === "tag") {
      return tagText.includes(keyword);
    }

    return true;
  });

  // 카드에서 보여줄 태그 렌더링용 헬퍼 (카드 본문 쪽)
  const renderTags = (post) => {
    if (Array.isArray(post.tags) && post.tags.length > 0) {
      return post.tags.map((t) => (
        <span key={t} className={styles.cardTagChip}>
          #{t}
        </span>
      ));
    }

    if (post.tag) {
      return String(post.tag)
        .split(/[,#\s]+/)
        .filter(Boolean)
        .map((t) => (
          <span key={t} className={styles.cardTagChip}>
            #{t}
          </span>
        ));
    }

    return null;
  };

  return (
    <div className={styles.boardContainer}>
      {/* 상단 제목 */}
      <h1 className={styles.boardTitle}>오늘의 OOTD</h1>

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

      {/* 필터 / 검색 바 */}
      <section className={styles.filterBar}>
        <div className={styles.filterRow}>
          {/* 왼쪽: 컬러, 체형 필터 */}
          <div className={styles.filterLeft}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>퍼스널 컬러</label>
              <select
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
              >
                <option value="">전체</option>
                <option value="봄 웜">봄 웜</option>
                <option value="여름 쿨">여름 쿨</option>
                <option value="가을 웜">가을 웜</option>
                <option value="겨울 쿨">겨울 쿨</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>퍼스널 체형</label>
              <select
                value={filterBody}
                onChange={(e) => setFilterBody(e.target.value)}
              >
                <option value="">전체</option>
                <option value="삼각형">삼각형</option>
                <option value="역삼각형">역삼각형</option>
                <option value="직사각형">직사각형</option>
                <option value="원형">원형</option>
                <option value="모래시계형">모래시계형</option>
              </select>
            </div>
          </div>

          {/* 오른쪽: 검색 영역 */}
          <div className={`${styles.filterGroup} ${styles.searchGroupRow}`}>
            <label className={styles.filterLabel}>검색</label>
            <div className={styles.searchRow}>
              <select
                className={styles.searchSelect}
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                <option value="title">제목</option>
                <option value="text">내용</option>
                <option value="tag">태그</option>
              </select>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="검색어를 입력하세요."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applySearch();
                  }
                }}
              />
              <button
                type="button"
                className={styles.searchBtn}
                onClick={applySearch}
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 카드 영역 */}
      <section className={styles.cardGrid}>
        {filteredPosts.map((post) => {
          // 작성자: JOIN으로 내려오는 writer_nickname 우선 사용, 없으면 id
          const writer = post.writer_nickname || post.id || "익명";

          return (
            <article
              key={post.seq}
              className={styles.card}
              onClick={() => handleCardClick(post)}
            >
              <div className={styles.cardThumb}>
                <img src={post.image_url} alt="" />
                <div className={styles.badgeGroup}>
                  {post.color && (
                    <span className={styles.badge}>{post.color}</span>
                  )}
                  {post.body_shape && (
                    <span className={styles.badge}>{post.body_shape}</span>
                  )}

                  {/* 이미지 위 태그 */}
                  {post.tag &&
                    post.tag
                      .split(/\s+/)
                      .filter(Boolean)
                      .map((t) => (
                        <span key={t} className={styles.badge}>
                          #{t}
                        </span>
                      ))}
                </div>
              </div>

              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{post.title}</h2>

                <p className={styles.cardDesc}>{post.text}</p>

                {/* 카드 오른쪽 하단 작성자 닉네임 */}
                <div className={styles.cardFooter}>
                  <span className={styles.cardWriter}>{writer}</span>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
