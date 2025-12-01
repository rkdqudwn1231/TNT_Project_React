import { Routes, Route } from "react-router-dom";
import Member from "./Member";
import Manage from "./Manage";

function ManageRoutes() {

  return (

    <Routes>
      <Route index element={<Manage />} />
      <Route path="member" element={<Member />} />
      {/* <Route path="img" element={<ImgTest />} /> */}

    </Routes>
  );
}

export default ManageRoutes;