import fs from 'fs/promises';
import mammoth from 'mammoth';
import path from 'path';

export async function extractTextFromFile(filePath, mimetype) {
  try {
    const buffer = await fs.readFile(filePath);
    
    switch (mimetype) {
      case 'application/pdf':
        // For now, we'll return a message for PDF files
        // In production, you would implement proper PDF parsing
        return `[Arquivo PDF carregado: ${path.basename(filePath)}]\n\nPor favor, cole o conteúdo do PDF no campo de texto se necessário.`;
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        const docData = await mammoth.extractRawText({ buffer });
        return docData.value;
        
      case 'text/plain':
        return buffer.toString('utf8');
        
      default:
        throw new Error(`Tipo de arquivo não suportado: ${mimetype}`);
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Erro ao extrair texto do arquivo: ${error.message}`);
  } finally {
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('Error deleting temporary file:', unlinkError);
    }
  }
}