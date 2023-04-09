import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import WorkFlow from "./pages/WorkFlow";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workflow/:id" element={<WorkFlow />} />
      </Routes>
    </div>
  );
}

export default App;
