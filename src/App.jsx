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
            <iframe
              src="/drishti/index.html"
              className="w-full border-none"
              style={{ height: "calc(100vh - 56px)", marginTop: "56px" }}
              title="Drishti"
            />
          }
        />

        {/* Authority Routes */}
        <Route path="/authority-login" element={<AuthorityLogin />} />
        <Route path="/authority" element={<AuthorityDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}