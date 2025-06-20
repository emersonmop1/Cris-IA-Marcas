import express from 'express';
import { analyzeWithClaude } from '../services/claudeService.js';
import { extractTextFromFile } from '../utils/fileProcessor.js';
import path from 'path';

const router = express.Router();

router.post('/stream', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { humanPrompt, rolePrompt } = req.body;
    let fileContent = '';

    if (req.file) {
      try {
        fileContent = await extractTextFromFile(req.file.path, req.file.mimetype);
      } catch (error) {
        console.error('Error extracting file content:', error);
        res.write(`data: ${JSON.stringify({ error: 'Erro ao processar arquivo: ' + error.message })}\n\n`);
        return res.end();
      }
    }

    const fullHumanPrompt = fileContent 
      ? `${humanPrompt}\n\nConteúdo do arquivo:\n${fileContent}`
      : humanPrompt;

    console.log('Starting analysis with Claude...');
    
    await analyzeWithClaude(rolePrompt, fullHumanPrompt, (chunk) => {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Analysis error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message || 'Erro interno do servidor' })}\n\n`);
    res.end();
  }
});

export default router;