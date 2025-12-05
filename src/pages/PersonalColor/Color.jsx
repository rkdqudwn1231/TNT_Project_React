import { Routes, Route } from "react-router-dom";
import PersonalColor from "./personalColor";
import ColorResult from "./ColorResult";
import Colortest from "./Colortest";


function Color(){
    return(
        <Routes>
            <Route index element={<PersonalColor/>}/>
             <Route path="result" element={<ColorResult/>} />
             <Route path="test" element={<Colortest/>}/>
         
        </Routes>
    );
}

    export default Color;