import { useState } from "react";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulamos un login sencillo
    if (email === "test@gmail.com" && password === "123") {
      alert("¡Login exitoso!");
    } else {
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8">
        <h1 className="text-4xl font-bold text-white text-center tracking-wider">
          Log In
        </h1>
        <form onSubmit={handleLogin} className="space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;