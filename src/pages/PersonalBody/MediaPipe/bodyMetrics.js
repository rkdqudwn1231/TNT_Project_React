
// landmarks: MediaPipe에서 받은 poseLandmarks[0].landmarks 배열

export function calcBodyRatios(landmarks) {

  // 랜드마크 배열이 없거나 비어 있으면 null 반환
  if (!landmarks || landmarks.length === 0) return null;

  // 특정 인덱스의 랜드마크를 [x, y] 형태로 반환하는 헬퍼 함수
  const getPoint = (id) => {
    const p = landmarks[id];  // id 위치의 랜드마크 하나 꺼냄
    return [p.x, p.y];        // x, y만 사용 (화면 상 상대 좌표)
  };

  // 두 점 사이의 거리(유클리드 거리) 계산 헬퍼
  const dist = (a, b) => {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  // MediaPipe PoseLandmark 인덱스 상수 (문서에 정의된 순서를 사용)
  const IDX = {
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,
  };

  // 각 랜드마크의 좌표를 [x, y]로 가져오기
  const L_SH = getPoint(IDX.LEFT_SHOULDER);
  const R_SH = getPoint(IDX.RIGHT_SHOULDER);
  const L_HIP = getPoint(IDX.LEFT_HIP);
  const R_HIP = getPoint(IDX.RIGHT_HIP);
  const L_KNEE = getPoint(IDX.LEFT_KNEE);
  const R_KNEE = getPoint(IDX.RIGHT_KNEE);
  const L_ANK = getPoint(IDX.LEFT_ANKLE);
  const R_ANK = getPoint(IDX.RIGHT_ANKLE);

  // 두 점의 중간 좌표를 반환하는 헬퍼
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

  // 어깨 중앙, 골반 중앙, 무릎 중앙, 발목 중앙 포인트 계산
  const midShoulder = mid(L_SH, R_SH);
  const midHip = mid(L_HIP, R_HIP);
  const midKnee = mid(L_KNEE, R_KNEE);
  const midAnkle = mid(L_ANK, R_ANK);

  // 어깨 폭(왼 어깨 ~ 오른 어깨 거리)
  const shoulderWidth = dist(L_SH, R_SH);
  // 골반 폭(왼 골반 ~ 오른 골반 거리)
  const hipWidth = dist(L_HIP, R_HIP);

  // 상체 길이(어깨 중앙 ~ 골반 중앙)
  const torsoLength = dist(midShoulder, midHip);
  // 다리 길이(골반 중앙 ~ 발목 중앙)
  const legLength = dist(midHip, midAnkle);
  // 상체 + 다리 총 길이
  const totalLength = torsoLength + legLength;

  // 어깨/골반 비율(골반이 1일 때 어깨가 몇 정도인지)
  const shoulderToHipRatio = hipWidth ? shoulderWidth / hipWidth : null;

  // 허리 비율은 정교하게 잡기 어렵기 때문에
  // 일단 어깨/골반 폭의 평균을 기준으로 "허리 폭이 골반보다 약간 작다"라는 가정으로 대략 근사
  const avgWidth = (shoulderWidth + hipWidth) / 2;
  const waistWidthApprox = avgWidth * 0.9; // 허리는 평균보다 10% 정도 좁다고 가정
  const waistToHipRatio = hipWidth ? waistWidthApprox / hipWidth : null;

  // 상체 길이 / 전체 길이 = 상체 비율
  const torsoToLegRatio = totalLength ? torsoLength / totalLength : null;

  // 계산한 비율들을 객체로 반환
  return {
    shoulderToHipRatio,
    waistToHipRatio,
    torsoToLegRatio,
  };
}
