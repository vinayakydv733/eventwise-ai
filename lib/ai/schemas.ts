import { z } from 'zod';

export const AIPlanSchema = z.object({
  summary: z.string().min(10),
  theme: z.object({
    name: z.string(),
    description: z.string(),
    colorPalette: z.array(z.string()),
    decorVibe: z.string(),
  }),
  budgetAllocations: z.array(
    z.object({
      category: z.string(),
      amount: z.number().positive(),
      percentage: z.number().min(0).max(100),
      note: z.string(),
      suggestedVendors: z.string().optional(),
    })
  ).min(3),
  contingencyReserve: z.number().min(0),
  timeline: z.array(
    z.object({
      phase: z.string(),
      timeframe: z.string(),
      task: z.string(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
      suggestedLeadDays: z.number().min(0),
      category: z.string(),
    })
  ).min(3),
  vendorsNeeded: z.array(
    z.object({
      category: z.string(),
      description: z.string(),
      estimatedCost: z.number().min(0),
      priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
      keyQuestionsToAsk: z.array(z.string()),
    })
  ).min(2),
  creativeIdeas: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      description: z.string(),
      estimatedCostImpact: z.enum(['Low', 'Medium', 'High']),
    })
  ).min(2),
  risksAndMitigations: z.array(
    z.object({
      risk: z.string(),
      severity: z.enum(['High', 'Medium', 'Low']),
      mitigation: z.string(),
    })
  ).min(1),
  isFallback: z.boolean().default(false),
});

export type AIPlanType = z.infer<typeof AIPlanSchema>;
