import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { caxios } from "../../config/config";
import styles from "./BoardDetail.module.css";

export default function BoardDetail() {
  const { seq } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 게시글 상세 조회
  const fetchPost = async () => {
    try {
      const res = await caxios.get(`/board/detail/${seq}`);
      const data = res.data;

      setPost(data);
      setLikeCount(data.likeCount ?? 0);
      setDislikeCount(data.dislikeCount ?? 0);

      // 댓글 API 있으면 여기서 같이 불러오면 됨
      // const commentRes = await caxios.get(`/board/${seq}/comments`);
      // setComments(commentRes.data);
    } catch (err) {
      console.error("게시글 상세 로드 실패", err);
      alert("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq]);

  // 목록으로
  const handleGoList = () => {
    navigate("/Board"); // 필요하면 라우트 경로 수정
  };

  // 수정하기
  const handleEdit = () => {
    if (!sessionStorage.getItem("id")) {
      alert("로그인 해주세요.");
      return;
    }

    const loginId = sessionStorage.getItem("id");
    const writer = post?.id || post?.writer;

    if (writer && writer !== loginId) {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }

    // 수정 라우트는 프로젝트에 맞게 변경
    navigate(`/Board/edit/${seq}`);
  };

  // 삭제하기
  const handleDelete = async () => {
    if (!sessionStorage.getItem("id")) {
      alert("로그인 해주세요.");
      return;
    }

    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await caxios.delete(`/board/delete/${seq}`);
      alert("삭제되었습니다.");
      navigate("/Board");
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  // 좋아요
  const handleLike = async () => {
    if (!sessionStorage.getItem("id")) {
      alert("로그인 해주세요.");
      return;
    }

    try {
      // 백엔드 API에 맞춰 수정
      // await caxios.post(`/board/like/${seq}`);
      setLikeCount((prev) => prev + 1);
    } catch (err) {
      console.error("좋아요 실패", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 싫어요
  const handleDislike = async () => {
    if (!sessionStorage.getItem("id")) {
      alert("로그인 해주세요.");
      return;
    }

    try {
      // 백엔드 API에 맞춰 수정
      // await caxios.post(`/board/dislike/${seq}`);
      setDislikeCount((prev) => prev + 1);
    } catch (err) {
      console.error("싫어요 실패", err);
      alert("싫어요 처리 중 오류가 발생했습니다.");
    }
  };

  // 댓글 등록 (지금은 프론트에서만 동작 / API 있으면 연결)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!sessionStorage.getItem("id")) {
      alert("로그인 해주세요.");
      return;
    }

    const trimmed = newComment.trim();
    if (!trimmed) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const writer = sessionStorage.getItem("id");

      // 백엔드 있으면 여기서 POST
      // const res = await caxios.post(`/board/${seq}/comments`, { text: trimmed });
      // setComments((prev) => [...prev, res.data]);

      // 프론트 임시 동작
      setComments((prev) => [
        ...prev,
        {
          id: Date.now(),
          writer,
          text: trimmed,
          createdAt: new Date().toISOString().slice(0, 16),
        },
      ]);

      setNewComment("");
    } catch (err) {
      console.error("댓글 등록 실패", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div className={styles.detailPage}>로딩 중...</div>;
  }

  if (!post) {
    return <div className={styles.detailPage}>게시글을 찾을 수 없습니다.</div>;
  }

  const tagList = post.tag
    ? String(post.tag)
        .split(/[,#\s]+/)
        .filter(Boolean)
    : [];

  const writer = post.id || post.writer || "익명";
  const createdAt =
    post.regdate || post.created_at || post.createdAt || "날짜 정보 없음";
  const views = post.readCount || post.views || 0;

  const personalColor = post.color || "정보 없음";
  const bodyShape = post.body_shape || "정보 없음";

  const imageUrl =
    post.image_url ||
    post.photo_url ||
    "https://via.placeholder.com/800x1000.png?text=%EC%BD%94%EB%94%94+%EC%9D%B4%EB%AF%B8%EC%A7%80";

  return (
    <div className={styles.detailPage}>
      <div className={styles.page}>
        <nav className={styles.breadcrumb}>
          <button
            type="button"
            className={styles.breadcrumbLink}
            onClick={() => navigate("/")}
          >
            홈
          </button>
          <span>&gt;</span>
          <button
            type="button"
            className={styles.breadcrumbLink}
            onClick={handleGoList}
          >
            코디 게시판
          </button>
          <span>&gt;</span>
          <span>상세보기</span>
        </nav>

        <div className={styles.detailWrapper}>
          {/* 왼쪽: 이미지 */}
          <section className={styles.card}>
            <div className={styles.thumb}>
              <img src={imageUrl} alt={post.title} />
              <div className={styles.badges}>
                {post.color && (
                  <span className={`${styles.badge} ${styles.badgeColor}`}>
                    {post.color}
                  </span>
                )}
                {post.body_shape && (
                  <span className={`${styles.badge} ${styles.badgeShape}`}>
                    {post.body_shape}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* 오른쪽: 정보 */}
          <section className={styles.card}>
            <header className={styles.metaTop}>
              <div>
                <h1 className={styles.title}>{post.title}</h1>
                <div className={styles.metaSub}>
                  <span>작성자: {writer}</span>
                  <span>{createdAt}</span>
                  <span>조회수 {views}</span>
                </div>
              </div>
            </header>

            <div className={styles.tagList}>
              {tagList.length === 0 && (
                <span className={styles.tagChip}>#태그 없음</span>
              )}
              {tagList.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  #{tag}
                </span>
              ))}
            </div>

            <section className={styles.descBox}>
              {post.text || "코디 설명이 없습니다."}
            </section>

            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>퍼스널 컬러</span>
                <span>{personalColor}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>퍼스널 체형</span>
                <span>{bodyShape}</span>
              </div>
            </div>

            {/* 상단 버튼: 목록 / 수정 / 삭제 */}
            <div className={styles.btnRow}>
              <button
                className={styles.btn}
                type="button"
                onClick={handleGoList}
              >
                목록으로
              </button>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                type="button"
                onClick={handleEdit}
              >
                수정하기
              </button>
              <button
                className={styles.btn}
                type="button"
                onClick={handleDelete}
              >
                삭제하기
              </button>
            </div>

            {/* 좋아요 / 싫어요 */}
            <div className={styles.btnRow}>
              <button
                className={`${styles.btn} ${styles.btnLike}`}
                type="button"
                onClick={handleLike}
              >
                <i
                  className={`bi bi-hand-thumbs-up-fill ${styles.icon}`}
                  aria-hidden="true"
                />
                <span>좋아요 {likeCount}</span>
              </button>
              <button
                className={`${styles.btn} ${styles.btnDislike}`}
                type="button"
                onClick={handleDislike}
              >
                <i
                  className={`bi bi-hand-thumbs-down-fill ${styles.icon}`}
                  aria-hidden="true"
                />
                <span>싫어요 {dislikeCount}</span>
              </button>
            </div>

            {/* 댓글 영역 */}
            <section className={styles.commentSection}>
              <h2 className={styles.commentTitle}>
                댓글 {comments.length}
              </h2>

              <div className={styles.commentBox}>
                {comments.length === 0 ? (
                  <p className={styles.commentEmpty}>
                    아직 등록된 댓글이 없습니다.
                  </p>
                ) : (
                  <ul className={styles.commentList}>
                    {comments.map((c) => (
                      <li key={c.id} className={styles.commentItem}>
                        <div className={styles.commentMeta}>
                          <span className={styles.commentWriter}>
                            {c.writer}
                          </span>
                          <span className={styles.commentDate}>
                            {c.createdAt}
                          </span>
                        </div>
                        <p className={styles.commentText}>{c.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <form
                className={styles.commentForm}
                onSubmit={handleCommentSubmit}
              >
                <textarea
                  className={styles.commentInput}
                  placeholder="댓글을 입력해주세요."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.commentSubmit}`}
                >
                  댓글 등록
                </button>
              </form>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
