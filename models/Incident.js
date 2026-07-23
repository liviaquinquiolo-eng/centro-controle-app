const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: String,
  incidentType: {
    type: String,
    enum: [
      'Injury/Accident (Safety)',
      'Employee illness',
      'Fire/Emergency',
      'Property Damage',
      'BOLO',
      'Theft/Loss of Company Property',
      'Theft/Loss of Personal Property',
      'Unauthorized Access/Trespassing (Security)',
      'Tailgating',
      'Threat/Verbal Dispute',
      'Ergonomic problems',
      'Falls',
      'Cuts',
      'Electric shock',
      'Burns',
      'Collisions',
      'Commuting accidents (office-home)',
      'psychiatric illness (panic attack, high stress)',
      'Elevator trapped',
      'Lost badge',
      'espionage',
      'other'
    ]
  },
  location: String,
  affectedEmployee: String,
  assignEmployee: String,
  date: Date,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  details: String,
  status: {
    type: String,
    enum: ['Aberto', 'Em investigação', 'Resolvido', 'Crítico'],
    default: 'Aberto'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Incident', incidentSchema);
