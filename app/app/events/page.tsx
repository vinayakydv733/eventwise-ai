'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Wallet,
  ArrowRight,
  Heart,
  PartyPopper,
  UsersRound,
  Briefcase,
  Trash2,
} from 'lucide-react';
import { formatCurrency, formatDate, getDaysRemaining } from '@/lib/utils';

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data) => {
        setEvents(data.events || []);
        setFilteredEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...events];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.theme?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'ALL') {
      result = result.filter((e) => e.type === typeFilter);
    }
    setFilteredEvents(result);
  }, [search, typeFilter, events]);

  const handleDelete = async (eventId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      }
    } catch (e) {
      alert('Failed to delete event');
    }
  };

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">My Events Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your scheduled events, timelines, vendor contracts, and budget allocations.
          </p>
        </div>
        <Link
          href="/app/events/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs transition-colors self-start"
        >
          <Plus className="h-4 w-4" />
          <span>New Event</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, location, or theme..."
            className="w-full rounded-lg border border-border pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'WEDDING', 'BIRTHDAY', 'COMMUNITY', 'CORPORATE'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                typeFilter === type
                  ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-60 rounded-2xl border border-border bg-white animate-pulse p-6" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-foreground">No matching events</h3>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => {
            const countdown = getDaysRemaining(event.startDate);
            const totalSpent =
              event.expenses
                ?.filter((e: any) => e.status === 'PAID')
                .reduce((s: number, e: any) => s + Number(e.amount), 0) || 0;
            const spendPercent = Math.min(
              100,
              Math.round((totalSpent / Math.max(Number(event.budgetCeiling), 1)) * 100)
            );

            return (
              <div
                key={event.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-xs hover:border-brand-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                      {getEventIcon(event.type)}
                      <span>{event.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        {countdown.label}
                      </span>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Event"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <Link href={`/app/events/${event.id}`}>
                    <h3 className="text-base font-bold text-foreground group-hover:text-brand-600 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                  </Link>

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

                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-bold text-foreground">
                        {formatCurrency(event.budgetCeiling, event.currency)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${Math.max(spendPercent, 5)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {event.tasks?.length || 0} tasks · {event.vendors?.length || 0} vendors
                  </span>
                  <Link
                    href={`/app/events/${event.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
                  >
                    <span>Manage</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
