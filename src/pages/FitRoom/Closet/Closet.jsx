import React, { useState, useRef, useEffect } from "react";

import { caxios } from "../../../config/config";
import styles from "./Closet.module.css"; // 현재 폴더 기준
import Modal from 'react-bootstrap/Modal';
import ColorThief from "colorthief";
import { removeBackground } from "@imgly/background-removal";

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
    const [editCategory, setEditCategory] = useState("");

    // 옷장 추가용
    const [ModalclothType, setModalClothType] = useState("upper");
    const [clothImage, setClothImage] = useState(null);
    const [lowerClothImage, setLowerClothImage] = useState(null);
    const [closetCategory, setClosetCategory] = useState("all");

    const [colorFilter, setColorFilter] = useState(null);


    useEffect(() => {
        const Closetlist = async () => {
            try {
                const res = await caxios.get("/closet/list");
                setClosetData(res.data);
                console.log("Closet list:", res.data);

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

        // if (clothImage) formData.append("cloth_image", clothImage);
        // if (lowerClothImage) formData.append("lower_cloth_image", lowerClothImage);

        const colorThief = new ColorThief();

        // 상의 색상 추출
        if (clothImage) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = URL.createObjectURL(clothImage);

            await new Promise((resolve) => {
                img.onload = () => {
                    try {
                        const [r, g, b] = colorThief.getColor(img);
                        formData.append("upperClothColorR", r);
                        formData.append("upperClothColorG", g);
                        formData.append("upperClothColorB", b);
                    } catch (err) {
                        console.error("색상 추출 실패", err);
                    }
                    resolve(true);
                };
            });

            formData.append("cloth_image", clothImage);
        }

        // 하의 색상 추출
        if (lowerClothImage) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = URL.createObjectURL(lowerClothImage);

            await new Promise((resolve) => {
                img.onload = () => {
                    try {
                        const [r, g, b] = colorThief.getColor(img);
                        formData.append("lowerClothColorR", r);
                        formData.append("lowerClothColorG", g);
                        formData.append("lowerClothColorB", b);
                    } catch (err) {
                        console.error("색상 추출 실패", err);
                    }
                    resolve(true);
                };
            });

            formData.append("lower_cloth_image", lowerClothImage);
        }

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


    //수정

    const handlEdit = async () => {

        try {
            const url = selectedCloth.url;
            await caxios.put("/closet/edit", null, {
                params: {
                    seq: selectedCloth.seq,
                    name: editName,
                    type: editType,
                    category: editCategory,
                    url: url
                }
            });
            alert("수정 완료");
            const list = await caxios.get("/closet/list");
            setClosetData(list.data);
            handleCloseModal();

        } catch (err) {
            console.error(err);
            alert("수정 실패");
        }
    }



    // 삭제
    const handleDelete = async () => {
        console.log("DELETE seq:", selectedCloth?.seq);
        try {
            await caxios.delete("/closet/delete", { params: { seq: selectedCloth.seq } });

            const list = await caxios.get("/closet/list");
            setClosetData(list.data);

            handleCloseModal();
            alert("삭제 완료");
        } catch (err) {
            console.error(err);
            alert("삭제 실패");
        }
    }


    //모달
    const handleEditClick = (item) => {
        setSelectedCloth(item);
        setModalType("edit");
        setEditName(item.name);
        setEditType(item.type);
        setEditCategory(item.category);
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
        setModalClothType("upper");
    };

    // 색상 구분
    function rgbToColorName([r, g, b]) {
        // 0~1 범위로 정규화
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        // 명도(Value)
        const v = max;
        // 채도(Saturation)
        const s = max === 0 ? 0 : delta / max;

        // 채도가 낮으면 회색/검정/흰색 처리
        if (s < 0.2) {
            // 거의 회색
            if (v > 0.9) return "white";
            if (v > 0.8) {
                // R,G,B 차이로 아이보리 구분
                if (r > b && g > b) return "ivory";
                return "gray";
            }
            if (v < 0.25) return "black";
            return "gray";
        }


        // Hue 계산
        let h;
        if (delta === 0) {
            h = 0;
        } else if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;

        // Hue 기준 색상 매핑(divmagic 참고)
        if (h >= 0 && h < 15) return "red";
        if (h >= 15 && h < 45) return "orange";
        if (h >= 45 && h < 70) return "yellow";
        if (h >= 70 && h < 170) return "green";
        if (h >= 170 && h < 200) return "teal";
        if (h >= 200 && h < 260) return "blue";
        if (h >= 260 && h < 290) return "purple";
        if (h >= 290 && h < 330) return "pink";
        if (h >= 330 && h <= 360) return "red"; // Hue가 330~360도도 빨강
        return "etc";
    }






    // 상의 하의 구분 + combo 지원
    const filteredData = closetData.flatMap(item => {
        const arr = [];

        // 상의
        if ((clothType === "all" || clothType === "upper") && item.upperName &&
            (closetCategory === "all" || item.category === closetCategory) &&
            (item.clothType === "upper" || item.clothType === "combo" || item.clothType === "full")) {

            const upperColorName =
                (item.upperColorR != null && item.upperColorG != null && item.upperColorB != null)
                    ? rgbToColorName([item.upperColorR, item.upperColorG, item.upperColorB])
                    : "기타";

            if (!colorFilter || colorFilter === "all" || upperColorName === colorFilter) {
                arr.push({
                    seq: item.seq,
                    type: "upper",
                    name: item.upperName,
                    url: item.upperImageUrl,
                    category: item.category,
                    color: upperColorName
                });
            }
        }

        // 하의
        if ((clothType === "all" || clothType === "lower") && item.lowerName &&
            (closetCategory === "all" || item.category === closetCategory) &&
            (item.clothType === "lower" || item.clothType === "combo" || item.clothType === "full")) {

            const lowerColorName =
                (item.lowerColorR != null && item.lowerColorG != null && item.lowerColorB != null)
                    ? rgbToColorName([item.lowerColorR, item.lowerColorG, item.lowerColorB])
                    : "기타";

            if (!colorFilter || colorFilter === "all" || lowerColorName === colorFilter) {
                arr.push({
                    seq: item.seq,
                    type: "lower",
                    name: item.lowerName,
                    url: item.lowerImageUrl,
                    category: item.category,
                    color: lowerColorName
                });
            }
        }

        return arr;
    });







    return (
        <div style={{ fontSize: "20px" }}>
            {/* 헤더 */}
            <h1 style={{ textAlign: "center" }}>Closet</h1>

            {/* 메인기능 */}
            <div>
                <label>유형:</label>
                <select value={clothType} onChange={(e) => setClothType(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="upper">상의</option>
                    <option value="lower">하의</option>
                </select>

                {/* 카테고리 선택 */}
                <label style={{ marginLeft: "20px" }}>카테고리:</label>
                <select value={closetCategory} onChange={(e) => setClosetCategory(e.target.value)}>
                    <option value="all">전체</option>
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

                <label style={{ marginLeft: "20px" }}>색상:</label>
                <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="white">하양</option>
                    <option value="ivory">아이보리</option>
                    <option value="gray">회색</option>
                    <option value="black">검정</option>
                    <option value="beige">베이지</option>
                    <option value="yellow">노랑</option>
                    <option value="orange">오렌지</option>
                    <option value="red">빨강</option>
                    <option value="pink">핑크</option>
                    <option value="fuchsia">푸시아</option>
                    <option value="green">초록</option>
                    <option value="teal">틸/청록</option>
                    <option value="brown">갈색</option>
                    <option value="maroon">마룬</option>
                    <option value="burgundy">버건디</option>
                    <option value="cyan">시안</option>
                    <option value="blue">파랑</option>
                    <option value="navy">네이비</option>
                    <option value="purple">보라</option>
                    <option value="violet">바이올렛</option>
                    <option value="etc">기타</option>
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
                                    <span style={{ fontSize: "0.8em", color: "gray" }}>
                                        {item.type === "upper" ? "상의" : item.type === "lower" ? "하의" : null}
                                    </span>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "15px",
                                            height: "15px",
                                            borderRadius: "50%",
                                            backgroundColor: item.color === "white" ? "#ffffff" :
                                                item.color === "black" ? "#000000" :
                                                    item.color === "gray" ? "#808080" :
                                                        item.color === "ivory" ? "#FFFFF0" :
                                                            item.color === "red" ? "#FF0000" :
                                                                item.color === "pink" ? "#FFC0CB" :
                                                                    item.color === "orange" ? "#FFA500" :
                                                                        item.color === "yellow" ? "#FFFF00" :
                                                                            item.color === "green" ? "#00FF00" :
                                                                                item.color === "teal" ? "#008080" :
                                                                                    item.color === "brown" ? "#A52A2A" :
                                                                                        item.color === "burgundy" ? "#800020" :
                                                                                            item.color === "maroon" ? "#800000" :
                                                                                                item.color === "blue" ? "#0000FF" :
                                                                                                    item.color === "navy" ? "#000080" :
                                                                                                        item.color === "purple" ? "#800080" :
                                                                                                            item.color === "violet" ? "#EE82EE" :
                                                                                                                item.color === "cyan" ? "#00FFFF" :
                                                                                                                    "#CCCCCC", // 기타
                                            marginLeft: "5px",
                                            border: "1px solid #000"
                                        }}
                                    ></span>
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
                                <br></br>

                                <label>카테고리:</label>
                                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
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



                            </div>
                        )}
                        {modalType === "delete" && selectedCloth && (
                            <p>의류명 : {selectedCloth.name}<br></br> 해당 의류를 삭제하시겠습니까?</p>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <button onClick={() => {
                            if (modalType === "edit") {
                                handlEdit();
                            } else if (modalType === "delete") {
                                handleDelete();
                            }

                        }}>
                            {modalType === "edit" ? "저장" : "삭제"}
                        </button>

                        <button onClick={handleCloseModal}>취소</button>
                    </Modal.Footer>
                </Modal>


                {/*두번째 Modal 옷장 추가 */}
                <Modal show={showAddModal} onHide={handleCloseAddClothModal}>
                    <Modal.Header>
                        <Modal.Title> 추가 </Modal.Title>
                    </Modal.Header>

                    <Modal.Body key={showAddModal ? "open" : "closed"}>


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
                                    {lowerClothImage && <img src={URL.createObjectURL(lowerClothImage)} alt="하의 미리보기" style={{ width: 200 }} />}
                                </div>
                            </>
                        )}

                        <label>유형:</label>
                        <select value={ModalclothType} onChange={(e) => setModalClothType(e.target.value)}>
                            <option value="upper">상의</option>
                            <option value="lower">하의</option>
                        </select>
                        <br></br>
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

                    </Modal.Body>

                    <Modal.Footer>
                        <button onClick={handleAddCloth}> 추가 </button>
                        <button onClick={handleCloseAddClothModal}>취소</button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>
    );
}

export default Closet;