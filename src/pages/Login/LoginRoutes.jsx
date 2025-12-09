import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import FindId from "./FindId";
import FindPassword from "./FindPassword";
import ResetPassword from "./ResetPassword";

function LoginRoutes() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="find-id" element={<FindId />} />
      <Route path="find-password" element={<FindPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default LoginRoutes;
