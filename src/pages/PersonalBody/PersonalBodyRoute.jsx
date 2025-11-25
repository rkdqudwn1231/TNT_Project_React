import { Routes, Route } from "react-router-dom";
import PersonalBody from "./PersonalBody";
import ImgTest from "./Test/ImgTest";
import TestMain from "./Test/TestMain";

function PersonalBodyRoute() {

  return (

    <Routes>

      <Route index element={<PersonalBody />} />
      <Route path="test" element={<TestMain />} />
      <Route path="img" element={<ImgTest />} />

    </Routes>
  );
}

export default PersonalBodyRoute;