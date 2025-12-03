import React, { useState, useRef, useEffect } from "react";

import { caxios } from "../../../config/config";
import styles from "./Closet.module.css"; // 현재 폴더 기준
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import ColorThief from "colorthief";
import { removeBackground } from "@imgly/background-removal";

function Closet() {

    const [clothType, setClothType] = useState("all");
    const [closetData, setClosetData] = useState([]);
    const [closetCategory, setClosetCategory] = useState("all");
    const [lowerCategory, setLowerCategory] = useState("all");
    const [fullCategory, setFullCategory] = useState("all");

    // 모달
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "edit" 또는 "delete"
    const [selectedCloth, setSelectedCloth] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    // Modal 수정용
    const [editType, setEditType] = useState(""); // "상의"/"하의"
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");

    // 옷장 추가용
    const [ModalclothType, setModalClothType] = useState("upper");
    const [clothImage, setClothImage] = useState("");
    const [lowerClothImage, setLowerClothImage] = useState("");


    const [colorFilter, setColorFilter] = useState("");
    const [modalCategory, setModalCategory] = useState("etc"); // 초기값 적절히
    const [modalLowerCategory, setModalLowerCategory] = useState("etc");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const memberId = sessionStorage.getItem("id");

    useEffect(() => {
        const Closetlist = async () => {
            try {
                const res = await caxios.get("/closet/list", {
                    params: { memberId }
                });
                setClosetData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        Closetlist();
    }, []);



    //옷 추가
    const handleAddCloth = async () => {

        setLoading(true);

        if ((ModalclothType === "upper" || ModalclothType === "full") && !clothImage) {
            alert("상의 이미지를 선택하세요.");
            return;
        }

        if ((ModalclothType === "lower") && !lowerClothImage) {
            alert("하의 이미지를 선택하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("memberId", memberId);
        formData.append("category", modalCategory);
        formData.append("clothType", ModalclothType);
        if (lowerCategory) formData.append("lowerCategory", modalLowerCategory);

        // 이미지 리사이즈 (removeBackground 속도 올리는 핵심)
        const resizeImage = (file, maxSize = 250) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = () => {
                    const canvas = document.createElement("canvas");

                    let { width, height } = img;

                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        } else {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            // Blob → File 변환 (속도 최적화 핵심)
                            const resizedFile = new File([blob], "resized.jpg", { type: "image/jpeg" });
                            resolve(resizedFile);
                        },
                        "image/jpeg",
                        0.85
                    );
                };
            });
        };

        // 최종 색상 추출
        const extractColor = async (file) => {
            try {
                const resizedFile = await resizeImage(file, 350);

                // removeBackground는 File로 넘겨야 가장 빠름
                const resultBlob = await removeBackground(resizedFile);
                const resultURL = URL.createObjectURL(resultBlob);

                return await new Promise((resolve) => {
                    const img = new Image();
                    img.src = resultURL;
                    img.onload = () => {
                        try {
                            const colorThief = new ColorThief();
                            resolve(colorThief.getColor(img));
                        } catch (err) {
                            console.error(err);
                            resolve(null);
                        }
                    };
                });
            } catch (err) {
                console.error(err);
                return null;
            }
        };



        // 상의 색상 추출
        if (clothImage) {
            const [r, g, b] = await extractColor(clothImage);
            formData.append("upperClothColorR", r);
            formData.append("upperClothColorG", g);
            formData.append("upperClothColorB", b);
            formData.append("cloth_image", clothImage);
        }

        // 하의 색상 추출
        if (lowerClothImage) {
            const [r, g, b] = await extractColor(lowerClothImage);
            formData.append("lowerClothColorR", r);
            formData.append("lowerClothColorG", g);
            formData.append("lowerClothColorB", b);
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
            setLoading(false);
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
            const list = await caxios.get("/closet/list", { params: { memberId } });
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

            const list = await caxios.get("/closet/list", { params: { memberId } });
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

    function rgbToColorName([r, g, b]) {
        r /= 255; g /= 255; b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        const v = max;
        const s = max === 0 ? 0 : delta / max;

        // 회색/검정/화이트
        if (s < 0.15) {  // 채도가 너무 낮으면
            if (v < 0.2) return "black";
            if (v > 0.85) return "white";
            return "gray";
        }

        // Hue 계산
        let h;
        if (delta === 0) h = 0;
        else if (max === r) h = ((g - b) / delta);
        else if (max === g) h = ((b - r) / delta + 2);
        else h = ((r - g) / delta + 4);
        h *= 60;
        if (h < 0) h += 360;
        h = Math.round(h);

        // 낮은 밝기 & 낮은 채도 → 카키/올리브
        if (v < 0.5 && s < 0.25 && h >= 40 && h <= 75) return "khaki";

        // 기존 보정
        if (h >= 320 && h < 350 && v > 0.5) return "pink";
        if (h >= 20 && h <= 60 && s < 0.8 && v < 0.55) return "brown";
        if (v > 0.85 && s < 0.35) return "ivory";
        if (v > 0.7 && s < 0.6) {
            if (r > g && g > b) return "beige";
            if (g > r && g > b) return "light green";
        }

        // Hue 기반 색상
        if (h >= 0 && h < 15) return "red";
        if (h >= 15 && h < 40) return "orange";
        if (h >= 40 && h < 75) return "yellow";
        if (h >= 75 && h < 170) return "green";
        if (h >= 170 && h < 200) return "teal";
        if (h >= 200 && h < 260) return "blue";
        if (h >= 260 && h < 320) return "purple";
        if (h >= 350 && h <= 360) return "red";

        return "etc";
    }

    // 상의 하의 구분 + combo 지원 (12.01 개선)
    const filteredData = closetData.flatMap(item => {
        const arr = [];

        if ((clothType === "all" || clothType === "full") && item.clothType === "full") {

            // full 카테고리 확인
            if (fullCategory === "all" || item.category === fullCategory) {

                const fullColorName =
                    (item.upperColorR != null && item.upperColorG != null && item.upperColorB != null)
                        ? rgbToColorName([item.upperColorR, item.upperColorG, item.upperColorB])
                        : (item.lowerColorR != null && item.lowerColorG != null && item.lowerColorB != null)
                            ? rgbToColorName([item.lowerColorR, item.lowerColorG, item.lowerColorB])
                            : "기타";

                if (!colorFilter || colorFilter === "all" || fullColorName === colorFilter) {
                    arr.push({
                        seq: item.seq,
                        type: "full",
                        name: item.upperName || item.lowerName || "full",
                        url: item.fullImageUrl || item.upperImageUrl || item.lowerImageUrl, // full 이미지 URL 우선
                        category: item.category, // 실제 DB category
                        color: fullColorName
                    });
                }
            }
        }

        // 상의
        if ((clothType === "all" || clothType === "upper") && (item.upperName || item.lowerName) &&
            (closetCategory === "all" || item.category === closetCategory) &&
            (item.clothType === "upper" || item.clothType === "combo")) {

            const upperColorName =
                (item.upperColorR != null && item.upperColorG != null && item.upperColorB != null)
                    ? rgbToColorName([item.upperColorR, item.upperColorG, item.upperColorB])
                    : (item.lowerColorR != null && item.lowerColorG != null && item.lowerColorB != null)
                        ? rgbToColorName([item.lowerColorR, item.lowerColorG, item.lowerColorB])
                        : "기타";

            if (!colorFilter || colorFilter === "all" || upperColorName === colorFilter) {
                arr.push({
                    seq: item.seq,
                    type: "upper",
                    name: item.upperName || item.lowerName,
                    url: item.upperImageUrl || item.lowerImageUrl,
                    category: item.category,
                    color: upperColorName
                });
            }

        }

        // 하의
        if ((clothType === "all" || clothType === "lower") && (item.lowerName || item.upperName) &&
            (lowerCategory === "all" || item.lowerCategory === lowerCategory) &&
            (item.clothType === "lower" || item.clothType === "combo")) {

            const lowerColorName =
                (item.lowerColorR != null && item.lowerColorG != null && item.lowerColorB != null)
                    ? rgbToColorName([item.lowerColorR, item.lowerColorG, item.lowerColorB])
                    : (item.upperColorR != null && item.upperColorG != null && item.upperColorB != null)
                        ? rgbToColorName([item.upperColorR, item.upperColorG, item.upperColorB])
                        : "기타";

            if (!colorFilter || colorFilter === "all" || lowerColorName === colorFilter) {
                arr.push({
                    seq: item.seq,
                    type: "lower",
                    name: item.lowerName || item.upperName,
                    url: item.lowerImageUrl || item.upperImageUrl,
                    category: item.lowerCategory,
                    color: lowerColorName
                });
            }
        }

        return arr;
    });


    // 옷 선택시
    const handleClothSelect = (item) => {
        const confirmed = window.confirm(`"${item.name}" 해당 옷을 FitRoom에 적용하시겠습니까?`);
        if (!confirmed) return; // 사용자가 취소하면 종료

        if (item.type === "upper") {
            // 상의만 선택
            sessionStorage.setItem("selectedUpperImage", item.url);
            sessionStorage.setItem("selectedUpperName", item.name);
        } else if (item.type === "lower") {
            // 하의만 선택
            sessionStorage.setItem("selectedLowerImage", item.url);
            sessionStorage.setItem("selectedLowerName", item.name);
        } else if (item.type === "full") {
            // full은 item에 upperImageUrl / lowerImageUrl이 있으면 분리
            const upperUrl = item.upperImageUrl || item.url;
            const lowerUrl = item.lowerImageUrl || item.url;

            sessionStorage.setItem("selectedUpperImage", upperUrl);
            sessionStorage.setItem("selectedLowerImage", lowerUrl);

            sessionStorage.setItem("selectedUpperName", item.name);
            sessionStorage.setItem("selectedLowerName", item.name);
        }

        alert(`${item.name} 선택 완료!`);
        navigate("/fitroom");
    };



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
                    <option value="full">한벌</option>
                </select>

                {/* 카테고리 선택 */}

                {(clothType === "full") && (
                    <>
                        <label>한벌 카테고리:</label>
                        <select value={fullCategory} onChange={(e) => setFullCategory(e.target.value)}>
                            <option value="all">전체</option>
                            <option value="coat">코트</option>
                            <option value="dress">드레스</option>
                            <option value="etc">기타</option>
                        </select>
                    </>
                )}


                {(clothType === "upper" || clothType === "all") && (
                    <>
                        <label style={{ marginLeft: "10px" }}>상의 카테고리:</label>
                        <select value={closetCategory} onChange={(e) => setClosetCategory(e.target.value)}>
                            <option value="all">전체</option>
                            <option value="tshirt">티셔츠</option>
                            <option value="shirt">셔츠</option>
                            <option value="hoodie">후드티</option>
                            <option value="jacket">자켓</option>
                            <option value="sweater">스웨터</option>
                            <option value="cardigan">가디건</option>
                            <option value="coat">코트</option>
                            <option value="dress">드레스</option>
                            <option value="etc">기타</option>
                        </select>
                    </>
                )}

                {(clothType === "lower" || clothType === "all") && (
                    <>

                        <label style={{ marginLeft: "10px" }}>하의 카테고리:</label>
                        <select value={lowerCategory} onChange={(e) => setLowerCategory(e.target.value)}>
                            <option value="all">전체</option>
                            <option value="longpants">긴바지</option>
                            <option value="shorts">반바지</option>
                            <option value="jeans">청바지</option>
                            <option value="slacks">슬랙스</option>
                            <option value="skirt">스커트</option>
                            <option value="etc">기타</option>
                        </select>

                    </>
                )}


                <label style={{ marginLeft: "5px" }}>
                    <span
                        style={{
                            display: "inline-block",
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            backgroundColor:
                                colorFilter === "white" ? "#ffffff" :
                                    colorFilter === "black" ? "#000000" :
                                        colorFilter === "gray" ? "#808080" :
                                            colorFilter === "ivory" ? "#fbfbecff" :
                                                colorFilter === "red" ? "#FF0000" :
                                                    colorFilter === "pink" ? "#EE82EE" :
                                                        colorFilter === "orange" ? "#FFA500" :
                                                            colorFilter === "yellow" ? "#FFFF00" :
                                                                colorFilter === "green" ? "#20cd20ff" :
                                                                    colorFilter === "teal" ? "#008080" :
                                                                        colorFilter === "brown" ? "#A52A2A" :
                                                                            colorFilter === "burgundy" ? "#800020" :
                                                                                colorFilter === "maroon" ? "#800000" :
                                                                                    colorFilter === "blue" ? "#4444f0ff" :
                                                                                        colorFilter === "navy" ? "#000080" :
                                                                                            colorFilter === "purple" ? "#800080" :
                                                                                                colorFilter === "violet" ? "#EE82EE" :
                                                                                                    colorFilter === "cyan" ? "#00FFFF" :
                                                                                                        colorFilter === "khaki" ? "#7A796F" :
                                                                                                            "#CCCCCC", // 기타
                            marginLeft: "5px",
                            border: "1px solid #000"
                        }}
                    ></span> 색상:
                </label>

                <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="white">흰색</option>
                    <option value="ivory">아이보리색</option>
                    <option value="gray">회색</option>
                    <option value="black">검정색</option>
                    <option value="red">빨강색</option>
                    <option value="orange">주황색</option>
                    <option value="yellow">노랑색</option>
                    <option value="green">초록색</option>
                    <option value="teal">청록색</option>
                    <option value="blue">파랑색</option>
                    <option value="navy">네이비</option>
                    <option value="purple">보라색</option>
                    <option value="pink">핑크색</option>
                    <option value="beige">베이지색</option>
                    <option value="brown">갈색</option>
                    <option value="maroon">밤색</option>
                    <option value="burgundy">자주색</option>
                    <option value="khaki">카키색</option>
                    <option value="etc">기타</option>
                </select>



                <button onClick={handleAddClothModal} style={{ float: "right" }}>옷 추가</button>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

                    {filteredData.map((item, idx) => (

                        <div key={idx} style={{ textAlign: "center" }}>
                            <div className={styles.itemCard}>
                                <div className={styles.imgWrapper}>
                                    {/* <img src={item.url} /> */}
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleClothSelect(item)}
                                    />

                                    <div className={styles.actions}>
                                        <button onClick={() => handleEditClick(item)}>✏️</button>
                                        <button onClick={() => handleDeleteClick(item)}>🗑️</button>
                                    </div>

                                </div>
                                <div>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "15px",
                                            height: "15px",
                                            borderRadius: "50%",
                                            backgroundColor: item.color === "white" ? "#ffffff" :
                                                item.color === "black" ? "#000000" :
                                                    item.color === "gray" ? "#808080" :
                                                        item.color === "ivory" ? "#fbfbecff" :
                                                            item.color === "red" ? "#FF0000" :
                                                                item.color === "pink" ? "#EE82EE" :
                                                                    item.color === "orange" ? "#FFA500" :
                                                                        item.color === "yellow" ? "#FFFF00" :
                                                                            item.color === "green" ? "#20cd20ff" :
                                                                                item.color === "teal" ? "#008080" :
                                                                                    item.color === "brown" ? "#A52A2A" :
                                                                                        item.color === "burgundy" ? "#800020" :
                                                                                            item.color === "maroon" ? "#800000" :
                                                                                                item.color === "blue" ? "#0000FF" :
                                                                                                    item.color === "navy" ? "#000080" :
                                                                                                        item.color === "purple" ? "#800080" :

                                                                                                            item.color === "cyan" ? "#00FFFF" :
                                                                                                                item.color === "khaki" ? "#8f784b" :
                                                                                                                    "#CCCCCC", // 기타
                                            marginLeft: "5px",
                                            border: "1px solid #000"
                                        }}
                                    ></span>

                                    <span style={{ marginLeft: "5px", fontSize: "0.9em", color: "black" }}>{item.name}</span>{" "}{" "}
                                    <span style={{ fontSize: "0.8em", color: "gray" }}>
                                        {item.type === "upper" ? "상의" : item.type === "lower" ? "하의" : item.type === "full" ? "한벌" : null}
                                    </span>

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
                                    <option value="full">한벌</option>
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

                        <label>유형:</label>
                        <select value={ModalclothType} onChange={(e) => setModalClothType(e.target.value)}>
                            <option value="upper">상의</option>
                            <option value="lower">하의</option>
                            <option value="full">한벌</option>
                        </select>
                        <br></br>
                        {/* 상의 카테고리 */}
                        {(ModalclothType === "upper" || ModalclothType === "combo" || ModalclothType === "full") && (
                            <div>
                                <label>상의 카테고리:</label>
                                <select value={modalCategory} onChange={(e) => setModalCategory(e.target.value)}>
                                    <option value="tshirt">티셔츠</option>
                                    <option value="shirt">셔츠</option>
                                    <option value="hoodie">후드티</option>
                                    <option value="jacket">자켓</option>
                                    <option value="sweater">스웨터</option>
                                    <option value="cardigan">가디건</option>
                                    <option value="coat">코트</option>
                                    <option value="dress">드레스</option>
                                    <option value="etc">기타</option>
                                </select>
                            </div>
                        )}

                        {/* 하의 카테고리 */}
                        {(ModalclothType === "lower" || ModalclothType === "combo") && (
                            <div>
                                <label>하의 카테고리:</label>
                                <select value={modalLowerCategory} onChange={(e) => setModalLowerCategory(e.target.value)}>
                                    <option value="longpants">긴바지</option>
                                    <option value="shorts">반바지</option>
                                    <option value="jeans">청바지</option>
                                    <option value="slacks">슬랙스</option>
                                    <option value="skirt">스커트</option>
                                    <option value="etc">기타</option>
                                </select>
                            </div>
                        )}


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


                    </Modal.Body>

                    <Modal.Footer>
                        <div disabled={loading}>{loading ? "옷장에 추가 중입니다..." : "진행 상태 "}</div>

                        <button onClick={handleAddCloth}> 추가 </button>
                        <button onClick={handleCloseAddClothModal}>취소</button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div >
    );
}

export default Closet;