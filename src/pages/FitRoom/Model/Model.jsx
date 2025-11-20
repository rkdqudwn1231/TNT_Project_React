import React, { useEffect, useState, useRef } from "react";

import { caxios } from "../../../config/config";
import styles from "./Model.module.css"; // 현재 폴더 기준
import Modal from 'react-bootstrap/Modal';

function Model() {

    const [modelData, setModelData] = useState([]);
    const [sex, setSex] = useState("all");

    // 모달 
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "edit" 또는 "delete"
    const [selectedModel, setSelectedModel] = useState(null);

    useEffect(() => {
        const Modellist = async () => {
            try {
                const res = await caxios.get("/model/list");
                setModelData(res.data);
            } catch (err) {
                console.error(err);

            }
        };

        Modellist();
    }, []);


    // 삭제
    const handleDelete = () => {

        try {
            caxios.delete("/model/delete", { params: { seq: selectedModel.seq } });

            setModelData(prev => prev.filter(e => e.seq !== selectedModel.seq));


            handleCloseModal();
            alert("삭제 완료");
        } catch (err) {
            console.error(err);
            alert("삭제 실패");
        }
    }

    // 중복 제거
    const filteredModels = (() => {
        const uniqueUrls = [];
        return modelData.filter(item => {
            if (!uniqueUrls.includes(item.modelUrl)) {
                uniqueUrls.push(item.modelUrl);
                return true;
            }
            return false;
        });
    })();

    // 성별 필터링
    const displayedModels = filteredModels.filter(item =>
        sex === "all" ? true : item.sex === sex
    );

    //모달
    const handleEditClick = (model) => {
        setSelectedModel(model);
        setModalType("edit");
        setShowModal(true);
    };

    const handleDeleteClick = (model) => {
        setSelectedModel(model);
        setModalType("delete");
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedModel(null);
    };

    return (
        <div>
            <h1>모델 </h1>
            <select value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="all">전체</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
            </select>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

                {displayedModels.map(item => (

                    <div key={item.seq} style={{ textAlign: "center" }}>

                        <div className={styles.itemCard}>
                            <div className={styles.imgWrapper}>
                                <img src={item.modelUrl} alt={item.name} />

                                <div className={styles.actions}>
                                    <button onClick={() => handleEditClick(item)}>✏️</button>
                                    <button onClick={() => handleDeleteClick(item)}>🗑️</button>
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.9em", color: "black" }}>{item.modelName}</span>{" "}{" "}
                                <span style={{ fontSize: "0.8em", color: "gray" }}>{item.sex}</span>

                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>

                <Modal.Header closeButton>
                    <Modal.Title>{modalType === "edit" ? "모델 수정" : "모델 삭제"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalType === "edit" && selectedModel && (
                        // 수정 로직 연결
                        <div>

                            <div>
                                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                                    <img
                                        src={selectedModel.modelUrl}
                                        alt={selectedModel.modelName}
                                        style={{ width: "200px" }}
                                    />
                                </div>
                            </div>


                            <div>
                                <label>이름:</label>
                                <input type="text" defaultValue={selectedModel.modelName} />
                                <br></br>
                                <label> 성별:</label>
                                <input type="text" defaultValue={selectedModel.sex} />
                            </div>
                        </div>
                    )}
                    {modalType === "delete" && selectedModel && (
                        <p>모델명 : {selectedModel.modelName}<br></br> 해당 모델을 삭제하시겠습니까?</p>
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

export default Model;