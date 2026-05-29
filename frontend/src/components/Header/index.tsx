import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <nav style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: 12 }}>
          Home
        </Link>

        <Link to="/about" style={{ marginRight: 12 }}>
          About Us
        </Link>

        <Link to="/pano" style={{ marginRight: 12 }}>
          Pano
        </Link>

        <Link to="/cs16">
          Map
        </Link>
      </nav>
    </>
  );
}
