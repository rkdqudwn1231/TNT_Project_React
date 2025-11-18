import { Routes, Route } from "react-router-dom";
import FitRoomMain from "./FitRoomMain";
import History from "./History/History";
import Closet from "./Closet/Closet";
import Model from "./Model/Model";

function FitRoom() {
  return (
    <Routes>
      <Route index element={<FitRoomMain />} />
      <Route path="history" element={<History />} />
      <Route path="closet" element={<Closet />} />
      <Route path="model" element={<Model />} />
    </Routes>
  );
}

export default FitRoom;