import React, { useState, useRef, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import styles from "./FitRoomMain.module.css"
import { caxios } from "../../config/config";
// import ColorThief from "colorthief";
// import { removeBackground } from "@imgly/background-removal";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ShareButton from "./ShareButton";

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

  // const [upperColor, setUpperColor] = useState(null); // 상의 dominant color
  // const [lowerColor, setLowerColor] = useState(null); // 하의 dominant color

  // // 로딩
  // const [upperColorLoading, setUpperColorLoading] = useState(false);
  // const [lowerColorLoading, setLowerColorLoading] = useState(false);

  //옷 , 모델 가져오기
  const [modelName, setModelName] = useState(""); // 새로 추가
  const [upperCloth, setUpperCloth] = useState(null);
  const [lowerCloth, setLowerCloth] = useState(null);

  // 옷 모달 열기/닫기
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [closetData, setClosetData] = useState([]); // 옷장 데이터

  // 모델 모달 열기/닫기
  const [showModelModal, setShowModelModal] = useState(false);
  const [modelList, setModelList] = useState([]); // 모델 데이터

  // 안내 모달 열기/닫기
  const [teachModalShow, setTeachModalShow] = useState(false);


  const isSubmitting = useRef(false); // 중복 요청 방지


  // 로그인 확인

  // const [checkedLogin, setCheckedLogin] = useState(false);

  // useEffect(() => {
  //   if (!checkedLogin) {
  //     if (!memberId) {
  //       alert("로그인 하세요!")
  //       navigate("/login");
  //     }
  //     setCheckedLogin(true); // 다시 실행 방지
  //   }
  // }, [memberId, navigate, checkedLogin]);

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
      // console.log(selectedName, "셀렉네임")
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
          console.log(modelName);
          sessionStorage.removeItem("selectedModelImage");
          sessionStorage.removeItem("selectedModelName");
        }
      };
      fetchModel();
    }
  }, []);

  useEffect(() => {
    // console.log("modelName 변경됨:", modelName);
  }, [modelName]);



  // // 이미지 리사이즈
  // const resizeImage = (file, maxSize = 200) => {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = URL.createObjectURL(file);
  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       let { width, height } = img;
  //       if (width > height) {
  //         if (width > maxSize) {
  //           height = height * (maxSize / width);
  //           width = maxSize;
  //         }
  //       } else {
  //         if (height > maxSize) {
  //           width = width * (maxSize / height);
  //           height = maxSize;
  //         }
  //       }
  //       canvas.width = width;
  //       canvas.height = height;
  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0, width, height);
  //       canvas.toBlob(resolve);
  //     };
  //   });
  // };


  const handleSubmit = async (e) => {

    // console.log(modelName, "모델이름");
    e.preventDefault();
    if (isSubmitting.current) return; // 이미 제출 중이면 무시
    isSubmitting.current = true;
    setLoading(true);

    let modelFile = modelImage;
    if (!modelFile) {
      alert("모델 이미지를 찾을 수 없습니다.");
      setLoading(false);
      isSubmitting.current = false;
      return;
    }


    const currentModelName = modelName || (modelFile instanceof File ? modelFile.name : "model.png");
    // console.log(currentModelName, "모델 이름 확인"); // 여기서 확인 가능


    if ((clothType === "upper" || clothType === "combo" || clothType === "full") && !clothImage) {
      alert("상의 이미지를 찾을 수 없습니다.");
      setLoading(false);
      isSubmitting.current = false;
      return;
    }
    if ((clothType === "combo") && !lowerClothImage) {
      alert("하의 이미지를 찾을 수 없습니다.");
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

      // // 배경제거 , 색상 추출
      // const extractColor = async (file) => {
      //   try {
      //     // 배경 제거
      //     const resultBlob = await removeBackground(file);
      //     const resultURL = URL.createObjectURL(resultBlob);

      //     // ColorThief로 색상 추출
      //     return await new Promise((resolve) => {
      //       const img = new Image();
      //       img.src = resultURL;
      //       img.onload = () => {
      //         try {
      //           const colorThief = new ColorThief();
      //           const dominantColor = colorThief.getColor(img);
      //           resolve(dominantColor); // [R, G, B]
      //         } catch (err) {
      //           console.error(err);
      //           resolve(null);
      //         }
      //       };
      //     });
      //   } catch (err) {
      //     console.error(err);
      //     return null;
      //   }
      // };

      // const clothColor = clothImage ? await extractColor(clothImage) : null;
      // const lowerClothColor =
      //   clothType === "combo" && lowerClothImage
      //     ? await extractColor(lowerClothImage)
      //     : null;

      // db 저장
      const saveData = new FormData();

      saveData.append("taskId", taskId);
      saveData.append("cloth_type", clothType);
      saveData.append("model_image", modelFile);

      if (clothImage) saveData.append("cloth_image", clothImage);
      if (lowerClothImage) saveData.append("lower_cloth_image", lowerClothImage);

      saveData.append("memberId", memberId);
      saveData.append("ClosetCategory", closetCategory);
      if (lowerCategory) saveData.append("lowerCategory", lowerCategory);
      saveData.append("sex", sex);
      saveData.append("modelName", currentModelName);

      //색상
      // if (clothColor) {
      //   saveData.append("upperClothColorR", clothColor[0]);
      //   saveData.append("upperClothColorG", clothColor[1]);
      //   saveData.append("upperClothColorB", clothColor[2]);
      // }
      // if (lowerClothColor) {
      //   saveData.append("lowerClothColorR", lowerClothColor[0]);
      //   saveData.append("lowerClothColorG", lowerClothColor[1]);
      //   saveData.append("lowerClothColorB", lowerClothColor[2]);
      // }

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



  // 업로드용 색 추출 extractDominantColor
  // 이미지 업로드 시 색상 추출
  const handleUpperImageChange = async (e) => {
    const file = e.target.files[0];
    setClothImage(file);
    // setUpperColorLoading(true); // 로딩 시작
    // const color = await extractDominantColor(file);
    // setUpperColor(color);
    // setUpperColorLoading(false); // 로딩 끝
  };

  const handleLowerImageChange = async (e) => {
    const file = e.target.files[0];
    setLowerClothImage(file);
    // setLowerColorLoading(true);
    // const color = await extractDominantColor(file);
    // setLowerColor(color); // [R, G, B]
    // setLowerColorLoading(false);
  };

  // // 색상 추출 함수
  // const extractDominantColor = async (file) => {
  //   if (!file) return null;
  //   try {
  //     const smallBlob = await resizeImage(file, 200); // 리사이즈
  //     const resultBlob = await removeBackground(smallBlob); // 배경 제거
  //     const resultURL = URL.createObjectURL(resultBlob);

  //     return await new Promise((resolve) => {
  //       const img = new Image();
  //       img.crossOrigin = "anonymous";
  //       img.src = resultURL;

  //       img.onload = () => {
  //         try {
  //           const colorThief = new ColorThief();
  //           const dominantColor = colorThief.getColor(img);
  //           console.log("Dominant Color:", dominantColor); // ✅ 추가
  //           resolve(dominantColor);
  //         } catch (err) {
  //           console.error(err); // 여기서 에러가 찍힐 가능성 높음
  //           resolve(null);
  //         }
  //       };

  //       img.onerror = (e) => {
  //         console.error("Image load error:", e);
  //         resolve(null);
  //       };
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     return null;
  //   }
  // };




  // 옷장 모달에서 선택시
  const convertUrlToFile = async (url, name) => {
    const res = await caxios.get(`/fitroom/fetchImage?url=${encodeURIComponent(url)}`, { responseType: 'blob' });
    return new File([res.data], name || "cloth.png", { type: res.data.type });
  };

  // 옷 선택 핸들러 
  const handleSelectCloth = async (item) => {
    // 이름 결정: upperName > lowerName > name > "이름 없음"
    const clothName = item.upperName || item.lowerName || item.name || "이름 없음";

    const confirmed = window.confirm(`"${clothName}" 옷을 FitRoom에 적용하시겠습니까?`);
    if (!confirmed) return;

    if (clothType === "upper") {
      const file = await convertUrlToFile(item.upperImageUrl, item.upperName || item.name);
      setClothImage(file);

      // setUpperColorLoading(true);
      // const color = await extractDominantColor(file);
      // setUpperColor(color);
      // setUpperColorLoading(false);

    } else if (clothType === "combo") {
      // 상의
      if (item.upperImageUrl) {
        const file = await convertUrlToFile(item.upperImageUrl, item.upperName || item.name);
        setClothImage(file);

        // setUpperColorLoading(true);
        // const color = await extractDominantColor(file);
        // setUpperColor(color);
        // setUpperColorLoading(false);
      }
      // 하의
      if (item.lowerImageUrl) {
        const file = await convertUrlToFile(item.lowerImageUrl, item.lowerName || item.name);
        setLowerClothImage(file);

        // setLowerColorLoading(true);
        // const color = await extractDominantColor(file);
        // setLowerColor(color);
        // setLowerColorLoading(false);
      }

    }
    if (clothType === "full") {
      const imageUrl = item.upperImageUrl;
      if (imageUrl) {
        const file = await convertUrlToFile(imageUrl, item.name || item.upperName);
        setClothImage(file);
        setLowerClothImage(null);

        // setUpperColorLoading(true);
        // const color = await extractDominantColor(file);
        // setUpperColor(color);
        // setUpperColorLoading(false);

        // setLowerColorLoading(false);
        // setLowerColor(null);
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


  //옷장 모달 열기
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

  // 모델 선택 핸들러 
  const handleSelectModelModal = async (item) => {
    const confirmed = window.confirm(`"${item.modelName}" 모델을 적용하시겠습니까?`);
    if (!confirmed) return;

    try {
      const res = await caxios.get(
        `/fitroom/fetchImage?url=${encodeURIComponent(item.modelUrl)}`,
        { responseType: "blob" }
      );
      const file = new File([res.data], item.modelName, { type: res.data.type });
      setModelImage(file);
      setModelName(item.modelName);
    } catch (err) {
      console.error("모델 선택 실패:", err);
    }
  };

  //옷장 열기 MODAL
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

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton style={{ justifyContent: "center" }}>
          <Modal.Title style={{ textAlign: "center", flex: 1 }}>옷장 선택</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* 필터 선택 */}
          <div style={{ marginBottom: "10px" }}>
            <label>유형: </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ fontSize: "15px" }}
            >
              <option value="all">전체</option>
              <option value="upper">상의</option>
              <option value="lower">하의</option>
              <option value="full">한벌</option>
            </select>
          </div>

          {/* 옷장 아이템 */}
          <div className={styles.cardContainer}>
            {filteredData.map((item, idx) => (
              <div key={idx} className={styles.itemCard} onClick={() => handleSelectCloth(item)}>
                <div className={styles.imgWrapper}>
                  <img
                    src={item.upperImageUrl || item.lowerImageUrl || item.fullImageUrl}
                    alt={item.upperName || item.lowerName || item.name}
                  />
                </div>
                <div className={styles.textWrapper}>
                  <p>{item.upperName || item.lowerName || item.name}</p>
                  <span style={{ fontSize: "0.8em", color: "gray" }}>
                    {item.clothType === "upper"
                      ? "상의"
                      : item.clothType === "lower"
                        ? "하의"
                        : item.clothType === "full"
                          ? "한벌"
                          : null}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <p>원하는 옷을 선택하여 피팅룸에 추가해 보세요!😋</p>
          <Button className={styles.tab2ButtonStyle} onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  //  모델 모달 열기
  const openModelModal = async () => {
    try {
      const myRes = await caxios.get("/model/list", {
        params: { memberId }
      });
      const publicRes = await caxios.get("/model/publicList");

      setModelList([...publicRes.data, ...myRes.data]);
      setShowModelModal(true);
    } catch (err) {
      console.error("모델 데이터 불러오기 실패:", err);
    }
  };


  // 모델 불러오기 MODAL
  function ModelModal({ show, handleClose, modelData, onSelect }) {
    const [filterSex, setFilterSex] = useState("all"); // all / male / female

    // 성별 필터링
    const filteredData = modelData.filter((item) => {
      if (filterSex === "all") return true;
      return item.sex === filterSex;
    });

    const handleSelectModel = (item) => {
      onSelect(item); // 부모에 선택 전달
      handleClose();
    };

    return (
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton style={{ justifyContent: "center" }}>
          <Modal.Title style={{ textAlign: "center", flex: 1 }}>
            모델 선택
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* 필터 선택 */}
          <div style={{ marginBottom: "10px" }}>
            <label>성별: </label>
            <select
              value={filterSex}
              onChange={(e) => setFilterSex(e.target.value)}
              style={{ fontSize: "15px" }}
            >
              <option value="all">전체</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          {/* 모델 카드 */}
          <div className={styles.cardContainer}>
            {filteredData.map((item) => (
              <div
                key={item.seq}
                className={styles.itemCard}
                onClick={() => handleSelectModel(item)}
              >
                <div className={styles.imgWrapper}>
                  <img src={item.modelUrl} alt={item.modelName} />
                </div>

                <div className={styles.textWrapper}>
                  <p>{item.modelName}</p>
                  <span style={{ fontSize: "0.8em", color: "gray" }}>
                    {item.sex === "male" ? "남성" : "여성"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <p>원하는 모델을 선택하여 피팅룸에 적용해 보세요!🙂</p>
          <Button className={styles.tab2ButtonStyle} onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }




  //안내 열기 MODAL
  function TeachModal({ show, onHide }) {

    return (
      <Modal size="lg" show={show} onHide={onHide}>
        <Modal.Header closeButton style={{ justifyContent: "center" }}>
          <Modal.Title style={{ textAlign: "center", flex: 1 }}>피팅룸 사용법</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* 필터 선택 */}
          <div style={{ marginBottom: "10px" }}>
            <h3>추천 이미지 해상도: 512x512 ~ 2048x2048 픽셀 사이</h3>
          </div>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <h3>올바른 예시</h3>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <img
                src="/images/fitroom/올바른예시0.png"
                alt="올바른예시0"
                style={{ width: "200px", display: "block", marginBottom: "5px" }}
              />
              <span>정면 모델</span>

              <span style={{ fontSize: "20px" }}>⭕</span>
            </div>

            <div style={{ textAlign: "center" }}>
              <img
                src="/images/fitroom/올바른예시1.png"
                alt="올바른예시1"
                style={{ width: "200px", display: "block", marginBottom: "5px" }}
              />
              <span>단일 옷 </span>
              <span style={{ fontSize: "20px" }}>⭕</span>
            </div>

            <div style={{ textAlign: "center" }}>
              <img
                src="/images/fitroom/올바른예시2.png"
                alt="올바른예시2"
                style={{ width: "200px", display: "block", marginBottom: "5px" }}
              />
              <span>걸려있는 옷 </span>
              <span style={{ fontSize: "20px" }}>⭕</span>
            </div>
          </div>


          <div style={{ textAlign: "center" }}>
            <h3> 잘못된 예시 </h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <img
                src="/images/fitroom/잘못된예시1.png"
                alt="잘못된예시1"
                style={{ width: "200px", height: "180px", display: "block", marginBottom: "5px" }}
              />
              <span>여러 사람 </span>

              <span style={{ fontSize: "20px" }}>❌</span>
            </div>

            <div style={{ textAlign: "center" }}>
              <img
                src="/images/fitroom/잘못된예시2.png"
                alt="잘못된예시2"
                style={{ width: "200px", height: "180px", display: "block", marginBottom: "5px" }}
              />
              <span>접힌 옷 </span>

              <span style={{ fontSize: "20px" }}>❌</span>
            </div>

            <div style={{ textAlign: "center" }}>
              <img
                src="/images/fitroom/잘못된예시3.png"
                alt="잘못된예시3"
                style={{ width: "200px", height: "180px", display: "block", marginBottom: "5px" }}
              />
              <span>옷 뒤쪽 </span>

              <span style={{ fontSize: "20px" }}>❌</span>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <p>⭐궁금한 점이 있으시다면 우측 하단의 채팅 봇을 이용해보세요!⭐</p>
          <Button className={styles.tab2ButtonStyle} onClick={onHide}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }


  return (

    <div style={{ fontSize: "20px" }}>

      {/* 안내 모달 */}


      <h1 style={{ textAlign: "center" }}>FitRoom</h1>

      {/* 도움말 MODAL */}
      <div>
        <button style={{ cursor: "pointer", float: "left" }} onClick={() => setTeachModalShow(true)} className={styles.tab2ButtonStyle} > 도움말 </button>
        <TeachModal show={teachModalShow} onHide={() => setTeachModalShow(false)} />
      </div>


      <ModelModal
        show={showModelModal}
        handleClose={() => setShowModelModal(false)}
        modelData={modelList}
        onSelect={handleSelectModelModal}
      />

      <ClosetModal
        show={showClosetModal}
        handleClose={() => setShowClosetModal(false)}
        closetData={closetData}
        onSelect={handleSelectCloth}
      />

      <form className={styles.container} onSubmit={handleSubmit}>
        {/* 모델 업로드 */}
        <div className={styles["modelbox"]}>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "7px" }}>
            <label>성별:</label>
            <select value={sex} onChange={(e) => setSex(e.target.value)} style={{ fontSize: "15px" }}>
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
          {/* 모델 MODAL */}
          <button type="button" onClick={openModelModal} className={styles.tab2ButtonStyle} style={{ marginTop: "15px" }}>
            모델 열기
          </button>
        </div>


        <div className={styles["clothesbox"]}>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>

            <div>
              <label>유형:</label>
              <select value={clothType} onChange={(e) => setClothType(e.target.value)} style={{ fontSize: "15px" }}>
                <option value="upper">상의</option>
                <option value="combo">상하의</option>
                <option value="full">한벌</option>
              </select>
            </div>

            {(clothType === "full") && (
              <div style={{ marginLeft: "10px" }}>
                <label>한벌:</label>
                <select value={closetCategory} onChange={(e) => setClosetCategory(e.target.value)} style={{ fontSize: "15px" }}>
                  <option value="coat">코트</option>
                  <option value="dress">드레스</option>
                  <option value="etc">기타</option>
                </select>
              </div>
            )}

            {(clothType === "upper" || clothType === "combo") && (
              <div style={{ marginLeft: "10px" }}>
                <label>상의:</label>
                <select value={closetCategory} onChange={(e) => setClosetCategory(e.target.value)} style={{ fontSize: "15px" }}>
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
                <label>하의:</label>
                <select value={lowerCategory} onChange={(e) => setLowerCategory(e.target.value)} style={{ fontSize: "15px" }}>
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
                    <div className={styles["upload-box"]} style={{ fontSize: "30px" }} >상의 업로드</div>
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

          </div>
          {/* 옷장 MODAL */}
          <button type="button" onClick={openClosetModal} className={styles.tabButtonStyle}>
            옷장 열기
          </button>

          <button
            type="submit"
            disabled={loading}
            className={styles.tab4ButtonStyle}
            style={{ width: "40%", fontSize: "30px", marginTop: "20px" }}
          >
            {loading ? "로딩중..." : "시작"}
          </button>

        </div>

        {/* 결과 이미지 */}
        <div className={styles["resultbox"]}>
          {(resultImage) && (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h3>완성 이미지</h3>
              <img
                src={resultImage}
                alt="완성 이미지"
                className={styles["upload-preview"]}
              />

              {/* 공유 버튼 */}
              <div style={{ marginTop: "20px" }}>
                <ShareButton
                  imageUrl={resultImage} // ShareButton에서 사용할 이미지 URL
                />
              </div>
            </div>
          )}
        </div>


      </form >

      {/*  회색화면 */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div style={{ textAlign: "center" }}>
            <Spinner animation="border" role="status" />
            <div style={{ marginTop: "10px", fontSize: "20px" }}>
              FitRoom 작업 중입니다...
            </div>
          </div>
        </div>
      )}



    </div >


  );


}

export default FitRoomMain;
