import React, { useEffect, useState } from "react";

import { caxios } from "../../../config/config";
import styles from "./History.module.css"; // 현재 폴더 기준

function History() {

    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const Historylist = async () => {
            try {
                const res = await caxios.get("/history/list");
                setHistoryData(res.data);
            } catch (err) {
                console.error(err);

            }
        };

        Historylist();
    }, []);

    // 날짜별 그룹화
    const groupedByDate = historyData.reduce((acc, item) => {

        const d = new Date(item.saveDate);   // ISO 문자열을 Date 객체로 변환
        const date = d.toISOString().split("T")[0]; // "YYYY-MM-DD"

        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {});

    // 같은 날짜 안에서 시간순 정렬
    Object.keys(groupedByDate).forEach(date => {
        groupedByDate[date].sort(
            (a, b) => new Date(a.saveDate) - new Date(b.saveDate)
        );
    });

    // 날짜 그룹 최신순 정렬
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <h1> 기록 내역 </h1>
            {sortedDates.map(date => (
                <div key={date}>
                    <h2>{date}</h2>
                    <div className="cardContainer">
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {groupedByDate[date].map(item => {

                                const day = new Date(item.saveDate);
                                const time = day.toTimeString().split(" ")[0]; // HH:MM:SS
                                return (

                                    <div key={item.seq} className={styles.itemCard}>
                                        {/* 큰 이미지 */}
                                        <img src={item.resultUrl} className={styles.mainImg} />

                                        {/* 작은 이미지 오버레이 */}
                                        <div className={styles.overlayImages}>
                                            <img src={`data:image/png;base64,${item.upperImageUrl}`} className={styles.smallImg} />
                                            {item.lowerImageUrl &&
                                                <img src={`data:image/png;base64,${item.lowerImageUrl}`} className={styles.smallImg} />
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                            {/* map */}
                        </div>
                    </div>
                </div>
            ))}



            
        </div>
    );
}

export default History;
