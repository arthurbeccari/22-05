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