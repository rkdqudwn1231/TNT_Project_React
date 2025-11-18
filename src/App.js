import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PersonalColor from "./PersonalColor/personalColor.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <Link to="/">Home</Link> |
          <Link to="/personalColor">Personal Color</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personalColor" element={<PersonalColor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  
}

export default App;
