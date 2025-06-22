import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  let links = [];
  if (user.role === "admin") {
    links = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/historique", label: "Historique" },
    ];
  } else if (user.role === "conducteur") {
    links = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/historique", label: "Historique" },
    ];
  } else if (user.role === "expediteur") {
    links = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/annonces", label: "Chercher Annonces" },
      { to: "/historique", label: "Historique" },
    ];
  }

  const profileLinks = [
    { to: "/profile", label: "Profil" },
    { to: "/notifications", label: "Notifications" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const linkClass = "block py-2 px-3 text-[#fdf6e3] rounded hover:bg-opacity-75 md:hover:bg-transparent md:border-0 md:hover:text-[#f4c542] md:p-0 transition-colors duration-300";
  const activeLinkClass = "block py-2 px-3 text-[#f4c542] bg-black bg-opacity-20 rounded md:bg-transparent md:text-[#f4c542] md:p-0 font-bold";

  return (
    <nav className="bg-[#2a6f97] border-b-2 border-[#f4c542] shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#fdf6e3] font-serif">TransportConnect</span>
        </Link>
        
        <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
            <span className="text-gray-200 text-sm hidden sm:block">Bonjour, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-[#c1272d] hover:bg-opacity-90 text-white px-4 py-2 rounded-lg font-bold transition-transform duration-200 hover:scale-105"
            >
              Déconnexion
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-200 rounded-lg md:hidden hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-controls="navbar-default"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
        </div>

        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-blue-400 rounded-lg bg-[#2a6f97] md:bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => isActive ? activeLinkClass : linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {profileLinks.map((link) => (
               <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => isActive ? activeLinkClass : linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
