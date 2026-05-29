import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/index";
import About from "./pages/About/index";
import Pano from "./pages/Pano/index";
import Map from "./pages/Map/index";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/pano" element={<Pano />} />
      <Route path="/cs16" element={<Map />} />
    </Routes>
  );
}
