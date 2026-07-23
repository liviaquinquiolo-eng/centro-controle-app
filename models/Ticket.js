const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  incidentId: mongoose.Schema.Types.ObjectId,
  title: String,
  incidentType: String,
  severity: String,
  location: String,
  affectedEmployee: String,
  assignEmployee: String,
  details: String,
  status: { type: String, enum: ['Aberto', 'Em Progresso', 'Fechado'], default: 'Aberto' },
  comments: [{
    user: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  closedAt: Date,
  resolutionTimeHours: Number
});

module.exports = mongoose.model('Ticket', ticketSchema);
