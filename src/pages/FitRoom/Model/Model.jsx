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
    const [modelImage, setModelImage] = useState(null);

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

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const myRes = await caxios.get("/model/list", { params: { memberId } });
                const publicRes = await caxios.get("/model/publicList");

                // 두 리스트 합치기
                setModelData([...publicRes.data, ...myRes.data]);
            } catch (err) {
                console.error(err);
            }
        };

        fetchModels();
    }, []);


    //추가
    const handleaddModel = async () => {


        if (!modelImage) {
            alert("모델을 추가해주세요")
            return;
        }

        const formData = new FormData();
        // formData.append("memberId", memberId);
        formData.append("memberId", memberId);
        formData.append("sex", modelsexModal);
        formData.append("modelUrl", modelImage);

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

                const myRes = await caxios.get("/model/list", { params: { memberId } });
                const publicRes = await caxios.get("/model/publicList");

                // 두 리스트 합치기
                setModelData([...publicRes.data, ...myRes.data]);
            } catch (err) {
                console.error(err);

            }
        } catch (err) {
            console.error(err);
            alert("추가 실패");
        }
    }



    // 삭제
    // const handleDelete = () => {

    //     try {
    //         caxios.delete("/model/delete", { params: { seq: selectedModel.seq } });

    //         setModelData(prev => prev.filter(e => e.seq !== selectedModel.seq));


    //         handleCloseModal();
    //         alert("삭제 완료");
    //     } catch (err) {
    //         console.error(err);
    //         alert("삭제 실패");
    //     }
    // }
    // 삭제
    const handleDelete = async () => {
        try {

            const res = await caxios.delete("/model/delete", {
                params: { seq: selectedModel.seq }
            });

            const result = res.data;

            if (result === -1) {
                // 기본 모델 삭제 시도
                alert("기본 가상모델은 삭제할 수 없습니다.");
                handleCloseModal();
                return;
            }


            const myRes = await caxios.get("/model/list", { params: { memberId } });
            const publicRes = await caxios.get("/model/publicList");


            setModelData([...publicRes.data, ...myRes.data]);


            handleCloseModal();
            alert("삭제 완료");

        } catch (err) {
            console.error(err);
            alert("삭제 실패");
        }
    };



    const handleEdit = async () => {

        try {
            const res = await caxios.put("/model/edit", null, {
                params: {
                    seq: selectedModel.seq,
                    name: editName,
                    sex: editSex
                }
            })

            const result = res.data;

            if (result === -1) {
                alert("기본 가상모델은 수정할 수 없습니다.");
                handleCloseModal();
                return;
            }

            // console.log(selectedModel.seq, editName, editSex);
            alert("수정 완료");
            //리스트 출력 (새로고침)
            const myRes = await caxios.get("/model/list", { params: { memberId } });
            const publicRes = await caxios.get("/model/publicList");

            setModelData([...publicRes.data, ...myRes.data]);
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
        const confirmed = window.confirm(`"${model.modelName}" 해당 모델을 FitRoom에 이용하시겠습니까?`);
        if (!confirmed) return; // 사용자가 취소하면 함수 종료

        sessionStorage.setItem("selectedModelImage", model.modelUrl);
        sessionStorage.setItem("selectedModelName", model.modelName); // 이름
        alert(`${model.modelName} 선택 완료`);
        navigate("/fitroom/fitroom");
    };

    return (
        <div style={{ fontSize: "20px" }}>
            {/* 헤더 */}
            <h1 style={{ textAlign: "center" }}>Model</h1>

            {/* 메인기능 */}
            <div>
                <label> 성별: </label>
                <select value={sex} onChange={(e) => setSex(e.target.value)} style={{ fontSize: "15px" }}>
                    <option value="all">전체</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>

                <button onClick={handlAddClick} className={styles.tabButtonStyle}>모델 추가</button>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

                    {displayedModels.map(item => (

                        <div key={item.seq} style={{ textAlign: "center" }}>

                            <div className={styles.itemCard}>
                                <div className={styles.imgWrapper}>
                                    <img src={item.modelUrl} alt={item.modelName} onClick={() => handleModelSelect(item)} />

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

                    <Modal.Header closeButton style={{ justifyContent: "center" }}>
                        <Modal.Title style={{ textAlign: "center", flex: 1 }}>{modalType === "edit" ? "모델 수정" : "모델 삭제"}</Modal.Title>
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
                                    <select value={editSex} onChange={(e) => setEditSex(e.target.value)} style={{ fontSize: "15px" }}>
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
                        <button className={styles.tabButtonStyle} onClick={() => {
                            if (modalType === "edit") {
                                handleEdit();
                            } else if (modalType === "delete") {
                                handleDelete();
                            }

                        }}>
                            {modalType === "edit" ? "저장" : "삭제"}
                        </button>

                        <button onClick={handleCloseModal} className={styles.tab2ButtonStyle}>취소</button>
                    </Modal.Footer>




                    {/*모달2 모델 추가 */}
                </Modal>

                <Modal show={showAddModelModal} onHide={handleAddCloseModal}>
                    <Modal.Header style={{ justifyContent: "center" }}>
                        <Modal.Title style={{ textAlign: "center", flex: 1 }}> 추가 </Modal.Title>
                    </Modal.Header>

                    <Modal.Body key={showAddModelModal ? "open" : "closed"}>

                        <select value={modelsexModal} onChange={(e) => setmodelsexModal(e.target.value)} style={{ fontSize: "15px" }}>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </select>

                        <div>
                            <label>모델 이미지:</label>

                            <input
                                type="file"
                                accept="image/*"
                                id="modelUpload"
                                onChange={(e) => setModelImage(e.target.files[0])}
                                style={{ display: "none" }}
                            />

                            {/* 커스텀 버튼 */}
                            <button
                                className={styles.tab3ButtonStyle}
                                onClick={() => document.getElementById("modelUpload").click()}
                            >
                                업로드
                            </button>

                            {modelImage && <img src={URL.createObjectURL(modelImage)} alt="상의 미리보기" style={{ width: 200, marginTop: "30px" }} />}
                        </div>


                    </Modal.Body>

                    <Modal.Footer>
                        <p>새로운 모델을 추가해 볼까요?😊</p>
                        <button onClick={handleaddModel} className={styles.tabButtonStyle}> 추가 </button>
                        <button onClick={handleAddCloseModal} className={styles.tab2ButtonStyle}>취소</button>
                    </Modal.Footer>

                </Modal>

            </div>
        </div>
    );

}



export default Model;