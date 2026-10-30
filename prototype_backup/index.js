import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
const port = process.env.PORT || 8787;

const demoPlan = (event) => {
  const total = Math.max(Number(event.budget) || 25000, 1);
  const currency = event.currency || 'INR';
  const allocations = [
    ['Venue & setup', .22], ['Food & drinks', .32], ['Decor & theme', .14],
    ['Photo / media', .10], ['Entertainment', .08], ['Invites & favors', .05], ['Contingency', .09]
  ];
  const date = event.date ? new Date(`${event.date}T12:00:00`) : new Date(Date.now() + 30*86400000);
  const niceDate = date.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  return {
    summary: `A thoughtful ${event.type.toLowerCase()} for ${event.guests} guests with a ${event.theme || 'warm, welcoming'} feel. Keep the guest experience simple, personal, and well-paced.`,
    budget: allocations.map(([category, share]) => ({ category, amount: Math.round(total*share), note: category === 'Contingency' ? 'Keep this untouched unless needed' : `${Math.round(share*100)}% planning target` })),
    timeline: [
      { when:'Today', task:'Lock the event brief, guest list, and spending limit', priority:'High' },
      { when:'Within 3 days', task:'Shortlist venue and catering options; request written quotes', priority:'High' },
      { when:'2–3 weeks before', task:'Confirm vendors, menu, theme, and run of show', priority:'High' },
      { when:'1 week before', task:'Send final guest details and reconfirm all vendors', priority:'Medium' },
      { when:'1 day before', task:'Pack supplies, share the schedule, and check setup', priority:'Medium' },
      { when:niceDate, task:'Enjoy the event; assign one person to handle logistics', priority:'High' }
    ],
    vendors: [
      { name:'Venue / space', detail:'Capacity, accessibility, power, weather backup', priority:'High' },
      { name:'Catering', detail:`Menu and quantities for ${event.guests} guests; dietary needs`, priority:'High' },
      { name:'Decor & rentals', detail:`Coordinate the ${event.theme || 'chosen'} theme, seating, and lighting`, priority:'Medium' },
      { name:'Photography / media', detail:'Shot list, coverage hours, delivery timeline', priority:'Medium' },
      { name:'Sound / entertainment', detail:'Equipment, playlist or agenda, setup time', priority:'Medium' }
    ],
    ideas: [
      { title:'A signature moment', description:'Create one memorable ritual: a group toast, wishes wall, gratitude circle, or shared photo.' },
      { title:'Make it personal', description:'Use a short welcome note and small details tied to the host, guest of honor, or community.' },
      { title:'Plan for real life', description:'Add a quiet corner, clear signs, water access, and a simple rain / delay backup.' }
    ],
    demoMode: true
  };
};

app.get('/api/health', (_req, res) => res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) }));
app.post('/api/plan', async (req, res) => {
  const event = req.body || {};
  if (!event.type || !event.guests || !event.budget) return res.status(400).json({ error: 'Event type, guest count, and budget are required.' });
  if (!process.env.OPENAI_API_KEY) return res.json(demoPlan(event));
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `You are Eventwise, a practical and creative event-planning expert. Return only valid JSON with keys: summary (string), budget (array of {category:string, amount:number, note:string}), timeline (array of {when:string, task:string, priority:"High"|"Medium"|"Low"}), vendors (array of {name:string, detail:string, priority:"High"|"Medium"|"Low"}), ideas (array of {title:string, description:string}), demoMode (boolean). Budget amounts must sum to the user's budget and use the supplied currency implicitly. Keep recommendations realistic for the event location and guest count. Include 6–8 budget categories, 5–7 timeline steps, 5–8 vendor checklist items, and 3–5 personalized ideas. Don't invent specific vendor names or claim real bookings/prices. Use the requested event date and event type.` },
        { role: 'user', content: JSON.stringify({ eventType:event.type, date:event.date, location:event.location || 'Not specified', guests:Number(event.guests), budget:Number(event.budget), currency:event.currency || 'INR', theme:event.theme || 'Suggest a suitable theme', priorities:event.priorities || 'Good guest experience and budget control', notes:event.notes || '' }) }
      ],
      temperature: 0.8
    });
    const plan = JSON.parse(response.choices[0]?.message?.content || '{}');
    plan.demoMode = false;
    res.json(plan);
  } catch (error) {
    console.error('Plan generation failed:', error.message);
    res.status(502).json({ error: 'AI planning failed. Check your API key/model and try again.' });
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => { if (err) next(); });
});
app.listen(port, () => console.log(`Eventwise API ready at http://localhost:${port}`));
