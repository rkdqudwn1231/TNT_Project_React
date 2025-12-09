import styles from "./PersonalBody.module.css";
import { useEffect, useRef } from "react";
import {useNavigate } from "react-router-dom";

const PersonalBody = () => {

    const navigate = useNavigate();

    const revealRefs = useRef([]);

    const addReveal = el => el && !revealRefs.current.includes(el) && revealRefs.current.push(el);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.show)),
            { threshold: 0.15 }
        );
        revealRefs.current.forEach(ref => observer.observe(ref));
        return () => observer.disconnect();
    }, []);

    const bodyImages = [
        {
            key: "H",
            title: "H형 체형",
            desc: `어깨–허리–엉덩이의 비율이 비슷해 직선적인 실루엣을 가진 체형.
      곡선이 두드러지지 않아 ‘평균적인 몸’, ‘군더더기 없는 몸’이라 불리기도 하지만
      허리 라인이 강하게 드러나지 않는 만큼 실루엣을 입체감 있게 만들어주는 스타일이 잘 어울린다.
      구조적인 재킷, 허리 절개 라인, 랩 디테일, 사선 재봉, 플레어 라인이 특히 강점을 끌어올린다.`,
            img: "/images/body/H.png"
        },
        {
            key: "O",
            title: "O형 체형",
            desc: `상체 중심의 볼륨이 특징인 체형으로 부드럽고 매끄러운 실루엣을 가진다.
      복부가 강조되기 쉬운 대신 힙, 다리, 쇄골·어깨 라인이 균형감 있게 이어져
      선을 정돈해 주는 스타일링만으로 분위기가 달라진다.
      브이넥, 롱 카디건, 스트레이트 팬츠, 허리 라인 부드러운 드레이핑이 아름다움을 강조한다.`,
            img: "/images/body/O.png"
        },
        {
            key: "A",
            title: "A형 체형",
            desc: `어깨보다 엉덩이·허벅지가 더 발달한 체형으로 한국과 아시아권에서 특히 흔하다.
      하체의 볼륨이 단점이 아니라 곡선미 자체이기 때문에 상체에 시선 포커스를 주면 비율이 극적으로 살아난다.
      보트넥, 퍼프·러플 숄더, 크롭 기장, 상체 디테일 포인트가 A형 체형의 매력을 돋보이게 한다.`,
            img: "/images/body/A.png"
        },
        {
            key: "X",
            title: "X형 체형",
            desc: `어깨와 골반의 폭이 비슷하고 허리가 잘록한 체형으로, 전체적으로 균형이 뛰어나다.
      굳이 숨기기보다 라인을 있는 그대로 드러냈을 때 가장 아름다운 체형.
      랩 원피스, 바디라인을 따라 흐르는 니트, 하이웨스트 팬츠가 비율과 실루엣을 강하게 살린다.`,
            img: "/images/body/X.png"
        },
        {
            key: "V",
            title: "V형 체형",
            desc: `어깨 또는 상체가 하체보다 강하게 존재감 있는 체형.
      힘 있고 매력적인 군더더기 없는 상체가 장점이며,
      하체 실루엣을 강조하면 비율이 순간적으로 안정된다.
      플레어 스커트, 와이드 팬츠, 힙 라인 강조, 상체는 미니멀한 스타일이 이상적 균형을 완성한다.`,
            img: "/images/body/V.png"
        },
    ];

    return (
        <div className={styles.wrapper}>

            {/* 1. 체형의 다양성 */}
            <section className={`${styles.section} ${styles.centerBlock}`} ref={addReveal}>
                <h2 className={styles.captionHeader}>몸은 모두 다르고,<br />그 다름은 비교가 아니라 개성입니다</h2>
                <img src="/images/body/다양한유형들.png" alt="체형 다양성" />
                <p className={styles.captionText}>
                    사람마다 실루엣·비율·곡선은 모두 다르고, <br />
                    그 다양함은 ‘정답과 오답’이 아니라
                    ‘개성과 매력’입니다. <br />
                    체형을 바꾸는 것이 목표가 아니라,<br />
                    체형이 가진 아름다움을 가장 잘 드러내는 스타일을 찾는 것이 중요합니다.
                </p>
            </section>

            {/* 2. 체형 유형 지그재그 */}
            {bodyImages.map((b, i) => (
                <section
                    key={b.key}
                    ref={addReveal}
                    className={`${styles.section} ${styles.zigzag} ${i % 2 === 1 ? styles.reverse : ""}`}
                >
                    <img src={b.img} alt={b.title} />
                    <div className={styles.textBlock}>
                        <h2>{b.title}</h2>
                        <p>{b.desc}</p>
                    </div>
                </section>
            ))}

            {/* 3. 스타일의 다양성 */}
            <section className={`${styles.section} ${styles.centerBlock}`} ref={addReveal}>
                <h2 className={styles.captionHeader}>스타일도 무한합니다</h2>
                <img src="/images/body/스타일.png" alt="스타일의 다양성" />
                <p className={styles.captionText}>
                    유행은 빠르게 변하지만,
                    나에게 가장 잘 맞는 실루엣은 변하지 않습니다.<br />
                    체형을 이해하는 순간,
                    옷 선택은 ‘고민’이 아니라 ‘표현’이 됩니다.
                </p>
            </section>

            {/* 4. TNT 연결 */}
            <section className={`${styles.section} ${styles.final}`} ref={addReveal}>
                <h2 className={styles.captionHeader}>그래서 오늘, 퍼스널 바디 진단이 중요합니다</h2>
                <img src="/images/body/personal7.jpg" alt="스타일의 다양성" style={{ width: "80%" }} />
                <p>
                    TNT는 사진·치수·설문을 기반으로 체형을 정교하게 분석하고<br />
                    골격과 비율에 맞춰 가장 자연스럽고 현실적인 스타일을 제안합니다.<br />
                    더 이상 ‘무작정 유행’을 따라 입지 않아도 됩니다.<br />
                    이제 패션은 유행이 아니라 ‘나에게 맞춤’이어야 합니다.
                </p>

                <button onClick={() => navigate("/body/main")}>
                    나의 체형 진단 시작하기
                </button>
            </section>
        </div>
    );
};

export default PersonalBody;
