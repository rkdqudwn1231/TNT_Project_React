import React, { useState, useRef, useEffect } from "react";
import styles from "./FitRoomMain.module.css"
import { caxios } from "../../config/config";
import ColorThief from "colorthief";
import { removeBackground } from "@imgly/background-removal";

import { useNavigate } from "react-router-dom";

function FitRoomMain() {

  const [modelImage, setModelImage] = useState(null);
  const [clothImage, setClothImage] = useState(null);
  const [lowerClothImage, setLowerClothImage] = useState(null);
  const [sex, setSex] = useState("male");
  const [clothType, setClothType] = useState("upper");
  const [closetCategory, setClosetCategory] = useState("etc");
  const [lowerCategory, setLowerCategory] = useState("etc");
  const [resultImage, setResultImage] = useState(null); // 완성 이미지 URL
  const [loading, setLoading] = useState(false);



  const isSubmitting = useRef(false); // 중복 요청 방지

  const navigate = useNavigate();

  const memberId = sessionStorage.getItem("id");

  const [checkedLogin, setCheckedLogin] = useState(false);

  useEffect(() => {
    if (!checkedLogin) {
      if (!memberId) {

        navigate("/login");
      }
      setCheckedLogin(true); // 다시 실행 방지
    }
  }, [memberId, navigate, checkedLogin]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return; // 이미 제출 중이면 무시
    isSubmitting.current = true;
    setLoading(true);


    if (!modelImage) {
      alert("모델 이미지를 추가하세요!");
      setLoading(false);
      isSubmitting.current = false;
      return;
    }
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
    if (modelImage) formData.append("model_image", modelImage);
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
      saveData.append("model_image", modelImage);    // 실제 파일 그대로
      if (clothImage) saveData.append("cloth_image", clothImage);
      if (lowerClothImage) saveData.append("lower_cloth_image", lowerClothImage);
      saveData.append("memberId", memberId);
      saveData.append("ClosetCategory", closetCategory);
      if (lowerCategory) saveData.append("lowerCategory", lowerCategory);
      saveData.append("sex", sex);

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
                src={URL.createObjectURL(modelImage)}
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
                  onChange={(e) => setClothImage(e.target.files[0])}
                />
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
                    onChange={(e) => setClothImage(e.target.files[0])}
                  />
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
                    onChange={(e) => setLowerClothImage(e.target.files[0])}
                  />
                </div>


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
            {loading ? "업로드 중..." : "전송"}
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
