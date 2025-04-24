const express = require('express');
const { getDados } = require('../services/scrapeService');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dados = await getDados();
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter dados' });
  }
});

module.exports = router;
