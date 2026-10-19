import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => { setName(''); setEmail(''); setPassword(''); }, []);

    const validate = () => {
        if (!name.trim()) return "Full Name is required";
        if (name.trim().length < 3) return "Full Name must be at least 3 characters";
        if (!/^[a-zA-Z ]+$/.test(name)) return "Full Name should contain only letters";

        if (!email.trim()) return "Email id is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter valid Email id";

        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(password)) return "Password must have 1 Capital letter";
        if (!/[a-z]/.test(password)) return "Password must have 1 small letter";
        if (!/[0-9]/.test(password)) return "Password must have 1 number";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!showOTP) {
            const err = validate();
            if (err) { setError(err); return; }
        } else {
            if (!otp.trim()) { setError("OTP is required"); return; }
            if (otp.length !== 6) { setError("OTP must be 6 digits"); return; }
        }

        setLoading(true);
        try {
            if (!showOTP) {
                await register(name.trim(), email.trim(), password);
                setShowOTP(true);
            } else {
                await verifyOTP(email.trim(), otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-[#fffaf0] p-8 rounded-[28px] border shadow-lg">
            <h2 className="text-3xl font-black text-center text-black">Create Account</h2>
            <p className="text-center text-gray-500 mb-6">All fields are required *</p>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center border border-red-200 text-sm font-medium">{error}</div>}

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                {!showOTP ? (
                    <>
                        <div><label className="text-sm font-bold text-black">Full Name *</label>
                            <input type="text" placeholder="Enter full name" value={name} onChange={e=>setName(e.target.value)} required
                            className="w-full mt-1 px-4 py-3 rounded-xl border bg-white text-black placeholder:text-gray-400 outline-none" style={{color:'#000'}} readOnly onFocus={e=>e.target.removeAttribute('readOnly')} />
                        </div>
                        <div><label className="text-sm font-bold text-black">Email Address *</label>
                            <input type="text" placeholder="Enter email id" value={email} onChange={e=>setEmail(e.target.value)} required
                            className="w-full mt-1 px-4 py-3 rounded-xl border bg-white text-black placeholder:text-gray-400 outline-none" style={{color:'#000'}} readOnly onFocus={e=>e.target.removeAttribute('readOnly')} />
                        </div>
                        <div><label className="text-sm font-bold text-black">Password *</label>
                            <input type="password" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} required
                            className="w-full mt-1 px-4 py-3 rounded-xl border bg-white text-black placeholder:text-gray-400 outline-none" style={{color:'#000', backgroundColor:'#fff'}} readOnly onFocus={e=>e.target.removeAttribute('readOnly')} />
                            <p className="text-[11px] text-gray-500 mt-1">* Min 8 chars, 1 Capital, 1 small, 1 number</p>
                        </div>
                    </>
                ) : (
                    <div><label className="text-sm font-bold text-black">OTP *</label>
                        <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} required maxLength={6}
                        className="w-full mt-1 px-4 py-3 rounded-xl border bg-white text-black text-center font-bold tracking-widest text-lg outline-none" />
                    </div>
                )}
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold">{loading ? 'Processing...' : (showOTP ? 'Verify & Complete' : 'Sign Up')}</button>
            </form>
            {!showOTP && <p className="text-center mt-5 text-sm">Already have account? <Link to="/login" className="font-bold text-black">Sign in</Link></p>}
        </div>
    );
};
export default Register;