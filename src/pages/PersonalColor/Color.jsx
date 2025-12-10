import { Routes, Route } from "react-router-dom";
import PersonalColor from "./personalColor";
import ColorResult from "./ColorResult";
import ColorAbout from "./ColorAbout";
import NotFoundRedirect from "../Common/NotFoundRedirect"

function Color() {
    return (
        <Routes>
            <Route index element={<PersonalColor />} />
            <Route path="result" element={<ColorResult />} />
            <Route path="about" element={<ColorAbout />} />
            <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
    );
}

export default Color;