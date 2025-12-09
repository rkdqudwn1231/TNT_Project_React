import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const SubTabs = ({ cx, onClickItem }) => {
  const { pathname } = useLocation();

  let tabs = [];

  if (pathname.startsWith("/color")) {
    tabs = [
      { label: "About", path: "/color/about", end: true },
      { label: "Color", path: "/color", end: true },
    ];
  }

  if (pathname.startsWith("/body")) {
    tabs = [
      { label: "About", path: "/body", end: true },
      { label: "Shape Diagnosis", path: "/body/main" },
    ];
  }

  if (pathname.startsWith("/fitroom")) {
    tabs = [
      { label: "About", path: "/fitroom/about" },
      { label: "FitRoom", path: "/fitroom/fitroom", end: true },
      { label: "Closet", path: "/fitroom/closet" },
      { label: "Model", path: "/fitroom/model" },
      { label: "History", path: "/fitroom/history" },


    ];
  }

  //  Community (ootd + QnA)
  if (pathname.startsWith("/Board")) {
    tabs = [
      { label: "OOTD Board", path: "/Board", end: true },
      { label: "Q&A", path: "/Board/qna", end: true }
    ];
  }

  // 기존 board/qna 코드 유지 (호환)
  if (pathname.startsWith("/board") || pathname.startsWith("/qna")) {
    tabs = [
      { label: "OOTD 게시판", path: "/board", end: true },
      { label: "문의 게시판", path: "/qna", end: true }
    ];
  }

  return (
    <div className={styles.subTabs}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.path}
          end={tab.end || false}
          onClick={onClickItem}
          className={cx(styles.subTab, styles.subTabActive)}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default SubTabs;
