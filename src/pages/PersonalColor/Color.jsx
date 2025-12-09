import { Routes, Route } from "react-router-dom";
import PersonalColor from "./personalColor";
import ColorResult from "./ColorResult";
import ColorAbout from "./ColorAbout";


function Color(){
    return(
        <Routes>
            <Route index element={<PersonalColor/>}/>
             <Route path="result" element={<ColorResult/>} />
             <Route path="about" element={<ColorAbout/>}/>
         
        </Routes>
    );
}

    export default Color;