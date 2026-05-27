import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import Credits from "./pages/Credits";
import ChatBox from "./components/ChatBox";
import Community from "./pages/Community";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadingUser } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading" || loadingUser) return <Loading />;

  return (
    <>
      <Toaster />
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      {user ? (
        // Authenticated layout — dark gradient background covers entire viewport
        <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1020] dark:to-[#0a0010] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
              <Route path="/loading" element={<Loading />} />
            </Routes>
          </div>
        </div>
      ) : (
        // Login screen — full viewport with centered card
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-b dark:from-[#1a1020] dark:to-[#0a0010]">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
