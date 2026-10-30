'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Heart,
  PartyPopper,
  UsersRound,
  Briefcase,
  CheckCircle2,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function NewEventWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'WEDDING',
    startDate: '',
    endDate: '',
    location: '',
    guestCount: 100,
    budgetCeiling: 500000,
    currency: 'INR',
    theme: '',
    formality: 'Semi-formal',
    dietaryNotes: '',
    accessibilityNotes: '',
    notes: '',
  });

  const eventTypes = [
    { id: 'WEDDING', label: 'Wedding & Engagement', icon: Heart, desc: 'Pheras, receptions, intimate vows' },
    { id: 'BIRTHDAY', label: 'Birthday & Anniversary', icon: PartyPopper, desc: 'Milestone celebrations & parties' },
    { id: 'COMMUNITY', label: 'Community & Cultural', icon: UsersRound, desc: 'Festivals, meetups, student gatherings' },
    { id: 'CORPORATE', label: 'Corporate & Conference', icon: Briefcase, desc: 'Seminars, launches, offsites' },
  ];

  const update = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Please enter a descriptive event name');
        return;
      }
      if (!formData.startDate) {
        setError('Please select an event date');
        return;
      }
      if (!formData.location.trim()) {
        setError('Please provide a destination or venue city');
        return;
      }
    }
    if (step === 2) {
      if (!formData.guestCount || formData.guestCount < 1) {
        setError('Please enter an estimated guest count');
        return;
      }
      if (!formData.budgetCeiling || formData.budgetCeiling < 1000) {
        setError('Please specify a realistic budget limit');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      // Redirect to the newly created event workspace
      router.push(`/app/events/${data.event.id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/app/events"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Cancel</span>
          </Link>
          <span className="text-xs font-bold text-brand-600">
            Step {step} of 4: {step === 1 ? 'Event Core' : step === 2 ? 'Guests & Budget' : step === 3 ? 'Style & Details' : 'Review & Launch'}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Tell us about your celebration</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every detail helps our multi-agent AI system tailor recommendations specifically for you.
              </p>
            </div>

            {/* Event Type Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Event Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {eventTypes.map((et) => {
                  const Icon = et.icon;
                  const isSelected = formData.type === et.id;
                  return (
                    <button
                      key={et.id}
                      type="button"
                      onClick={() => update('type', et.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500'
                          : 'border-border bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 ${
                          isSelected ? 'bg-brand-500 text-white' : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{et.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{et.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Ananya & Rohan's Wedding, Aarav's 10th Birthday"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Date and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Event Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => update('startDate', e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Destination / City / Venue</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => update('location', e.target.value)}
                    placeholder="e.g. Udaipur, Rajasthan or South Mumbai"
                    className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Guests & Budget */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Set your budget & guest scope</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our Budget Advisor agent ensures every rupee is allocated with purpose and contingency reserves.
              </p>
            </div>

            {/* Guest Count */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700">Expected Guests</label>
                <span className="text-xs font-bold text-brand-600">{formData.guestCount} guests</span>
              </div>
              <input
                type="number"
                min="5"
                max="5000"
                value={formData.guestCount}
                onChange={(e) => update('guestCount', Number(e.target.value))}
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <p className="text-[11px] text-muted-foreground">
                Approximate attendance is fine; you can refine this later in the Guest Manager.
              </p>
            </div>

            {/* Budget Limit & Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Total Budget Ceiling</label>
              <div className="flex gap-2">
                <select
                  value={formData.currency}
                  onChange={(e) => update('currency', e.target.value)}
                  className="rounded-xl border border-border px-3 py-2.5 text-xs font-bold text-foreground bg-zinc-50 focus:border-brand-500 focus:outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <input
                  type="number"
                  step="5000"
                  min="5000"
                  value={formData.budgetCeiling}
                  onChange={(e) => update('budgetCeiling', Number(e.target.value))}
                  className="flex-1 rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                <span>Planned spend per attendee:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(
                    Math.round(formData.budgetCeiling / Math.max(formData.guestCount, 1)),
                    formData.currency
                  )}
                  /guest
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Style & Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Aesthetics & Hospitality Preferences</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Helps the Creative Ideas and Vendor Coordinator agents craft the mood and catering specifics.
              </p>
            </div>

            {/* Theme */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Theme or Vibe</label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => update('theme', e.target.value)}
                placeholder="e.g. Royal Rajasthani Elegance, Retro 80s Neon, Minimal Garden"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Formality */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Formality Level</label>
              <select
                value={formData.formality}
                onChange={(e) => update('formality', e.target.value)}
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground bg-white focus:border-brand-500 focus:outline-none"
              >
                <option value="Traditional Formal">Traditional Formal (Black Tie / Royal Festive)</option>
                <option value="Semi-formal">Semi-formal (Contemporary Elegant)</option>
                <option value="Casual Fun">Casual Fun (Relaxed Celebration)</option>
                <option value="Smart Casual">Smart Casual (Modern Gathering)</option>
              </select>
            </div>

            {/* Dietary & Accessibility */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Dietary & Cultural Notes (Optional)</label>
              <textarea
                value={formData.dietaryNotes}
                onChange={(e) => update('dietaryNotes', e.target.value)}
                rows={2}
                placeholder="e.g. Jain food counters required, pure vegetarian banquet, live chaat stalls..."
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Organizer Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Organizer Priorities & Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={2}
                placeholder="Must-haves, ceremonial traditions, sunset timing requirements..."
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-foreground placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Review & Launch */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Review your event plan brief</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click create to set up your persistent workspace and generate initial budget, tasks, and vendor recommendations.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-zinc-50/70 p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Event Title:</span>
                <span className="font-bold text-foreground text-sm">{formData.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-semibold text-foreground">{formData.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-semibold text-foreground">{formData.startDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold text-foreground">{formData.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Guests:</span>
                <span className="font-semibold text-foreground">{formData.guestCount} attendees</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Budget Ceiling:</span>
                <span className="font-bold text-brand-700 text-sm">
                  {formatCurrency(formData.budgetCeiling, formData.currency)}
                </span>
              </div>
              {formData.theme && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span className="font-semibold text-foreground">{formData.theme}</span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-xs text-brand-800 flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Automated Multi-Agent Co-Pilot Initialization</p>
                <p className="mt-1 leading-relaxed text-zinc-600 text-[11px]">
                  Upon saving, your workspace will activate live deterministic budgeting, lead-time timeline mapping, and vendor checklist prompts. You can review and adjust any recommendations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 flex items-center justify-between pt-5 border-t border-border">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-md transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Workspace…</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Launch Event Workspace</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
