import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const { darkMode } = useTheme();
  return (
    <div className={`${darkMode ? 'bg-[#050507] text-white' : 'bg-[#f6f6f9] text-[#0a0a14]'} min-h-screen flex flex-col transition-all duration-700 relative`}>
      <div className="fixed inset-0 pointer-events-none z-0">
        {darkMode ? (
          <>
            <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-[#6d28d9]/20 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] bg-[#0ea5e9]/15 rounded-full blur-[150px]"></div>
          </>
        ) : (
          <>
            <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-purple-200/50 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] bg-blue-200/50 rounded-full blur-[150px]"></div>
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col w-full">
          <Routes>
            
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            
           
            <Route path="/" element={<div className="container mx-auto px-4 py-8"><Home /></div>} />
            <Route path="/events/:id" element={<div className="container mx-auto px-4 py-8"><EventDetail /></div>} />

        
            <Route path="/dashboard" element={<ProtectedRoute><div className="container mx-auto px-4 py-8"><UserDashboard /></div></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><div className="container mx-auto px-4 py-8"><AdminDashboard /></div></ProtectedRoute>} />
            <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/payment-failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}