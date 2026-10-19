import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    const handleSyncSeats = async () => {
        if(!window.confirm('Fix all seats? This will recalculate seats based on confirmed bookings.')) return;
        try {
            await api.put('/events/sync-seats');
            alert('All seats fixed! 149/150 -> 150/150 ho gaya');
            fetchData();
        } catch (error) {
            
            alert('Backend route nahi mila. Compass Shell me ye chalao: db.events.updateMany({}, [{ $set: { availableSeats: "$totalSeats" } }])');
            console.error(error);
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading admin panel...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Admin Dashboard</h1>
                    <p className="text-gray-300">Manage events and manually confirm bookings.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleSyncSeats}
                        className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-lg transition shadow-md"
                        title="Fix 149/150 issue"
                    >
                        🔄 Fix Seats
                    </button>
                    <button
                        onClick={() => setShowEventForm(!showEventForm)}
                        className="flex-1 md:flex-none bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition shadow-md"
                    >
                        {showEventForm ? 'Cancel' : '+ Create Event'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black text-green-600">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl font-bold">₹</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Paid Clients</p>
                        <h3 className="text-3xl font-black text-blue-600">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold">👤</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Pending Requests</p>
                        <h3 className="text-3xl font-black text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">⏳</div>
                </div>
            </div>

            {showEventForm && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input required type="text" placeholder="Event Title" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required type="text" placeholder="Category" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="text" placeholder="Location" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Total Seats" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                        <div className="md:col-span-2">
                            <input type="text" placeholder="Image URL" className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>
                        <textarea required placeholder="Event Description" className="border px-4 py-3 rounded-lg md:col-span-2 h-32 focus:ring-2 focus:ring-gray-700 outline-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="md:col-span-2 bg-gray-900 text-white font-bold py-3 mt-2 rounded-lg hover:bg-black transition">Publish Event</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm">{events.length}</span>
                        All Events
                        <span className="text-xs font-normal text-gray-500 ml-2">(Photo wala issue fix ke liye Fix Seats dabao)</span>
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {events.map(event => {
                                const isLess = event.availableSeats < event.totalSeats;
                                return (
                                    <li key={event._id} className={`p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 ${isLess ? 'bg-orange-50/50' : ''}`}>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                                            <div className="flex gap-3 text-sm">
                                                <span className="text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                                                <span className={`font-bold ${isLess ? 'text-orange-600' : 'text-green-600'}`}>{event.availableSeats}/{event.totalSeats} seats {isLess ? '⚠️' : ''}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteEvent(event._id)} className="text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50">Delete</button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">{bookings.length}</span>
                        Booking Requests
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {bookings.map(booking => (
                                <li key={booking._id} className={`p-6 border-l-4 ${booking.status === 'pending' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-gray-900 text-lg">{booking.eventId?.title || 'Deleted Event'}</h4>
                                        <div className="flex flex-col gap-1 items-end ml-4">
                                            <span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
                                            <span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700' : booking.paymentStatus === 'not_decided' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200'}`}>{booking.paymentStatus.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 mb-3 border text-sm">
                                        <p><span className="font-bold w-16 inline-block text-gray-500 text-xs">USER:</span> {booking.userId?.name} ({booking.userId?.email})</p>
                                        <p><span className="font-bold w-16 inline-block text-gray-500 text-xs">AMOUNT:</span> ₹{booking.amount}</p>
                                        <p><span className="font-bold w-16 inline-block text-gray-500 text-xs">DATE:</span> {new Date(booking.bookedAt || booking.createdAt).toLocaleString()}</p>
                                    </div>

                                    {booking.status === 'pending' && booking.paymentStatus !== 'not_decided' && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 text-xs font-bold py-2.5 px-3 rounded-lg">
                                                ✓ Approve as Paid
                                            </button>
                                            <button onClick={() => handleConfirmBooking(booking._id, 'not_decided')} className="flex-1 min-w-[120px] bg-orange-50 text-orange-700 hover:bg-orange-500 hover:text-white border border-orange-200 text-xs font-bold py-2.5 px-3 rounded-lg">
                                                ◐ Mark Undecided
                                            </button>
                                            <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-lg">
                                                ✕ Reject
                                            </button>
                                        </div>
                                    )}
                                    {booking.status === 'pending' && booking.paymentStatus === 'not_decided' && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 bg-green-600 text-white text-xs font-bold py-2.5 px-3 rounded-lg hover:bg-green-700">
                                                Now Approve as Paid
                                            </button>
                                            <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-50 text-red-600 border border-red-200 text-xs font-bold py-2.5 px-3 rounded-lg">
                                                ✕ Reject
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;