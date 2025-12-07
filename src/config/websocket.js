import Stomp from "stompjs";

let stompClient = null;

export const connectWebSocket = (userId, onMessage) => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket("ws://localhost:8080/ws-stomp"); 
    stompClient = Stomp.over(socket);

    stompClient.debug = null; // 콘솔 디버그 끄기

    stompClient.connect(
      {},
      () => {
        console.log("WebSocket 연결됨");

        // 사용자 알림 구독: /topic/notifications/{userId}
        stompClient.subscribe(`/topic/notifications/${userId}`, (msg) => {
          if (onMessage) {
            onMessage(JSON.parse(msg.body)); 
          }
        });

        resolve();
      },
      (err) => {
        console.error("WebSocket 연결 실패:", err);
        reject(err);
      }
    );
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("WebSocket 연결 해제됨");
    });
  }
};
