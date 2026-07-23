# 🛡️ Centro de Controle Avançado

**Plataforma completa para registro de incidentes de segurança e eventos corporativos**

![Status](https://img.shields.io/badge/Status-Pronto-brightgreen)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🎯 Funcionalidades

### ✅ Gerenciamento de Incidentes
- 📋 Criar, editar e deletar incidentes
- 🎚️ Classificar por severidade (Crítica, Alta, Média, Baixa)
- 📊 Acompanhar status (Aberto, Em investigação, Resolvido)
- 👤 Atribuir responsáveis

### ✅ Gerenciamento de Eventos
- 📅 Criar eventos corporativos
- 📍 Especificar local e participantes
- ✉️ **Envio automático de email** para safetyandsecurity@docusign.com
- 📊 Rastrear confirmações e status

### ✅ Filtros Avançados
- 🔍 Buscar por título
- 🎯 Filtrar por tipo, status e severidade
- 📅 Filtrar por data

### ✅ Análise de Dados
- 📊 Gráficos de distribuição de severidade
- 📈 Gráficos de status
- 📉 Taxa de resolução de incidentes
- 📋 Tabela de resumo geral

### ✅ Exportação
- 📥 Exportar dados em CSV
- 💾 Compatível com Excel e Google Sheets

### ✅ Notificações
- 📢 Notificar funcionários de tarefas pendentes
- ✉️ Email automático para eventos
- 🔔 Sistema de notificações em tempo real

### ✅ Autenticação e Segurança
- 🔐 Registro e login de usuários
- 🛡️ Tokens JWT
- 🔒 Senhas criptografadas com bcrypt
- 👥 Controle de acesso por usuário

---

## 🚀 Quick Start

### Instalação Local (5 minutos)

```bash
# 1. Clonar repositório
git clone seu-repositorio
cd centro-controle-seguranca

# 2. Executar setup
bash setup.sh

# 3. Editar .env
nano .env
# Configurar JWT_SECRET, MONGODB_URI, SMTP_USER, SMTP_PASSWORD

# 4. Iniciar
npm start
```

Acesse: **http://localhost:5000**

### Com Docker (Mais rápido)

```bash
# Editar .env com suas configurações de email
docker-compose up -d

# Logs
docker-compose logs -f
```

---

## 📚 Documentação

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guia completo de instalação e produção
- **[API.md](./API.md)** - Documentação das APIs
- **[SECURITY.md](./SECURITY.md)** - Boas práticas de segurança

---

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# Servidor
PORT=5000
NODE_ENV=production

# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/centro-controle

# Autenticação
JWT_SECRET=seu-segredo-super-seguro-mude-isso
JWT_EXPIRE=7d

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app-google
```

### Configurar Email Gmail

1. Ativar 2FA: https://myaccount.google.com
2. Gerar "Senha de app": https://myaccount.google.com/apppasswords
3. Copiar senha para `SMTP_PASSWORD`

---

## 📊 Estrutura do Projeto

```
centro-controle-seguranca/
├── models/               # Modelos MongoDB
│   ├── User.js          # Usuários
│   ├── Incident.js      # Incidentes
│   └── Event.js         # Eventos
├── routes/              # Rotas da API
│   ├── auth.js          # Autenticação
│   ├── incidents.js     # Incidentes
│   ├── events.js        # Eventos
│   └── notifications.js # Notificações
├── middleware/
│   └── auth.js          # Middleware JWT
├── server.js            # Servidor principal
├── package.json         # Dependências
├── .env.example         # Variáveis de exemplo
├── Dockerfile           # Containerização
├── docker-compose.yml   # Docker Compose
└── DEPLOYMENT.md        # Guia de deploy
```

---

## 🔌 API Principal

### Autenticação
```bash
POST   /api/auth/register        # Criar conta
POST   /api/auth/login           # Login
GET    /api/auth/me              # Perfil
PUT    /api/auth/profile         # Atualizar perfil
```

### Incidentes
```bash
GET    /api/incidents            # Listar
POST   /api/incidents            # Criar
GET    /api/incidents/:id        # Detalhe
PUT    /api/incidents/:id        # Editar
DELETE /api/incidents/:id        # Deletar
GET    /api/incidents/stats/summary
```

### Eventos
```bash
GET    /api/events               # Listar
POST   /api/events               # Criar (+ email automático)
GET    /api/events/:id           # Detalhe
PUT    /api/events/:id           # Editar
DELETE /api/events/:id           # Deletar
```

### Notificações
```bash
POST   /api/notifications/send   # Enviar notificação
GET    /api/notifications/history
```

---

## 🌐 Deployment

### DigitalOcean / AWS / VPS próprio
```bash
# Ver DEPLOYMENT.md
```

### Heroku
```bash
heroku create seu-app
heroku config:set JWT_SECRET="..."
git push heroku main
```

### Docker
```bash
docker-compose up -d
```

---

## 🔐 Segurança

✅ **Implementado:**
- Autenticação JWT
- Hashing de senhas (bcrypt)
- CORS habilitado
- Helmet para headers HTTP
- Validação de entrada
- Proteção contra XSS

⚠️ **Recomendações:**
- Use HTTPS em produção
- Rotate JWT_SECRET periodicamente
- Faça backup do MongoDB
- Use variáveis de ambiente seguras
- Implemente rate limiting

---

## 📋 Requisitos

- **Node.js** 14+ 
- **MongoDB** 4.4+
- **NPM** ou **Yarn**
- Email (SMTP)

---

## 🚀 Performance

- API otimizada com índices MongoDB
- Cache de autenticação com JWT
- Gráficos renderizados no client-side
- Exportação assíncrona

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| MongoDB não conecta | Verificar `MONGODB_URI` e se MongoDB está rodando |
| Email não é enviado | Verificar `SMTP_USER`, `SMTP_PASSWORD` e firewall |
| Token JWT inválido | Verificar `JWT_SECRET` e expiração |
| CORS error | Verificar origem no middleware |

---

## 📞 Suporte

Para dúvidas ou bugs, verifique:
1. [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Logs da aplicação
3. Documentação da API

---

## 📄 Licença

MIT © 2024

---

## 👨‍💻 Desenvolvido por

**Claude** | Plataforma de Inteligência Artificial

---

## 🎉 Próximas Melhorias

- [ ] Dashboard interativo
- [ ] Relatórios em PDF
- [ ] Integração com Slack
- [ ] Autenticação OAuth2
- [ ] Mulher-factor authentication (2FA)
- [ ] Mobile app (React Native)
- [ ] API WebSocket em tempo real

---

**Comece agora:** `bash setup.sh` e acesse http://localhost:5000
