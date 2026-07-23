const express = require('express');
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const incidents = await Incident.find({ userId: req.user.id });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const incident = new Incident({
      title: req.body.title,
      incidentType: req.body.incidentType,
      location: req.body.location,
      affectedEmployee: req.body.affectedEmployee,
      assignEmployee: req.body.assignEmployee,
      date: req.body.date,
      severity: req.body.severity || 'low',
      details: req.body.details,
      userId: req.user.id
    });

    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
