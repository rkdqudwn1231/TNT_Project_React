import React, { useState, useRef, useEffect } from "react";

import { caxios } from "../../../config/config";
import styles from "./Closet.module.css"; // 현재 폴더 기준
import Modal from 'react-bootstrap/Modal';


function Closet() {

    const [clothType, setClothType] = useState("all");
    const [closetData, setClosetData] = useState([]);

    // 모달
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "edit" 또는 "delete"
    const [selectedCloth, setSelectedCloth] = useState(null);


    // Modal 수정용
    const [editType, setEditType] = useState(""); // "상의"/"하의"
    const [editName, setEditName] = useState("");


    useEffect(() => {
        const Closetlist = async () => {
            try {
                const res = await caxios.get("/closet/list");
                setClosetData(res.data);
            } catch (err) {
                console.error(err);

            }
        };

        Closetlist();
    }, []);



    // 삭제
    const handleDelete = async () => {
        console.log("DELETE seq:", selectedCloth?.seq);
        try {
            await caxios.delete("/closet/delete", { params: { seq: selectedCloth.seq } });

            setClosetData(prev => prev.filter(e => e.seq !== selectedCloth.seq));

            handleCloseModal();
            alert("삭제 완료");
        } catch (err) {
            console.error(err);
            alert("삭제 실패");
        }
    }


    // 중복 제거 및 clothType 필터링
    const filteredData = (() => {
        const uniqueUpper = [];
        const uniqueLower = [];
        const result = [];

        closetData.forEach(item => {
            if ((clothType === "all" || clothType === "upper") && item.upperImageUrl) {
                if (!uniqueUpper.includes(item.upperImageUrl)) {
                    result.push({ seq: item.seq, type: "상의", name: item.upperName, url: item.upperImageUrl });
                    uniqueUpper.push(item.upperImageUrl);
                }
            }
            if ((clothType === "all" || clothType === "lower") && item.lowerImageUrl) {
                if (!uniqueLower.includes(item.lowerImageUrl)) {
                    result.push({ seq: item.seq, type: "하의", name: item.lowerName, url: item.lowerImageUrl });
                    uniqueLower.push(item.lowerImageUrl);
                }
            }
        });

        return result;
    })();


    //모달
    const handleEditClick = (item) => {
        setSelectedCloth(item);
        setModalType("edit");
        setEditName(item.name);
        setEditType(item.type);
        setShowModal(true);
    };

    const handleDeleteClick = (item) => {
        setSelectedCloth(item);
        setModalType("delete");
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCloth(null);
    };


    return (
        <div>
            <h1> 옷장 </h1>

            <select value={clothType} onChange={(e) => setClothType(e.target.value)}>
                <option value="all">전체</option>
                <option value="upper">상의</option>
                <option value="lower">하의</option>
            </select>


            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {filteredData.map((item, idx) => (

                    <div key={idx} style={{ textAlign: "center" }}>
                        <div className={styles.itemCard}>
                            <div className={styles.imgWrapper}>
                                <img src={item.url} />

                                <div className={styles.actions}>
                                    <button onClick={() => handleEditClick(item)}>✏️</button>
                                    <button onClick={() => handleDeleteClick(item)}>🗑️</button>
                                </div>

                            </div>
                            <div>
                                <span style={{ fontSize: "0.9em", color: "black" }}>{item.name}</span>{" "}{" "}
                                <span style={{ fontSize: "0.8em", color: "gray" }}>{item.type}</span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>

                <Modal.Header closeButton>
                    <Modal.Title>{modalType === "edit" ? "의류 수정" : "의류 삭제"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalType === "edit" && selectedCloth && (
                        // 수정 로직 연결
                        <div>

                            <div>
                                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                                    <img
                                        src={selectedCloth.url}
                                        alt={selectedCloth.name}
                                        style={{ width: "200px" }}
                                    />
                                </div>
                            </div>


                            <label>이름:</label>
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            <br></br>
                            <label>유형:</label>
                            <select value={editType} onChange={(e) => setEditType(e.target.value)}>
                                <option value="upper">상의</option>
                                <option value="lower">하의</option>
                            </select>
                        </div>
                    )}
                    {modalType === "delete" && selectedCloth && (
                        <p>의류명 : {selectedCloth.name}<br></br> 해당 의류를 삭제하시겠습니까?</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={handleCloseModal}>취소</button>

                    <button onClick={() => {
                        if (modalType === "edit") {
                            // 수정 호출
                        } else if (modalType === "delete") {
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

export default Closet;