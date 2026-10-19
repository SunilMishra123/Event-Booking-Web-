const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// Mock payment success - direct paid kar do
router.post('/pay/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  booking.paymentStatus = 'paid';
  booking.status = 'confirmed';
  await booking.save();
  res.json({ message: 'Payment successful', booking });
});

module.exports = router;