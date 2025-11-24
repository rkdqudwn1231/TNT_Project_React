import { Modal, Button } from "react-bootstrap";
import { ColorDescriptions } from "../ColorDescriptions";

function ColorModal({ show, onHide, color }) {
  const cleanColor = color?.trim().toUpperCase();
  const info = ColorDescriptions[cleanColor];

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{info?.name || "컬러 정보"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: cleanColor,
            margin: "0 auto 20px",
            border: "2px solid #ddd"
          }}
        />

        {info ? (
          <>
            <p><b>어울리는 톤:</b> {info.tone}</p>
            <p><b>무드:</b> {info.mood}</p>

            <p><b>잘 어울리는 조합</b></p>
            <ul>
              {info.match?.length ? (
                info.match.map((m, idx) => <li key={idx}>{m}</li>)
              ) : (
                <li>등록된 정보 없음</li>
              )}
            </ul>

            <p><b>피해야 할 조합</b></p>
            <ul>
              {info.avoid?.length ? (
                info.avoid.map((m, idx) => <li key={idx}>{m}</li>)
              ) : (
                <li>등록된 피해야 할 조합이 없습니다.</li>
              )}
            </ul>
          </>
        ) : (
          <p>해당 색상에 대한 상세 정보가 없습니다.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ColorModal;
