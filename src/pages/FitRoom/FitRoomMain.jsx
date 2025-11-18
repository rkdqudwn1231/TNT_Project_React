import axios from "axios";
import React, { useState, useRef } from "react";
import { caxios } from "../../config/config";
import { useNavigate } from "react-router-dom";

function FitRoomMain() {

  const [modelImage, setModelImage] = useState(null);
  const [clothImage, setClothImage] = useState(null);
  const [lowerClothImage, setLowerClothImage] = useState(null);
  const [clothType, setClothType] = useState("upper");
  const [resultImage, setResultImage] = useState(null); // 완성 이미지 URL
  const [loading, setLoading] = useState(false);


  const isSubmitting = useRef(false); // 중복 요청 방지

  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) return; // 이미 제출 중이면 무시
    isSubmitting.current = true;
    setLoading(true);

    console.log("aaa");

    if (!modelImage) {
      alert("모델 이미지를 선택하세요!");
      setLoading(false);
      isSubmitting.current = false;
      return;
    }
    if ((clothType === "upper" || clothType === "combo" || clothType === "full") && !clothImage) {
      alert("상의 또는 전체 옷 이미지를 선택하세요!");
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
      // api 실행 
      const res = await caxios.post("/fitroom/wear", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // 결과
      const resultUrl = res.data.imageUrl;


      // 결과 데이터 관리
      setResultImage(resultUrl); // 서버에서 반환한 최종 이미지 URL

      const saveData = new FormData();
      saveData.append("image_url", resultUrl);       // 합성 결과 URL
      saveData.append("cloth_type", clothType);
      saveData.append("model_image", modelImage);    // 실제 파일 그대로
      if (clothImage) saveData.append("cloth_image", clothImage);
      if (lowerClothImage) saveData.append("lower_cloth_image", lowerClothImage);
      saveData.append("memberId", "맴버임시");
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
    <div style={{ margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>모델 이미지:</label>
          <input type="file" accept="image/*" onChange={(e) => setModelImage(e.target.files[0])} />
          {modelImage && <img src={URL.createObjectURL(modelImage)} alt="모델 미리보기" style={{ width: 150 }} />}
        </div>

        {(clothType === "upper" || clothType === "full") && (
          <div>
            <label>상의 이미지:</label>
            <input type="file" accept="image/*" onChange={(e) => setClothImage(e.target.files[0])} />
            {clothImage && <img src={URL.createObjectURL(clothImage)} alt="상의 미리보기" style={{ width: 150 }} />}
          </div>
        )}


        {(clothType === "combo") && (
          <>
            <div>
              <label>상의 이미지:</label>
              <input type="file" accept="image/*" onChange={(e) => setClothImage(e.target.files[0])} />
              {clothImage && <img src={URL.createObjectURL(clothImage)} alt="상의 미리보기" style={{ width: 150 }} />}
            </div>
            <div>
              <label>하의 이미지:</label>
              <input type="file" accept="image/*" onChange={(e) => setLowerClothImage(e.target.files[0])} />
              {lowerClothImage && <img src={URL.createObjectURL(lowerClothImage)} alt="하의 미리보기" style={{ width: 150 }} />}
            </div>
          </>
        )}

        <div>
          <label>옷 타입:</label>
          <select value={clothType} onChange={(e) => setClothType(e.target.value)}>
            <option value="upper">상의</option>
            <option value="combo">상하의</option>
            <option value="full">한벌</option>
          </select>
          <button type="submit" disabled={loading} style={{marginLeft:"30px"}}>
          {loading ? "업로드 중..." : "전송"}
        </button>
        </div>

      </form>


      {resultImage && (
        <div>
          <h3>완성 이미지:</h3>
          <img src={resultImage} alt="완성 이미지" style={{ width: 300 }} />
        </div>
      )}
      <button onClick={() => navigate("closet")}>임시 옷장 페이지</button>
      <button onClick={() => navigate("model")}>임시 모델 페이지</button>
      <button onClick={() => navigate("history")}>임시 기록 페이지</button>

    </div>
  );
}

export default FitRoomMain;
