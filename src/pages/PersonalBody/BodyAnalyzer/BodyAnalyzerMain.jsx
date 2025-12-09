import styles from "../PersonalBody.module.css";
import { useNavigate } from "react-router-dom";

const BodyAnalyzerMain = () => {

    const navigate = useNavigate();

    return (

        <div className="container">

            <div className={styles.pbHeader}>Body Type Test</div>
            <div className={styles.selectTest}>
                <div className={styles.select} style={{ marginLeft: "-55px", backgroundColor: "#fce690ff", border: "5px solid #fce690ff" }}>
                    <div className={styles.selectHeader} style={{ marginBottom: "80px" }}>AI 이미지 진단</div>
                    <img src="/images/body/이미지.jpg" style={{ width: "300px", marginBottom: "30px" }} />
                    <button className={styles.selectBtn} onClick={() => navigate("/body/img")}>선택하기</button>
                </div>
                <div className={styles.select} style={{ backgroundColor: "#80bafcff", border: "5px solid #80bafcff" }}>
                    <div className={styles.selectHeader} style={{ marginBottom: "80px" }}>설문 진단</div>
                    <img src="/images/body/설문.png" style={{ width: "300px", marginBottom: "60px" }} />
                    <button className={styles.selectBtn}  onClick={() => navigate("/body/survery")} >선택하기</button>
                </div>
                <div className={styles.select} style={{ backgroundColor: "#B5A6E8", border: "5px solid #B5A6E8", marginRight: "-55px" }}>
                    <div className={styles.selectHeader} style={{ marginBottom: "70px" }}>치수 진단</div>
                    <img src="/images/body/치수.jpg" style={{ width: "300px", marginBottom: "20px", marginLeft: "15px" }} />
                    <button className={styles.selectBtn}  onClick={() => navigate("/body/size")}>선택하기</button>
                </div>
            </div>
        </div>
    )
}

export default BodyAnalyzerMain;