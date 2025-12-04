import React, { useState, useRef, useEffect } from "react";
import styles from "./FitRoomMain.module.css"
import { caxios } from "../../config/config";
import ColorThief from "colorthief";
import { removeBackground } from "@imgly/background-removal";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function FitRoomMain() {

  const [modelImage, setModelImage] = useState(null);
  const [clothImage, setClothImage] = useState(null);
  const [lowerClothImage, setLowerClothImage] = useState(null);
  const [sex, setSex] = useState("male");
  const [clothType, setClothType] = useState("combo");
  const [closetCategory, setClosetCategory] = useState("etc");
  const [lowerCategory, setLowerCategory] = useState("etc");
  const [resultImage, setResultImage] = useState(null); // 완성 이미지 URL
  const [loading, setLoading] = useState(false);

  const [upperColor, setUpperColor] = useState(null); // 상의 dominant color
  const [lowerColor, setLowerColor] = useState(null); // 하의 dominant color

  // 로딩
  const [upperColorLoading, setUpperColorLoading] = useState(false);
  const [lowerColorLoading, setLowerColorLoading] = useState(false);

  //옷 , 모델 가져오기
  const [modelName, setModelName] = useState(""); // 새로 추가
  const [upperCloth, setUpperCloth] = useState(null);
  const [lowerCloth, setLowerCloth] = useState(null);

  // 옷 모달 열기/닫기
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [closetData, setClosetData] = useState([]); // 옷장 데이터


  const isSubmitting = useRef(false); // 중복 요청 방지

  const navigate = useNavigate();

  // 사용자 id
  const memberId = sessionStorage.getItem("id");
  // 로그인 확인
  const [checkedLogin, setCheckedLogin] = useState(false);

  useEffect(() => {
    if (!checkedLogin) {
      if (!memberId) {

        navigate("/login");
      }
      setCheckedLogin(true); // 다시 실행 방지
    }
  }, [memberId, navigate, checkedLogin]);



  // 옷장탭에서 넘어온 옷
  useEffect(() => {
    const upperImage = sessionStorage.getItem("selectedUpperImage");
    const upperName = sessionStorage.getItem("selectedUpperName");
    const lowerImage = sessionStorage.getItem("selectedLowerImage");
    const lowerName = sessionStorage.getItem("selectedLowerName");

    const convertToFile = async (url, name, setState) => {
      if (!url) return;
      try {
        const res = await caxios.get(`/fitroom/fetchImage?url=${encodeURIComponent(url)}`, {
          responseType: "blob",
        });
        const file = new File([res.data], name || "cloth.png", { type: res.data.type });
        setState(file);
      } catch (err) {
        console.error("옷 이미지 변환 실패:", err);
      }
    };

    if (upperImage) {
      convertToFile(upperImage, upperName, setClothImage);
      sessionStorage.removeItem("selectedUpperImage");
      sessionStorage.removeItem("selectedUpperName");
    }

    if (lowerImage) {
      convertToFile(lowerImage, lowerName, setLowerClothImage);
      sessionStorage.removeItem("selectedLowerImage");
      sessionStorage.removeItem("selectedLowerName");
    }
  }, []);


  // 모델탭에서 넘어온 모델
  useEffect(() => {
    const selectedImage = sessionStorage.getItem("selectedModelImage");
    const selectedName = sessionStorage.getItem("selectedModelName");

    if (selectedImage && selectedName) {
      const fetchModel = async () => {
        try {
          const res = await caxios.get(
            `/fitroom/fetchImage?url=${encodeURIComponent(selectedImage)}`,
            { responseType: "blob" }
          );
          const file = new File([res.data], selectedName, { type: res.data.type });
          setModelImage(file);
          setModelName(selectedName); // 여기서 바로 세팅
        } catch (err) {
          console.error("모델 이미지 변환 실패:", err);
        } finally {
          sessionStorage.removeItem("selectedModelImage");
          sessionStorage.removeItem("selectedModelName");
        }
      };
      fetchModel();
    }
  }, []);




  const handleSubmit = async (e) => {

    console.log(modelName, "모델이름");
    e.preventDefault();
    if (isSubmitting.current) return; // 이미 제출 중이면 무시
    isSubmitting.current = true;
    setLoading(true);

    let modelFile = modelImage;
    if (!modelFile) {
      alert("모델 이미지를 선택하세요!");
      setLoading(false);
      isSubmitting.current = false;
      return;
    }


    const currentModelName = modelName || (modelFile instanceof File ? modelFile.name : "model.png");
    console.log(currentModelName, "모델 이름 확인"); // 여기서 확인 가능


    if ((clothType === "upper" || clothType === "combo" || clothType === "full") && !clothImage) {
      alert("옷 이미지를 추가하세요!");
      setLoading(false);
      isSubmitting.current = false;
      return;
    }
    if ((clothType === "combo") && !lowerClothImage) {
      alert("하의 이미지를 선택하세요!");
      setLoading(false);
      isSubmitting.current = false;
      return;
    }

    // ---- api 스타트

    const formData = new FormData();
    if (modelImage) formData.append("model_image", modelFile);
    if (clothImage) formData.append("cloth_image", clothImage);

    // clothType이 'combo'일 때만 하의 추가
    if (clothType === "combo") {
      if (lowerClothImage) {
        formData.append("lower_cloth_image", lowerClothImage);
      }
    }
    formData.append("cloth_type", clothType); // select에서 선택한 값 사용
    formData.append("hd_mode", "false");

    try {

      // -- 서버에 api 요청 전달
      const res = await caxios.post("/fitroom/wear", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // -----결과
      // taskId 받기
      const { taskId } = res.data;


      // taskId로 이미지 URL 가져오기
      const fetchResultImage = async (taskId) => {
        let imageUrl = "";
        for (let i = 0; i < 15; i++) { // 최대 15번 시도
          const res = await caxios.get(`/fitroom/status?taskId=${taskId}`);
          if (res.data.status === "completed") {
            imageUrl = res.data.imageUrl;
            break; // 완료되면 반복 종료
          }
          await new Promise(r => setTimeout(r, 2000)); // 2초 대기
        }
        return imageUrl;
      };

      const imageUrl = await fetchResultImage(taskId); // await 추가!

      if (!imageUrl) {
        alert("이미지 생성이 지연되고 있습니다.");
        return;
      }
      setResultImage(imageUrl);

      // 배경제거 , 색상 추출
      const extractColor = async (file) => {
        try {
          // 배경 제거
          const resultBlob = await removeBackground(file);
          const resultURL = URL.createObjectURL(resultBlob);

          // ColorThief로 색상 추출
          return await new Promise((resolve) => {
            const img = new Image();
            img.src = resultURL;
            img.onload = () => {
              try {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(img);
                resolve(dominantColor); // [R, G, B]
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

      const clothColor = clothImage ? await extractColor(clothImage) : null;
      const lowerClothColor =
        clothType === "combo" && lowerClothImage
          ? await extractColor(lowerClothImage)
          : null;

      // db 저장

      const saveData = new FormData();
      saveData.append("taskId", taskId); //  taskId 11.20 등록
      saveData.append("cloth_type", clothType);
      saveData.append("model_image", modelFile);    // 실제 파일 그대로
      if (clothImage) saveData.append("cloth_image", clothImage);
      if (lowerClothImage) saveData.append("lower_cloth_image", lowerClothImage);
      saveData.append("memberId", memberId);
      saveData.append("ClosetCategory", closetCategory);
      if (lowerCategory) saveData.append("lowerCategory", lowerCategory);
      saveData.append("sex", sex);
      saveData.append("modelName", modelName);

      //색상
      if (clothColor) {
        saveData.append("upperClothColorR", clothColor[0]);
        saveData.append("upperClothColorG", clothColor[1]);
        saveData.append("upperClothColorB", clothColor[2]);
      }
      if (lowerClothColor) {
        saveData.append("lowerClothColorR", lowerClothColor[0]);
        saveData.append("lowerClothColorG", lowerClothColor[1]);
        saveData.append("lowerClothColorB", lowerClothColor[2]);
      }

      // DB에 저장
      await caxios.post("/fitroom/save", saveData, {
        headers: { "Content-Type": "multipart/form-data" }
      });



    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      isSubmitting.current = false; // 요청 완료 후 다시 제출 가능
    }


  };



  // 이미지 리사이즈
  const resizeImage = (file, maxSize = 200) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = height * (maxSize / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = width * (maxSize / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve);
      };
    });
  };

  // 업로드용 색 추출 extractDominantColor
  // 이미지 업로드 시 색상 추출
  const handleUpperImageChange = async (e) => {
    const file = e.target.files[0];
    setClothImage(file);
    setUpperColorLoading(true); // 로딩 시작
    const color = await extractDominantColor(file);
    setUpperColor(color);
    setUpperColorLoading(false); // 로딩 끝
  };

  const handleLowerImageChange = async (e) => {
    const file = e.target.files[0];
    setLowerClothImage(file);
    setLowerColorLoading(true);
    const color = await extractDominantColor(file);
    setLowerColor(color); // [R, G, B]
    setLowerColorLoading(false);
  };

  // 색상 추출 함수
  const extractDominantColor = async (file) => {
    if (!file) return null;
    try {
      const smallBlob = await resizeImage(file, 200); // 리사이즈
      const resultBlob = await removeBackground(smallBlob); // 배경 제거
      const resultURL = URL.createObjectURL(resultBlob);

      return await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = resultURL;

        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            console.log("Dominant Color:", dominantColor); // ✅ 추가
            resolve(dominantColor);
          } catch (err) {
            console.error(err); // 여기서 에러가 찍힐 가능성 높음
            resolve(null);
          }
        };

        img.onerror = (e) => {
          console.error("Image load error:", e);
          resolve(null);
        };
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  };


  // 모달 열기
  const openClosetModal = async () => {
    try {
      const res = await caxios.get("/closet/list", {
        params: { memberId }
      });
      setClosetData(res.data);
      setShowClosetModal(true);
    } catch (err) {
      console.error("옷장 데이터 불러오기 실패:", err);
    }
  };

  // 모달에서 선택
  const convertUrlToFile = async (url, name) => {
    const res = await caxios.get(`/fitroom/fetchImage?url=${encodeURIComponent(url)}`, { responseType: 'blob' });
    return new File([res.data], name || "cloth.png", { type: res.data.type });
  };

  const handleSelectCloth = async (item) => {
    // 이름 결정: upperName > lowerName > name > "이름 없음"
    const clothName = item.upperName || item.lowerName || item.name || "이름 없음";

    const confirmed = window.confirm(`"${clothName}" 옷을 FitRoom에 적용하시겠습니까?`);
    if (!confirmed) return;

    if (clothType === "upper") {
      const file = await convertUrlToFile(item.upperImageUrl, item.upperName || item.name);
      setClothImage(file);

      setUpperColorLoading(true);
      const color = await extractDominantColor(file);
      setUpperColor(color);
      setUpperColorLoading(false);

    } else if (clothType === "combo") {
      // 상의
      if (item.upperImageUrl) {
        const file = await convertUrlToFile(item.upperImageUrl, item.upperName || item.name);
        setClothImage(file);

        setUpperColorLoading(true);
        const color = await extractDominantColor(file);
        setUpperColor(color);
        setUpperColorLoading(false);
      }
      // 하의
      if (item.lowerImageUrl) {
        const file = await convertUrlToFile(item.lowerImageUrl, item.lowerName || item.name);
        setLowerClothImage(file);

        setLowerColorLoading(true);
        const color = await extractDominantColor(file);
        setLowerColor(color);
        setLowerColorLoading(false);
      }

    }
    if (clothType === "full") {
      const imageUrl = item.upperImageUrl;
      if (imageUrl) {
        const file = await convertUrlToFile(imageUrl, item.name || item.upperName);
        setClothImage(file);
        setLowerClothImage(null);

        setUpperColorLoading(true);
        const color = await extractDominantColor(file);
        setUpperColor(color);
        setUpperColorLoading(false);

        setLowerColorLoading(false);
        setLowerColor(null);
      }
    }

  }




  // function ClosetModal({ show, handleClose, closetData, onSelect }) {

  //   return (
  //     <Modal show={show} onHide={handleClose} size="lg">
  //       <Modal.Header closeButton>
  //         <Modal.Title>옷장 선택</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
  //           {closetData.map((item, idx) => (
  //             <div key={idx}>
  //               <img
  //                 src={item.upperImageUrl || item.lowerImageUrl || item.fullImageUrl}
  //                 alt={item.upperName || item.lowerName || item.name}
  //                 style={{ width: 100, cursor: "pointer" }}
  //                 onClick={() => handleSelectCloth(item)}
  //               />
  //               <span>{item.upperName || item.lowerName || item.name}</span>
  //             </div>
  //           ))}
  //         </div>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button variant="secondary" onClick={handleClose}>닫기</Button>
  //       </Modal.Footer>
  //     </Modal>
  //   );
  // }

  function ClosetModal({ show, handleClose, closetData, onSelect }) {
    const [filterType, setFilterType] = useState("all"); // all / upper / lower / full

    // 타입별로 필터링
    const filteredData = closetData.filter((item) => {
      if (filterType === "all") return true;
      return item.clothType === filterType;
    });

    const handleSelectCloth = (item) => {
      onSelect(item); // 부모에 선택 전달
      handleClose();
    };

    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>옷장 선택</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* 필터 선택 */}
          <div style={{ marginBottom: "10px" }}>
            <label>유형: </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="upper">상의</option>
              <option value="lower">하의</option>
              <option value="full">한벌</option>
            </select>
          </div>

          {/* 옷장 아이템 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {filteredData.map((item, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <img
                  src={item.upperImageUrl || item.lowerImageUrl || item.fullImageUrl}
                  alt={item.upperName || item.lowerName || item.name}
                  style={{ width: 100, cursor: "pointer" }}
                  onClick={() => handleSelectCloth(item)}
                />
                <div>{item.upperName || item.lowerName || item.name}</div>
                <span style={{ fontSize: "0.8em", color: "gray" }}>
                  {item.clothType === "upper" ? "상의" : item.clothType === "lower" ? "하의" : item.clothType === "full" ? "한벌" : null}
                </span>
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }



  return (

    <div style={{ fontSize: "20px" }}>

      <h1 style={{ textAlign: "center" }}>FitRoom</h1>


      <form className={styles.container} onSubmit={handleSubmit}>

        {/* 모델 업로드 */}

        <div className={styles["modelbox"]}>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <label>성별:</label>
            <select value={sex} onChange={(e) => setSex(e.target.value)}>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          <h2>모델 이미지</h2>
          <label htmlFor="modelInput">
            {!modelImage ? (
              <div className={styles["upload-box"]} style={{ fontSize: "30px" }}> 모델 업로드 </div>
            ) : (
              <img
                src={modelImage instanceof File ? URL.createObjectURL(modelImage) : modelImage}
                className={styles["upload-preview"]}
                alt="모델 미리보기"
              />
            )}
          </label>

          <input
            id="modelInput" type="file"
            accept="image/*"
            className={styles["hidden-input"]}
            onChange={(e) => setModelImage(e.target.files[0])}
          />

        </div>


        <div className={styles["clothesbox"]}>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>

            <div>
              <label>유형:</label>
              <select value={clothType} onChange={(e) => setClothType(e.target.value)}>
                <option value="upper">상의</option>
                <option value="combo">상하의</option>
                <option value="full">한벌</option>
              </select>
            </div>

            {(clothType === "full") && (
              <div style={{ marginLeft: "10px" }}>
                <label>카테고리:</label>
                <select value={closetCategory} onChange={(e) => setClosetCategory(e.target.value)}>
                  <option value="coat">코트</option>
                  <option value="dress">드레스</option>
                  <option value="etc">기타</option>
                </select>
              </div>
            )}



            {(clothType === "upper" || clothType === "combo") && (
              <div style={{ marginLeft: "10px" }}>
                <label>카테고리:</label>
                <select value={closetCategory} onChange={(e) => setClosetCategory(e.target.value)}>
                  <option value="tshirt">티셔츠</option>
                  <option value="shirt">셔츠</option>
                  <option value="hoodie">후드티</option>
                  <option value="jacket">자켓</option>
                  <option value="sweater">스웨터</option>
                  <option value="cardigan">가디건</option>
                  <option value="etc">기타</option>
                </select>
              </div>
            )}



            {(clothType === "combo") && (
              <div style={{ marginLeft: "10px" }}>
                <label>하의 카테고리:</label>
                <select value={lowerCategory} onChange={(e) => setLowerCategory(e.target.value)}>
                  <option value="longpants">긴바지</option>
                  <option value="shorts">반바지</option>
                  <option value="jeans">청바지</option>
                  <option value="slacks">슬랙스</option>
                  <option value="skirt">스커트</option>
                  <option value="etc">기타</option>
                </select>
              </div>
            )}
          </div>

          {/*type이 upper이거나 full 일 때 상의 업로드 */}
          {/* 상의 이미지 */}
          <div style={{ textAlign: "center" }}>
            {(clothType === "upper" || clothType === "full") && (
              <div>
                <h2>상의 이미지</h2>
                <label htmlFor="upperInput">
                  {!clothImage ? (
                    <div className={styles["upload-box"]} style={{ fontSize: "30px" }}>상의 업로드</div>
                  ) : (
                    <img
                      src={URL.createObjectURL(clothImage)}
                      className={styles["upload-preview"]}
                      alt="상의 미리보기"
                    />
                  )}
                </label>
                <input
                  id="upperInput"
                  type="file"
                  accept="image/*"
                  className={styles["hidden-input"]}
                  onChange={handleUpperImageChange} // <- 여기 수정
                />
                {/* <input
                  id="upperInput"
                  type="file"
                  accept="image/*"
                  className={styles["hidden-input"]}
                  onChange={(e) => setClothImage(e.target.files[0])}
                /> */}
              </div>
            )}
          </div>

          <div>
            {(clothType === "combo") && (
              <div className={styles["upper-lower-container"]}>
                {/* 상의 */}
                <div>
                  <h3>상의 이미지</h3>
                  <label htmlFor="upperInputCombo">
                    {!clothImage ? (
                      <div className={styles["upload-box"]} style={{ fontSize: "30px" }}>상의 업로드</div>
                    ) : (
                      <img
                        src={URL.createObjectURL(clothImage)}
                        className={styles["upload-preview"]}
                        alt="상의 미리보기"
                      />
                    )}
                  </label>
                  <input
                    id="upperInputCombo"
                    type="file"
                    accept="image/*"
                    className={styles["hidden-input"]}
                    onChange={handleUpperImageChange}
                  />
                  {/* <input
                    id="upperInputCombo"
                    type="file"
                    accept="image/*"
                    className={styles["hidden-input"]}
                    onChange={(e) => setClothImage(e.target.files[0])}
                  /> */}
                </div>

                {/* 하의 */}
                <div>
                  <h3>하의 이미지</h3>
                  <label htmlFor="lowerInput">
                    {!lowerClothImage ? (
                      <div className={styles["upload-box"]} style={{ fontSize: "30px" }}>하의 업로드</div>
                    ) : (
                      <img
                        src={URL.createObjectURL(lowerClothImage)}
                        className={styles["upload-preview"]}
                        alt="하의 미리보기"
                      />
                    )}
                  </label>
                  <input
                    id="lowerInput"
                    type="file"
                    accept="image/*"
                    className={styles["hidden-input"]}
                    onChange={handleLowerImageChange}
                  />
                  {/* <input
                    id="lowerInput"
                    type="file"
                    accept="image/*"
                    className={styles["hidden-input"]}
                    onChange={(e) => setLowerClothImage(e.target.files[0])}
                  /> */}
                </div>


              </div>
            )}

           // @@ 주석
            <div style={{ margin: "10px 0" }}>
              <button type="button" onClick={openClosetModal}>
                옷장 열기
              </button>
            </div>

            <ClosetModal
              show={showClosetModal}
              handleClose={() => setShowClosetModal(false)}
              closetData={closetData}
              onSelect={handleSelectCloth}
            />



            {/* upper / full 색상 표시 */}
            {(clothType === "upper" || clothType === "full") && clothImage && (
              <div style={{ marginTop: "10px" }}>
                <p>상의 색상:</p>
                {upperColorLoading ? (
                  <div>상의 색 추출중...(15 ~ 20초)</div>
                ) : upperColor ? (
                  <div style={{
                    width: 50,
                    height: 50,
                    backgroundColor: `rgb(${upperColor[0]},${upperColor[1]},${upperColor[2]})`,
                    border: "1px solid #000"
                  }} />
                ) : null}
              </div>
            )}

            {/* combo 색상 표시 */}
            {clothType === "combo" && (clothImage || lowerClothImage) && (
              <div className={styles["upper-lower-container"]}>
                <p>상의 색상:</p>
                {upperColorLoading ? (
                  <div>상의 색 추출중... (15 ~ 20초)</div>
                ) : upperColor ? (
                  <div style={{
                    width: 50,
                    height: 50,
                    backgroundColor: `rgb(${upperColor[0]},${upperColor[1]},${upperColor[2]})`,
                    border: "1px solid #000"
                  }} />
                ) : null}

                <p>하의 색상:</p>
                {lowerColorLoading ? (
                  <div>하의 색 추출중...(15 ~ 20초)</div>
                ) : lowerColor ? (
                  <div style={{
                    width: 50,
                    height: 50,
                    backgroundColor: `rgb(${lowerColor[0]},${lowerColor[1]},${lowerColor[2]})`,
                    border: "1px solid #000"
                  }} />
                ) : null}
              </div>
            )}


          </div>

          <button type="submit"
            disabled={loading}
            style={{
              display: "block",      // select와 겹치지 않게 block으로
              width: "30%",
              backgroundColor: "lightblue",
              border: "none",
              borderRadius: "10px",
              fontSize: "30px",
              marginTop: "20px"
            }}>
            {loading ? "이미지 합성 중 입니다...(45~60초)" : "합성"}
          </button>

        </div>


        <div className={styles["resultbox"]}>
          {(resultImage) && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <h3>완성 이미지</h3>
              <img
                src={resultImage}
                alt="완성 이미지"
                className={styles["upload-preview"]}
              />
            </div>
          )}
        </div>

      </form >
    </div >

  );
}

export default FitRoomMain;
