import { useState } from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("decoded");
    localStorage.removeItem("tokenData");
    window.dispatchEvent(new Event('storage'));
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8">
        <h1 className="text-4xl font-bold text-white text-center tracking-wider">
          Log Out
        </h1>
        
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Logout;