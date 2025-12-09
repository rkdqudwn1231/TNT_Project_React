// src/pages/Notification/NotificationBell.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationBell.module.css";
import { caxios } from "../../config/config";
import { connectWebSocket, disconnectWebSocket } from "../../config/websocket";
import ToastNotification from "../../pages/Notification/Toast";
import "bootstrap-icons/font/bootstrap-icons.css";

const NotificationBell = ({ loginId }) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const isLoggedIn = !!loginId;

  // 타입별 아이콘 선택
  const renderTypeIcon = (type) => {
    if (type === "LIKE") {
      return (
        <i
          className={`bi bi-heart-fill ${styles.iconLike}`}
          aria-hidden="true"
        />
      );
    }
    if (type === "COMMENT") {
      return (
        <i
          className={`bi bi-chat-dots-fill ${styles.iconComment}`}
          aria-hidden="true"
        />
      );
    }
    if (type === "REPLY") {
      return (
        <i
          className={`bi bi-chat-left-text-fill ${styles.iconReply}`}
          aria-hidden="true"
        />
      );
    }
    // 기본 아이콘
    return (
      <i
        className={`bi bi-bell-fill ${styles.iconDefault}`}
        aria-hidden="true"
      />
    );
  };

  // 메시지 렌더 (닉네임 분리 + 아이콘)
  const renderMessage = (message, type) => {
    if (!message || typeof message !== "string") {
      return (
        <span className={styles.messageText}>
          {renderTypeIcon(type)}
          <span>{message}</span>
        </span>
      );
    }

    const idx = message.indexOf("님이 ");
    if (idx === -1) {
      // 닉네임 패턴이 아니면 전체를 그냥 출력
      return (
        <span className={styles.messageText}>
          {renderTypeIcon(type)}
          <span>{message}</span>
        </span>
      );
    }

    const nickname = message.slice(0, idx);
    const rest = message.slice(idx + 3); // "님이 " 이후 문장

    return (
      <span className={styles.messageText}>
        {renderTypeIcon(type)}
        <span className={styles.nickname}>{nickname}</span>
        <span>님이 {rest}</span>
      </span>
    );
  };

  // 최초 알림 목록 + 웹소켓 연결
  useEffect(() => {
    if (!isLoggedIn) {
      disconnectWebSocket();
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        const res = await caxios.get(`/notification/list/${loginId}`);
        const list = Array.isArray(res.data) ? res.data : [];
        if (!mounted) return;

        setNotifications(list);
        setUnreadCount(list.filter((n) => n.is_read === "N").length);
      } catch (e) {
        console.error("알림 초기 로드 실패", e);
      }
    };

    init();

    connectWebSocket(loginId, (msg) => {
      if (!mounted) return;

      setNotifications((prev) => {
        const next = [msg, ...prev];
        return next.slice(0, 10); // 최대 10개
      });
      setUnreadCount((prev) => prev + 1);

      const text = msg?.message || "새로운 알림이 도착했습니다.";
      setToastMsg(text);
    }).catch((e) => console.error("웹소켓 연결 실패", e));

    return () => {
      mounted = false;
      disconnectWebSocket();
    };
  }, [isLoggedIn, loginId]);

  // 종 클릭
  const handleClickBell = async () => {
    if (!loginId) return;

    try {
      // 최신 알림 다시 로드
      const res = await caxios.get(`/notification/list/${loginId}`);
      const list = Array.isArray(res.data) ? res.data : [];
      setNotifications(list);

      // 드롭다운 토글
      setShowDropdown((prev) => !prev);

      // 전체 읽음 처리
      await caxios.put(`/notification/read-all/${loginId}`);
      setUnreadCount(0);
    } catch (e) {
      console.error("알림 로드/읽음 처리 실패", e);
      setToastMsg("알림을 불러오지 못했습니다.");
    }
  };

  // 알림 한 건 클릭 → 해당 게시글로 이동
  const handleClickNotification = (noti) => {
    if (noti.board_seq) {
      navigate(`/Board/detail/${noti.board_seq}`);
    }
    setShowDropdown(false);
  };

  return (
    <>
      <div className={styles.notificationWrapper}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={handleClickBell}
        >
          <i className="bi bi-bell"></i>
          {unreadCount > 0 && <span className={styles.bellDot} />}
        </button>

        {showDropdown && (
          <div className={styles.notificationDropdown}>
            {notifications.length === 0 ? (
              <div className={styles.notificationEmpty}>
                새로운 알림이 없습니다.
              </div>
            ) : (
              <ul className={styles.notificationList}>
                {notifications.map((n) => (
                  <li
                    key={n.seq}
                    className={styles.notificationItem}
                    onClick={() => handleClickNotification(n)}
                  >
                    <div className={styles.notificationMessage}>
                      {renderMessage(n.message, n.type)}
                    </div>
                    <div className={styles.notificationTime}>
                      {n.created_at
                        ? String(n.created_at)
                            .replace("T", " ")
                            .slice(0, 16)
                        : ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {toastMsg && (
        <ToastNotification
          message={toastMsg}
          onClose={() => setToastMsg(null)}
        />
      )}
    </>
  );
};

export default NotificationBell;
