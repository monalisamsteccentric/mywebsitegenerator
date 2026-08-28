require('dotenv').config();

const path = require('path');
const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, 'public');

app.use(express.json({ limit: '20kb' }));
app.use(express.static(publicDirectory));

const systemInstruction = `You are an expert web designer and frontend developer. Generate a complete, polished, responsive standalone HTML website based on the user's description. Return ONLY the complete HTML document beginning with <!DOCTYPE html>. Do not use Markdown code fences. Include all necessary CSS inside <style> tags and JavaScript inside <script> tags. Do not explain the code.

Choose an appropriate visual style, typography, layout, colors, and content for the user's request. Build a real website, not a description. Include navigation, a compelling hero section, relevant main sections, calls to action, and a footer. Infer specialized sections for businesses such as restaurants, portfolios, agencies, SaaS products, events, or shops. Use accessible semantic HTML, responsive mobile layouts, useful hover states, and inline SVG or CSS for visual details when needed. Do not load external assets or make network requests so the result works as a standalone downloaded HTML file.`;

app.post('/api/generate', async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';

  if (!prompt) {
    return res.status(400).json({ error: 'Please describe the website you want to build.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'Website generation is not configured yet. Add OPENAI_API_KEY in the server environment.' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      max_tokens: 12000
    });

    const html = completion.choices?.[0]?.message?.content?.trim();
    if (!html || !html.toLowerCase().includes('<html')) {
      return res.status(502).json({ error: 'The AI returned an invalid website. Please try again.' });
    }

    return res.json({ html });
  } catch (error) {
    console.error('OpenAI generation failed:', error.message);
    return res.status(502).json({ error: 'We could not generate your website right now. Please try again.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`AI Website Builder listening on port ${port}`);
});
