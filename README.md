# 🧠 Cris IA Marcas

Sistema completo para análise de marcas utilizando a API do Claude 4.0 com streaming de dados em tempo real.

## 🚀 Tecnologias

### Frontend
- **React 18** com Vite
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Lucide React** para ícones
- **Axios** para requisições HTTP
- **jsPDF & html2canvas** para exportação

### Backend
- **Node.js** com Express
- **Streaming de dados** em tempo real
- **Multer** para upload de arquivos
- **PDF-Parse & Mammoth** para processamento de documentos
- **Anthropic SDK** para integração com Claude

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <repository-url>
cd Cris-IA-Marcas
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Configure suas variáveis de ambiente:

```env
CLAUDE_API_KEY=your_claude_api_key_here
PORT=3002
NODE_ENV=development
```

### 3. Configuração do Frontend

```bash
cd ../frontend
npm install
```

O arquivo `.env` já está configurado para desenvolvimento local.

### 4. Executar o Projeto

**Opção 1 - Executar ambos simultaneamente (recomendado):**
```bash
npm run dev
```

**Opção 2 - Executar separadamente:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

O sistema estará disponível em:
- Frontend: http://localhost:5174 (ou 5173)
- Backend: http://localhost:3002

## 📋 Funcionalidades

### ✅ Implementadas

1. **Gerenciamento de Prompts**
   - Prompt padrão com metodologia completa dos 7 pilares
   - Criação de prompts personalizados
   - Visualização e edição de prompts

2. **Análise de Marcas**
   - Upload de arquivos (PDF, DOC, DOCX, TXT)
   - Input de texto manual
   - Streaming em tempo real das respostas do Claude
   - Seleção de prompts (padrão ou personalizados)

3. **Interface Moderna**
   - Design responsivo com Tailwind CSS
   - Modo escuro/claro
   - Animações suaves
   - Paleta de cores personalizada

4. **Exportação**
   - Exportar resultados em PDF
   - Exportar resultados em DOC
   - Formatação adequada para documentos

### 🔄 Arquitetura

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços de API
│   ├── utils/         # Utilitários
│   └── App.jsx        # Componente principal
│
backend/
├── routes/            # Rotas da API
├── services/          # Serviços de negócio
├── utils/             # Utilitários
├── data/              # Armazenamento de prompts
└── server.js          # Servidor principal
```

## 🎨 Metodologia de Análise

O sistema implementa uma metodologia completa baseada em **7 pilares fundamentais**:

1. **Persona** - Definição precisa do público-alvo
2. **Tese de Necessidade** - Análise de problemas e pirâmide de Maslow
3. **Mecanismo Único** - Diferencial competitivo
4. **Mecanismo Viral** - Potencial de viralização
5. **Emoção Central** - Arquétipos e gatilhos emocionais
6. **Causa (Círculo Dourado)** - Propósito, processo e produto
7. **Storytelling** - Narrativa e roteiros para TikTok/Reels

## 🔧 Desenvolvimento

### Estrutura de Cores

```css
primary: '#37E359'    // Verde principal
secondary: '#051626'  // Azul escuro
background-light: '#F8F9FA'
background-dark: '#121212'
```

### Scripts Disponíveis

**Backend:**
- `npm start` - Produção
- `npm run dev` - Desenvolvimento com nodemon

**Frontend:**
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build

## 📝 Licença

Este projeto é propriedade privada e não possui licença pública.

---

**Desenvolvido com ❤️ usando Claude 4.0**