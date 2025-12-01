import { Routes, Route } from "react-router-dom";
import PersonalBody from "./PersonalBody";
import BodyAnalyzerImg from "./BodyAnalyzer/BodyAnalyzerImg";
import BodyAnalyzerMain from "./BodyAnalyzer/BodyAnalyzerMain";
import BodyAnalyzerSurvery from "./BodyAnalyzer/BodyAnalyzerSurvery";

function PersonalBodyRoute() {

  return (

    <Routes>

      <Route index element={<PersonalBody />} />
      <Route path="main" element={<BodyAnalyzerMain />} />
      <Route path="img" element={<BodyAnalyzerImg />} />
      <Route path="survery" element={<BodyAnalyzerSurvery />} />

    </Routes>
  );
}

export default PersonalBodyRoute;