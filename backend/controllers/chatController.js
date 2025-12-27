import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error('AI ERROR', err.message);
    res.status(500).json({ error: err.message });
  }
};
