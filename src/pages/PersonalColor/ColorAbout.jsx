// src/pages/PersonalColor/ColorAbout.jsx
import { useEffect, useRef } from "react";
import styles from "./ColorAbout.module.css";

export default function ColorAbout() {
  const revealRefs = useRef([]);

  const addReveal = el => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealRefs.current.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 2~5 : 컬러의 다양성과 스타일 이미지를 보여주는 섹션 카드들
  const diversityBlocks = [
    {
      id: 1,
      label: "COLOR × STYLE",
      title: "컬러가 바뀌면 같은 아이템도 완전히 다른 무드",
      desc: "같은 셔츠와 팬츠라도 어떤 색을 입느냐에 따라 분위기는 러블리, 모던, 레트로까지 끝없이 변합니다. 퍼스널 컬러는 ‘나에게 맞는 무드’를 골라주는 기준점이에요.",
      img: "/images/colorabout/palette_card1.jpg", // 이미지2
    },
    {
      id: 2,
      label: "COLOR DIVERSITY",
      title: "비슷한 빨강, 전혀 다른 인상",
      desc: "오렌지 레드, 토마토 레드, 버건디… 미묘한 톤 차이가 얼굴의 혈색과 대비를 바꿔요. 내 피부와 가장 자연스럽게 섞이는 ‘나만의 레드’를 찾는 것이 퍼스널 컬러의 시작입니다.",
      img: "/images/colorabout/palette_card2.jpg", // 이미지3
    },
    {
      id: 3,
      label: "BRIGHT vs SOFT",
      title: "밝기와 채도에 따라 살아나는 사람",
      desc: "어떤 사람은 쨍한 형광 컬러에서, 또 어떤 사람은 안개 낀 파스텔에서 가장 빛나요. 퍼스널 컬러는 ‘얼마나 밝고, 얼마나 선명한 색’을 입어야 하는지도 함께 알려줍니다.",
      img: "/images/colorabout/palette_card3.jpg", // 이미지4
    },
    {
      id: 4,
      label: "YOUR COLOR STORY",
      title: "옷장 전체가 나만의 팔레트로 이어지도록",
      desc: "잘 어울리는 색들을 축으로 삼으면 상·하의, 아우터, 액세서리까지 자연스럽게 연결되는 컬러 스토리가 만들어집니다. 매일의 코디가 훨씬 쉬워져요.",
      img: "/images/colorabout/palette_card4.jpg", // 이미지5
    },
  ];

  // 6~9 : 사계절 퍼스널 컬러 설명 (지그재그 레이아웃)
  const seasonBlocks = [
    {
      id: 1,
      season: "봄 웜톤 Spring",
      keyword: "맑고 따뜻한 꽃잎 컬러",
      desc: [
        "복숭아빛이 도는 화사한 피부, 밝은 갈색 눈동자와 잘 어울리는 타입.",
        "코랄, 애프리콧, 라이트 옐로우, 밝은 민트처럼 ‘밝고 따뜻한 색’에서 얼굴이 가장 생기 있어 보입니다.",
        "무겁고 탁한 컬러보다는 가볍고 투명한 컬러를 선택하면 어려 보이는 느낌이 살아나요.",
      ],
      best: "베이비 핑크, 코랄, 라이트 옐로우, 민트 그린, 워터 블루",
      img: "/images/colorabout/spring_warm.jpg", // 봄 원톤
    },
    {
      id: 2,
      season: "여름 쿨톤 Summer",
      keyword: "차분하고 투명한 파스텔",
      desc: [
        "푸른 기가 살짝 도는 깨끗한 피부, 그레이시한 눈동자를 가진 경우가 많아요.",
        "연보라, 쿨핑크, 스카이블루, 안개 낀 민트처럼 ‘차갑지만 부드러운 색’에서 얼굴이 정제되어 보입니다.",
        "채도가 너무 높거나 노란색이 많이 섞인 컬러는 피부를 칙칙하게 만들 수 있어요.",
      ],
      best: "라일락, 쿨 핑크, 더스티 블루, 연청, 세이지 그린",
      img: "/images/colorabout/summer_cool.jpg", // 여름 쿨톤
    },
    {
      id: 3,
      season: "가을 웜톤 Autumn",
      keyword: "깊고 포근한 어스 컬러",
      desc: [
        "골드·브라운 계열과 찰떡궁합인 따뜻한 이미지.",
        "카멜, 머스타드, 올리브, 테라코타 같은 ‘가을 숲의 색’이 들어오면 눈동자가 또렷해지고 분위기가 성숙해집니다.",
        "피부가 노랗게 뜨지 않도록 너무 쨍한 형광 컬러보다는 살짝 눌린 톤을 선택하는 것이 포인트.",
      ],
      best: "카멜 브라운, 카키, 머스타드, 브릭 오렌지, 포레스트 그린",
      img: "/images/colorabout/autumn_warm.jpg", // 가을 웜톤
    },
    {
      id: 4,
      season: "겨울 쿨톤 Winter",
      keyword: "선명하고 콘트라스트 강한 컬러",
      desc: [
        "흰 피부와 짙은 머리색·눈썹, 강한 대비가 특징인 타입.",
        "버건디, 푸시아, 아이시 블루, 퓨어 화이트처럼 고채도·고대비 컬러에서 얼굴이 또렷하고 카리스마 있게 보입니다.",
        "베이지·코랄처럼 너무 따뜻하고 뿌연 색은 오히려 힘이 빠져 보일 수 있어요.",
      ],
      best: "버건디, 푸시아, 로열 블루, 아이보리·화이트, 블랙",
      img: "/images/colorabout/winter_cool.jpg", // 겨울 쿨톤
    },
  ];

  return (
    <div className={styles.wrapper}>
      {/* 1. 퍼스널 컬러 개념/정의 헤더 */}
      
      <section ref={addReveal} className={`${styles.hero} ${styles.hidden}`}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroTag}>ABOUT PERSONAL COLOR</p>
          <h1 className={styles.heroTitle}>
            퍼스널 컬러,
            <br />
            나를 가장 빛나게 하는 <span>색의 언어</span>
          </h1>
          <p className={styles.heroDesc}>
            퍼스널 컬러는 피부·머리·눈동자의 고유한 톤을 분석해
            나에게 가장 잘 어울리는 색의 범위를 찾는 진단입니다.
            단순히 “웜톤 / 쿨톤”을 나누는 것을 넘어서,
            <br />
            <strong>Hue(따뜻함/차가움) · Value(밝기) · Chroma(선명도)</strong>의
            조합으로 나만의 팔레트를 완성해요.
          </p>
          <div className={styles.heroChips}>
            <span>12계절 퍼스널 컬러</span>
            <span>이미지 메이킹</span>
            <span>메이크업 &amp; 패션 스타일링</span>
          </div>
          {/* <div className={styles.heroPalettes}>
            <img
              src="/images/colorabout/palette_card1.jpg"
              alt="퍼스널 컬러 팔레트 카드"
            />
          </div> */}
        </div>
      </section>

      {/* 2~5. 컬러의 다양성과 역할 */}
      <section
        ref={addReveal}
        className={`${styles.section} ${styles.hidden}`}
      >
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTag}>WHY COLOR MATTERS</p>
          <h2 className={styles.sectionTitle}>
            같은 옷이어도 색이 바뀌면
            <br />
            인상, 분위기, 존재감까지 달라집니다
          </h2>
          <p className={styles.sectionDesc}>
            퍼스널 컬러는 그냥 ‘예쁜 색’이 아니라,
            <br />
            <strong>나의 피부 톤과 조화를 이루는 색</strong>을 골라 주는 기준입니다.
            아래 예시처럼 색의 선택만으로도 스타일의 무드가 완전히 달라져요.
          </p>
        </div>

        <div className={styles.diversityGrid}>
          {diversityBlocks.map(block => (
            <article
              key={block.id}
              ref={addReveal}
              className={`${styles.diversityCard} ${styles.hidden}`}
            >
              <div className={styles.cardImageWrapper}>
                <img src={block.img} alt={block.title} />
                <div className={styles.cardGlow} />
              </div>
              <div className={styles.cardText}>
                <span className={styles.cardLabel}>{block.label}</span>
                <h3 className={styles.cardTitle}>{block.title}</h3>
                <p className={styles.cardDesc}>{block.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6~9. 사계절 퍼스널 컬러 지그재그 설명 */}
      <section className={styles.zigzagWrapper}>
        {seasonBlocks.map((block, idx) => (
          <div
            key={block.id}
            ref={addReveal}
            className={`${styles.zigzagSection} ${styles.hidden} ${
              idx % 2 === 1 ? styles.reverse : ""
            }`}
          >
            <div className={styles.zigzagImageBox}>
              <img src={block.img} alt={block.season} />
            </div>
            <div className={styles.zigzagTextBox}>
              <p className={styles.zigzagTag}>SEASONAL TYPE</p>
              <h3 className={styles.zigzagTitle}>{block.season}</h3>
              <p className={styles.zigzagKeyword}>{block.keyword}</p>
              <ul className={styles.zigzagList}>
                {block.desc.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <p className={styles.zigzagBest}>
                <span>잘 어울리는 컬러 키워드</span>
                {block.best}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 10. 실제 제공 기능 설명 */}
   <section
  ref={addReveal}
  className={`${styles.featureSection} ${styles.hidden}`}
>
  <div className={styles.featureHeader}>
    <p className={styles.sectionTag}>TNT FITROOM PERSONAL COLOR</p>
    <h2 className={styles.sectionTitle}>
      얼굴 사진 한 장으로,
      <br />
      나만의 퍼스널 컬러 팔레트를 완성하세요
    </h2>
  </div>

  <div className={styles.featureContent}>
    {/* 🔥 텍스트를 div 박스 5개로 변경 */}
    <div className={styles.featureTextBoxes}>
      <div className={styles.featureCard}>
        사용자의 <strong>머리색 · 눈동자색 · 피부톤</strong>을 정밀하게 분석해
        그 사람만의 고유한 색 기반을 찾아드립니다.
      </div>
      <div className={styles.featureCard}>
        12계절 시스템을 기반으로 <strong>퍼스널 컬러 타입</strong>을 정확하게
        진단하고, 어떤 색이 가장 자연스럽고 생기 있게 보이는지 알려줍니다.
      </div>
      <div className={styles.featureCard}>
        나에게 <strong>환하게 살아나는 BEST 컬러</strong>와
        반대로 얼굴이 칙칙해 보일 수 있는 <strong>WORST 컬러</strong>를
        비교해 보여드려 색 선택의 기준을 만들어 드립니다.
      </div>
      <div className={styles.featureCard}>
        각 톤에 해당하는 <strong>대표 연예인 스타일</strong>도 추천되어
        실제 스타일링 감을 빠르게 파악할 수 있습니다.
      </div>
    </div>

    {/* 오른쪽은 진단 이미지 */}
    <div className={styles.featurePreview}>
      <img
        src="/images/colorabout/ColorAnalysis.jpg"
        alt="퍼스널 컬러 진단 예시"
      />
      <div className={styles.previewBadge}>AI COLOR ANALYSIS</div>
    </div>
  </div>
</section>

    </div>
  );
}
