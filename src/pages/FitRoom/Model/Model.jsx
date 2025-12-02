import React, { useEffect, useState, useRef } from "react";

import { caxios } from "../../../config/config";
import styles from "./Model.module.css"; // 현재 폴더 기준
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";

function Model() {

    const [modelData, setModelData] = useState([]);
    const [sex, setSex] = useState("all");

    // 모달 
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "edit" 또는 "delete"
    const [selectedModel, setSelectedModel] = useState(null);


    // 모달 수정용
    const [editName, setEditName] = useState("");
    const [editSex, setEditSex] = useState("male"); // "성별"


    // 모델 추가용
    const [showAddModelModal, setAddModelModal] = useState(false);
    const [modelsexModal, setmodelsexModal] = useState("male");
    const [modeImage, setModelImage] = useState(null);

    const memberId = sessionStorage.getItem("id");

  const navigate = useNavigate();

    useEffect(() => {
        const Modellist = async () => {
            try {
                const res = await caxios.get("/model/list", {
                    params: { memberId }
                });
                setModelData(res.data);
            } catch (err) {
                console.error(err);

            }
        };

        Modellist();
    }, []);

    //추가

    const handleaddModel = async () => {


        if (!modeImage) {
            alert("모델을 추가해주세요")
            return;
        }

        const formData = new FormData();
        formData.append("memberId", memberId);
        formData.append("sex", modelsexModal);
        formData.append("modelUrl", modeImage);

        try {
            await caxios.post("/model/insert", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            handleCloseModal();
            alert("추가 완료");

            setAddModelModal(false);
            setModelImage(null);

            // 서버에서 전체 리스트 다시 가져오기
            try {
                const res = await caxios.get("/model/list");
                setModelData(res.data);
            } catch (err) {
                console.error(err);

            }
        } catch (err) {
            console.error(err);
            alert("추가 실패");
        }
    }



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

    const handleEdit = async () => {

        try {
            await caxios.put("/model/edit", null, {
                params: {
                    seq: selectedModel.seq,
                    name: editName,
                    sex: editSex
                }
            })
            alert("수정 완료");
            //리스트 출력 (새로고침)
            const res = await caxios.get("/model/list");
            setModelData(res.data);
            handleCloseModal();

        } catch (err) {
            console.error(err);
            alert("수정 실패");
        }

    }



    // // 중복 제거
    // const filteredModels = (() => {
    //     const uniqueNames = new Set();
    //     const result = [];

    //     modelData.forEach(item => {
    //         if (!uniqueNames.has(item.modelName)) {
    //             uniqueNames.add(item.modelName); // item.modelName으로 맞춤
    //             result.push({
    //                 seq: item.seq,
    //                 modelName: item.modelName,
    //                 modelUrl: item.modelUrl,
    //                 sex: item.sex
    //             });
    //         }
    //     });

    //     return result;
    // })();



    // 성별 필터링
    const displayedModels = modelData.filter(item =>
        sex === "all" ? true : item.sex === sex
    );

    //수정 모달
    const handleEditClick = (model) => {
        setSelectedModel(model);
        setModalType("edit");
        setEditName(model.modelName);
        setEditSex(model.sex);
        setShowModal(true);
    };

    //삭제 모달
    const handleDeleteClick = (model) => {
        setSelectedModel(model);
        setModalType("delete");
        setShowModal(true);
    };

    //수정 삭제 모달 닫기 
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedModel(null);
    };

    // 옷장 추가
    const handlAddClick = (model) => {
        setSelectedModel(model);
        setAddModelModal(true)
    }

    // 옷장 추가 모달 닫기
    const handleAddCloseModal = () => {
        setAddModelModal(false);
        setSelectedModel(null);
        setModelImage(null);
    };

    // 모델 선택시
    const handleModelSelect = (model) => {
        sessionStorage.setItem("selectedModelImage", model.modelUrl);
        alert(`${model.modelName} 선택 완료`);
        navigate("/fitroom");
      
    };

    return (
        <div style={{ fontSize: "20px" }}>
            {/* 헤더 */}
            <h1 style={{ textAlign: "center" }}>Model</h1>

            {/* 메인기능 */}
            <div>
                <label> 성별: </label>
                <select value={sex} onChange={(e) => setSex(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>

                <button onClick={handlAddClick} style={{ float: "right" }}>모델 추가</button>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

                    {displayedModels.map(item => (

                        <div key={item.seq} style={{ textAlign: "center" }}>

                            <div className={styles.itemCard}>
                                <div className={styles.imgWrapper}>
                                    <img src={item.modelUrl} alt={item.modelName} onClick={() => handleModelSelect(item)}/>

                                    <div className={styles.actions}>
                                        <button onClick={() => handleEditClick(item)}>✏️</button>
                                        <button onClick={() => handleDeleteClick(item)}>🗑️</button>
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: "0.9em", color: "black" }}>{item.modelName}</span>{" "}{" "}
                                    <span style={{ fontSize: "0.8em", color: "gray" }}>
                                        {item.sex === "male" ? "남성" : item.sex === "female" ? "여성" : null}
                                    </span>

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
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                    <br></br>
                                    <label>성별:</label>
                                    <select value={editSex} onChange={(e) => setEditSex(e.target.value)}>
                                        <option value="male">남성</option>
                                        <option value="female">여성</option>
                                    </select>

                                </div>
                            </div>
                        )}
                        {modalType === "delete" && selectedModel && (
                            <p>모델명 : {selectedModel.modelName}<br></br> 해당 모델을 삭제하시겠습니까?</p>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <button onClick={() => {
                            if (modalType === "edit") {
                                handleEdit();
                            } else if (modalType === "delete") {
                                handleDelete();
                            }

                        }}>
                            {modalType === "edit" ? "저장" : "삭제"}
                        </button>

                        <button onClick={handleCloseModal}>취소</button>
                    </Modal.Footer>




                    {/*모달2 모델 추가 */}
                </Modal>

                <Modal show={showAddModelModal} onHide={handleAddCloseModal}>
                    <Modal.Header>
                        <Modal.Title> 추가 </Modal.Title>
                    </Modal.Header>

                    <Modal.Body key={showAddModelModal ? "open" : "closed"}>

                        <select value={modelsexModal} onChange={(e) => setmodelsexModal(e.target.value)}>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </select>

                        <div>
                            <label>모델 이미지:</label>
                            <input type="file" accept="image/*" onChange={(e) => setModelImage(e.target.files[0])} />
                            {modeImage && <img src={URL.createObjectURL(modeImage)} alt="상의 미리보기" style={{ width: 200 }} />}
                        </div>


                    </Modal.Body>

                    <Modal.Footer>
                        <button onClick={handleaddModel}> 추가 </button>
                        <button onClick={handleAddCloseModal}>취소</button>
                    </Modal.Footer>

                </Modal>

            </div>
        </div>
    );

}

export default Model;