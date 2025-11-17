import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PersonalColor from "./PersonalColor/personalColor.jsx";
import ContentMain from "./pages/Common/ContentMain.jsx";

function App() {

  // 로그인이 되어 있으면 url 링크에 맞춰서 동작.
  return (
  <BrowserRouter>
    <Routes>
      {/* 일단 2차 때 처럼 contentmain 스크립트 불러오도록 구성. 
      이유 : 채팅처럼 따로 창 만들어서 쓸 일 있을까봐 */}

      <Route path="/*" element={<ContentMain />} />
    </Routes>
  </BrowserRouter>
);
}

export default App;
