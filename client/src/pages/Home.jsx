import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaMoon, FaSun } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => fetchEvents(), 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const scrollToEvents = () => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className={`${darkMode 
            ? 'bg-[#050507] text-white' 
            : 'bg-[#f6f6f9] text-[#0a0a14]'} min-h-screen transition-all duration-700 flex flex-col relative overflow-hidden`}>

           
            <div className="fixed inset-0 pointer-events-none">
                {darkMode ? (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#6d28d9]/20 rounded-full blur-[150px]"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#0ea5e9]/15 rounded-full blur-[150px]"></div>
                        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-[#ec4899]/10 rounded-full blur-[130px]"></div>
                    </>
                ) : (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full blur-[150px]"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[150px]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.3]"></div>
                    </>
                )}
            </div>

           
            <div className="relative z-10 flex justify-end p-6">
                <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all ${darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-black/5 border-black/10 text-black'}`}>
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>
            </div>

            {/* HERO */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className={`relative z-10 mx-4 md:mx-8 rounded-[2.5rem] overflow-hidden border ${darkMode ? 'bg-[#0f0f12]/80 border-white/10' : 'bg-white/70 border-black/5'} backdrop-blur-2xl shadow-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                <div className="relative p-10 md:p-20 text-center flex flex-col items-center">
                    <span className={`backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase mb-6 border ${darkMode ? 'bg-white/10 border-white/20 text-gray-300' : 'bg-black/5 border-black/10 text-gray-600'}`}>Welcome to Eventora</span>
                    <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight mb-6">Find Your Next <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">Unforgettable</span> Experience</h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg mb-10 max-w-2xl`}>Tech conferences, music festivals, and workshops near you - all in one dark light universe.</p>
                    <div className="w-full max-w-2xl relative">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="text" placeholder="Search events by title..." className={`w-full pl-14 pr-6 py-4 rounded-full text-[15px] font-medium focus:outline-none transition-all ${darkMode ? 'bg-[#1a1a1f] text-white border border-white/10 placeholder-gray-500 focus:border-violet-500/50' : 'bg-white text-black border border-black/10 shadow-lg placeholder-gray-400'}`} value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
            </motion.div>

          
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto w-full mt-8 px-4">
                {[
                    { icon: <FaRegClock />, title: "Fast Booking", desc: "Secure tickets instantly with ultra-fast infrastructure built for speed.", action: scrollToEvents },
                    { icon: <FaTicketAlt />, title: "Seamless Access", desc: "Download or manage all tickets from your personal dashboard.", action: () => navigate('/dashboard') },
                    { icon: <FaShieldAlt />, title: "Secure Platform", desc: "Protected by 256-bit SSL, JWT Auth & 2FA OTP security.", action: () => alert('🔒 Secure') }
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} whileHover={{ y: -6 }} onClick={c.action} className={`p-8 rounded-[1.8rem] border backdrop-blur-xl cursor-pointer group ${darkMode ? 'bg-[#121216]/80 border-white/[0.08] hover:border-violet-500/30 hover:bg-[#18181d]' : 'bg-white/80 border-black/5 hover:border-violet-300 shadow-sm hover:shadow-xl'} transition-all`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>{c.icon}</div>
                        <h3 className="font-bold text-[16px] mb-2">{c.title}</h3>
                        <p className={`text-[13px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* EVENTS */}
            <div id="events-section" className="relative z-10 max-w-7xl mx-auto w-full mt-16 px-4 pb-20">
                <h2 className="text-3xl font-black mb-8 tracking-tight">Upcoming Events <span className={`ml-3 text-xs font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-white/10' : 'bg-black/5'}`}>{events.length}</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map((event, idx) => (
                        <motion.div key={event._id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} className={`rounded-[1.5rem] overflow-hidden border backdrop-blur-xl group ${darkMode ? 'bg-[#121216] border-white/5 hover:border-white/15' : 'bg-white border-black/5 hover:shadow-xl'} transition-all`}>
                            <div className="h-48 relative overflow-hidden">
                                <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="" />
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur ${event.ticketPrice === 0 ? 'bg-green-500 text-white' : 'bg-white text-black'}`}>{event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}</div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold">{event.title}</h3>
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>📍 {event.location}</p>
                                <Link to={`/events/${event._id}`} className={`mt-4 block text-center text-xs font-bold py-2.5 rounded-full border transition ${darkMode ? 'border-white/10 hover:bg-white hover:text-black' : 'border-black/10 hover:bg-black hover:text-white'}`}>View Details</Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;