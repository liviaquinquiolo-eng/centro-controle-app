#!/bin/bash

echo "🚀 Centro de Controle Avançado - Setup"
echo "======================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não está instalado${NC}"
    echo "  Instale em: https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js encontrado: $(node --version)${NC}"

# Verificar MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB não está instalado${NC}"
    echo "  Instale em: https://docs.mongodb.com/manual/installation/"
    echo "  Ou use: docker-compose up -d"
    echo ""
fi

# Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm install

# Criar arquivo .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️  Criando arquivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Arquivo .env criado${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações:${NC}"
    echo "   - JWT_SECRET"
    echo "   - MONGODB_URI"
    echo "   - SMTP_USER e SMTP_PASSWORD"
    echo ""
else
    echo -e "${GREEN}✓ Arquivo .env já existe${NC}"
fi

# Criar pasta de logs
mkdir -p logs

echo ""
echo -e "${GREEN}✓ Setup concluído!${NC}"
echo ""
echo "Próximos passos:"
echo "  1. Editar arquivo .env"
echo "  2. Iniciar MongoDB (se local)"
echo "  3. Executar: npm start (produção) ou npm run dev (desenvolvimento)"
echo ""
echo "Mais informações em: DEPLOYMENT.md"
