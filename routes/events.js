const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Configurar transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Obter todos os eventos do usuário
router.get('/', auth, async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = { userId: req.user.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const events = await Event.find(query).sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter eventos' });
  }
});

// Criar novo evento
router.post('/', auth, [
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('date').notEmpty().withMessage('Data é obrigatória'),
  body('location').notEmpty().withMessage('Local é obrigatório')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, date, location, attendees, status } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      attendees,
      status: status || 'Planejado',
      userId: req.user.id
    });

    await event.save();

    // Enviar email para a equipe de segurança
    try {
      const emailContent = `
        <h2>Novo Evento Corporativo Registrado</h2>
        <p><strong>Título:</strong> ${title}</p>
        <p><strong>Descrição:</strong> ${description}</p>
        <p><strong>Data:</strong> ${new Date(date).toLocaleDateString('pt-BR')}</p>
        <p><strong>Local:</strong> ${location}</p>
        <p><strong>Participantes:</strong> ${attendees || 'Não especificado'}</p>
        <p><strong>Status:</strong> ${status || 'Planejado'}</p>
        <p><strong>Criado por:</strong> ${req.user.name || 'Usuário'}</p>
        <hr/>
        <p><em>Este é um email automático do Centro de Controle Avançado</em></p>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'safetyandsecurity@docusign.com',
        subject: `Novo Evento Corporativo - ${title}`,
        html: emailContent
      });

      // Marcar email como enviado
      event.emailSent = true;
      event.emailSentAt = Date.now();
      await event.save();
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não falha a criação do evento se o email falhar
    }

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// Obter evento por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (event.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter evento' });
  }
});

// Atualizar evento
router.put('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (event.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// Deletar evento
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (event.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Evento deletado'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
});

// Obter estatísticas
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id });

    const stats = {
      total: events.length,
      confirmed: events.filter(e => e.status === 'Confirmado').length,
      planned: events.filter(e => e.status === 'Planejado').length,
      completed: events.filter(e => e.status === 'Concluído').length,
      canceled: events.filter(e => e.status === 'Cancelado').length
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
});

module.exports = router;
