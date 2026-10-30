'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  WandSparkles,
  Sparkles,
  CheckCircle2,
  Clock,
  Wallet,
  Store,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Check,
  AlertCircle,
  CalendarDays,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AIPlannerStudioPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Approval options
  const [applyOptions, setApplyOptions] = useState({
    applyBudget: true,
    applyTimeline: true,
    applyVendors: true,
    applyIdeas: true,
  });

  useEffect(() => {
    fetch('/api/events')
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data) => {
        setEvents(data.events || []);
        if (data.events?.length > 0) {
          setSelectedEventId(data.events[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!selectedEventId) return;
    setGenerating(true);
    setError(null);
    setGeneratedPlan(null);
    setAppliedSuccess(false);

    try {
      const res = await fetch(`/api/events/${selectedEventId}/ai-plan`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate plan');

      setGeneratedPlan(data.plan);
      setSavedPlanId(data.planId);
    } catch (e: any) {
      setError(e.message || 'Error communicating with AI orchestration engine');
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = async () => {
    if (!savedPlanId || !selectedEventId) return;
    setApplying(true);

    try {
      const res = await fetch(`/api/events/${selectedEventId}/ai-plan/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: savedPlanId,
          ...applyOptions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply plan');

      setAppliedSuccess(true);
    } catch (e: any) {
      alert(e.message || 'Error applying plan');
    } finally {
      setApplying(false);
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Studio Header */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
          <Sparkles className="h-4 w-4" />
          <span>Multi-Agent AI Planning Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Coordinated Specialist Agents for Your Celebration
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
          Eventwise orchestrates 7 specialized planning domains: Budget Advisor, Timeline Planner, Vendor Coordinator,
          Creative Ideas Specialist, and Risk Assessment.
        </p>

        {/* Event Picker & Trigger */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-5 border-t border-brand-200">
          <div className="flex-1">
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">Select Event to Plan:</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full rounded-xl border border-brand-200 bg-white px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} ({e.type} · {formatCurrency(e.budgetCeiling, e.currency)})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !selectedEventId}
            className="sm:self-end flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-md transition-all disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Orchestrating Specialists…</span>
              </>
            ) : (
              <>
                <WandSparkles className="h-4 w-4" />
                <span>Generate Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Applied Success Message */}
      {appliedSuccess && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-xs text-emerald-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Plan Successfully Integrated into Workspace!</p>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                Budget categories, milestones, and vendor tasks have been populated.
              </p>
            </div>
          </div>
          <Link
            href={`/app/events/${selectedEventId}`}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700 transition-colors"
          >
            Open Dashboard →
          </Link>
        </div>
      )}

      {/* Generated Plan Review Panel */}
      {generatedPlan && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Summary Card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
                {generatedPlan.isFallback ? 'Deterministic Domain Template' : 'Live OpenAI Orchestration'}
              </span>
              <span className="text-xs text-muted-foreground">Status: Awaiting Your Review</span>
            </div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">Executive Strategy</h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">{generatedPlan.summary}</p>

            {/* Theme concept */}
            {generatedPlan.theme && (
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-xs space-y-2">
                <span className="font-bold text-foreground">Theme Concept: {generatedPlan.theme.name}</span>
                <p className="text-muted-foreground text-[11px]">{generatedPlan.theme.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-zinc-500 font-semibold">Palette:</span>
                  <div className="flex gap-1.5">
                    {generatedPlan.theme.colorPalette?.map((c: string, i: number) => (
                      <span key={i} className="h-4 w-4 rounded-full border border-zinc-200" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Specialist Output Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Budget Advisor Output */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Wallet className="h-4 w-4 text-primary" />
                <span>Budget Advisor Recommendations</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {generatedPlan.budgetAllocations?.map((b: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div>
                      <span className="font-semibold text-foreground">{b.category}</span>
                      <span className="text-[11px] text-muted-foreground block">{b.note}</span>
                    </div>
                    <span className="font-bold text-foreground shrink-0">
                      {formatCurrency(b.amount, selectedEvent?.currency)} ({b.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Timeline Planner Output */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Timeline Planner Milestones</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {generatedPlan.timeline?.slice(0, 5).map((t: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-700 text-[11px]">{t.timeframe}</span>
                      <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded font-semibold text-zinc-600">
                        {t.priority}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground">{t.task}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Vendor Coordinator Output */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Store className="h-4 w-4 text-primary" />
                <span>Vendor Coordinator Checklist</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {generatedPlan.vendorsNeeded?.map((v: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{v.category}</span>
                      <span className="font-bold text-emerald-600 text-[11px]">
                        Target: {formatCurrency(v.estimatedCost, selectedEvent?.currency)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Risk Assessment Specialist Output */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                <span>Risk Assessment & Mitigations</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {generatedPlan.risksAndMitigations?.map((r: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">{r.risk}</span>
                      <span className="text-[10px] font-bold text-rose-700">{r.severity} Risk</span>
                    </div>
                    <p className="text-[11px] text-zinc-600">
                      <strong>Mitigation:</strong> {r.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selective Approval & Application Box */}
          <div className="rounded-2xl border border-brand-200 bg-white p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Selective Plan Approval</h3>
            <p className="text-xs text-muted-foreground">
              Choose which modules to populate into your active event workspace.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { key: 'applyBudget', label: 'Budget Targets' },
                { key: 'applyTimeline', label: 'Timeline Milestones' },
                { key: 'applyVendors', label: 'Vendor Directory' },
                { key: 'applyIdeas', label: 'Creative Ideas' },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border bg-zinc-50 cursor-pointer hover:bg-zinc-100"
                >
                  <input
                    type="checkbox"
                    checked={(applyOptions as any)[opt.key]}
                    onChange={(e) =>
                      setApplyOptions((prev) => ({ ...prev, [opt.key]: e.target.checked }))
                    }
                    className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-semibold text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
              <button
                onClick={handleApply}
                disabled={applying || appliedSuccess}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-md disabled:opacity-50"
              >
                {applying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Applying Changes…</span>
                  </>
                ) : appliedSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Applied to Workspace</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve & Apply Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
