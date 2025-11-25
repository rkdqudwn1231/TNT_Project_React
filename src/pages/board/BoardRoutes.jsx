import { Routes, Route } from "react-router-dom";
import Board from "./Board";
import BoardDetail from "./BoardDetail";

function BoardRoutes() {
  return (
    <Routes>
      <Route path= "Board" element={<Board />} />
      <Route path="detail/:id" element={<BoardDetail />} />
    </Routes>
  );
}

export default BoardRoutes;
