// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Map from "./components/Map";
import ComplaintForm from "./components/ComplaintForm";
import AuthorityDashboard from "./components/authorityDashboard";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AuthorityLogin from "./pages/AuthorityLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#ffffff",
            border: "1px solid #1f1f1f",
          },
        }}
      />

      <Navbar />

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/report" element={<ComplaintForm />} />

        {/* Drishti */}
        <Route
          path="/drishti"
          element={
            <div style={{
              position: "fixed",
              top: "56px",
              left: 0,
              right: 0,
              bottom: 0,
            }}>
              <iframe
                src="/drishti/index.html"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                }}
                title="Drishti"
              />
            </div>
          }
        />

        {/* Authority Routes */}
        <Route path="/authority-login" element={<AuthorityLogin />} />
        <Route path="/authority" element={<AuthorityDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}