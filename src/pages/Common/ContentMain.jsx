import { Routes, Route, useLocation } from "react-router-dom";
import styles from "./ContentMain.module.css";
import PersonalColor from "../PersonalColor/personalColor";
import FitRoom from "../FitRoom/FitRoom";
import Home from "../Home/Home";
import Header from "./Header";
import Body from "../PersonalBody/Body";
import ColorResult from "../PersonalColor/ColorResult";
import SubTabs from "./SubTabs.jsx";
import MyPage from "../MyPage/MyPage"
import SignUp from "../SignUp/SignUp"
import BoardRoutes from "../Board/BoardRoutes";
import LoginRoutes from "../Login/LoginRoutes";

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
                            <Route path="/color/*" element={<PersonalColor />} />
                            <Route path="/color/result" element={<ColorResult />} />
                            <Route path="/body/*" element={<Body />} />
                            <Route path="/fitroom/*" element={<FitRoom />} />
                            <Route path="/community/*" element={<PersonalColor />} />
                            <Route path="/Login/*" element={<LoginRoutes />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/MyPage" element={<MyPage />}/>
                            <Route path="/BoardRoutes/*" element={<BoardRoutes/>}/>
                            <Route path="*" element={<h2>404 Not Found</h2>} />
                            
                        </Routes>
                    </section>
                </main>

        </div>
      
    );
};

export default ContentMain;
