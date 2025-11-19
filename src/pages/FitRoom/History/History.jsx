import React, { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import styles from "./History.module.css"; // 현재 폴더 기준
import Modal from 'react-bootstrap/Modal';

function History() {

    const [historyData, setHistoryData] = useState([]);

    // 모달
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "edit" 또는 "delete"
    const [selectedHistory, setSelectedHistory] = useState(null);

    useEffect(() => {
        const Historylist = async () => {
            try {
                const res = await caxios.get("/history/list");
                setHistoryData(res.data);
            } catch (err) {
                console.error(err);

            }
        };

        Historylist();
    }, []);



    // 삭제
    const handleDelete = () => {

        try {
            caxios.delete("/history/delete", { params: { seq: selectedHistory.seq } });

            setHistoryData(prev => prev.filter(e => e.seq !== selectedHistory.seq));


            handleCloseModal();
            alert("삭제 완료");
        } catch (err) {
            console.error(err);
            alert("삭제 실패");
        }
    }


    // 날짜별 그룹화
    const groupedByDate = historyData.reduce((acc, item) => {

        const d = new Date(item.saveDate);   // ISO 문자열을 Date 객체로 변환
        const date = d.toISOString().split("T")[0]; // "YYYY-MM-DD"

        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {});

    // 같은 날짜 안에서 시간순 정렬
    Object.keys(groupedByDate).forEach(date => {
        groupedByDate[date].sort(
            (a, b) => new Date(a.saveDate) - new Date(b.saveDate)
        );
    });

    // 날짜 그룹 최신순 정렬
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));



    //모달

    const handleDeleteClick = (item) => {
        setSelectedHistory(item);
        setModalType("delete");
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHistory(null);
    };




    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <h1> 기록 내역 </h1>
            {sortedDates.map(date => (
                <div key={date}>
                    <span style={{ fontSize: "25px", color: "black" }}>{date}</span>
                    <div className="cardContainer">
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {groupedByDate[date].map(item => {

                                const day = new Date(item.saveDate);
                                const time = day.toTimeString().split(" ")[0]; // HH:MM:SS
                                return (

                                    <div key={item.seq} className={styles.itemCard}>
                                        {/* 큰 이미지 */}
                                        <img src={item.resultUrl} className={styles.mainImg} />

                                        {/* 작은 이미지 오버레이 */}
                                        <div className={styles.overlayImages}>
                                            <img src={`data:image/png;base64,${item.upperImageUrl}`} className={styles.smallImg} />
                                            {item.lowerImageUrl &&
                                                <img src={`data:image/png;base64,${item.lowerImageUrl}`} className={styles.smallImg} />
                                            }
                                        </div>
                                        <div className={styles.actions}>
                                            <button onClick={() => handleDeleteClick(item)}>🗑️</button>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* map */}
                        </div>
                    </div>
                </div>
            ))}


            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>

                <Modal.Header closeButton>
                    <Modal.Title>{modalType === "edit" ? "기록 수정" : "기록 삭제"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {modalType === "delete" && selectedHistory && (
                        
                        <p>기록 : {selectedHistory.name}<br></br> 해당 기록을 삭제하시겠습니까?</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={handleCloseModal}>취소</button>

                    <button onClick={() => {
                        if (modalType === "delete") {
                            handleDelete();
                        }

                    }}>
                        {modalType === "edit" ? "저장" : "삭제"}
                    </button>
                </Modal.Footer>
            </Modal>


        </div>
    );
}

export default History;
