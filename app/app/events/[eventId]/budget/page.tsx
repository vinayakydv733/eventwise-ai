'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  TrendingUp,
  Search,
  Filter,
  ArrowLeft,
  X,
  Loader2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BudgetPlannerPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    categoryId: '',
    status: 'PAID',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    allocatedAmount: '',
    color: '#6366f1',
  });

  const loadData = () => {
    fetch(`/api/events/${eventId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          setData(d);
          if (d.event?.categories?.length > 0 && !expenseForm.categoryId) {
            setExpenseForm((prev) => ({ ...prev, categoryId: d.event.categories[0].id }));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.categoryId) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${eventId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: expenseForm.title,
          amount: Number(expenseForm.amount),
          categoryId: expenseForm.categoryId,
          status: expenseForm.status,
          paymentDate: expenseForm.paymentDate,
          notes: expenseForm.notes,
        }),
      });

      if (res.ok) {
        setIsAddExpenseOpen(false);
        setExpenseForm({
          title: '',
          amount: '',
          categoryId: data?.event?.categories?.[0]?.id || '',
          status: 'PAID',
          paymentDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
        loadData();
      }
    } catch {
      alert('Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.allocatedAmount) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${eventId}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryForm.name,
          allocatedAmount: Number(categoryForm.allocatedAmount),
          color: categoryForm.color,
        }),
      });

      if (res.ok) {
        setIsAddCategoryOpen(false);
        setCategoryForm({ name: '', allocatedAmount: '', color: '#6366f1' });
        loadData();
      }
    } catch {
      alert('Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense transaction?')) return;
    try {
      const res = await fetch(`/api/events/${eventId}/expenses/${expenseId}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch {
      alert('Failed to delete expense');
    }
  };

  const handleToggleStatus = async (expense: any) => {
    const nextStatus = expense.status === 'PAID' ? 'PENDING' : 'PAID';
    try {
      const res = await fetch(`/api/events/${eventId}/expenses/${expense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) loadData();
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const { event, stats } = data;
  const audit = stats.budget;

  // Filter expenses
  let filteredExpenses = event.expenses || [];
  if (search.trim()) {
    const q = search.toLowerCase();
    filteredExpenses = filteredExpenses.filter(
      (e: any) => e.title.toLowerCase().includes(q) || e.category?.name.toLowerCase().includes(q)
    );
  }
  if (statusFilter !== 'ALL') {
    filteredExpenses = filteredExpenses.filter((e: any) => e.status === statusFilter);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/app/events/${eventId}`}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{event.title}</span>
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Budget & Expense Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deterministic allocation, committed expenditure, and automated variance analysis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.open(`/api/events/${eventId}/export?format=csv`, '_blank')}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Warnings Banner if any */}
      {audit.warnings && audit.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-1 text-xs text-amber-800">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Budget Integrity Guardrails</span>
          </div>
          {audit.warnings.map((w: string, i: number) => (
            <p key={i} className="text-[11px] leading-relaxed pl-6">
              • {w}
            </p>
          ))}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Total Budget Limit</span>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatCurrency(audit.budgetCeiling, event.currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(audit.costPerGuestPlanned, event.currency)} / guest ceiling
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Total Allocated</span>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatCurrency(audit.totalAllocated, event.currency)}
          </p>
          <p className="text-xs text-brand-600 font-semibold mt-1">
            {audit.unallocatedBudget >= 0
              ? `${formatCurrency(audit.unallocatedBudget, event.currency)} unallocated`
              : 'Over-allocated!'}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Actual Spent</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {formatCurrency(audit.totalActualSpent, event.currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(audit.totalPending, event.currency)} pending confirmation
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Remaining Budget</span>
          <p
            className={`text-2xl font-bold mt-2 ${
              audit.remainingBudget >= 0 ? 'text-foreground' : 'text-rose-600'
            }`}
          >
            {formatCurrency(audit.remainingBudget, event.currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Available for allocation</p>
        </div>
      </div>

      {/* Category Allocations Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground">Category Targets & Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audit.categories.map((cat: any) => (
            <div key={cat.id} className="rounded-xl border border-border bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground truncate">{cat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cat.status === 'over'
                      ? 'bg-rose-50 text-rose-700'
                      : cat.status === 'warning'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {cat.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Allocated:</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(cat.allocatedAmount, event.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Spent / Committed:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(cat.committedAmount, event.currency)}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full ${
                    cat.status === 'over' ? 'bg-rose-500' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(cat.percentSpent, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Transactions Table */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-foreground">Expense Records</h2>
            <p className="text-xs text-muted-foreground">All recorded payments, quotes, and deposits</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search expenses..."
                className="rounded-lg border border-border pl-8 pr-3 py-1 text-xs text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-brand-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border px-2.5 py-1 text-xs text-foreground bg-zinc-50"
            >
              <option value="ALL">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No expenses found. Click &quot;Record Expense&quot; above to log your first transaction.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/70 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Expense Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.map((exp: any) => (
                  <tr key={exp.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-foreground">{exp.title}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{exp.category?.name || 'General'}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {exp.paymentDate ? formatDate(exp.paymentDate) : 'Pending date'}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-foreground">
                      {formatCurrency(exp.amount, event.currency)}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(exp)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                          exp.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            exp.status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>{exp.status}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground">Record New Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Venue advance, Sound system rental"
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Category</label>
                <select
                  value={expenseForm.categoryId}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground bg-white focus:outline-none focus:border-brand-500"
                >
                  {event.categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Amount ({event.currency})</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="25000"
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Status</label>
                  <select
                    value={expenseForm.status}
                    onChange={(e) => setExpenseForm((p) => ({ ...p, status: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground bg-white"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Payment Date</label>
                <input
                  type="date"
                  value={expenseForm.paymentDate}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, paymentDate: e.target.value }))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover"
                >
                  {submitting ? 'Saving…' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground">Add Budget Category</h3>
              <button onClick={() => setIsAddCategoryOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Fireworks & Special FX"
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Allocated Target ({event.currency})</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={categoryForm.allocatedAmount}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, allocatedAmount: e.target.value }))}
                  placeholder="30000"
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover"
                >
                  {submitting ? 'Creating…' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
