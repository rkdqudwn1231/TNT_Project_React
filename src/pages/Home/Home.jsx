import styles from "./Home.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Home() {

  const navigate = useNavigate();

  /* 슬라이드 애니메이션 */
  const slideRefs = useRef([]);
  slideRefs.current = [];

  const addSlideRef = el => {
    if (el && !slideRefs.current.includes(el)) slideRefs.current.push(el);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add(styles.show);
        });
      },
      { threshold: 0.25 }
    );

    slideRefs.current.forEach(ref => observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.home}>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <video autoPlay muted loop playsInline className={styles.videoBgBlur}>
          <source src="/videos/intro.mp4" type="video/mp4" />
        </video>

        <video autoPlay muted loop playsInline className={styles.videoMain}>
          <source src="/videos/intro.mp4" type="video/mp4" />
        </video>

        <div className={styles.overlay}>
          <h1>We Find the Style. You Just Enjoy</h1>
          <p style={{ color: "white" , marginLeft: "15px" }}>From personal color to body shape, we craft a style made just for you.</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-5">
        <Container>

          {/* 1. 퍼스널 컬러 */}
          <Row className="align-items-center" style={{ marginTop: "100px", }}>
            <Col lg={6}
              className={styles.slideLeft}
              ref={addSlideRef}
              style={{ textAlign: "left", paddingRight: "40px" }} >
              <h2 className="mb-4 ">“ 사진 한 장으로 나의 컬러를 찾다 ”</h2>
              <p>
                AI가 피부·머리·눈 색을 분석해 <br />
                나에게 가장 찰떡으로 어울리는 퍼스널 컬러를 알려줘요.
              </p>
              <p>
                어울리는 색상 · 피해야 할 색상은 물론 <br />
                연예인 톤 비교 · 스타일 TIP · 코디 추천까지 한 번에 제공!
              </p>
              <p>지금 바로 사진 업로드하고 당신의 컬러톤을 찾아보세요!</p>
              <button className={styles.naviBtn} onClick={() => navigate("/color")}>
                진단하러 가기
              </button>
            </Col>

            <Col lg={6}
              className={styles.slideRight}
              ref={addSlideRef}
              style={{ transitionDelay: "0.15s" }}>
              <img
                src="/images/about/personal2.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{ marginTop: "100px" }}
              />
            </Col>
          </Row>

          {/* 2. 퍼스널 체형 */}
          <Row className="align-items-center" >
            <Col lg={6}
              className={styles.slideRight}
              ref={addSlideRef}>
              <img
                src="/images/about/personal3.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{ marginTop: "170px", }}
              />
            </Col>

            <Col lg={6}
              className={styles.slideLeft}
              ref={addSlideRef}
              style={{ textAlign: "right", paddingRight: "50px", transitionDelay: "0.15s" }}>
              <h2 className="mb-4 ">“ 스타일의 완성은 핏에서 시작된다 ”</h2>
              <p>
                사진 · 설문 · 치수 중 원하는 방식으로 체형을 분석할 수 있어요.<br />
                AI가 신체 비율과 실루엣을 파악해<br />
                당신에게 가장 잘 맞는 체형 유형을 찾아드려요.
              </p>
              <p>
                어울리는 핏부터 추천 스타일, 베스트 아이템까지 한 번에!
              </p>
              <p>지금 나에게 맞는 진단 방식을 선택하고, 완벽한 핏을 경험해보세요!</p>
              <button className={styles.naviBtn} onClick={() => navigate("/body/main")}>
                진단하러 가기
              </button>
            </Col>
          </Row>

          {/* 3. 피팅룸 */}
          <Row className="align-items-center" style={{ marginTop: "150px", }}>
            <Col lg={6}
              className={styles.slideLeft}
              ref={addSlideRef}
              style={{ textAlign: "left" }}>
              <h2 className="mb-4 ">“ 입어보지 않아도, 입어본 것처럼 ”</h2>
              <p>
                AI가 나의 실루엣 위에 의류를 자연스럽게 합성해<br />
                핏과 분위기를 현실감 있게 확인할 수 있어요.<br />
              </p>
              <p>
                실패 없는 선택을 위한 가장 빠른 방법!
              </p>
              <p>가상피팅룸을 이용하여 온라인에서 자유롭게 옷을 입어보세요!</p>
              <button className={styles.naviBtn} onClick={() => navigate("/fitroom/fitroom")}>
                피팅하러 가기
              </button>
            </Col>

            <Col lg={6}
              className={styles.slideRight}
              ref={addSlideRef}
              style={{ transitionDelay: "0.15s" }}>
              <img
                src="/images/about/personal4.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{ marginTop: "100px", marginLeft: "10px" }}
              />
            </Col>
          </Row>

          {/* 4. 옷장 */}
          <Row className="align-items-center" style={{ marginTop: "220px", }}>
            <Col lg={6}
              className={styles.slideRight}
              ref={addSlideRef}>
              <img
                src="/images/about/personal5.png"
                className="img-fluid rounded"
                alt="about"
                style={{ marginTop: "100px", marginLeft: "10px", marginBottom: "100px" }}
              />
            </Col>

            <Col lg={6}
              className={styles.slideLeft}
              ref={addSlideRef}
              style={{ textAlign: "right", paddingLeft: "40px", transitionDelay: "0.15s" }}>
              <h2 className="mb-4 ">“ 좋아하는 옷들을 한곳에, 나만의 옷장 ”</h2>
              <p>나에게 잘 맞는 옷을 저장해두고, 언제든 다시 꺼내볼 수 있어요.</p>
              <p>
                자주 입는 스타일, 마음에 든 코디, 시도해보고 싶은 룩까지<br />
                한 곳에 정리해서 나만의 옷장을 만들어보세요!
              </p>
              <p>지금 바로 당신의 옷장을 채우고, <br />
                나만의 새로운 스타일을 발견해보세요!</p>
              <button className={styles.naviBtn} onClick={() => navigate("/fitroom/closet")}>
                내 옷장 가기
              </button>
            </Col>
          </Row>

          {/* 5. 챗봇 */}
          <Row className="align-items-center" style={{ marginTop: "190px", marginBottom: "250px" }} >
            <Col lg={6}
              className={styles.slideLeft}
              ref={addSlideRef}>
              <h2 className="mb-4 ">" 나만의 스타일 메이트, 패션 챗봇 "</h2>
              <p>
                패션이 어려울 때, 스타일이 고민될 때<br />
                언제든 옆에서 조언해주는 나만의 AI 스타일리스트예요.
              </p>
              <p>
                성별 · 체형 · 퍼스널 컬러 · 취향을 바탕으로<br />
                어울리는 아이템과 코디를 대화하듯 추천해줘요.
              </p>
              <p>
                지금 패션 챗봇과 대화하며<br />
                가장 나다운 스타일을 찾아보세요!
              </p>
            </Col>

            <Col lg={6}
              className={styles.slideRight}
              ref={addSlideRef}
              style={{ transitionDelay: "0.15s" }}>
              <img
                src="/images/about/chatbot.png"
                className="img-fluid rounded"
                alt="about"
                style={{ marginTop: "30px" }}
              />
            </Col>
          </Row>

        </Container>
      </section>
    </div>
  );
}
