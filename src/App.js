import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import ContentMain from "./pages/Common/ContentMain.jsx";

function App() {


  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const token = sessionStorage.getItem("token") || "";
      if (!token) return;

      const blob = new Blob([JSON.stringify({ token })], { type: "text/plain" });
      navigator.sendBeacon("http://10.5.5.19/manage/logout/beacon", blob);
      console.log("sendBeacon sent");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
