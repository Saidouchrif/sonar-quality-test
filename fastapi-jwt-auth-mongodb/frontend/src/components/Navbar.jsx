import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 group">
            <span className="text-2xl">🔐</span>
            <span className="font-bold text-xl text-white group-hover:text-yellow-300 transition-colors">
              FastAPI Auth
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/home"
              className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              Accueil
            </Link>
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700 px-6 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white hover:bg-red-600 px-6 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md"
              >
                Déconnexion
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 bg-opacity-95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/home"
              onClick={() => setIsMenuOpen(false)}
              className="block text-white hover:bg-white hover:bg-opacity-20 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Accueil
            </Link>
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white hover:bg-white hover:bg-opacity-20 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700 px-4 py-3 rounded-lg transition-all duration-200 font-semibold text-center"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-red-500 text-white hover:bg-red-600 px-4 py-3 rounded-lg transition-all duration-200 font-semibold"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
