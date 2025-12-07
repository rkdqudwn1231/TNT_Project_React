import { Routes, Route } from "react-router-dom";
import PersonalBody from "./PersonalBody";
import BodyAnalyzerMain from "./BodyAnalyzer/BodyAnalyzerMain";
import BodyAnalyzerSurvery from "./BodyAnalyzer/BodyAnalyzerSurvery";
import BodyAnalyzerResult from "./BodyAnalyzer/BodyAnalyzerResult";
import BodyAnalyzerSize from "./BodyAnalyzer/BodyAnalyzerSize";
import BodyAnalyzerImg from "./BodyAnalyzer/BodyAnalyzerImg";

function PersonalBodyRoute() {

  return (

    <Routes>

      <Route index element={<PersonalBody />} />
      <Route path="main" element={<BodyAnalyzerMain />} />
      <Route path="img" element={<BodyAnalyzerImg />} />
      <Route path="survery" element={<BodyAnalyzerSurvery />} />
      <Route path="size" element={<BodyAnalyzerSize />} />
      <Route path="result" element={<BodyAnalyzerResult />} />
      
    </Routes>
  );
}

export default PersonalBodyRoute;