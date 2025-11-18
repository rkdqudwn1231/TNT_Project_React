import styles from "./Home.module.css";
import { Container, Row, Col } from "react-bootstrap";

export default function Home() {
  return (
    <div className={styles.home}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        {/* 흐림 처리된 가로 전체 배경 */}
        <video autoPlay muted loop playsInline className={styles.videoBgBlur}>
          <source src="/videos/intro8.mp4" type="video/mp4" />
        </video>

        {/* 실제 보여줄 세로 영상 */}
        <video autoPlay muted loop playsInline className={styles.videoMain}>
          <source src="/videos/intro8.mp4" type="video/mp4" />
        </video>

        <div className={styles.overlay}>
          <h1>Your Style, Defined</h1>
          <p>Unlock your personal color & shape</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      {/* 예시로 아무 이미지 먼저 넣었음 */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="mb-4 fw-bold">Personel Color</h2>
              <p>
                여기에 About 소개
              </p>
            </Col>
            <Col lg={6}>
              <img
                src="/images/personal1.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{
                  marginTop: "100px",
                  marginLeft: "20px"
                }}
              />
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col lg={6}>
              <img
                src="/images/personal2.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{
                  marginTop: "100px",
                  marginLeft: "-30px"
                }}
              />
            </Col>
            <Col lg={6} style={{ textAlign: "right" }}>
              <h2 className="mb-4 fw-bold">Personel Color</h2>
              <p>
                여기에 About 소개
              </p>
            </Col>

            <Col lg={6}>
              <h2 className="mb-4 fw-bold">Personel Body</h2>
              <p>
                여기에 About 소개
              </p>
            </Col>
            <Col lg={6}>
              <img
                src="/images/personal3.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{
                  marginTop: "100px",
                  marginLeft: "170px"
                }}
              />
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col lg={6}>
              <img
                src="/images/personal4.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{
                  marginTop: "100px",
                  marginLeft: "-10px"
                }}
              />
            </Col>
            <Col lg={6} style={{ textAlign: "right" }}>
              <h2 className="mb-4 fw-bold">Fitting Room</h2>
              <p>
                여기에 About 소개
              </p>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="mb-4 fw-bold">Fitting Room</h2>
              <p>
                여기에 About 소개
              </p>
            </Col>
            <Col lg={6}>
              <img
                src="/images/personal5.png"
                className="img-fluid rounded"
                alt="about"
                style={{
                  marginTop: "100px",
                  marginLeft: "10px",
                  marginBottom: "100px"
                }}
              />
            </Col>
          </Row>

        </Container>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5">여기 푸터</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <h4>Step 1</h4>
              <p>설명…</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <h4>Step 2</h4>
              <p>설명…</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <h4>Step 3</h4>
              <p>설명…</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
