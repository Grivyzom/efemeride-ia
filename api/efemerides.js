// api/efemerides.js
// Integración con LLaMA 2 Chat de Meta (Open Source y gratuito) vía Hugging Face Inference API
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
// Tu token de HF (asegúrate de que sea un classic token con inferencia habilitada)
const HF_TOKEN = process.env.HF_API_TOKEN;
// Modelo LLaMA 2 Chat (7B) – gratuito y open source bajo licencia Meta
const MODEL_ID = 'meta-llama/Llama-2-7b-chat-hf';
const MODEL_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

console.log('🔑 HF_TOKEN disponible:', !!HF_TOKEN);
console.log('🔗 Endpoint de inferencia:', MODEL_URL);

// Genera una efeméride usando LLaMA 2
async function generarEfemeride(prompt) {
  const resp = await axios.post(
    MODEL_URL,
    {
      inputs: prompt,
      parameters: { max_new_tokens: 150, temperature: 0.7 },
      options: { wait_for_model: true }
    },
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );
  const data = resp.data;
  // La respuesta puede ser un array con objetos { generated_text }
  if (Array.isArray(data) && data[0].generated_text) {
    return data[0].generated_text.trim();
  }
  // En ocasiones viene como un objeto con .generated_text
  if (data.generated_text) {
    return data.generated_text.trim();
  }
  throw new Error('Respuesta inesperada de LLaMA 2');
}

// Ruta POST /api/efemerides
router.post('/', async (req, res) => {
  const hoy = new Date();
  const dd = String(hoy.getDate()).padStart(2, '0');
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const prompt = `Efeméride de programación para el día ${dd}-${mm}: indica el año y una descripción breve del acontecimiento.`;

  try {
    console.log(`🔄 Generando efeméride con LLaMA 2 (${MODEL_ID})…`);
    const efemeride = await generarEfemeride(prompt);
    console.log('✅ Efeméride servida por LLaMA 2');
    return res.json({ efemeride, source: 'LLaMA 2', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('LLaMA 2 Error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'No se pudo generar la efeméride con LLaMA 2' });
  }
});

module.exports = router;