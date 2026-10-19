const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

router.get('/', getEvents);


router.put('/sync-seats', protect, admin, async (req, res) => {
    try {
        const events = await Event.find();
        for (let ev of events) {
            const confirmedCount = await Booking.countDocuments({ 
                eventId: ev._id, 
                status: 'confirmed' 
            });
            ev.availableSeats = ev.totalSeats - confirmedCount;
            await ev.save();
        }
        res.json({ message: 'All seats synced successfully', totalEvents: events.length });
    } catch (error) {
        console.error('Sync Seats Error:', error);
        res.status(500).json({ message: 'Error syncing seats', error: error.message });
    }
});

router.get('/:id', getEventById);
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;