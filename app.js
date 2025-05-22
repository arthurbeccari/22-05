const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const LOG_FILE = 'logs.txt';

app.use(express.json());

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}\n`;

  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('Erro ao escrever no arquivo de log:', err);
    } else {
      console.log('Mensagem registrada no log:', logEntry.trim());
    }
  });
}

app.post('/logs', (req, res) => {
  const { studentName } = req.body;

  if (!studentName) {
    return res.status(400).json({ error: 'O nome do aluno é obrigatório no corpo da requisição.' });
  }

  const studentId = uuidv4(); 
  const logContent = `Aluno: ${studentName}, ID: ${studentId}`;

  logMessage(logContent); 

  res.status(200).json({
    id: studentId,
    message: `Log para o aluno ${studentName} registrado com sucesso!`,
  });
});

app.get('/logs/:id', (req, res) => {
  const requestedId = req.params.id; 

  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Arquivo de logs não encontrado.' });
      }
      console.error('Erro ao ler o arquivo de log:', err);
      return res.status(500).json({ error: 'Erro interno do servidor ao ler o arquivo de log.' });
    }

    const lines = data.split('\n');
    let foundLog = null;

    for (const line of lines) {
      const idMatch = line.match(/ID: ([0-9a-fA-F-]+)/);
      if (idMatch && idMatch[1] === requestedId) {
        foundLog = line;
        break; 
      }
    }

    if (foundLog) {
      res.status(200).json({
        id: requestedId,
        message: 'Log encontrado com sucesso.',
        logEntry: foundLog,
      });
    } else {
      res.status(404).json({
        error: `ID "${requestedId}" não encontrado no arquivo de logs.`,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});