// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import ComplaintForm from "./components/ComplaintForm";
import AuthorityDashboard from "./components/authorityDashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
          },
        }}
      />
      <Navbar />
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/home" element={<Home />} />
  <Route path="/map" element={<Map />} />
  <Route path="/report" element={<ComplaintForm />} />
  <Route path="/dashboard" element={<AuthorityDashboard />} />
</Routes>
    </BrowserRouter>
  );
}
