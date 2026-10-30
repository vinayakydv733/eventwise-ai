'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Lightbulb,
  Plus,
  ArrowLeft,
  Heart,
  Palette,
  UtensilsCrossed,
  Music,
  Check,
  X,
  Loader2,
} from 'lucide-react';

export default function InspirationPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Decor',
    description: '',
    impact: 'Medium',
  });

  const loadIdeas = () => {
    fetch(`/api/events/${eventId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          setEventData(d.event);
          setIdeas(d.event.ideas || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadIdeas();
  }, [eventId]);

  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${eventId}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setForm({ title: '', category: 'Decor', description: '', impact: 'Medium' });
        loadIdeas();
      }
    } catch {
      alert('Failed to add idea');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  // Pre-curated palettes for event theme
  const palettes = [
    { name: 'Royal Twilight', colors: ['#4f46e5', '#7c3aed', '#c084fc', '#f3e8ff', '#1e1b4b'] },
    { name: 'Warm Terracotta Garden', colors: ['#ea580c', '#f97316', '#fed7aa', '#ffedd5', '#431407'] },
    { name: 'Emerald & Gold Luxury', colors: ['#047857', '#10b981', '#f59e0b', '#fef3c7', '#064e3b'] },
  ];

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
              <span>{eventData?.title}</span>
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Creative Inspiration Studio</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curated themes, visual color palettes, catering concepts, and guest interaction rituals.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Custom Idea</span>
        </button>
      </div>

      {/* Color Palettes Section */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Palette className="h-4 w-4 text-brand-600" />
          <span>Curated Color Moodboards</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {palettes.map((p) => (
            <div key={p.name} className="p-4 rounded-xl border border-border bg-zinc-50/50 space-y-2">
              <span className="text-xs font-bold text-foreground">{p.name}</span>
              <div className="flex h-10 rounded-lg overflow-hidden border border-zinc-200">
                {p.colors.map((c, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: c }}
                    className="flex-1 transition-transform hover:scale-105"
                    title={c}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Curated Experience Ideas</h2>
          <span className="text-xs text-muted-foreground">{ideas.length} ideas saved</span>
        </div>

        {ideas.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-white text-xs text-muted-foreground">
            No ideas saved yet. Use the AI Planner on your event dashboard to generate tailored ideas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-xs hover:border-brand-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                      {idea.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Impact: {idea.impact}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{idea.title}</h3>
                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{idea.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-brand-500" />
                    <span>Personalized Concept</span>
                  </span>
                  <span className="font-semibold text-emerald-600">{idea.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Idea Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground">Add Custom Inspiration Idea</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddIdea} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Concept Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Signature Mocktail Live Counter"
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground bg-white"
                  >
                    <option value="Decor">Decor & Ambience</option>
                    <option value="Catering">Food & Beverage</option>
                    <option value="Entertainment">Music & Activity</option>
                    <option value="Guest Experience">Guest Experience</option>
                    <option value="Keepsake">Favors & Gifts</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Budget Impact</label>
                  <select
                    value={form.impact}
                    onChange={(e) => setForm((p) => ({ ...p, impact: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground bg-white"
                  >
                    <option value="Low">Low Cost</option>
                    <option value="Medium">Medium Cost</option>
                    <option value="High">High / Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Description & Execution</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="How will this be executed at the event? What makes it special?"
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
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
                  {submitting ? 'Saving…' : 'Add Idea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
