import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import FindId from "./FindId";
import FindPassword from "./FindPassword";
import ResetPassword from "./ResetPassword";
import NotFoundRedirect from "../Common/NotFoundRedirect";

function LoginRoutes() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="find-id" element={<FindId />} />
      <Route path="find-password" element={<FindPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

export default LoginRoutes;
