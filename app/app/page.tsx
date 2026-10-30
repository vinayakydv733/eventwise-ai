'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CalendarDays,
  Plus,
  ArrowRight,
  Wallet,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  WandSparkles,
  Heart,
  PartyPopper,
  UsersRound,
  Briefcase,
} from 'lucide-react';
import { formatCurrency, formatDate, getDaysRemaining } from '@/lib/utils';

export default function WorkspaceOverviewPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Compute aggregated stats
  const totalBudget = events.reduce((sum, e) => sum + (Number(e.budgetCeiling) || 0), 0);
  const totalGuests = events.reduce((sum, e) => sum + (Number(e.guestCount) || 0), 0);
  const totalTasks = events.reduce((sum, e) => sum + (e.tasks?.length || 0), 0);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'WEDDING':
        return <Heart className="h-4 w-4 text-rose-500" />;
      case 'BIRTHDAY':
        return <PartyPopper className="h-4 w-4 text-amber-500" />;
      case 'COMMUNITY':
        return <UsersRound className="h-4 w-4 text-emerald-500" />;
      default:
        return <Briefcase className="h-4 w-4 text-brand-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sharma Celebrations Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Every event, effortlessly extraordinary.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            You have <strong className="text-foreground">{events.length} active events</strong> in planning.
            Your AI co-planners are ready to assist.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/app/ai-planner"
            className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
          >
            <WandSparkles className="h-4 w-4" />
            <span>AI Co-Pilot</span>
          </Link>
          <Link
            href="/app/events/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Event</span>
          </Link>
        </div>
      </div>

      {/* Workspace Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Events</span>
            <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{events.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Across 3 event categories</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Budget Allocated</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{formatCurrency(totalBudget)}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">All guardrails active</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Expected Guests</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalGuests.toLocaleString('en-IN')}</p>
          <p className="text-xs text-muted-foreground mt-1">Hospitality tracking ready</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Checklist Tasks</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">Prioritized milestones</p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">Active Events</h2>
            <p className="text-xs text-muted-foreground">Select an event to open its complete management suite</p>
          </div>
          <Link
            href="/app/events"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl border border-border bg-white/50 animate-pulse p-6" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">No events found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
              Get started by creating your first event with our intelligent planning wizard.
            </p>
            <Link
              href="/app/events/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
              <span>Create Event</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => {
              const countdown = getDaysRemaining(event.startDate);
              const totalSpent = event.expenses
                ?.filter((e: any) => e.status === 'PAID')
                .reduce((s: number, e: any) => s + Number(e.amount), 0) || 0;
              const spendPercent = Math.min(
                100,
                Math.round((totalSpent / Math.max(Number(event.budgetCeiling), 1)) * 100)
              );

              return (
                <div
                  key={event.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-xs hover:border-brand-300 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Header: Type Pill & Countdown */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                        {getEventIcon(event.type)}
                        <span>{event.type}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        {countdown.label}
                      </span>
                    </div>

                    {/* Event Title */}
                    <Link href={`/app/events/${event.id}`}>
                      <h3 className="text-base font-bold text-foreground group-hover:text-brand-600 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                    </Link>

                    {/* Metadata */}
                    <div className="space-y-1.5 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{event.guestCount} guests planned</span>
                      </div>
                    </div>

                    {/* Budget Progress Bar */}
                    <div className="mt-5 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground font-medium">Budget Target</span>
                        <span className="font-bold text-foreground">
                          {formatCurrency(event.budgetCeiling, event.currency)}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all duration-500"
                          style={{ width: `${Math.max(spendPercent, 5)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                        <span>{formatCurrency(totalSpent, event.currency)} spent</span>
                        <span>{spendPercent}% committed</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{event.tasks?.length || 0} tasks</span>
                      <span>·</span>
                      <span>{event.vendors?.length || 0} vendors</span>
                    </div>
                    <Link
                      href={`/app/events/${event.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
