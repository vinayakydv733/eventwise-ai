'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Clock,
  ClipboardList,
  Store,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Download,
  WandSparkles,
  ChevronRight,
  ArrowRight,
  Loader2,
  Check,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, formatDate, getDaysRemaining } from '@/lib/utils';

export default function EventDashboardPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const fetchEvent = () => {
    fetch(`/api/events/${eventId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setEventData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleGeneratePlan = async () => {
    setGeneratingAI(true);
    setAiNotice(null);
    try {
      const res = await fetch(`/api/events/${eventId}/ai-plan`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate plan');

      // Auto-apply or show confirmation notice
      const applyRes = await fetch(`/api/events/${eventId}/ai-plan/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: data.planId }),
      });
      const applyData = await applyRes.json();

      setAiNotice(
        data.plan.isFallback
          ? 'Generated structured plan using deterministic domain templates. Added budget allocations, milestones, and vendor tasks.'
          : 'Personalized AI plan successfully orchestrated across Budget, Timeline, Vendor, and Idea specialists!'
      );
      fetchEvent();
    } catch (e: any) {
      setAiNotice(e.message || 'Error running AI planner');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    window.open(`/api/events/${eventId}/export?format=${format}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!eventData || !eventData.event) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-border">
        <h2 className="text-base font-bold text-foreground">Event not found</h2>
        <Link href="/app/events" className="mt-3 inline-block text-xs text-brand-600 font-semibold">
          Return to Events
        </Link>
      </div>
    );
  }

  const { event, stats } = eventData;
  const budget = stats.budget;
  const countdown = stats.countdown;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
              {event.type}
            </span>
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
              {countdown.label}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{formatDate(event.startDate)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              <span>{event.guestCount} guests planned</span>
            </div>
            {event.theme && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                <span>Theme: {event.theme}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={handleGeneratePlan}
            disabled={generatingAI}
            className="flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-700 hover:bg-brand-100 transition-colors shadow-xs"
          >
            {generatingAI ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Orchestrating Plan…</span>
              </>
            ) : (
              <>
                <WandSparkles className="h-3.5 w-3.5" />
                <span>Generate AI Plan</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleExport('json')}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>

          <Link
            href={`/app/events/${eventId}/budget`}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {/* AI Notification Banner if generated */}
      {aiNotice && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-xs text-brand-800 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Multi-Agent Planning System Notice</p>
              <p className="mt-0.5 text-zinc-600 leading-relaxed text-[11px]">{aiNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setAiNotice(null)}
            className="text-zinc-400 hover:text-zinc-600 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget Card */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Budget Ceiling</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatCurrency(budget.budgetCeiling, event.currency)}
          </p>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border text-muted-foreground">
            <span>{event.categories.length} categories</span>
            <span className="font-semibold text-emerald-600">
              {formatCurrency(budget.remainingBudget, event.currency)} remaining
            </span>
          </div>
        </div>

        {/* Actual Spend Card */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Actual Spent</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatCurrency(budget.totalActualSpent, event.currency)}
          </p>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border text-muted-foreground">
            <span>{formatCurrency(budget.totalPending, event.currency)} pending</span>
            <span>
              {budget.budgetCeiling > 0
                ? Math.round((budget.totalCommitted / budget.budgetCeiling) * 100)
                : 0}
              % committed
            </span>
          </div>
        </div>

        {/* Tasks Progress Card */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Checklist Progress</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {stats.tasks.completed}{' '}
            <span className="text-sm font-normal text-muted-foreground">/ {stats.tasks.total} done</span>
          </p>
          <div className="mt-2.5">
            <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${stats.tasks.percentComplete}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
              <span>{stats.tasks.inProgress} in progress</span>
              <span>{stats.tasks.overdue} overdue</span>
            </div>
          </div>
        </div>

        {/* Guest RSVP Card */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Guest Headcount</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {stats.rsvp.attending}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              / {event.guestCount} confirmed
            </span>
          </p>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border text-muted-foreground">
            <span>{stats.rsvp.tentative} tentative</span>
            <span>{formatCurrency(budget.costPerGuestPlanned, event.currency)}/guest</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Budget Distribution & Milestones (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Allocation Panel */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">Budget Allocation Breakdown</h2>
                <p className="text-xs text-muted-foreground">
                  Give every rupee a designated purpose. Managed with deterministic financial integrity.
                </p>
              </div>
              <Link
                href={`/app/events/${eventId}/budget`}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Full Planner</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Stacked Percentage Bar */}
            <div className="h-4 w-full rounded-full bg-zinc-100 flex overflow-hidden my-3">
              {budget.categories.map((cat: any, i: number) => {
                const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#64748b'];
                const bg = colors[i % colors.length];
                return (
                  <div
                    key={cat.id}
                    title={`${cat.name}: ${formatCurrency(cat.allocatedAmount, event.currency)} (${cat.percentOfBudget}%)`}
                    style={{ width: `${cat.percentOfBudget}%`, backgroundColor: bg }}
                    className="h-full transition-all hover:opacity-90"
                  />
                );
              })}
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {budget.categories.slice(0, 6).map((cat: any, i: number) => {
                const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#64748b'];
                const bg = colors[i % colors.length];
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 bg-zinc-50/50 text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: bg }} />
                      <span className="font-semibold text-foreground truncate">{cat.name}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-foreground">
                        {formatCurrency(cat.allocatedAmount, event.currency)}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">{cat.percentOfBudget}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Timeline Milestones */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">Upcoming Milestones</h2>
                <p className="text-xs text-muted-foreground">Calculated lead times to keep execution on track</p>
              </div>
              <Link
                href={`/app/events/${eventId}/timeline`}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Full Timeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {event.tasks.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-xl">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No tasks scheduled yet.</p>
                <button
                  onClick={handleGeneratePlan}
                  className="mt-2 text-xs font-bold text-brand-600 hover:underline"
                >
                  Generate initial timeline with AI →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {event.tasks.slice(0, 5).map((task: any) => {
                  const isDone = task.status === 'COMPLETED';
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-zinc-50/40 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            isDone
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                              : 'border-zinc-300 bg-white text-zinc-400'
                          }`}
                        >
                          {isDone ? <Check className="h-3.5 w-3.5" /> : null}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDone ? 'line-through text-zinc-400' : 'text-foreground'}`}>
                            {task.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No date set'} · {task.category}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'HIGH' || task.priority === 'URGENT'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Vendor Status & Creative Ideas (1 Col) */}
        <div className="space-y-6">
          {/* Vendor Booking Status */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Vendor Status</h2>
              <Link
                href={`/app/events/${eventId}/vendors`}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Directory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {event.vendors.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-border rounded-xl">
                <Store className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No vendors logged yet.</p>
                <Link
                  href={`/app/events/${eventId}/vendors`}
                  className="mt-2 inline-block text-xs font-bold text-brand-600 hover:underline"
                >
                  Add vendor quote →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {event.vendors.slice(0, 4).map((v: any) => (
                  <div key={v.id} className="p-3 rounded-xl border border-border bg-zinc-50/50 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{v.name}</span>
                      <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                        {v.bookingStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                      <span>{v.category}</span>
                      <span className="font-semibold text-foreground">
                        {v.quotedAmount ? formatCurrency(v.quotedAmount, event.currency) : 'Pending quote'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inspiration Concept Highlight */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>AI Inspiration Pick</span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              {event.ideas?.[0]?.title || 'Golden Hour Lakefront Rituals'}
            </h3>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              {event.ideas?.[0]?.description ||
                'Align ceremony and photography with evening light for optimal ambience, followed by acoustic live performance.'}
            </p>
            <Link
              href={`/app/events/${eventId}/inspiration`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
            >
              <span>Explore Inspiration Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
