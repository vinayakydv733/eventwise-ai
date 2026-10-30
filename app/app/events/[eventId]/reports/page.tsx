'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  FileBarChart2,
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wallet,
  Users,
  Store,
  Loader2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ReportsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const { event, stats } = data;
  const budget = stats.budget;
  const taskStats = stats.tasks;

  // Calculate overall Readiness Score (0 to 100)
  const taskWeight = Math.min(50, Math.round(taskStats.percentComplete * 0.5));
  const vendorBookedRatio =
    event.vendors?.length > 0
      ? (event.vendors.filter((v: any) => v.bookingStatus === 'BOOKED').length /
          event.vendors.length) *
        30
      : 15;
  const budgetHealthScore = budget.isOverBudget ? 5 : 20;
  const readinessScore = Math.min(100, Math.round(taskWeight + vendorBookedRatio + budgetHealthScore));

  return (
    <div className="space-y-8 max-w-4xl mx-auto print:p-0 print:space-y-4">
      {/* Action Header - hidden in print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
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
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Executive Event Audit & Report</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Holistic event readiness evaluation, financial summary, and printable operational brief.
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
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex items-start justify-between pb-6 border-b border-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
              Eventwise AI Executive Briefing
            </span>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">{event.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {event.type} · {formatDate(event.startDate)} · {event.location}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex flex-col items-center justify-center rounded-2xl border border-brand-200 bg-brand-50/70 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">Readiness Score</span>
              <span className="text-2xl font-extrabold text-brand-700 mt-0.5">{readinessScore}%</span>
            </div>
          </div>
        </div>

        {/* Section 1: Financial Health Audit */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span>1. Financial & Budget Integrity</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-muted-foreground block text-[11px]">Budget Ceiling</span>
              <span className="font-bold text-foreground text-sm mt-0.5 block">
                {formatCurrency(budget.budgetCeiling, event.currency)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-muted-foreground block text-[11px]">Total Allocated</span>
              <span className="font-bold text-foreground text-sm mt-0.5 block">
                {formatCurrency(budget.totalAllocated, event.currency)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-muted-foreground block text-[11px]">Actual Spent</span>
              <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
                {formatCurrency(budget.totalActualSpent, event.currency)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-muted-foreground block text-[11px]">Remaining Liquidity</span>
              <span className="font-bold text-foreground text-sm mt-0.5 block">
                {formatCurrency(budget.remainingBudget, event.currency)}
              </span>
            </div>
          </div>

          {/* Category Allocation Table */}
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs border border-border rounded-xl">
              <thead className="bg-zinc-50 border-b border-border text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Allocated Target</th>
                  <th className="p-2.5">Committed Spend</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {budget.categories.map((c: any) => (
                  <tr key={c.id}>
                    <td className="p-2.5 font-semibold text-foreground">{c.name}</td>
                    <td className="p-2.5">{formatCurrency(c.allocatedAmount, event.currency)}</td>
                    <td className="p-2.5 font-bold">{formatCurrency(c.committedAmount, event.currency)}</td>
                    <td className="p-2.5 text-[11px] font-semibold uppercase">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Milestone Health */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>2. Milestone & Checklist Execution</span>
          </h3>

          <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <div>
              <span className="font-bold text-foreground">{taskStats.completed} completed</span>
              <span className="text-muted-foreground"> of {taskStats.total} milestones total</span>
            </div>
            <span className="text-xs font-bold text-brand-700">{taskStats.percentComplete}% on schedule</span>
          </div>
        </div>

        {/* Section 3: Vendor Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" />
            <span>3. Vendor Sourcing & Booking Audit</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-border rounded-xl">
              <thead className="bg-zinc-50 border-b border-border text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="p-2.5">Vendor</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Quoted Price</th>
                  <th className="p-2.5">Booking Status</th>
                  <th className="p-2.5">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {event.vendors.map((v: any) => (
                  <tr key={v.id}>
                    <td className="p-2.5 font-semibold text-foreground">{v.name}</td>
                    <td className="p-2.5 text-muted-foreground">{v.category}</td>
                    <td className="p-2.5 font-bold">
                      {v.quotedAmount ? formatCurrency(v.quotedAmount, event.currency) : 'Pending'}
                    </td>
                    <td className="p-2.5 text-[11px] font-semibold">{v.bookingStatus.replace('_', ' ')}</td>
                    <td className="p-2.5 text-[11px] text-muted-foreground">{v.paymentStatus.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Generated by Eventwise AI Platform</span>
          <span>Snapshot Date: {formatDate(new Date())}</span>
        </div>
      </div>
    </div>
  );
}
