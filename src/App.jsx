import React, { useContext, useEffect, useState } from "react";

import MainPage from "./MainPage";
import LandingPage from "./pages/LandingPage";
import {
  createBrowserRouter,
  Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import TVStaticEffect from "./pages/TVStaticEffect";
import CustomCursor from "./components/CustomCursor";
import Footer from "./pages/Footer";
import Signup from "./components/Auth/Signup";
import HoverEffect from "./components/HoverEffect";
const App = () => {
  const [xAxis, setXAxis] = useState();
  const [yAxis, setYAxis] = useState();

  return (
    <BrowserRouter>
      <CustomCursor x={xAxis} y={yAxis} />
      <div
        onMouseMove={(e) => {
          setXAxis(e.clientX);
          setYAxis(e.clientY);
        }}
        className="relative appContainer"
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        {/* <HoverEffect /> */}
        <Footer />
      </div>
      <TVStaticEffect />
    </BrowserRouter>
  );
};

export default App;
