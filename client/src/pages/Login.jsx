import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(()=>{ setEmail(''); setPassword(''); },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError("Email id is required *"); return; }
        if (!password) { setError("Password is required *"); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter valid Email id"); return; }
        
        setLoading(true); setError('');
        try {
            const data = await login(email.trim(), password);
            navigate(data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) { setError(err.message || "Login failed"); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-[80vh] flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-[#fffaf0] p-8 rounded-[28px] border shadow-xl">
                <h2 className="text-3xl font-black text-center text-black">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-6">All fields required *</p>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-medium">{error}</div>}
                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
                    <div><label className="text-sm font-bold text-black">Email *</label>
                        <input type="text" placeholder="Enter email id" value={email} onChange={e=>setEmail(e.target.value)} required
                        className="w-full mt-2 px-4 py-3 rounded-xl border bg-white text-black placeholder:text-gray-400 outline-none" style={{color:'#000'}} readOnly onFocus={e=>e.target.removeAttribute('readOnly')} />
                    </div>
                    <div><label className="text-sm font-bold text-black">Password *</label>
                        <input type="password" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} required
                        className="w-full mt-2 px-4 py-3 rounded-xl border bg-white text-black placeholder:text-gray-400 outline-none" style={{color:'#000', backgroundColor:'#fff'}} readOnly onFocus={e=>e.target.removeAttribute('readOnly')} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold">{loading ? "Signing..." : "Sign In"}</button>
                </form>
            </div>
        </div>
    );
};
export default Login;