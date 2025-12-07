import React, { useEffect, useRef } from "react";
import { Toast } from "bootstrap"; 
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Toast.module.css";

export default function ToastNotification({ message, onClose }) {
  const toastRef = useRef(null);

  useEffect(() => {
    if (!toastRef.current) return;

    const bsToast = new Toast(toastRef.current, { delay: 3000 });
    bsToast.show();

    // 토스트가 사라진 후 처리
    toastRef.current.addEventListener("hidden.bs.toast", () => {
      if (onClose) onClose();
    });
  }, []);

  return (
    <div
      className={`toast ${styles.toastContainer}`}
      role="alert"
      ref={toastRef}
    >
      <div className="toast-header">
        <strong className="me-auto">알림</strong>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}
