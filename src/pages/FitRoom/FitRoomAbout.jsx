import { useEffect, useRef } from "react";
import styles from "./FitRoomAbout.module.css";

export default function FitRoomAbout() {
  const zigzagRefs = useRef([]);
  const featureRefs = useRef([]);

  const featureSections = [
    {
      id: 2,
      title: "먼저, 나를 이해하는 진단부터",
      desc: `TNT는 '멋 있음'을 따라가기 전에, '나'를 정확히 이해하는 것부터 시작합니다.
퍼스널 컬러와 퍼스널 체형을 온라인 환경에서 정교하게 진단해
무슨 옷이 나를 가장 편안하고 세련되게 보이게 하는지 기초부터 정리해 줍니다.`,
      lists: [
        "퍼스널 컬러 진단 → 어울리는 컬러 팔레트 제공",
        "퍼스널 체형 진단 → H·A·V·O·X 체형 분석",
        "진단 결과는 가상 피팅과 옷장 추천에 연동"
      ],
      image: "/images/fitroom/virtual-mirror.png",
      alt: "TNT 메인 화면",
  imgStyle: { maxWidth: "800px" }
    },
    {
      id: 3,
      title: "거울 앞이 아닌, 스크린 앞에서 입어보는 옷",
      desc: `카메라 촬영 없이도 TNT는 사용자를 닮은 가상 모델을 생성합니다.
그 위에 상의·하의·아우터를 자유롭게 교체하며
“이 조합이 나에게 어울릴까?”를 부담 없이 실험해 볼 수 있습니다.`,
      lists: [
        "가상 아바타",
        "수십 가지 코디를 버튼으로 가상 피팅",
        "결과 이미지 제공",
        
      ],
      image: "/images/fitroom/screen.png",
      alt: "버추얼 피팅 미러 이미지"
    },
    {
      id: 4,
      title: "손안에서 펼쳐지는 나만의 런웨이",
      desc: `TNT의 추천 코디 카드는 유행을 그대로 복사하지 않습니다.
진단 결과를 기반으로 나에게 어울리는 컬러·실루엣을 반영해
‘나답게 트렌디한 스타일’을 제안합니다.`,
      lists: [
        
      ],
      image: "/images/fitroom/runway.png",
      alt: "스마트폰에서 걸어나오는 모델"
    },
    {
      id: 5,
      title: "온라인 플래그십 스토어처럼, 내 가상 옷장",
      desc: `가상 피팅을 통해 마음에 들었던 옷들은 그대로 내 옷장에 모을 수 있습니다.
쇼핑몰을 압축해 온 느낌이 아니라,
‘나에게 맞는 옷만 선별된 개인 부티크’를 만드는 경험입니다.`,
      lists: [
        "원클릭으로 옷장 저장",
        "카테고리별 정돈된 UI",
        
      ],
      image: "/images/fitroom/blue-store.jpg",
      alt: "럭셔리 패션 스토어 인테리어"
    }
  ];

  const zigzagItems = [
    { img: "/images/fitroom/01.png", align: "left" },
    { img: "/images/fitroom/02.png", align: "right" },
    { img: "/images/fitroom/03.png", align: "left" },
    { img: "/images/fitroom/04.png", align: "right" }
  ];


  
  useEffect(() => {
    const io1 = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.show)),
      { threshold: 0.3 }
    );
    zigzagRefs.current.forEach(r => r && io1.observe(r));

    const io2 = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.show)),
      { threshold: 0.3 }
    );
    featureRefs.current.forEach(r => r && io2.observe(r));

    return () => {
      io1.disconnect();
      io2.disconnect();
    };
  }, []);

  return (
    <section className={styles.wrap}>

      {/* ① 첫 메인 이미지 */}
      <div className={styles.heroImg}>
        <img src="/images/fitroom/fashion-hard.png" alt="패션 불안" />
      </div>

      {/* ② 헤더 문장 */}
      <h2 className={styles.header}>" 패션이 어려우신가요? "</h2>

      {/* ③ 기사/커뮤니티 캡처 지그재그 */}
      <div className={styles.zigzag}>
        {zigzagItems.map((item, i) => (
          <div
            key={i}
            ref={el => (zigzagRefs.current[i] = el)}
            className={`${styles.zItem} ${item.align === "right" ? styles.right : styles.left}`}
          >
            <img src={item.img} alt="" />
          </div>
        ))}
      </div>
      {/* ④ "패션 어렵지 않아요" 이미지 */}
      <div className={styles.titleBlock}>
        <img src="/images/fitroom/main-title.png" alt="패션 어렵지 않아요" />
      </div>

      {/* ⑤ 설명 박스 */}
      <div className={styles.intro}>
        <p>
          “뭘 입어야 할지 모르겠어요”에서 출발한 가상 피팅룸
          <br />
          TNT는 패션이 어렵고 두려운 사람들의 고민에서 시작되었습니다.
          온라인 커뮤니티와 Q&A 속 수많은 질문을 분석하여,
          혼자 거울 앞에서 막막해지는 순간을 대신 해결해 주는 공간을 만들었습니다.
        </p>

        <ul>
          <li>실제 사용자 고민 데이터를 반영한 스타일 추천 로직</li>
          <li>현실적인 코디 문제를 해결하는 단계별 안내</li>
          <li>꾸안꾸·오피스룩·데이트룩 등 TPO 맞춤 조언</li>
        </ul>
      </div>

      {/* ⑥ 아래 기능 소개 id:2~id:5 */}
      <div className={styles.features}>
        {featureSections.map((sec, i) => (
          <div
            key={sec.id}
            ref={el => (featureRefs.current[i] = el)}
            className={`${styles.featureRow} ${i % 2 ? styles.reverse : ""}`}
          >
            <div className={styles.featureImg}>
              <img src={sec.image} alt={sec.alt} />
            </div>

            <div className={styles.featureText}>
              <h3>{sec.title}</h3>
              <p>{sec.desc}</p>
              <ul>
                {sec.lists.map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
