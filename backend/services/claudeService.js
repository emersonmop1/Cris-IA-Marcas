import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env do diretório raiz do backend
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verificar se a chave está sendo carregada
const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

if (!apiKey) {
  console.error('❌ API Key não encontrada no arquivo .env');
  console.error('Variáveis de ambiente disponíveis:', Object.keys(process.env).filter(k => k.includes('API')));
} else {
  console.log('✅ API Key carregada com sucesso');
  console.log('Primeiros caracteres da chave:', apiKey.substring(0, 20) + '...');
  console.log('Tamanho da chave:', apiKey.length);
}

// Limpar possíveis espaços ou quebras de linha
const cleanApiKey = apiKey ? apiKey.trim() : undefined;

const anthropic = new Anthropic({
  apiKey: cleanApiKey,
});

export async function analyzeWithClaude(rolePrompt, humanPrompt, onChunk) {
  try {
    console.log('Iniciando análise com Claude...');
    console.log('API Key configurada:', cleanApiKey ? 'Sim' : 'Não');
    
    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      temperature: 0.7,
      system: rolePrompt,
      messages: [
        {
          role: 'user',
          content: humanPrompt
        }
      ],
      stream: true
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.text) {
        onChunk(event.delta.text);
      }
    }

  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error(`Erro na API do Claude: ${error.message}`);
  }
}