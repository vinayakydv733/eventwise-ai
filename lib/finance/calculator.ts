export interface CategorySummary {
  id: string;
  name: string;
  allocatedAmount: number;
  actualSpent: number;
  pendingAmount: number;
  committedAmount: number;
  remainingAmount: number;
  percentOfBudget: number;
  percentSpent: number;
  status: 'under' | 'on_track' | 'warning' | 'over';
}

export interface BudgetAuditResult {
  budgetCeiling: number;
  totalAllocated: number;
  totalActualSpent: number;
  totalPending: number;
  totalCommitted: number;
  remainingBudget: number;
  isOverBudget: boolean;
  unallocatedBudget: number;
  costPerGuestPlanned: number;
  costPerGuestActual: number;
  categories: CategorySummary[];
  warnings: string[];
}

export function auditBudget(
  budgetCeiling: number,
  guestCount: number,
  categories: Array<{
    id: string;
    name: string;
    allocatedAmount: number;
  }>,
  expenses: Array<{
    categoryId: string;
    amount: number;
    status: string;
  }>
): BudgetAuditResult {
  const ceiling = Math.max(0, Math.round(budgetCeiling));
  const guests = Math.max(1, guestCount || 1);

  let totalAllocated = 0;
  let totalActualSpent = 0;
  let totalPending = 0;

  // Group expenses by category
  const expenseMap = new Map<string, { actual: number; pending: number }>();
  for (const exp of expenses) {
    const cur = expenseMap.get(exp.categoryId) || { actual: 0, pending: 0 };
    const amount = Math.max(0, Math.round(exp.amount));
    if (exp.status === 'PAID') {
      cur.actual += amount;
      totalActualSpent += amount;
    } else if (exp.status === 'PENDING') {
      cur.pending += amount;
      totalPending += amount;
    }
    expenseMap.set(exp.categoryId, cur);
  }

  const categorySummaries: CategorySummary[] = [];
  const warnings: string[] = [];

  for (const cat of categories) {
    const alloc = Math.max(0, Math.round(cat.allocatedAmount));
    totalAllocated += alloc;
    const { actual, pending } = expenseMap.get(cat.id) || { actual: 0, pending: 0 };
    const committed = actual + pending;
    const remaining = alloc - committed;

    let status: 'under' | 'on_track' | 'warning' | 'over' = 'on_track';
    if (committed > alloc) {
      status = 'over';
      warnings.push(`Category "${cat.name}" is over budget by ₹${(committed - alloc).toLocaleString('en-IN')}`);
    } else if (committed > alloc * 0.9) {
      status = 'warning';
    } else if (committed < alloc * 0.5) {
      status = 'under';
    }

    const percentOfBudget = ceiling > 0 ? Math.round((alloc / ceiling) * 100) : 0;
    const percentSpent = alloc > 0 ? Math.round((committed / alloc) * 100) : 0;

    categorySummaries.push({
      id: cat.id,
      name: cat.name,
      allocatedAmount: alloc,
      actualSpent: actual,
      pendingAmount: pending,
      committedAmount: committed,
      remainingAmount: remaining,
      percentOfBudget,
      percentSpent,
      status,
    });
  }

  const totalCommitted = totalActualSpent + totalPending;
  const remainingBudget = ceiling - totalActualSpent;
  const isOverBudget = totalCommitted > ceiling;
  const unallocatedBudget = ceiling - totalAllocated;

  if (totalAllocated > ceiling) {
    warnings.push(
      `Total category allocations (₹${totalAllocated.toLocaleString('en-IN')}) exceed the overall budget ceiling (₹${ceiling.toLocaleString('en-IN')}).`
    );
  }

  if (isOverBudget) {
    warnings.push(
      `Total committed expenses (₹${totalCommitted.toLocaleString('en-IN')}) exceed the budget limit by ₹${(totalCommitted - ceiling).toLocaleString('en-IN')}.`
    );
  }

  return {
    budgetCeiling: ceiling,
    totalAllocated,
    totalActualSpent,
    totalPending,
    totalCommitted,
    remainingBudget,
    isOverBudget,
    unallocatedBudget,
    costPerGuestPlanned: Math.round(ceiling / guests),
    costPerGuestActual: Math.round(totalActualSpent / guests),
    categories: categorySummaries,
    warnings,
  };
}
