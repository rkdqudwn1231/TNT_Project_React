import React, { useEffect, useState } from "react";
import { caxios } from "../../config/config";

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

    return (
        <div>
            {Object.entries(groupedByDate).map(([date, items]) => (
                <div key={date} style={{ marginBottom: "20px",float:"left" }} >
                    <h2>{date}</h2>
                    <div style={{ display: "flex", gap: "10px" }}>
                        {items.map(item => {

                            const day = new Date(item.saveDate);
                            const time = day.toTimeString().split(" ")[0]; // HH:MM:SS
                            return (
                                <div key={item.seq}>

                                    <img src={item.resultUrl} width={200} />
                                    
                                    <p style={{ fontSize: "25px" }}> {item.name} </p>
                                  
                                </div>
                                
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default History;
