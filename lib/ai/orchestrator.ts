import prisma from '@/lib/db';
import { AIPlanType } from './schemas';
import { generateAIPlan } from './provider';

export async function requestAndSavePlan(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  const plan = await generateAIPlan({
    title: event.title,
    type: event.type,
    date: event.startDate,
    location: event.location,
    guestCount: event.guestCount,
    budgetCeiling: event.budgetCeiling,
    currency: event.currency,
    theme: event.theme,
    formality: event.formality,
    notes: event.notes,
  });

  // Persist plan proposal in AIPlan table
  const savedPlan = await prisma.aIPlan.create({
    data: {
      eventId: event.id,
      summary: plan.summary,
      rawJson: JSON.stringify(plan),
      approved: false,
    },
  });

  return {
    planId: savedPlan.id,
    plan,
  };
}

export async function applyApprovedPlan(
  planId: string,
  options?: {
    applyBudget?: boolean;
    applyTimeline?: boolean;
    applyVendors?: boolean;
    applyIdeas?: boolean;
  }
) {
  const aiPlanRecord = await prisma.aIPlan.findUnique({
    where: { id: planId },
    include: { event: true },
  });

  if (!aiPlanRecord) {
    throw new Error('Plan not found');
  }

  const plan: AIPlanType = JSON.parse(aiPlanRecord.rawJson);
  const event = aiPlanRecord.event;
  const eventDate = new Date(event.startDate);

  const applyBudget = options?.applyBudget ?? true;
  const applyTimeline = options?.applyTimeline ?? true;
  const applyVendors = options?.applyVendors ?? true;
  const applyIdeas = options?.applyIdeas ?? true;

  return await prisma.$transaction(async (tx) => {
    // 1. Apply Budget Allocations
    if (applyBudget && plan.budgetAllocations?.length) {
      for (const [idx, alloc] of plan.budgetAllocations.entries()) {
        const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#64748b'];
        const color = colors[idx % colors.length];

        await tx.budgetCategory.upsert({
          where: {
            eventId_name: {
              eventId: event.id,
              name: alloc.category,
            },
          },
          update: {
            allocatedAmount: alloc.amount,
            note: alloc.note,
          },
          create: {
            eventId: event.id,
            name: alloc.category,
            allocatedAmount: alloc.amount,
            color,
            note: alloc.note,
          },
        });
      }
    }

    // 2. Apply Timeline Tasks
    if (applyTimeline && plan.timeline?.length) {
      for (const [index, item] of plan.timeline.entries()) {
        const dueDate = new Date(eventDate);
        dueDate.setDate(dueDate.getDate() - item.suggestedLeadDays);

        await tx.task.create({
          data: {
            eventId: event.id,
            title: item.task,
            category: item.category,
            priority: item.priority,
            status: 'TODO',
            dueDate,
            order: index,
          },
        });
      }
    }

    // 3. Apply Vendor Checklist
    if (applyVendors && plan.vendorsNeeded?.length) {
      for (const vendor of plan.vendorsNeeded) {
        await tx.vendor.create({
          data: {
            eventId: event.id,
            workspaceId: event.workspaceId,
            name: vendor.category,
            category: vendor.category,
            quotedAmount: vendor.estimatedCost,
            bookingStatus: 'TO_RESEARCH',
            paymentStatus: 'NOT_DUE',
            notes: `${vendor.description}\n\nKey questions:\n- ${vendor.keyQuestionsToAsk.join('\n- ')}`,
          },
        });
      }
    }

    // 4. Apply Ideas
    if (applyIdeas && plan.creativeIdeas?.length) {
      for (const idea of plan.creativeIdeas) {
        await tx.idea.create({
          data: {
            eventId: event.id,
            title: idea.title,
            category: idea.category,
            description: idea.description,
            impact: idea.estimatedCostImpact,
            status: 'PROPOSED',
          },
        });
      }
    }

    // Mark plan as approved
    const updatedPlan = await tx.aIPlan.update({
      where: { id: planId },
      data: {
        approved: true,
        appliedAt: new Date(),
      },
    });

    // Log activity
    await tx.activityLog.create({
      data: {
        workspaceId: event.workspaceId,
        eventId: event.id,
        action: 'AI_PLAN_APPLIED',
        details: `Applied AI Plan: ${plan.summary.substring(0, 80)}...`,
      },
    });

    return updatedPlan;
  });
}
