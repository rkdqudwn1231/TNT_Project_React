import { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import styles from "./Header.module.css";

const Header = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [solid, setSolid] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);

  // 헤더 스크롤 이벤트
  useEffect(() => {

    const threshold = 10;
    const holdShow = 120;

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

      setPrevScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);


    return (
        <div className={styles.header}>
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/color">Personal Color</Link>|
                  <Link to="/fitroom">FitRoom</Link>
            </nav>
        </div>
    );
};

export default Header;
