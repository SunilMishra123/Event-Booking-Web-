const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://event-booking-web-pl.vercel.app",
  "https://event-booking-web-git-main-eventora6s-projects.vercel.app",
  "https://event-booking-7svgtoy-eventora6s-projects.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
   
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); 
    }
  },
  credentials: true
}));

app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: "Event Booking API is running", status: "OK" });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));