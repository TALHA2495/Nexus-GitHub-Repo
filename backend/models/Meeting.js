const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected', 'completed'], 
    default: 'pending' 
  },
  meetingLink: { type: String, default: "" }, 
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);