const express = require('express');
const router = express.Router();
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

// Armazenar notificações em memória (para produção, usar banco de dados)
const notifications = [];

// Enviar notificação para funcionário
router.post('/send', auth, [
  body('employeeName').notEmpty().withMessage('Nome do funcionário é obrigatório'),
  body('employeeEmail').isEmail().withMessage('Email inválido'),
  body('task').notEmpty().withMessage('Tarefa é obrigatória')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { employeeName, employeeEmail, task } = req.body;

    // Preparar email
    const emailContent = `
      <h2>Você tem uma tarefa pendente</h2>
      <p>Olá <strong>${employeeName}</strong>,</p>
      <p>Você recebeu uma nova tarefa pendente:</p>
      <p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
        <strong>${task}</strong>
      </p>
      <p>Por favor, confirme o recebimento desta tarefa.</p>
      <hr/>
      <p><em>Enviado pelo Centro de Controle Avançado</em></p>
    `;

    // Enviar email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: employeeEmail,
      subject: 'Tarefa Pendente - Centro de Controle',
      html: emailContent
    });

    // Armazenar notificação
    const notification = {
      id: Date.now(),
      employeeName,
      employeeEmail,
      task,
      sentBy: req.user.name,
      sentAt: new Date(),
      status: 'sent'
    };

    notifications.push(notification);

    res.status(200).json({
      success: true,
      message: 'Notificação enviada com sucesso',
      notification
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação' });
  }
});

// Obter histórico de notificações
router.get('/history', auth, async (req, res) => {
  try {
    const userNotifications = notifications.filter(n => n.sentBy === req.user.name);
    
    res.status(200).json({
      success: true,
      count: userNotifications.length,
      notifications: userNotifications
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter notificações' });
  }
});

module.exports = router;
