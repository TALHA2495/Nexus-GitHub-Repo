const router = require('express').Router();
const Meeting = require('../models/Meeting');
const auth = require('../middleware/authMiddleware'); // Your JWT protector


// Create a meeting request
router.post('/request', auth, async (req, res) => {
  try {
    const { investorId, title, scheduledDate } = req.body;

    const newMeeting = new Meeting({
      entrepreneur: req.user.id, // From JWT token
      investor: investorId,
      title,
      scheduledDate
    });

    await newMeeting.save();
    // Populate entrepreneur details for the response so frontend can display name immediately
    await newMeeting.populate('entrepreneur', 'name email');
    res.status(201).json(newMeeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get meetings for an investor
router.get('/investor/:investorId', auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({ investor: req.params.investorId })
      .populate('entrepreneur', 'name startupName')
      .sort({ scheduledDate: 1 });
    res.json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get meetings for an entrepreneur
router.get('/entrepreneur/:entrepreneurId', auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({ entrepreneur: req.params.entrepreneurId })
      .populate('investor', 'name')
      .sort({ scheduledDate: 1 });
    res.json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update meeting status (Accept/Decline)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'confirmed' or 'rejected'
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Verify the user is the investor of this meeting
    if (meeting.investor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this meeting" });
    }

    meeting.status = status;
    await meeting.save();
    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Mark meeting as completed
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Verify user is part of the meeting
    if (meeting.investor.toString() !== req.user.id && meeting.entrepreneur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    meeting.status = 'completed';
    await meeting.save();
    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;