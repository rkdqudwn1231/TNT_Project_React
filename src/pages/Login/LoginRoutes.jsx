import { Routes, Route } from "react-router-dom";
import Login from "./Login";

function LoginRoutes() {
  return (
    <Routes>
      <Route index element={<Login />} />
    </Routes>
  );
}

export default LoginRoutes;
