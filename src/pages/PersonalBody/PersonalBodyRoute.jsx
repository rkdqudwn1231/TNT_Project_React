import { Routes, Route } from "react-router-dom";
import PersonalBody from "./PersonalBody";
import BodyAnalyzerImg from "./BodyAnalyzer/BodyAnalyzerImg";
import BodyAnalyzerMain from "./BodyAnalyzer/BodyAnalyzerMain";

function PersonalBodyRoute() {

  return (

    <Routes>

      <Route index element={<PersonalBody />} />
      <Route path="main" element={<BodyAnalyzerMain />} />
      <Route path="img" element={<BodyAnalyzerImg />} />

    </Routes>
  );
}

export default PersonalBodyRoute;