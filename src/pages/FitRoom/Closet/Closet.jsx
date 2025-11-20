import React, { useState, useRef, useEffect } from "react";

import { caxios } from "../../../config/config";
import styles from "./Closet.module.css"; // 현재 폴더 기준
import Modal from 'react-bootstrap/Modal';
import { ModalFooter } from "react-bootstrap";


function Closet() {

    const [clothType, setClothType] = useState("all");
    const [closetData, setClosetData] = useState([]);

    // 모달
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "edit" 또는 "delete"
    const [selectedCloth, setSelectedCloth] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Modal 수정용
    const [editType, setEditType] = useState(""); // "상의"/"하의"
    const [editName, setEditName] = useState("");

    // 옷장 추가용
    const [ModalclothType, setModalClothType] = useState("upper");
    const [clothImage, setClothImage] = useState(null);
    const [lowerClothImage, setLowerClothImage] = useState(null);
    const [closetCategory, setClosetCategory] = useState("tshirt");


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


    //옷 추가

    const handleAddCloth = async () => {

        if ((ModalclothType === "upper" || ModalclothType === "full") && !clothImage) {
            alert("상의 이미지를 선택하세요.");
            return;
        }

        if ((ModalclothType === "lower") && !lowerClothImage) {
            alert("하의 이미지를 선택하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("memberId", "맴버임시");
        formData.append("category", closetCategory);
        formData.append("clothType", ModalclothType);
        if (clothImage) formData.append("cloth_image", clothImage);
        if (lowerClothImage) formData.append("lower_cloth_image", lowerClothImage);

        try {
            const res = await caxios.post("/closet/insert", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("저장 성공", res.data);
            alert("옷 추가 완료!");
            setShowAddModal(false); // 모달 닫기
            setClothImage(null);    // 이미지 초기화
            setLowerClothImage(null);

            // 서버에서 전체 리스트 다시 가져오기
            try {
                const listRes = await caxios.get("/closet/list");
                setClosetData(listRes.data);
            } catch (err) {
                console.error("리스트 갱신 실패", err);
            }

        } catch (err) {
            console.error("저장 실패", err);
            alert("옷 추가 실패!");
        };

    }


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
        const uniqueUpperNames = new Set();
        const uniqueLowerNames = new Set();
        const result = [];

        closetData.forEach(item => {


            // 상의
            if ((clothType === "all" || clothType === "upper") && item.upperName) {
                if (!uniqueUpperNames.has(item.upperName)) {
                    uniqueUpperNames.add(item.upperName);
                    result.push({
                        seq: item.seq,
                        type: "upper",            // DB 값
                        name: item.upperName,
                        url: item.upperImageUrl,
                    });
                }
            }

            // 하의
            if ((clothType === "all" || clothType === "lower") && item.lowerName) {
                if (!uniqueLowerNames.has(item.lowerName)) {
                    uniqueLowerNames.add(item.lowerName);
                    result.push({
                        seq: item.seq,
                        type: "lower",            // DB 값
                        name: item.lowerName,
                        url: item.lowerImageUrl,
                    });
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

    // 두번째 모달 추가
    const handleAddClothModal = () => {
        setShowAddModal(true);
    }

    const handleCloseAddClothModal = () => {
        setShowAddModal(false);
        setSelectedCloth(null);
        setLowerClothImage(null);
        setClothImage(null);
        setModalClothType(null);
    };

    return (
        <div>
            <h1> 옷장 </h1>

            <select value={clothType} onChange={(e) => setClothType(e.target.value)}>
                <option value="all">전체</option>
                <option value="upper">상의</option>
                <option value="lower">하의</option>
            </select>


            <button onClick={handleAddClothModal} style={{ float: "right" }}>옷 추가</button>

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


            {/*두번째 Modal 옷추가 */}
            <Modal show={showAddModal} onHide={handleCloseAddClothModal}>
                <Modal.Header>
                    <Modal.Title> 추가 </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <select value={ModalclothType} onChange={(e) => setModalClothType(e.target.value)}>
                        <option value="upper">상의</option>
                        <option value="lower">하의</option>
                    </select>
                    <label>카테고리:</label>
                    <select value={closetCategory} onChange={(e) => setClosetCategory(e.target.value)}>
                        <option value="tshirt">티셔츠</option>
                        <option value="shirt">셔츠</option>
                        <option value="hoodie">후드티</option>
                        <option value="jacket">자켓</option>
                        <option value="sweater">스웨터</option>
                        <option value="cardigan">가디건</option>
                        <option value="coat">코트</option>
                        <option value="jeans">청바지</option>
                        <option value="slacks">슬랙스</option>
                        <option value="longpants">긴바지</option>
                        <option value="shorts">반바지</option>
                        <option value="skirt">스커트</option>
                        <option value="dress">드레스</option>
                        <option value="etc">기타</option>
                    </select>

                    {/*type이 upper이거나 full 일 때 상의 업로드 */}
                    {(ModalclothType === "upper" || ModalclothType === "full") && (
                        <div>
                            <label>상의 이미지:</label>
                            <input type="file" accept="image/*" onChange={(e) => setClothImage(e.target.files[0])} />
                            {clothImage && <img src={URL.createObjectURL(clothImage)} alt="상의 미리보기" style={{ width: 150 }} />}
                        </div>
                    )}

                    {/* type이 combo 일때 상의 하의 업로드 */}
                    {(ModalclothType === "lower") && (
                        <>
                            <div>
                                <label>하의 이미지:</label>
                                <input type="file" accept="image/*" onChange={(e) => setLowerClothImage(e.target.files[0])} />
                                {lowerClothImage && <img src={URL.createObjectURL(lowerClothImage)} alt="하의 미리보기" style={{ width: 150 }} />}
                            </div>
                        </>
                    )}
                </Modal.Body>

                <ModalFooter>
                    <button onClick={handleAddCloth}> 추가 </button>
                    <button onClick={handleCloseAddClothModal}>취소</button>
                </ModalFooter>
            </Modal>

        </div>
    );
}

export default Closet;