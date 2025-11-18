import React, { useEffect, useState, useRef } from "react";
import caxios from "../../../config/config";

function Model() {

 const [modelData, setModelData] = useState([]);
 
     useEffect(() => {
         const Modellist = async () => {
             try {
                 const res = await caxios.get("/model/list");
                 setModelData(res.data);
             } catch (err) {
                 console.error(err);
                
             }
         };
 
         Modellist();
     }, []);
 
     return(
           <div>
             {modelData.map(item => (
                 <div key={item.seq} style={{float:"left"}}>
                     <p>{item.name}</p>
                     {/* 이미지 뽑을때 db에 있는 url은 항상 base64로 변환해서 뽑아야 이미지로 나옴! */}
                     <img src={`data:image/png;base64,${item.modelUrl}`} /> 
                     <p>{item.modelName}</p>
                   
                 </div>
             ))}
         </div>
     )

}

export default Model;