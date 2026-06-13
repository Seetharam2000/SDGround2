import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div className="text-white pt-20 text-center">Map coming soon</div>} />
        <Route path="/report" element={<div className="text-white pt-20 text-center">Report form coming soon</div>} />
        <Route path="/dashboard" element={<div className="text-white pt-20 text-center">Dashboard coming soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}