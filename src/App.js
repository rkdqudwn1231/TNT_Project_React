import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import PersonalColor from "./pages/PersonalColor/personalColor.jsx";
import ContentMain from "./pages/Common/ContentMain.jsx";
import FitRoom from "./pages/FitRoom/FitRoom.jsx";

function App() {


  useEffect(() => {
    // index.html에서 SDK가 로드됐는지 확인
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("034f69077a26317b44736939a73b0351"); 
      console.log("Kakao SDK Initialized!");
    }
  }, []);

  // 로그인이 되어 있으면 url 링크에 맞춰서 동작.
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/*" element={<ContentMain />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
