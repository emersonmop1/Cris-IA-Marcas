#!/bin/bash

echo "🚀 Iniciando o servidor backend..."
echo ""

# Navegar para o diretório do backend
cd backend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando arquivo .env..."
    echo ""
    echo "Por favor, adicione sua chave da API Anthropic no arquivo backend/.env:"
    echo "ANTHROPIC_API_KEY=sua-chave-aqui"
    echo ""
    touch .env
    echo "ANTHROPIC_API_KEY=" > .env
    echo "⚠️  IMPORTANTE: Edite o arquivo backend/.env e adicione sua chave da API!"
    echo ""
fi

# Iniciar o servidor
echo "🔧 Iniciando servidor na porta 3002..."
npm run dev