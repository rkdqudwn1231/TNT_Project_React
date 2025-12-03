import { Routes, Route } from "react-router-dom";
import Board from "./Board";
import BoardDetail from "./BoardDetail";

function BoardRoutes() {
  return (
    <Routes>
      {/* /Board */}
      <Route path="" element={<Board />} />

      {/* /Board/detail/:seq */}
      <Route path="detail/:seq" element={<BoardDetail />} />
    </Routes>
  );
}

export default BoardRoutes;
