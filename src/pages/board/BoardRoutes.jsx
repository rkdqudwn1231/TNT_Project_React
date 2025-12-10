import { Routes, Route } from "react-router-dom";
import Board from "./Board";
import BoardDetail from "./BoardDetail";
import NotFoundRedirect from "../Common/NotFoundRedirect";

function BoardRoutes() {
  return (
    <Routes>
      {/* /Board */}
      <Route path="" element={<Board />} />

      {/* /Board/detail/:seq */}
      <Route path="detail/:seq" element={<BoardDetail />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

export default BoardRoutes;
