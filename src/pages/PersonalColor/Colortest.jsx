import styles from "./Colortest.module.css";

const Colortest = () => {
    return (
        <div className={styles.container}>

           

            <h2 className={styles.title}>퍼스널 컬러란 무엇인가요?</h2>

            <p className={styles.paragraph}>
                개인의 피부톤에 가장 잘 어울리는 색상을 찾아주는 컬러로지 이론입니다. 
                색상의 조화와 부조화의 원리를 바탕으로 모든 색상을 사계절 유형으로 구분하는 것이 특징입니다!
                퍼스널 컬러는 개인에게 가장 잘 어울리는 색상을 진단하여 약점은 커버하고 강점은 극대화하여 긍정적이고 자신감 있는 이미지를 만들어냅니다.
                퍼스널 컬러의 활용은 개인의 생활 패턴, 심리 상태, 생체 리듬에 영향을 미쳐 더욱 풍요롭고 안정적인 삶을 가능하게 합니다!
            </p>

            <p className={styles.paragraph}>
                퍼스널 컬러는 20세기 초 스위스 예술가 
                <strong> 요하네스 이텐(Johannes Itten)</strong>이  
                ‘사계절 색채 이론’을 기반으로 개념을 확립했습니다.  
                그는 “색은 생명이다. 색이 없는 세상은 죽은 것처럼 보인다”고 말하며 색의 중요성을 강조했습니다.
            </p>

            <p className={styles.paragraph}>
                오늘날 퍼스널 컬러는 패션, 메이크업, 스타일링 전반에서 널리 활용되며  
                자신에게 가장 잘 맞는 <strong>옷 색상, 화장품 컬러, 액세서리 톤</strong>을 선택하는 데 큰 도움을 줍니다.
            </p>

             <div className={styles.brushTitle}>
                My Personal Color가 사계절을 어떻게 분류하는지 알아보겠습니다.
            </div>

        </div>
    );
};

export default Colortest;
