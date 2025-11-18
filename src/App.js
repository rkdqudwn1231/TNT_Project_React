import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PersonalColor from "./pages/PersonalColor/personalColor.jsx";
import ContentMain from "./pages/Common/ContentMain.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        
        {/* 네비게이션 */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/personalColor">Personal Color</Link>
        </nav>

        <Routes>
          {/* 홈은 ContentMain 사용 */}
          <Route path="/" element={<ContentMain />} />

          {/* 퍼스널 컬러 페이지 */}
          <Route path="/personalColor" element={<PersonalColor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
