// src/config/websocket.js

import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (userId, onMessage) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject("유저 ID 없음");
      return;
    }

    stompClient = new Client({
      brokerURL: `https://tnt-65859504419.asia-northeast3.run.app`,
      reconnectDelay: 3000,

      onConnect: () => {
        console.log("WebSocket 연결됨");

        // 구독
        stompClient.subscribe(`/topic/notifications/${userId}`, (frame) => {
          if (!frame.body) return;
          const msg = JSON.parse(frame.body);
          onMessage(msg);
        });

        resolve();
      },

      onStompError: (err) => {
        console.error("STOMP 오류:", err);
        reject(err);
      }
    });

    stompClient.activate();
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
