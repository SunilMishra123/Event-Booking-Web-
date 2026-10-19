import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaTicketAlt, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { darkMode, setDarkMode } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`sticky top-0 z-50 backdrop-blur-2xl border-b transition-all duration-500 ${darkMode ? 'bg-[#0a0a0f]/70 border-white/10' : 'bg-white/70 border-black/5 shadow-sm'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className={`text-xl font-black flex items-center gap-2.5 tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            <FaTicketAlt className="text-sm" />
                        </div>
                        Eventora
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <Link to="/" className={`text-sm font-medium transition hover:opacity-70 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Events</Link>
                        
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className={`text-sm font-medium transition hover:opacity-70 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dashboard</Link>
                                <button onClick={handleLogout} className={`text-sm px-4 py-2 rounded-full font-semibold border transition ${darkMode ? 'bg-white/10 border-white/10 hover:bg-white hover:text-black' : 'bg-black/5 border-black/10 hover:bg-black hover:text-white'}`}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={`text-sm font-medium transition hover:opacity-70 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Login</Link>
                                <Link to="/register" className={`text-sm px-5 py-2.5 rounded-full font-bold transition ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>Sign Up</Link>
                            </>
                        )}

                        {/* DARK-LIGHT TOGGLE */}
                        <button 
                            onClick={() => setDarkMode(!darkMode)} 
                            className={`w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur transition-all active:scale-90 ${darkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-black' : 'bg-black/5 border-black/10 text-black hover:bg-black hover:text-white'}`}
                        >
                            {darkMode ? <FaSun className="text-[13px]" /> : <FaMoon className="text-[13px]" />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;