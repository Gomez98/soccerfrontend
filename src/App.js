import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import About from "./pages/About";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Student from "./pages/Student";
import Representative from "./pages/Representative";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<Student />} />
          <Route path="/representative" element={<Representative />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}