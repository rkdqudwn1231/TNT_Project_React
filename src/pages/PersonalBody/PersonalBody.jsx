import styles from "./PersonalBody.module.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PersonalBody = () => {
    const navigate = useNavigate();

    const revealRefs = useRef([]);
    const addReveal = el =>
        el && !revealRefs.current.includes(el) && revealRefs.current.push(el);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries =>
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add(styles.show);
                        observer.unobserve(e.target);
                    }
                }),
            { threshold: 0.18 }
        );

        revealRefs.current.forEach(ref => observer.observe(ref));
        return () => observer.disconnect();
    }, []);

    const bodyImages = [
        {
            key: "H",
            title: "H형 체형",
            desc: `어깨–허리–엉덩이의 폭이 비슷해 직선적인 실루엣을 가진 체형입니다.
과한 굴곡은 없지만, 대신 깔끔하고 담백한 분위기가 강점입니다.

허리 라인이 뚜렷하지 않기 때문에,
상의와 하의의 경계를 만들어 주면 실루엣에 입체감이 살아납니다.

• 허리 절개선이 있는 원피스나 자켓
• 스트레이트 라인의 팬츠와 스커트
• 랩 디테일, 사선 재봉, 살짝 퍼지는 A라인 스커트

직선을 기본으로, 필요한 곳에만 곡선을 더하면
H형 체형의 균형 잡힌 실루엣이 자연스럽게 강조됩니다.`,
            img: "/images/body/H.png"
        },
        {
            key: "O",
            title: "O형 체형",
            desc: `상체 중심의 볼륨이 특징인 체형으로
부드럽고 둥근 실루엣이 매력인 유형입니다.

복부가 눈에 띄기 쉬운 대신,
쇄골·어깨·다리 라인이 예쁘게 이어지는 경우가 많습니다.

• 깊지 않은 브이넥, U넥, 세로 절개 디테일
• 허리를 꽉 조이지 않는 스트레이트·세미 A라인
• 롱 가디건, 롱 재킷처럼 세로로 떨어지는 아우터

라인을 가리기보다는,
시선을 위·아래로 자연스럽게 연결해 주면
O형 체형만의 부드러운 분위기가 더 또렷해집니다.`,
            img: "/images/body/O.png"
        },
        {
            key: "A",
            title: "A형 체형",
            desc: `어깨보다 골반·허벅지가 더 발달한 체형으로,
하체의 곡선이 풍부한 실루엣입니다.

하체 볼륨을 숨기기보다는,
상체에 가볍게 포인트를 주면 전체 비율이 극적으로 살아납니다.

• 보트넥·스퀘어넥처럼 넓게 열리는 넥 라인
• 퍼프·셔링 숄더, 상체에 디테일이 있는 상의
• 허리 라인이 살짝 들어간 상의 + 심플한 하의
• A라인 스커트, 세미 플레어, 일자/와이드 팬츠

시선을 위로 끌어올리고,
하체는 매트하고 심플하게 정돈해 주는 것이 핵심입니다.`,
            img: "/images/body/A.png"
        },
        {
            key: "X",
            title: "X형 체형",
            desc: `어깨와 골반의 폭이 비슷하고
허리가 잘록하게 들어간 ‘클래식 Hourglass’ 실루엣입니다.

굳이 감추지 않고,
곡선을 자연스럽게 드러냈을 때 가장 아름다운 체형입니다.

• 허리를 강조하는 랩 원피스, 벨트 스타일
• 바디를 따라 흐르는 니트, 골지 소재
• 하이웨스트 팬츠·스커트로 다리 비율 업
• 허리선이 살아 있는 자켓·트렌치코트

과하게 달라붙는 것보다는
몸의 곡선을 ‘따라가는’ 정도가 가장 세련된 연출입니다.`,
            img: "/images/body/X.png"
        },
        {
            key: "V",
            title: "V형 체형",
            desc: `어깨 또는 상체의 존재감이 하체보다 강한 체형으로,
힘 있고 탄탄한 상체 실루엣이 가장 큰 매력입니다.

시선을 자연스럽게 아래로 이어주면
전체적인 비율이 순식간에 안정됩니다.

• 브이넥·홀터넥처럼 위를 가볍게 열어주는 디자인
• 상체는 디테일을 줄이고, 하체에 포인트를 주는 스타일
• 플레어 스커트, 와이드 팬츠, 힙 라인을 살린 하의
• 상체는 미니멀, 하체는 풍성한 실루엣 조합

상체의 힘 있는 실루엣을 살리되,
하체 쪽에 볼륨을 더해 균형을 맞추는 것이 핵심입니다.`,
            img: "/images/body/V.png"
        }
    ];

    return (
        <div className={styles.wrapper}>

            <section className={`${styles.section} ${styles.hero}`} ref={addReveal}>
                <div className={styles.heroContent}>
                    <span className={styles.heroBadge}>TNT Personal Body</span>
                    <h1 className={styles.heroTitle}>
                        사람의 몸은 하나의 기준으로<br />
                        나눌 수 없습니다.
                    </h1>
                    <p className={styles.heroSub}>
                        모두 다른 실루엣, 모두 다른 비율, 모두 다른 곡선.
                        <br />
                        TNT는 체형을 ‘비교’가 아닌 ‘개성’으로 바라보고,
                        <br />
                        각자의 체형이 가장 아름답게 보이는 스타일을 함께 찾습니다.
                    </p>

                </div>

                <div className={styles.heroImageWrap}>
                    <img
                        src="/images/body/헤더이미지.jpg"
                        alt="AI Body Analysis"
                        className={styles.heroImage}
                    />
                    <div className={styles.heroGlow} />
                </div>
            </section>


            <section
                className={`${styles.section} ${styles.centerBlock}`}
                ref={addReveal}
            >
                <h2 className={styles.captionHeader}>
                    다양한 체형이 존재하고,<br />
                    그 모든 체형은 각자의 방식으로 아름답습니다.
                </h2>
                <img
                    src="/images/body/다양한유형들.png"
                    alt="체형 다양성"
                    className={styles.fullImage}
                />
                <p className={styles.captionText}>
                    사람마다 어깨 너비, 허리 라인, 골반과 다리의 비율이 모두 다릅니다.
                    <br />
                    누군가는 직선적인 실루엣이, 누군가는 부드러운 곡선이,
                    <br />
                    또 다른 누군가는 하체의 볼륨이 가장 큰 매력이 됩니다.
                    <br />
                    <br />
                    TNT의 퍼스널 바디 진단은
                    <br />
                    체형을 바꾸기 위한 것이 아니라,
                    <br />
                    ‘지금의 나’를 가장 돋보이게 하는 방식을 찾기 위한 시작점입니다.
                </p>
            </section>

            {bodyImages.map((b, i) => (
                <section
                    key={b.key}
                    ref={addReveal}
                    className={`${styles.section} ${styles.zigzag} ${i % 2 === 1 ? styles.reverse : ""
                        }`}
                >
                    <div className={styles.bodyImageWrap}>
                        <img src={b.img} alt={b.title} />
                        <span className={styles.bodyLabel}>{b.key} TYPE</span>
                    </div>
                    <div className={styles.textBlock}>
                        <h2>{b.title}</h2>
                        <p>{b.desc}</p>
                    </div>
                </section>
            ))}


            <section
                className={`${styles.section} ${styles.analysis}`}
                ref={addReveal}
            >
                <h2 className={styles.analysisHeader}>
                    집에서 편하게, 세 가지 방식으로 받는 퍼스널 체형 진단
                </h2>
                <p className={styles.analysisText}>
                    TNT는 사진, 설문, 신체 치수 세 가지 데이터를 활용해
                    <br />
                    보다 정교하고 현실적인 체형 분석을 제공합니다.
                    <br />
                    거울 앞에 서 있는 지금, 휴대폰만 있으면 진단을 시작할 수 있습니다.
                </p>

                <div className={styles.analysisMain}>
                    <div className={styles.analysisImageWrap}>
                        <img
                            src="/images/body/ai진단.png"
                            alt="AI Body Analysis"
                            className={styles.analysisImage}
                        />
                        <div className={styles.analysisTag}>AI Body Analysis · Beta</div>
                    </div>

                    <div className={styles.analysisGrid}>
                        <div className={styles.analysisCard}>
                            <h3>📷 AI 이미지 분석</h3>
                            <p>
                                전신이 보이는 사진 한 장을 업로드하면
                                <br />
                                AI가 자동으로 어깨, 허리, 골반, 다리 비율을 분석하여,
                                <br />
                                체형 유형 진단과 추천 스타일 추천
                            </p>
                        </div>

                        <div className={styles.analysisCard}>
                            <h3>📝 라이프스타일 설문 진단</h3>
                            <p>
                                거울로 보는 내 모습, 평소 옷이 맞는 느낌,
                                <br />
                                사람들이 자주 하는 말을 바탕으로 체형을 유형화합니다.
                            </p>
                        </div>

                        <div className={styles.analysisCard}>
                            <h3>📏 신체 치수 기반 분석</h3>
                            <p>
                                어깨·가슴·허리·힙 치수를 입력하면
                                <br />
                                수치로 판단하는 체형 유형과 비율을 체크해 체형을 진단합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            <section
                className={`${styles.section} ${styles.styleSection}`}
                ref={addReveal}
            >
                <h2 className={styles.styleHeader}>
                    체형을 이해했다면,<br />
                    이제는 나에게 맞는 스타일을 찾을 차례입니다.
                </h2>
                <p className={styles.styleSub}>
                    TNT는 진단 결과에 따라 체형을 ‘보완’하거나 ‘살려주는’ 스타일을 추천합니다.
                    <br />
                    상의·하의·아우터까지, 실제 쇼핑에 바로 연결할 수 있는 현실적인 조합만 담았습니다.
                </p>

                <div className={styles.styleGrid}>
                    <div className={styles.styleCard}>
                        <h3>상의 추천</h3>
                        <p>
                            넥 라인, 어깨 라인, 기장감으로
                            <br />
                            시선을 위 또는 아래로 유도해 비율을 정돈합니다.
                        </p>
                        <span className={styles.styleTag}>예: 브이넥 니트, 크롭 셔츠, 셔링 블라우스</span>
                    </div>

                    <div className={styles.styleCard}>
                        <h3>하의 추천</h3>
                        <p>
                            하체 볼륨을 살리거나 정돈하는
                            <br />
                            스커트·팬츠 실루엣을 체형에 맞게 골라드립니다.
                        </p>
                        <span className={styles.styleTag}>예: A라인 스커트, 와이드 팬츠, H라인 스커트</span>
                    </div>

                    <div className={styles.styleCard}>
                        <h3>아우터 & 전체 코디</h3>
                        <p>
                            재킷, 코트, 트렌치처럼
                            <br />
                            전체 실루엣을 한 번에 잡아주는 아우터 조합까지 제안합니다.
                        </p>
                        <span className={styles.styleTag}>예: 허리 벨트 코트, 세미 오버핏 자켓</span>
                    </div>
                </div>
            </section>


            <section
                className={`${styles.section} ${styles.final}`}
                ref={addReveal}
            >
                <h2 className={styles.captionHeader}>
                    오늘의 나를 있는 그대로 바라보고,<br />
                    가장 잘 어울리는 스타일을 찾아보세요.
                </h2>
                <img
                    src="/images/body/personal7.jpg"
                    alt="퍼스널 체형 진단"
                    style={{ width: "60%", borderRadius: "18px", marginTop: "80px" }}
                />
                <p className={styles.finalText}>
                    TNT 퍼스널 바디 진단은 지금의 체형을 있는 그대로 존중합니다.
                    <br />
                    각자가 가진 실루엣과 비율의 아름다움을 먼저 발견하고,
                    <br />
                    그 매력을 가장 자연스럽게 드러낼 수 있는 스타일을 제안합니다.
                    <br />
                    <br />
                    집에서 편리하게 ,
                    <br />
                    이미지 업로드·설문·신체 치수 입력만으로
                    <br />
                    나에게 맞춘 체형 분석과 스타일 추천을 받아보세요.
                </p>

                <div className={styles.finalButtons}>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => navigate("/body/main")}
                    >
                        지금 바로 체형 진단 시작하기
                    </button>

                </div>
            </section>
        </div>
    );
};

export default PersonalBody;
