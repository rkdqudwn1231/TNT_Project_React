import SubTabs from "./SubTabs";
import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = ({ isHome }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Home 전용 스크롤 이벤트
  useEffect(() => {
    if (!isHome) {
      setShowHeader(true);
      setSolid(true);
      return;
    }

    const threshold = 10;
    const holdShow = 120;
    let prev = window.scrollY;

    const handleScroll = () => {
      const cur = window.scrollY;
      const diff = cur - prev;

      if (Math.abs(diff) < threshold) return;

      if (diff < 0) setShowHeader(true);
      if (diff > 0 && cur > holdShow) setShowHeader(false);

      setSolid(cur > 150);
      prev = cur;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const cx = (base, active) => ({ isActive }) =>
    isActive ? `${base} ${active}` : base;

  // 메뉴를 닫는 함수
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* 🔥 모바일 오버레이 (메뉴 열릴 때만 표시) */}
      {menuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}

      <header
        className={`
          ${styles.header}
            ${isHome ? (solid ? styles.solid : styles.transparent) : styles.subHeader}
          ${isHome ? styles.homeText : ""}
          ${showHeader ? "" : styles.hide}
        `}
      >
        <div className={styles.logoArea}>
          <a href="/" className={styles.logo}>TNT</a>

          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        <div className={styles.tabArea}>
          {/* 메인탭 */}
          <nav
            className={`${styles.mainTabs} ${menuOpen ? styles.openMenu : styles.closeMenu
              }`}
          >
            <NavLink
              to="/color"
              className={cx(styles.mainTab, styles.mainTabActive)}
              onClick={closeMenu}
            >
              Personal Color
            </NavLink>

            <NavLink
              to="/body"
              className={cx(styles.mainTab, styles.mainTabActive)}
              onClick={closeMenu}
            >
              Personal Body
            </NavLink>

            <NavLink
              to="/fitroom"
              className={cx(styles.mainTab, styles.mainTabActive)}
              onClick={closeMenu}
            >
              Fitting Room
            </NavLink>
          </nav>

          {/* 서브탭 */}
          {!isHome && (
            <div
              className={`${styles.subTabsWrapper} ${menuOpen ? styles.openMenu : styles.closeMenu
                }`}
            >
              <SubTabs cx={cx} onClickItem={closeMenu} />
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
