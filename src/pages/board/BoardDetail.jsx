import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { caxios } from "../../config/config";
import styles from "./BoardDetail.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function BoardDetail() {
  const { seq } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  // 실제 서버 댓글 목록
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 대댓글 입력 상태
  const [replyParentId, setReplyParentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // 게시글 수정 상태
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  // "LIKE" | "DISLIKE" | null
  const [myReaction, setMyReaction] = useState(null);

  // 로그인 정보
  const loginId = sessionStorage.getItem("id");        // 회원 ID
  const loginNickname = sessionStorage.getItem("nickname"); // 현재 닉네임

  // 게시글 상세 조회
  const fetchPost = async () => {
    try {
      const res = await caxios.get(`/board/detail/${seq}`);
      const data = res.data;

      setPost(data);
      setLikeCount(data.likeCount ?? 0);
      setDislikeCount(data.dislikeCount ?? 0);

      setEditTitle(data.title || "");
      setEditText(data.text || "");
    } catch (err) {
      console.error("게시글 상세 로드 실패", err);
      alert("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 댓글 목록 조회
  const fetchComments = async () => {
    try {
      const res = await caxios.get(`/board/${seq}/comments`);
      const list = res.data || [];

      const mapped = list.map((c) => ({
        id: c.seq,
        writer: c.member_nickname,       // 화면에 보이는 닉네임
        memberId: c.member_id,           // 권한 체크용 ID
        text: c.content,
        createdAt: c.created_at
          ? String(c.created_at).replace("T", " ").slice(0, 16)
          : "",
        parentSeq: c.parent_seq ?? null,
        depth: c.depth ?? 0,
      }));

      setComments(mapped);
    } catch (err) {
      console.error("댓글 목록 로드 실패", err);
    }
  };

  // 내 좋아요/싫어요 상태 조회
  const fetchMyReaction = async () => {
    if (!loginId) {
      setMyReaction(null);
      return;
    }

    try {
      const res = await caxios.get(`/board/${seq}/reaction`, {
        params: { memberId: loginId },
      });

      console.log("내 반응 응답:", res.data);

      let reaction = null;

      if (typeof res.data === "string") {
        reaction = res.data;
      } else if (res.data && typeof res.data === "object") {
        reaction = res.data.reaction;
      }

      if (reaction !== "LIKE" && reaction !== "DISLIKE") {
        reaction = null;
      }

      setMyReaction(reaction);
    } catch (err) {
      console.error("내 반응 조회 실패", err);
      setMyReaction(null);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [seq]);

  useEffect(() => {
    fetchComments();
  }, [seq]);

  useEffect(() => {
    fetchMyReaction();
  }, [seq, loginId]);

  // 목록으로
  const handleGoList = () => {
    navigate("/Board");
  };

  // 게시글 수정 시작
  const handleStartEditPost = () => {
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }
    if (!isOwner) {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }
    setIsEditingPost(true);
  };

  // 게시글 수정 취소
  const handleCancelEditPost = () => {
    if (!post) return;
    setEditTitle(post.title || "");
    setEditText(post.text || "");
    setIsEditingPost(false);
  };

  // 게시글 수정 저장
  const handleSaveEditPost = async () => {
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }
    if (!isOwner) {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }

    const trimmedTitle = editTitle.trim();
    const trimmedText = editText.trim();

    if (!trimmedTitle) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      await caxios.put(`/board/update/${seq}`, {
        title: trimmedTitle,
        text: trimmedText,
      });

      setPost((prev) =>
        prev
          ? {
              ...prev,
              title: trimmedTitle,
              text: trimmedText,
            }
          : prev
      );
      setIsEditingPost(false);
      alert("게시글이 수정되었습니다.");
    } catch (err) {
      console.error("게시글 수정 실패", err);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }

    if (!isOwner) {
      alert("작성자만 삭제할 수 있습니다.");
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
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }

    const memberId = loginId;

    try {
      await caxios.post(`/board/like/${seq}`, null, {
            params: {
             memberId: loginId,
             memberNickname: loginNickname,   // ★ 추가
            },
        });

      if (myReaction === "LIKE") {
        // 이미 좋아요 → 취소
        setMyReaction(null);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        // 기존에 싫어요였다면 싫어요 취소
        if (myReaction === "DISLIKE") {
          setDislikeCount((prev) => Math.max(prev - 1, 0));
        }
        setMyReaction("LIKE");
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("좋아요 실패", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 싫어요
  const handleDislike = async () => {
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }

    const memberId = loginId;

    try {
      await caxios.post(`/board/dislike/${seq}`, null, {
        params: { memberId },
      });

      if (myReaction === "DISLIKE") {
        // 이미 싫어요 → 취소
        setMyReaction(null);
        setDislikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        // 기존에 좋아요였다면 좋아요 취소
        if (myReaction === "LIKE") {
          setLikeCount((prev) => Math.max(prev - 1, 0));
        }
        setMyReaction("DISLIKE");
        setDislikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("싫어요 실패", err);
      alert("싫어요 처리 중 오류가 발생했습니다.");
    }
  };

  // 일반 댓글 등록
  const handleCommentSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }

    const trimmed = newComment.trim();
    if (!trimmed) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const nickname = loginNickname || loginId;

      await caxios.post(`/board/${seq}/comments`, {
        content: trimmed,
        member_id: loginId,       // 권한 체크용
        member_nickname: nickname // 화면 표시용
      });

      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("댓글 등록 실패", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 입력창 열기
  const handleOpenReply = (parentId) => {
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }
    setReplyParentId(parentId);
    setReplyText("");
  };

  // 대댓글 등록
  const handleReplySubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }

    if (!replyParentId) {
      alert("대댓글 대상이 없습니다.");
      return;
    }

    const trimmed = replyText.trim();
    if (!trimmed) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const nickname = loginNickname || loginId;

      await caxios.post(`/board/${seq}/comments/${replyParentId}`, {
        content: trimmed,
        member_id: loginId,
        member_nickname: nickname,
      });

      setReplyText("");
      setReplyParentId(null);
      await fetchComments();
    } catch (err) {
      console.error("대댓글 등록 실패", err);
      alert("대댓글 등록 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정 시작
  const handleStartEditComment = (comment) => {
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }
    // 권한 체크는 memberId 기준
    if (comment.memberId !== loginId) {
      alert("본인 댓글만 수정할 수 있습니다.");
      return;
    }
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  // 댓글 수정 취소
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  // 댓글 수정 저장
  const handleSaveEditComment = async (commentId) => {
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }

    const trimmed = editCommentText.trim();
    if (!trimmed) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await caxios.put(`/board/${seq}/comments/${commentId}`, {
        content: trimmed,
        member_id: loginId,   // 서버에서 seq + member_id 로 검사
      });

      setEditingCommentId(null);
      setEditCommentText("");
      await fetchComments();
    } catch (err) {
      console.error("댓글 수정 실패", err);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (comment) => {
    if (!loginId) {
      alert("로그인 해주세요.");
      return;
    }
    if (comment.memberId !== loginId) {
      alert("본인 댓글만 삭제할 수 있습니다.");
      return;
    }

    const ok = window.confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await caxios.delete(`/board/${seq}/comments/${comment.id}`, {
        data: { member_id: loginId }, // axios delete body
      });
      await fetchComments();
    } catch (err) {
      console.error("댓글 삭제 실패", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
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

  const writer = post.writer_nickname || post.id || "익명";

  const rawDate = post.regdate || post.created_at || post.createdAt || "";
  const createdAt = rawDate
    ? rawDate.replace("T", " ").slice(0, 16)
    : "날짜 정보 없음";

  const views = post.readCount || post.views || 0;
  const personalColor = post.color || "정보 없음";
  const bodyShape = post.body_shape || "정보 없음";

  const imageUrl =
    post.image_url ||
    post.photo_url ||
    "https://via.placeholder.com/800x1000.png?text=%EC%BD%94%EB%94%94+%EC%9D%B4%EB%AF%B8%EC%A7%80";

  const isOwner = !!loginId && post.id === loginId;

  const topLevelComments = comments.filter((c) => !c.parentSeq);
  const replyComments = comments.filter((c) => c.parentSeq);

  const getReplies = (parentId) =>
    replyComments.filter((c) => c.parentSeq === parentId);

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

                {tagList.map((tag) => (
                  <span key={tag} className={styles.badge}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 오른쪽: 정보 */}
          <section className={styles.card}>
            <header className={styles.metaTop}>
              <div>
                {isEditingPost ? (
                  <input
                    className={styles.editTitleInput}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="제목을 입력해주세요."
                  />
                ) : (
                  <h1 className={styles.title}>{post.title}</h1>
                )}
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
              {isEditingPost ? (
                <textarea
                  className={styles.editTextarea}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="코디 설명을 입력해주세요."
                />
              ) : (
                post.text || "코디 설명이 없습니다."
              )}
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

            {/* 상단 버튼 */}
            <div className={styles.btnRow}>
              <button
                className={styles.btn}
                type="button"
                onClick={handleGoList}
              >
                목록으로
              </button>

              {isOwner && !isEditingPost && (
                <>
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    type="button"
                    onClick={handleStartEditPost}
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
                </>
              )}

              {isOwner && isEditingPost && (
                <>
                  <button
                    className={styles.btn}
                    type="button"
                    onClick={handleCancelEditPost}
                  >
                    취소
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    type="button"
                    onClick={handleSaveEditPost}
                  >
                    저장
                  </button>
                </>
              )}
            </div>

            {/* 좋아요 / 싫어요 */}
            <div className={styles.btnRow}>
              <button
                className={`${styles.btn} ${styles.btnLike} ${
                  myReaction === "LIKE" ? styles.btnLikeActive : ""
                }`}
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
                className={`${styles.btn} ${styles.btnDislike} ${
                  myReaction === "DISLIKE" ? styles.btnDislikeActive : ""
                }`}
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

            {/* 댓글 입력 */}
            <form
              className={styles.commentForm}
              onSubmit={handleCommentSubmit}
            >
              <textarea
                className={styles.commentInput}
                placeholder="댓글을 입력해주세요."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
                style={{ resize: "none" }}
              />
              <button
                type="submit"
                className={`${styles.btn} ${styles.commentSubmit}`}
              >
                댓글 등록
              </button>
            </form>

            {/* 댓글 리스트 */}
            <section className={styles.commentSection}>
              <h2 className={styles.commentTitle}>댓글 {comments.length}</h2>

              <div className={styles.commentBox}>
                {comments.length === 0 ? (
                  <p className={styles.commentEmpty}>
                    아직 등록된 댓글이 없습니다.
                  </p>
                ) : (
                  <ul className={styles.commentList}>
                    {topLevelComments.map((c) => {
                      const isMyComment =
                        !!loginId && c.memberId === loginId;

                      return (
                        <li key={c.id} className={styles.commentItem}>
                          <div className={styles.commentMeta}>
                            <span className={styles.commentWriter}>
                              {c.writer}
                            </span>
                            <span className={styles.commentDate}>
                              {c.createdAt}
                            </span>
                          </div>

                          {editingCommentId === c.id ? (
                            <textarea
                              className={styles.commentEditInput}
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                            />
                          ) : (
                            <p className={styles.commentText}>{c.text}</p>
                          )}

                          <div className={styles.commentFooter}>
                            {/* 왼쪽: 수정 · 삭제 */}
                            {isMyComment && (
                              <div className={styles.commentActions}>
                                {editingCommentId === c.id ? (
                                  <>
                                    <button
                                      type="button"
                                      className={styles.commentActionButton}
                                      onClick={() =>
                                        handleSaveEditComment(c.id)
                                      }
                                    >
                                      저장
                                    </button>
                                    <span
                                      className={styles.commentActionDivider}
                                    >
                                      ·
                                    </span>
                                    <button
                                      type="button"
                                      className={styles.commentActionButton}
                                      onClick={handleCancelEditComment}
                                    >
                                      취소
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      className={styles.commentActionButton}
                                      onClick={() =>
                                        handleStartEditComment(c)
                                      }
                                    >
                                      수정
                                    </button>
                                    <span
                                      className={styles.commentActionDivider}
                                    >
                                      ·
                                    </span>
                                    <button
                                      type="button"
                                      className={styles.commentActionButton}
                                      onClick={() =>
                                        handleDeleteComment(c)
                                      }
                                    >
                                      삭제
                                    </button>
                                  </>
                                )}
                              </div>
                            )}

                            {/* 오른쪽: 대댓글 버튼 */}
                            <button
                              type="button"
                              className={styles.replyButton}
                              onClick={() => handleOpenReply(c.id)}
                            >
                              <i
                                className={`bi bi-arrow-return-right ${styles.replyIcon}`}
                                aria-hidden="true"
                              />
                            </button>
                          </div>

                          {/* 이 부모 댓글에 대한 대댓글 입력창 */}
                          {replyParentId === c.id && (
                            <form
                              className={styles.replyForm}
                              onSubmit={handleReplySubmit}
                            >
                              <textarea
                                className={styles.replyInput}
                                value={replyText}
                                onChange={(e) =>
                                  setReplyText(e.target.value)
                                }
                                placeholder="대댓글을 입력해주세요."
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleReplySubmit();
                                  }
                                }}
                                style={{ resize: "none" }}
                              />
                              <button
                                type="submit"
                                className={`${styles.btn} ${styles.commentSubmit}`}
                              >
                                답글 등록
                              </button>
                            </form>
                          )}

                          {/* 대댓글 리스트 */}
                          {getReplies(c.id).length > 0 && (
                            <ul className={styles.replyList}>
                              {getReplies(c.id).map((r) => {
                                const isMyReply =
                                  !!loginId && r.memberId === loginId;
                                const isEditingReply =
                                  editingCommentId === r.id;

                                return (
                                  <li
                                    key={r.id}
                                    className={styles.replyItem}
                                  >
                                    <div className={styles.commentMeta}>
                                      <span className={styles.commentWriter}>
                                        {r.writer}
                                      </span>
                                      <span className={styles.commentDate}>
                                        {r.createdAt}
                                      </span>
                                    </div>

                                    {isEditingReply ? (
                                      <textarea
                                        className={styles.commentEditInput}
                                        value={editCommentText}
                                        onChange={(e) =>
                                          setEditCommentText(
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      <p className={styles.commentText}>
                                        {r.text}
                                      </p>
                                    )}

                                    <div className={styles.commentFooter}>
                                      {isMyReply && (
                                        <div
                                          className={
                                            styles.commentActions
                                          }
                                        >
                                          {isEditingReply ? (
                                            <>
                                              <button
                                                type="button"
                                                className={
                                                  styles.commentActionButton
                                                }
                                                onClick={() =>
                                                  handleSaveEditComment(
                                                    r.id
                                                  )
                                                }
                                              >
                                                저장
                                              </button>
                                              <span
                                                className={
                                                  styles.commentActionDivider
                                                }
                                              >
                                                ·
                                              </span>
                                              <button
                                                type="button"
                                                className={
                                                  styles.commentActionButton
                                                }
                                                onClick={
                                                  handleCancelEditComment
                                                }
                                              >
                                                취소
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                type="button"
                                                className={
                                                  styles.commentActionButton
                                                }
                                                onClick={() =>
                                                  handleStartEditComment(
                                                    r
                                                  )
                                                }
                                              >
                                                수정
                                              </button>
                                              <span
                                                className={
                                                  styles.commentActionDivider
                                                }
                                              >
                                                ·
                                              </span>
                                              <button
                                                type="button"
                                                className={
                                                  styles.commentActionButton
                                                }
                                                onClick={() =>
                                                  handleDeleteComment(r)
                                                }
                                              >
                                                삭제
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
