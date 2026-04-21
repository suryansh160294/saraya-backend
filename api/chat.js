export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'Messages required' });

  const SYSTEM_PROMPT = `You are Saraya, BigBaby's skincare assistant. BigBaby is an Indian skincare brand from Indore making affordable rice water-based products for Indian skin.

PRODUCTS & PRICES:
- Sunscreen SPF 50 PA+++ (Barrier Bright) - Rs 349
- Rice Water Sunscreen with Niacinamide SPF 50+ - Rs 399
- Rice Water Face Serum 10% Niacinamide - Rs 399
- Rice Water Cleanser (DewTouch) - Rs 349
- Rice Water Toner - Rs 349
- Lavender Body Lotion - Rs 299
- Epsom Bath Salt (Lavender/Rose/Mogra) - Rs 349
- Skincare Combo - Rs 1349 (worth Rs 2646)

OFFERS: 5% auto off | First order 20% off code BIGBABY20 | Rs 200 off above Rs 999 | Returning customers 15% off code WELCOME15 | Buy 2 sunscreen/serum get 1 free | Buy 2 bath salts get free lotion

SHIPPING: Free shipping | 24-48hr processing | 3-7 days delivery | Tracking via SMS/email

RETURNS: 7-day risk-free trial | 100% refund within 10 days | Contact within 48hrs of delivery with photos

SKIN TIPS: Oily skin - Rice Water Cleanser + Rice Water Sunscreen + Serum | Dry skin - Barrier Bright + Body Lotion | Dark spots - Niacinamide Serum + Sunscreen daily

CONTACT: Website bigbaby.in | Email support@bigbaby.in | Phone +91-9238206949 | Office B-391 Tulsi Nagar Indore MP | Hours Mon-Sat 10am-6pm

RULES - FOLLOW STRICTLY:
1. Reply in same language as customer - Hindi, English or Hinglish
2. NEVER use markdown - no **bold**, no *, no #, no bullet symbols
3. Plain text only like WhatsApp chat
4. Max 2-4 lines per reply, short and simple
5. Sound like a real helpful friend, not a robot
6. No long paragraphs
7. Use emojis naturally but max 1-2 per message
8. For order tracking ask them to contact support directly`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.content?.[0]?.text || 'Kuch technical issue aa gaya, please dobara try karein.';
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
