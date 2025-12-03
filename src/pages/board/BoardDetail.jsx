import React from 'react';
import styles from './Board.module.css'; // Board.module.css를 재사용합니다.

function BoardDetail() {
  return (
    <div className={styles.boardContainer}>
      <h2>게시글 상세 페이지</h2>
      <p>여기에 게시글의 상세 내용이 표시될 예정입니다.</p>
    </div>
  );
}

export default BoardDetail;