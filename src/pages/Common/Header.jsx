import SubTabs from "./SubTabs";
import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = ({ isHome }) => {

  const [showHeader, setShowHeader] = useState(true);
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const isLoggedIn = !!sessionStorage.getItem("token");

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

  const toggleMainTab = (tabName) => {
    if (activeMainTab === tabName) {
      setActiveMainTab(null);
    } else {
      setActiveMainTab(tabName);
    }
  };

  // 메뉴 닫기
  const closeMenu = () => {
    setMenuOpen(false);
    setActiveMainTab(null);
  };

  return (
    <>
      {menuOpen && <div className={styles.overlay} onClick={closeMenu} />}

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
            className={`${styles.menuToggle} ${isHome ? styles.menuToggleHome : styles.menuToggleSub}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        <div className={styles.tabArea}>
          {/* 메인탭 */}
          <nav className={`${styles.mainTabs} ${menuOpen ? styles.openMenu : styles.closeMenu}`}>

            {/* 홈일 때 */}
            {!isMobile && isHome && (
              <>
                <NavLink to="/color" className={styles.mainTab}>Personal Color</NavLink>
                <NavLink to="/body" className={styles.mainTab}>Personal Body</NavLink>
                <NavLink to="/fitroom" className={styles.mainTab}>Fitting Room</NavLink>

                {/* PC Community */}
                <NavLink to="/Board" className={styles.mainTab}>
                  Community
                </NavLink>
              </>
            )}

            {/* 서브페이지 */}
            {!isMobile && !isHome && (
              <>
                <NavLink
                  to="/color"
                  className={({ isActive }) =>
                    isActive ? `${styles.mainTab} ${styles.mainTabActive}` : styles.mainTab
                  }
                >
                  Personal Color
                </NavLink>

                <NavLink
                  to="/body"
                  className={({ isActive }) =>
                    isActive ? `${styles.mainTab} ${styles.mainTabActive}` : styles.mainTab
                  }
                >
                  Personal Body
                </NavLink>

                <NavLink
                  to="/fitroom"
                  className={({ isActive }) =>
                    isActive ? `${styles.mainTab} ${styles.mainTabActive}` : styles.mainTab
                  }
                >
                  Fitting Room
                </NavLink>

                {/* PC Community */}
                <NavLink
                  to="/Board"
                  className={({ isActive }) =>
                    isActive ? `${styles.mainTab} ${styles.mainTabActive}` : styles.mainTab
                  }
                >
                  Community
                </NavLink>
              </>
            )}

            {/* 모바일 */}
            {isMobile && (
              <>
                {/* COLOR */}
                <div className={styles.mainTabGroup}>
                  <div className={styles.mainTab} onClick={() => toggleMainTab("color")}>
                    Personal Color
                  </div>
                  {activeMainTab === "color" && (
                    <div className={styles.subDropdown}>
                      <NavLink to="/color" onClick={closeMenu}>Personal Color?</NavLink>
                    </div>
                  )}
                </div>

                {/* BODY */}
                <div className={styles.mainTabGroup}>
                  <div className={styles.mainTab} onClick={() => toggleMainTab("body")}>
                    Personal Body
                  </div>
                  {activeMainTab === "body" && (
                    <div className={styles.subDropdown}>
                      <NavLink to="/body" onClick={closeMenu}>Personal Body?</NavLink>
                    </div>
                  )}
                </div>

                {/* FITROOM */}
                <div className={styles.mainTabGroup}>
                  <div className={styles.mainTab} onClick={() => toggleMainTab("fitroom")}>
                    Fitting Room
                  </div>
                  {activeMainTab === "fitroom" && (
                    <div className={styles.subDropdown}>
                      <NavLink to="/fitroom" onClick={closeMenu}>FitRoom</NavLink>
                      <NavLink to="/fitroom/closet" onClick={closeMenu}>Closet</NavLink>
                      <NavLink to="/fitroom/model" onClick={closeMenu}>Model</NavLink>
                      <NavLink to="/fitroom/history" onClick={closeMenu}>History</NavLink>
                      <NavLink to="/fitroom/about" onClick={closeMenu}>About</NavLink>
                    </div>
                  )}
                </div>

                {/* MOBILE Community */}
                <div className={styles.mainTabGroup}>
                  {/* key값을 community → Board로 통일 */}
                  <div className={styles.mainTab} onClick={() => toggleMainTab("Board")}>
                    Community
                  </div>

                  {activeMainTab === "Board" && (
                    <div className={styles.subDropdown}>
                      {/* 잘못된 /Board/Board → /Board 로 수정 */}
                      <NavLink to="/Board" onClick={closeMenu}>Free Board</NavLink>
                      <NavLink to="/Board" onClick={closeMenu}>Q&A</NavLink>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isLoggedIn && (
              <NavLink
                to="/login"
                className={styles.mainTab}
                onClick={closeMenu}
              >
                Login
              </NavLink>
            )}
          </nav>

          {/* 서브탭 */}
          {isHome === false && isMobile === false && (
            <div className={styles.subTabsWrapper}>
              <SubTabs cx={cx} onClickItem={closeMenu} />
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
