import { useState } from "react";
import styles from "./Home.module.css";
import { Container, Row, Col } from "react-bootstrap";
import colorstyles from "../PersonalColor/Colortest.module.css";
import { tonePalettes } from "../PersonalColor/TonePalettes";
import ColorModal from "../PersonalColor/modal/ColorModal";
import { useNavigate } from "react-router-dom";

const seasonMap = {
  "봄": "Spring",
  "여름": "Summer",
  "가을": "Autumn",
  "겨울": "Winter"
};

const toneButtons = [
  { key: "봄", label: "봄🌸" },
  { key: "여름", label: "여름🌿" },
  { key: "가을", label: "가을🍁" },
  { key: "겨울", label: "겨울❄" }
];

export default function Home() {
  const [selectedTone, setSelectedTone] = useState("봄");
  const [selectedColor, setSelectedColor] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        {/* 흐림 처리된 가로 전체 배경 */}
        <video autoPlay muted loop playsInline className={styles.videoBgBlur}>
          <source src="/videos/intro.mp4" type="video/mp4" />
        </video>

        {/* 실제 보여줄 세로 영상 */}
        <video autoPlay muted loop playsInline className={styles.videoMain}>
          <source src="/videos/intro.mp4" type="video/mp4" />
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
              <h2 className={colorstyles.title}>퍼스널 컬러란 무엇인가요?</h2>

              <p className={colorstyles.paragraph}>
                개인의 피부톤에 가장 잘 어울리는 색상을 찾아주는 컬러로지 이론입니다.
                색상의 조화와 부조화의 원리를 바탕으로 모든 색상을 사계절 유형으로 구분하는 것이 특징입니다!
                퍼스널 컬러는 개인에게 가장 잘 어울리는 색상을 진단하여 약점은 커버하고 강점은 극대화하여 긍정적이고 자신감 있는 이미지를 만들어냅니다.
                퍼스널 컬러의 활용은 개인의 생활 패턴, 심리 상태, 생체 리듬에 영향을 미쳐 더욱 풍요롭고 안정적인 삶을 가능하게 합니다!
              </p>

              <p className={colorstyles.paragraph}>
                퍼스널 컬러는 20세기 초 스위스 예술가
                <strong> 요하네스 이텐(Johannes Itten)</strong>이
                ‘사계절 색채 이론’을 기반으로 개념을 확립했습니다.
                그는 “색은 생명이다. 색이 없는 세상은 죽은 것처럼 보인다”고 말하며 색의 중요성을 강조했습니다.
              </p>

              <p className={colorstyles.paragraph}>
                오늘날 퍼스널 컬러는 패션, 메이크업, 스타일링 전반에서 널리 활용되며
                자신에게 가장 잘 맞는 <strong>옷 색상, 화장품 컬러, 액세서리 톤</strong>을 선택하는 데 큰 도움을 줍니다.
              </p>

            </Col>
            <Col lg={6}>
              <img
                src="/images/about/personal1.jpg"
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
                src="/images/about/personal2.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{
                  marginTop: "100px",
                  marginLeft: "-30px"
                }}
              />
            </Col>
            <Col lg={6} style={{ textAlign: "left", paddingRight: "40px" }}>
              <h2 className="mb-4 fw-bold">Personel Color</h2>
              <p className={colorstyles.paragraph}>
                퍼스널 컬러는 피부톤·명도·채도·대비를 분석해 나에게 가장 조화로운 색을 찾아주는
                이미지 컨설팅 이론입니다.
                단순히 ‘예쁜 색 고르기’가 아니라, 얼굴의 생기와 선명도, 입체감을 자연스럽게
                끌어올려 나만의 분위기를 극대화하는 과정이기도 합니다.
              </p>

              <p className={colorstyles.paragraph}>
                사계절 퍼스널 컬러는 봄·여름·가을·겨울 4가지 계절의 온도감과 분위기를 바탕으로
                어울리는 색상 흐름을 정리한 체계입니다.
                예를 들어 위의 <b>브라이트 스프링</b> 이미지는 ‘따뜻함 ,선명함(Warm & Clear)’을
                특징으로 하며, 밝고 채도가 높은 컬러가 얼굴을 환하게 표현해 줍니다.
              </p>

              <p className={colorstyles.paragraph}>
                각 계절의 팔레트는 의상 색 조합은 물론, 헤어 컬러, 메이크업 톤(파운데이션·섀도우·립)
                선택에도 직접적으로 활용됩니다.
                아래 팔레트를 통해 나와 맞는 계절 감성과 컬러 분위기를 한눈에 확인해보세요.
              </p>



              <div className={colorstyles.toneButtons}>
                {toneButtons.map((tone) => (
                  <button
                    key={tone.key}
                    className={`${colorstyles.toneBtn} ${selectedTone === tone.key ? colorstyles.activeBtn : ""
                      }`}
                    onClick={() => setSelectedTone(tone.key)}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>

              <div className={colorstyles.paletteContainer}>
                {tonePalettes[seasonMap[selectedTone]].map((color, i) => (
                  <div
                    key={i}
                    className={colorstyles.colorCircle}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color);
                      setModalShow(true);
                    }}
                  ></div>
                ))}
              </div>

              <ColorModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                color={selectedColor}
              />



            </Col>

            <Col lg={6}>
              <h2 className="mb-4 fw-bold">Personel Body</h2>
              <p>
                여기에 About 소개
              </p>
            </Col>
            <Col lg={6}>
              <img
                src="/images/about/personal3.jpg"
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
                src="/images/about/personal4.jpg"
                className="img-fluid rounded"
                alt="about"
                style={{
                  marginTop: "100px",
                  marginLeft: "-10px"
                }}
              />
            </Col>
            <Col lg={6} >
              <h2 className="mb-4 fw-bold">Fitting Room</h2>
              <p>
                가상피팅룸(Virtual Fitting Room)은 온라인에서 이미지를 통해 옷을 입어보는 경험을 <br></br>
                시뮬레이션해 주는 기술입니다.<br></br><br></br>
                실제로 옷을 착용하지 않아도, 모델 이미지·옷 이미지를 활용하여  <br></br>
                현실감 있는 시뮬레이션을 제공합니다.
              </p>
              <button
                onClick={() => navigate("/fitroom")}
                style={{
                  float: "right",
                  padding: "10px 18px",
                  borderRadius: "15px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: "0.25s",
                  background: "linear-gradient(135deg, #ff8fa3, #fc8da7ff)",
                  color: "white",
                  boxShadow: "0 4px 10px rgba(255, 111, 145, 0.4)",
                  display: "inline-block",
                  textAlign: "center",
                  userSelect: "none"
                }}
              >
                GO Fitting Room
              </button>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="mb-4 fw-bold">Fitting Room</h2>
              <p>

                사용자에게 시간 절약, 맞춤 체험, 반품률 감소, 데이터 활용 장점을 제공합니다.<br></br>
                가상피팅룸을 이용하여 온라인에서 자유롭게 옷을 입어보세요!
              </p>
              <button
                onClick={() => navigate("/fitroom")}
                style={{
                  float: "right",
                  padding: "10px 18px",
                  borderRadius: "15px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: "0.25s",
                  background: "linear-gradient(135deg, #ff8fa3, #fc8da7ff)",
                  color: "white",
                  boxShadow: "0 4px 10px rgba(255, 111, 145, 0.4)",
                  display: "inline-block",
                  textAlign: "center",
                  userSelect: "none"
                }}
              >
                GO Fitting Room
              </button>
            </Col>
            <Col lg={6}>
              <img
                src="/images/about/personal5.png"
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
