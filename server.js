const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON no body das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal: envia a landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: receber dados do formulário de contato (POST)
app.post('/api/contato', (req, res) => {
  const { nome, email, telefone, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({
      success: false,
      message: 'Nome, e-mail e mensagem são obrigatórios.'
    });
  }

  // Aqui você pode: salvar em banco, enviar e-mail, etc.
  console.log('Novo contato recebido:', { nome, email, telefone, mensagem });

  res.status(200).json({
    success: true,
    message: 'Mensagem recebida! Entraremos em contato em breve.'
  });
});

app.listen(PORT, () => {
  console.log(`MASTER ELEVADORES - Servidor rodando em http://localhost:${PORT}`);
});
