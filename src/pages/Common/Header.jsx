import { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import styles from "./Header.module.css";

const Header = ({isHome}) => {

  const [showHeader, setShowHeader] = useState(true); // 기본은 Header 보이게
  const [solid, setSolid] = useState(false);

  //const [prevScroll, setPrevScroll] = useState(0);

  useEffect(() => {

    // 홈이 아닐 때 헤더 항상 고정 / 노출
    if (!isHome) {
      setShowHeader(true);
      setSolid(true); // 서브 페이지에서는 항상 solid 배경 쓰고 싶으면 true
      return;
    }

    // 홈일 때만 스크롤 이벤트 적용
    const threshold = 10;
    const holdShow = 120;

    let prevScroll = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;
      const diff = current - prevScroll;

      if (Math.abs(diff) < threshold) return;

      // 스크롤 위로 올림 → 헤더 표시
      if (diff < 0) {
        setShowHeader(true);
      }

      // 스크롤 아래로 내림 → 일정 거리 이후에만 숨김
      if (diff > 0 && current > holdShow) {
        setShowHeader(false);
      }

      // solid 배경 적용
      setSolid(current > 150);

      prevScroll=current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // 홈이 아니면 무조건 보이도록 처리
  const visibleClass = !isHome || showHeader ? styles.show : "";


  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`
    ${styles.navbar}
    ${visibleClass}
    ${solid ? styles.solid : styles.transparent}
  `}
    >
      <div className={styles.navWrapper}>
        <Navbar.Brand href="/" className={styles.logo}>
          TNT
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className={styles.menuArea}>
          <Nav>
            <Nav.Link href="/color">Personal Color</Nav.Link>
            <Nav.Link href="/body">Personal Body</Nav.Link>
            <Nav.Link href="/fitroom">FitRoom</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
