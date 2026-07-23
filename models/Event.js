const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: String,
  date: Date,
  attendees: Number,
  description: String,
  status: {
    type: String,
    enum: ['Agendado', 'Em andamento', 'Concluído', 'Cancelado'],
    default: 'Agendado'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emailSent: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
