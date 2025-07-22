// api/efemeride.js

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Tu token de Hugging Face en .env
const HF_TOKEN = process.env.HF_API_TOKEN;
// Endpoint del modelo LLaMA 2 Chat en HF
const MODEL_URL = 'https://api-inference.huggingface.co/models/gpt2';

router.post('/', async (req, res) => {
  try {
    // Obtén fecha actual en DD-MM
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const prompt = `Dame una efeméride breve y clara para el día ${dd}-${mm}, indicando el año y qué ocurrió.`;

    // Llamada a la Inference API de HF
    const response = await axios.post(
      MODEL_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extrae el texto generado
    const generated = Array.isArray(response.data)
      ? response.data[0].generated_text
      : response.data.generated_text;

    res.json({ efemeride: generated.trim() });
  } catch (err) {
    console.error('Hugging Face Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Error al generar la efeméride' });
  }
});

module.exports = router;
