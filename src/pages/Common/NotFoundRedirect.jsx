import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const NotFoundRedirect = () => {
  useEffect(() => {
    alert("잘못된 접근입니다.");
  }, []);

  return <Navigate to="/" replace />;
}

export default NotFoundRedirect;