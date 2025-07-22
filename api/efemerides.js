// api/efemerides.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const HF_TOKEN  = process.env.HF_API_TOKEN;
const MODEL_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf';

router.post('/', async (req, res) => {
  console.log('[api/efemerides] Llamando a HF…');
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const prompt = `Dame una efeméride breve y clara para el día ${dd}-${mm}, indicando el año y qué ocurrió.`;

    const response = await axios.post(
      MODEL_URL,
      { inputs: prompt, parameters: { max_new_tokens:150, temperature:0.7 } },
      { headers: { Authorization:`Bearer ${HF_TOKEN}`, 'Content-Type':'application/json' } }
    );

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
