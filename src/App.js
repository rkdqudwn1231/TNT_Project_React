import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PersonalColor from "./pages/PersonalColor/personalColor.jsx";
import ContentMain from "./pages/Common/ContentMain.jsx";
import FitRoom from "./pages/FitRoom/FitRoom.jsx";

function App() {

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
