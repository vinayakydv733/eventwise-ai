'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Mail,
  Utensils,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';

export default function GuestsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [guests, setGuests] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    group: 'FAMILY',
    rsvpStatus: 'ATTENDING',
    plusOnes: 0,
    dietaryNeeds: '',
    notes: '',
  });

  const loadGuests = () => {
    fetch(`/api/events/${eventId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          setEventData(d.event);
          setGuests(d.event.guests || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadGuests();
  }, [eventId]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${eventId}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setForm({
          name: '',
          email: '',
          phone: '',
          group: 'FAMILY',
          rsvpStatus: 'ATTENDING',
          plusOnes: 0,
          dietaryNeeds: '',
          notes: '',
        });
        loadGuests();
      }
    } catch {
      alert('Failed to add guest');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRSVP = async (guestId: string, rsvpStatus: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/guests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId, rsvpStatus }),
      });
      if (res.ok) loadGuests();
    } catch {
      alert('Failed to update RSVP');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  let filtered = [...guests];
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.email?.toLowerCase().includes(q) ||
        g.dietaryNeeds?.toLowerCase().includes(q)
    );
  }
  if (groupFilter !== 'ALL') {
    filtered = filtered.filter((g) => g.group === groupFilter);
  }

  const attendingCount = guests.filter((g) => g.rsvpStatus === 'ATTENDING').length;
  const plusOnesTotal = guests.filter((g) => g.rsvpStatus === 'ATTENDING').reduce((s, g) => s + (g.plusOnes || 0), 0);
  const totalAttendingHeads = attendingCount + plusOnesTotal;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/app/events/${eventId}`}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{eventData?.title}</span>
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Guest Hospitality & RSVP Tracker</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage invitations, attendee groups, plus-ones, and dietary restrictions.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Guest</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Confirmed Attendees</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {totalAttendingHeads}{' '}
            <span className="text-xs font-normal text-muted-foreground">
              ({attendingCount} primaries + {plusOnesTotal} plus-ones)
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Planning Capacity</span>
          <p className="text-2xl font-bold text-foreground mt-1">
            {eventData?.guestCount} <span className="text-xs font-normal text-muted-foreground">guests target</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Special Dietary Needs</span>
          <p className="text-2xl font-bold text-brand-600 mt-1">
            {guests.filter((g) => g.dietaryNeeds).length}{' '}
            <span className="text-xs font-normal text-muted-foreground">logged</span>
          </p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guests or dietary needs..."
                className="rounded-lg border border-border pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-brand-500 w-52 sm:w-64"
              />
            </div>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground bg-zinc-50"
            >
              <option value="ALL">All Groups</option>
              <option value="FAMILY">Family</option>
              <option value="FRIENDS">Friends</option>
              <option value="VIP">VIP</option>
              <option value="COLLEAGUES">Colleagues</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No guests found. Click &quot;Add Guest&quot; above to log your guest list.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/70 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Guest Name</th>
                  <th className="px-5 py-3">Group</th>
                  <th className="px-5 py-3">RSVP Status</th>
                  <th className="px-5 py-3">Plus Ones</th>
                  <th className="px-5 py-3">Dietary / Hospitality Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((guest) => (
                  <tr key={guest.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-foreground">{guest.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                        {guest.group}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={guest.rsvpStatus}
                        onChange={(e) => handleUpdateRSVP(guest.id, e.target.value)}
                        className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
                          guest.rsvpStatus === 'ATTENDING'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            : guest.rsvpStatus === 'DECLINED'
                            ? 'border-rose-300 bg-rose-50 text-rose-700'
                            : 'border-zinc-300 bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        <option value="ATTENDING">Attending</option>
                        <option value="DECLINED">Declined</option>
                        <option value="TENTATIVE">Tentative</option>
                        <option value="NO_REPLY">No Reply</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 font-semibold">+{guest.plusOnes}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {guest.dietaryNeeds || 'None logged'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground">Add Guest to List</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddGuest} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Guest / Family Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Sunil & Anita Gupta"
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Group</label>
                  <select
                    value={form.group}
                    onChange={(e) => setForm((p) => ({ ...p, group: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground bg-white"
                  >
                    <option value="FAMILY">Family</option>
                    <option value="FRIENDS">Friends</option>
                    <option value="VIP">VIP</option>
                    <option value="COLLEAGUES">Colleagues</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Additional Plus-Ones</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={form.plusOnes}
                    onChange={(e) => setForm((p) => ({ ...p, plusOnes: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Dietary Preferences</label>
                <input
                  type="text"
                  value={form.dietaryNeeds}
                  onChange={(e) => setForm((p) => ({ ...p, dietaryNeeds: e.target.value }))}
                  placeholder="e.g. Jain meal, Vegan, Nut allergy..."
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover"
                >
                  {submitting ? 'Saving…' : 'Add Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
