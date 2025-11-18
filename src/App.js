import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PersonalColor from "./pages/PersonalColor/personalColor.jsx";
import ContentMain from "./pages/Common/ContentMain.jsx";
import FitRoom from "./pages/FitRoom/FitRoom.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ContentMain />} />
          <Route path="/personalColor" element={<PersonalColor />} />
          <Route path="/fitroom/*" element={<FitRoom />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
