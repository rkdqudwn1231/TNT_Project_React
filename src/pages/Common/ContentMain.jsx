import { Routes, Route, useLocation } from "react-router-dom";
import styles from "./ContentMain.module.css";
import PersonalColor from "../PersonalColor/personalColor";
import FitRoom from "../FitRoom/FitRoom";
import Home from "../Home/Home";
import Header from "./Header";


const ContentMain = () => {

    return (
        <div className={styles.container}>
            {/* ✅ 헤더 */}
            <header className={styles.header}>
                <Header />
            </header>

            {/* ✅ 메인 (컨텐츠) */}
            <main className={styles.main}>
                {/* 컨텐츠 */}
                <section className={styles.content}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/color/*" element={<PersonalColor />} />
                        <Route path="/body/*" element={<PersonalColor />} />
                        <Route path="/fitroom/*" element={<FitRoom />} />
                        <Route path="/community/*" element={<PersonalColor />} />
                        <Route path="*" element={<h2>404 Not Found</h2>} />
                    </Routes>
                </section>
            </main>
        </div>
    );
};

export default ContentMain;
