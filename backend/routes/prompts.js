import express from 'express';
import { readPrompts, savePrompt, deletePrompt, getDefaultPrompt } from '../services/promptService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prompts = await readPrompts();
    res.json(prompts);
  } catch (error) {
    console.error('Error reading prompts:', error);
    res.status(500).json({ error: 'Erro ao carregar prompts' });
  }
});

router.get('/default', async (req, res) => {
  try {
    const defaultPrompt = await getDefaultPrompt();
    res.json({ prompt: defaultPrompt });
  } catch (error) {
    console.error('Error getting default prompt:', error);
    res.status(500).json({ error: 'Erro ao carregar prompt padrão' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, content } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({ error: 'Nome e conteúdo são obrigatórios' });
    }

    const prompt = await savePrompt(name, content);
    res.status(201).json(prompt);
  } catch (error) {
    console.error('Error saving prompt:', error);
    res.status(500).json({ error: 'Erro ao salvar prompt' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deletePrompt(id);
    res.json({ message: 'Prompt deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ error: 'Erro ao deletar prompt' });
  }
});

export default router;