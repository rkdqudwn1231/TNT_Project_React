import { Routes, Route, Navigate } from "react-router-dom";
import About from "./About";
import Closet from "./Closet/Closet";
import Model from "./Model/Model";
import History from "./History/History";
import FitRoomMain from "./FitRoomMain";
import FitRoomShare from "./FitRoomShare";

function FitRoom() {
  return (
    <Routes>
      {/* /fitroom 접근 → about이 첫 페이지 */}
      <Route index element={<Navigate to="about" replace />} />

      {/* ABOUT */}
      <Route path="about" element={<About />} />

      {/* 탭에서 FITROOM 누르면 여기가 열림 */}
      <Route path="fitroom" element={<FitRoomMain />} />

      {/* 나머지 페이지들 */}
      <Route path="closet" element={<Closet />} />
      <Route path="model" element={<Model />} />
      <Route path="history" element={<History />} />
      <Route path="share" element={<FitRoomShare />} />
    </Routes>
  );
}

export default FitRoom;
