import React, { useState, useRef, useEffect } from "react";
import caxios from "../../../config/config";

function Closet() {
    const [clothType, setClothType] = useState("upper");
    const [closetData, setClosetData] = useState([]);

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

    return (
        <div>
            <div>
                <select value={clothType} onChange={(e) => setClothType(e.target.value)}>
                    <option value="upper">상의</option>
                    <option value="lower">하의</option>
                </select>
            </div>
            {closetData.map(item => (
                <div key={item.seq}>
                    {/* 이미지 뽑을때 db에 있는 url은 항상 base64로 변환해서 뽑아야 이미지로 나옴! */}

                    {(clothType === "upper" || clothType === "full") && (
                        <>
                            <img src={`data:image/png;base64,${item.upperImageUrl}`} />
                            <p>{item.upperName}</p>
                        </>
                    )}

                    {(clothType === "lower") && (
                        <>
                            <img src={`data:image/png;base64,${item.lowerImageUrl}`} />
                            <p>{item.lowerName}</p>
                        </>)}


                </div>
            ))}
        </div>
    )
}

export default Closet;