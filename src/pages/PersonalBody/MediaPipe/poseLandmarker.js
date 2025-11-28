// src/utils/poseLandmarker.js

// MediaPipe에서 제공하는 vision tasks 중 PoseLandmarker 관련 객체들을 import
import {
  FilesetResolver,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

// 이미 만들어진 PoseLandmarker 인스턴스를 재사용하기 위해 전역 변수로 선언
let poseLandmarker = null;

// PoseLandmarker 인스턴스를 반환하는 함수 (비동기)
export async function getPoseLandmarker() {
  // 이미 만들어져 있으면 그대로 반환 (모델을 매번 부르지 않도록)
  if (poseLandmarker) return poseLandmarker;

  // MediaPipe의 wasm 파일들이 있는 경로를 알려주면서 FilesetResolver 생성
  const vision = await FilesetResolver.forVisionTasks(
    // wasm 파일을 가져올 CDN 경로 (버전/경로는 필요하면 조정)
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  // PoseLandmarker 인스턴스를 생성
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      // 실제 포즈 모델(.task 파일)이 올라가 있는 URL
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
    },
    runningMode: "IMAGE", // 한 장의 이미지 기준으로 분석하겠다(영상이면 VIDEO)
    numPoses: 1,          // 포즈를 몇 개까지 찾을지(사람 1명 기준이라 1)
  });

  // 이제 만들어진 인스턴스를 기억해 두고 반환
  return poseLandmarker;
}
