# Centro de Controle Avançado - Guia de Instalação e Deployment

## 📋 Requisitos

- **Node.js** 14+ (https://nodejs.org)
- **MongoDB** 4.4+ (Local ou MongoDB Atlas)
- **Git** (para clonar)
- **Docker** (Opcional, para containerização)

---

## 🚀 Instalação Local

### 1. Clonar o repositório
```bash
git clone seu-repositorio
cd centro-controle-seguranca
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copiar `.env.example` para `.env`:
```bash
cp .env.example .env
```

Editar `.env` com suas configurações:

```env
# Servidor
PORT=5000
NODE_ENV=development

# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/centro-controle

# JWT
JWT_SECRET=seu-segredo-jwt-super-seguro-mude-isso
JWT_EXPIRE=7d

# Email (Gmail - configurar conforme seção abaixo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app
```

### 4. Iniciar MongoDB (se local)

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
brew services start mongodb-community
```

### 5. Executar aplicação

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

Acesse em: `http://localhost:5000`

---

## 📧 Configurar Email Automático

### Opção 1: Gmail (Recomendado)

1. Ativar 2FA em sua conta Google
2. Gerar "Senha de app" em: https://myaccount.google.com/apppasswords
3. Copiar senha gerada para `SMTP_PASSWORD` no `.env`

### Opção 2: Outro provedor de email

Ajuste em `.env`:
```env
SMTP_HOST=smtp.seuprovededor.com
SMTP_PORT=587
SMTP_USER=seu-usuario
SMTP_PASSWORD=sua-senha
```

---

## 🐳 Deployment com Docker

### 1. Construir imagem
```bash
docker build -t centro-controle:latest .
```

### 2. Executar com Docker Compose (recomendado)

Criar arquivo `.env` primeiro, depois:
```bash
docker-compose up -d
```

Aplicação rodando em: `http://localhost:5000`

Para parar:
```bash
docker-compose down
```

---

## ☁️ Deployment em Produção

### Opção 1: DigitalOcean

1. Criar Droplet (Ubuntu 20.04, 2GB RAM mínimo)
2. SSH na máquina
3. Instalar dependências:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb-server
```

4. Clonar projeto:
```bash
git clone seu-repositorio
cd centro-controle-seguranca
npm install
```

5. Configurar `.env` com suas variáveis
6. Iniciar com PM2:
```bash
npm install -g pm2
pm2 start server.js --name "centro-controle"
pm2 startup
pm2 save
```

7. Configurar Nginx como reverse proxy:
```bash
sudo apt-get install -y nginx
```

Editar `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reiniciar Nginx:
```bash
sudo systemctl restart nginx
```

### Opção 2: Heroku

1. Instalar Heroku CLI
2. Fazer login:
```bash
heroku login
```

3. Criar aplicação:
```bash
heroku create nome-da-app
```

4. Configurar variáveis:
```bash
heroku config:set JWT_SECRET="seu-segredo"
heroku config:set MONGODB_URI="sua-url-mongodb-atlas"
heroku config:set SMTP_USER="seu-email"
heroku config:set SMTP_PASSWORD="sua-senha"
```

5. Fazer deploy:
```bash
git push heroku main
```

### Opção 3: AWS EC2

1. Criar instância EC2 (Ubuntu, t2.micro para teste)
2. SSH na máquina
3. Seguir passos similares ao DigitalOcean
4. Usar RDS para MongoDB ou MongoDB Atlas

---

## 🔐 Segurança em Produção

### 1. SSL/TLS
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d seu-dominio.com
```

### 2. Firewall
```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 3. Variáveis de Ambiente Seguras
- Nunca commitar `.env` no Git
- Usar `.gitignore`:
```
node_modules/
.env
.env.local
logs/
```

### 4. MongoDB Atlas (em vez de instância local)
- Acesso: https://www.mongodb.com/cloud/atlas
- Copiar URL de conexão para `MONGODB_URI`

---

## 📊 Estrutura de Pastas

```
centro-controle-seguranca/
├── models/
│   ├── User.js
│   ├── Incident.js
│   └── Event.js
├── routes/
│   ├── auth.js
│   ├── incidents.js
│   ├── events.js
│   └── notifications.js
├── middleware/
│   └── auth.js
├── server.js
├── package.json
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🧪 Testando APIs

### Registrar usuário
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Fazer login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Criar incidente (com token)
```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "title": "Falha de sistema",
    "description": "Sistema offline",
    "severity": "critical"
  }'
```

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"
- Verificar se MongoDB está rodando: `mongod --version`
- Verificar `MONGODB_URI` no `.env`

### Erro: "JWT token invalid"
- Verificar se `JWT_SECRET` está configurado
- Verificar se token está sendo passado corretamente no header

### Erro: "Email not sent"
- Verificar credenciais SMTP
- Para Gmail: usar "Senha de app" (não senha da conta)
- Verificar se email está em whitelist

---

## 📞 Suporte

Para problemas, verifique:
1. Logs da aplicação
2. Conectividade com MongoDB
3. Variáveis de ambiente corretas
4. Permissões de firewall

---

## 📄 Licença

MIT

**Criado para: Segurança e Controle de Eventos**
