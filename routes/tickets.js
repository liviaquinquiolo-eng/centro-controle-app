const express = require('express');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

const router = express.Router();

// GET todos os tickets
router.get('/', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ticket por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRIAR ticket (automático quando incidente é criado)
router.post('/', auth, async (req, res) => {
  try {
    const lastTicket = await Ticket.findOne().sort({ number: -1 });
    const nextNumber = lastTicket ? lastTicket.number + 1 : 1000;

    const ticket = new Ticket({
      number: nextNumber,
      incidentId: req.body.incidentId,
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
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADICIONAR COMENTÁRIO
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    ticket.comments.push({
      user: req.body.user,
      text: req.body.text
    });

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ATUALIZAR STATUS DO TICKET
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    ticket.status = req.body.status;

    if (req.body.status === 'Fechado') {
      ticket.closedAt = new Date();
      const diffMs = ticket.closedAt - ticket.createdAt;
      ticket.resolutionTimeHours = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OBTER MÉTRICAS
router.get('/metrics/all', auth, async (req, res) => {
  try {
    const allTickets = await Ticket.find();
    const closedTickets = allTickets.filter(t => t.status === 'Fechado');
    
    const avgTime = closedTickets.length > 0 
      ? (closedTickets.reduce((sum, t) => sum + (t.resolutionTimeHours || 0), 0) / closedTickets.length).toFixed(1)
      : 0;

    const metrics = {
      totalTickets: allTickets.length,
      openTickets: allTickets.filter(t => t.status === 'Aberto').length,
      inProgressTickets: allTickets.filter(t => t.status === 'Em Progresso').length,
      closedTickets: closedTickets.length,
      averageResolutionTime: avgTime,
      fastestResolution: closedTickets.length > 0 ? Math.min(...closedTickets.map(t => t.resolutionTimeHours || 0)) : 0,
      slowestResolution: closedTickets.length > 0 ? Math.max(...closedTickets.map(t => t.resolutionTimeHours || 0)) : 0
    };

    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
