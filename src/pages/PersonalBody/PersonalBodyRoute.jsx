import { Routes, Route } from "react-router-dom";
import PersonalBody from "./PersonalBody";
import PersonalBodyTest from "./PersonalBodyTest";

function PersonalBodyRoute() {

  return (

    <Routes>

      <Route index element={<PersonalBody />} />
      <Route path="test" element={<PersonalBodyTest />} />

    </Routes>
  );
}

export default PersonalBodyRoute;