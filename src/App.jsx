// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import ComplaintForm from "./components/ComplaintForm";
import AuthorityDashboard from "./components/AuthorityDashboard";
import Login from "./pages/Login";

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
        <Route path="/" element={<Map />} />
        <Route path="/report" element={<ComplaintForm />} />
        <Route path="/dashboard" element={<AuthorityDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
