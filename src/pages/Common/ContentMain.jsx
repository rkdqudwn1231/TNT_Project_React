import { Routes, Route, useLocation } from "react-router-dom";
import styles from "./ContentMain.module.css";
import PersonalColor from "../PersonalColor/personalColor";
import FitRoom from "../FitRoom/FitRoom";
import Home from "../Home/Home";
import Chatbot from "../Chatbot/Chatbot";
import Color from "../PersonalColor/Color"; 
import Header from "./Header";
import SubTabs from "./SubTabs.jsx";
import MyPage from "../MyPage/MyPage"
import SignUp from "../SignUp/SignUp"
import BoardRoutes from "../Board/BoardRoutes";
import ManageRoutes from "../Manage/ManageRoutes";
import LoginRoutes from "../Login/LoginRoutes";
import PersonalBodyRoute from "../PersonalBody/PersonalBodyRoute.jsx";
import { Col } from "react-bootstrap";



const ContentMain = () => {

    // 홈일 때 헤더 스크롤 이벤트 , 홈이 아닐 때 헤더 fixed
    const location = useLocation();
    const isHome = location.pathname === "/" || location.pathname === "/Login"; // 홈인지 체크

    return (

        // 홈일 때와 홈이 아닐 때 레이아웃 
        <div className={`${styles.container} ${isHome ? styles.home : styles.sub}`}>

            {/*헤더 */}
            <header className={styles.header}>
                <Header isHome={isHome} />
            </header>

                {/* 메인 (컨텐츠) */}
                <main className={styles.main}>
                    {/* 컨텐츠 */}
                    <section className={styles.content}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/color/*" element={<Color />} />
                            <Route path="/body/*" element={<PersonalBodyRoute   />} />
                            <Route path="/fitroom/*" element={<FitRoom />} />
                            <Route path="/Login/*" element={<LoginRoutes />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/MyPage" element={<MyPage />}/>
                            <Route path="/Board/*" element={<BoardRoutes />} />
                            <Route path="*" element={<h2>404 Not Found</h2>} />
                        </Routes>
                    </section>
                </main>
            { <Chatbot /> }
        </div>
      
    );
};

export default ContentMain;
