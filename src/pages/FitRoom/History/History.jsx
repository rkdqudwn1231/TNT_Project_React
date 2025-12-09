import React, { useEffect, useRef, useState } from "react";
import { caxios } from "../../../config/config";
import styles from "./History.module.css"; // 현재 폴더 기준
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";

function History() {

    const [historyData, setHistoryData] = useState([]);

    // 모달
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "edit" 또는 "delete"
    const [selectedHistory, setSelectedHistory] = useState(null);

    const navigate = useNavigate();

    const checkedRef = useRef(false);

    // 사용자 id
    const memberId = sessionStorage.getItem("id");

    useEffect(() => {
        if (checkedRef.current) return; // 이미 체크했으면 종료
        checkedRef.current = true;      // 체크 완료 표시

        if (!memberId) {
            alert("로그인 후 이용해주세요");
            navigate("/login");
        }

    }, [memberId, navigate]);

    useEffect(() => {
        const Historylist = async () => {
            try {
                const res = await caxios.get("/history/list", {
                    params: { memberId }
                });
                setHistoryData(res.data);
            } catch (err) {
                console.error(err);

            }
        };

        Historylist();
    }, []);

    const handleDownload = async () => {
        try {
            const res = await caxios.get("/history/download", {
                params: { seq: selectedHistory.seq },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(res.data); // Blob 생성
            const link = document.createElement('a');

            // 서버에서 내려주는 Content-Disposition 헤더에서 파일명 추출 가능하지만
            // 여기서는 DTO에서 가져온 이름 그대로 사용
            const fileName = selectedHistory.name || 'file';
            link.href = url;
            link.setAttribute('download', fileName);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            handleCloseModal();
            alert("다운로드 완료");
        } catch (err) {
            console.error(err);
            alert("다운로드 실패");
        }
    };




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


    const handleDownloadClick = (item) => {
        setSelectedHistory(item);
        setModalType("download");
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHistory(null);
    };




    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* 헤더 */}
            <h1 style={{ textAlign: "center" }}>History</h1>
            {/* 메인기능 */}
            <div>
                {sortedDates.map(date => (
                    <div key={date}>
                        <span style={{ fontSize: "25px", color: "black" }}>{date}</span>
                        <div className="cardContainer">
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {groupedByDate[date].map(item => {
                                    return (<div key={item.seq} className={styles.itemCard}>
                                        <div className={styles.imgWrapper}>
                                            <img
                                                src={item.resultUrl}
                                                className={styles.mainImg}
                                                alt=""
                                            />
                                        </div>

                                        <div className={styles.overlayImages}>
                                            <img src={item.upperImageUrl} className={styles.smallImg} />
                                            {item.lowerImageUrl &&
                                                <img src={item.lowerImageUrl} className={styles.smallImg} />
                                            }
                                        </div>

                                        <div className={styles.actions}>
                                            <button onClick={() => handleDeleteClick(item)}>🗑️</button>
                                            <button onClick={() => handleDownloadClick(item)}>⬇</button>
                                        </div>
                                    </div>

                                        // <div key={item.seq} className={styles.itemCard}>
                                        //     {/* 큰 이미지 */}
                                        //     <img src={item.resultUrl} className={styles.mainImg} />

                                        //     {/* 작은 이미지 오버레이 */}
                                        //     <div className={styles.overlayImages}>

                                        //         <img src={item.upperImageUrl} className={styles.smallImg} />
                                        //         {item.lowerImageUrl &&
                                        //             <img src={item.lowerImageUrl} className={styles.smallImg} />
                                        //         }
                                        //     </div>
                                        //     <div className={styles.actions}>
                                        //         <button onClick={() => handleDeleteClick(item)}>🗑️</button>
                                        //         <button onClick={() => handleDownloadClick(item)}>⬇</button>
                                        //     </div>
                                        // </div>
                                    );
                                })}
                                {/* map */}
                            </div>
                        </div>
                    </div>
                ))}


                {/* Modal */}
                <Modal show={showModal} onHide={handleCloseModal}>

                    <Modal.Header closeButton style={{ justifyContent: "center" }}>
                        <Modal.Title style={{ textAlign: "center", flex: 1 }}>{modalType === "download" ? "다운로드" : "기록 삭제"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {modalType === "download" && selectedHistory && (

                            <p>기록 : {selectedHistory.name}<br></br> 해당 기록을 다운받겠습니까?</p>
                        )}

                        {modalType === "delete" && selectedHistory && (

                            <p>기록 : {selectedHistory.name}<br></br> 해당 기록을 삭제하시겠습니까?</p>
                        )}
                    </Modal.Body>

                    <Modal.Footer>


                        <button className={styles.tabButtonStyle} onClick={() => {
                            if (modalType === "download") {
                                handleDownload();
                            }
                            else if (modalType === "delete") {
                                handleDelete();
                            }

                        }}>
                            {modalType === "download" ? "다운받기" : "삭제"}
                        </button>

                        <button onClick={handleCloseModal} className={styles.tab2ButtonStyle}>취소</button>
                    </Modal.Footer>
                </Modal>


            </div>
        </div>
    );
}

export default History;
