import { Routes, Route, Navigate } from "react-router";
import Dashboard from "@/view/pages/Dashboard";
import About from "@/view/pages/About";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
