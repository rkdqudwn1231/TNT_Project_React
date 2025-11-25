import { Routes, Route } from "react-router-dom";
import PersonalColor from "../PersonalColor/personalColor";
import ColorResult from "../PersonalColor/ColorResult";

function Color(){
    return(
        <Routes>
            <Route index element={<PersonalColor/>}/>
             <Route path="result" element={<ColorResult />} />
        </Routes>
    );
}

    export default Color;