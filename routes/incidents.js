const express = require('express');
const Incident = require('../models/Incident');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const incident = new Incident({
      title: req.body.title,
      incidentType: req.body.incidentType,
      severity: req.body.severity || 'low',
      location: req.body.location,
      affectedEmployee: req.body.affectedEmployee,
      assignEmployee: req.body.assignEmployee,
      date: req.body.date,
      details: req.body.details,
      userId: req.user.id
    });

    const savedIncident = await incident.save();

    // CRIAR TICKET AUTOMATICAMENTE
    const lastTicket = await Ticket.findOne().sort({ number: -1 });
    const nextNumber = lastTicket ? lastTicket.number + 1 : 1000;

    const ticket = new Ticket({
      number: nextNumber,
      incidentId: savedIncident._id,
      title: req.body.title,
      incidentType: req.body.incidentType,
      severity: req.body.severity,
      location: req.body.location,
      affectedEmployee: req.body.affectedEmployee,
      assignEmployee: req.body.assignEmployee,
      details: req.body.details,
      createdBy: req.user.id
    });

    await ticket.save();

    res.json({ incident: savedIncident, ticket: ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const incidents = await Incident.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
