import OpenAI from 'openai';
import { AIPlanSchema, AIPlanType } from './schemas';
import { EventInputContext, generateDeterministicPlan } from './templates';

export function isAIConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return Boolean(key && key.trim() !== '' && !key.includes('your_openai_api_key'));
}

export async function generateAIPlan(context: EventInputContext): Promise<AIPlanType> {
  // If OpenAI is not configured, directly return deterministic plan
  if (!isAIConfigured()) {
    return generateDeterministicPlan(context);
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 25000,
    });

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const systemPrompt = `You are Eventwise AI, an elite, practical, and highly experienced event planning orchestrator.
You coordinate 7 specialist event planning domains:
1. Budget Advisor (realistic category distributions summing exactly to the total budget ceiling)
2. Timeline Planner (lead times working backwards from the event date)
3. Vendor Coordinator (identifying critical services, cost targets, and essential vendor queries)
4. Creative Ideas Specialist (tailored themes, unique guest moments, decor concepts)
5. Risk Assessment Specialist (practical logistics, weather, and schedule bottleneck mitigations)

You must return a single JSON object matching this schema:
{
  "summary": string,
  "theme": { "name": string, "description": string, "colorPalette": string[], "decorVibe": string },
  "budgetAllocations": [ { "category": string, "amount": number, "percentage": number, "note": string, "suggestedVendors": string } ],
  "contingencyReserve": number,
  "timeline": [ { "phase": string, "timeframe": string, "task": string, "priority": "LOW"|"MEDIUM"|"HIGH"|"URGENT", "suggestedLeadDays": number, "category": string } ],
  "vendorsNeeded": [ { "category": string, "description": string, "estimatedCost": number, "priority": "HIGH"|"MEDIUM"|"LOW", "keyQuestionsToAsk": string[] } ],
  "creativeIdeas": [ { "title": string, "category": string, "description": string, "estimatedCostImpact": "Low"|"Medium"|"High" } ],
  "risksAndMitigations": [ { "risk": string, "severity": "High"|"Medium"|"Low", "mitigation": string } ],
  "isFallback": false
}

CRITICAL RULES:
- The sum of all "budgetAllocations.amount" must equal the user's total budget of ${context.budgetCeiling} ${context.currency}.
- Do NOT invent fictional vendor names or claim real vendor bookings.
- Be culturally sensitive and practical for the location: ${context.location}.
- Return ONLY valid JSON.`;

    const userPrompt = JSON.stringify({
      title: context.title,
      eventType: context.type,
      eventDate: context.date,
      location: context.location,
      guestCount: context.guestCount,
      budgetCeiling: context.budgetCeiling,
      currency: context.currency,
      theme: context.theme || 'Modern, welcoming and authentic',
      formality: context.formality || 'Semi-formal',
      priorities: context.priorities || 'Smooth guest flow, great catering, stress-free hosts',
      notes: context.notes || '',
    });

    const completion = await openai.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error('Empty response from AI model');
    }

    const parsedJson = JSON.parse(rawContent);
    parsedJson.isFallback = false;

    // Validate with Zod schema
    const validatedPlan = AIPlanSchema.parse(parsedJson);
    return validatedPlan;
  } catch (error: any) {
    console.warn('AI plan generation failed or timed out. Falling back to deterministic plan:', error?.message);
    const fallback = generateDeterministicPlan(context);
    fallback.isFallback = true;
    return fallback;
  }
}
