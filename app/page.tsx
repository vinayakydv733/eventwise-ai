'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Wallet,
  Clock3,
  Store,
  Heart,
  PartyPopper,
  UsersRound,
  Briefcase,
  Menu,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const eventTypes = [
    {
      title: 'Weddings & Engagements',
      icon: Heart,
      desc: 'Pheras, sangeet, and lakefront receptions planned with cultural reverence and budget guardrails.',
      href: '/features/wedding-planner',
    },
    {
      title: 'Birthdays & Milestones',
      icon: PartyPopper,
      desc: 'Kids parties, milestone 50ths, and themed celebrations with curated games and custom cakes.',
      href: '/features/birthday-planner',
    },
    {
      title: 'Community & Cultural Meetups',
      icon: UsersRound,
      desc: 'Open-source summits, college fests, cultural nights, and volunteer coordination.',
      href: '/app/events/new',
    },
    {
      title: 'Corporate Conferences',
      icon: Briefcase,
      desc: 'Seminars, tech hackathons, sponsor expos, and executive retreats with precision logistics.',
      href: '/app/events/new',
    },
  ];

  const features = [
    {
      icon: Wallet,
      title: 'Deterministic Budget Guardrails',
      desc: 'Integer-based calculations with zero floating point errors. Automated contingency reserves and per-guest metrics.',
    },
    {
      icon: Clock3,
      title: 'Backwards-Planned Roadmap',
      desc: 'Lead-time calculation based on your event date. Automatically flags overdue milestones and conflicting lead times.',
    },
    {
      icon: Store,
      title: 'Vendor Sourcing & Quotes',
      desc: 'Track quotes, booking stages, payment disbursements, and checklist questions before you sign any contract.',
    },
    {
      icon: Sparkles,
      title: '7 Specialized AI Agents',
      desc: 'Orchestrating Budget, Timeline, Vendors, Creative Themes, and Risk Assessment simultaneously.',
    },
  ];

  const faqs = [
    {
      q: 'How does the multi-agent AI architecture work?',
      a: 'Rather than trusting a single language model prompt with both creative themes and math, Eventwise coordinates specialized agents: the Budget Advisor handles category distributions, the Timeline Planner calculates backwards schedules, the Vendor Coordinator identifies services, and deterministic application code verifies that all amounts sum exactly to your budget ceiling.',
    },
    {
      q: 'Does Eventwise work without an OpenAI API key?',
      a: 'Yes. Eventwise includes rich deterministic planning templates for weddings, birthdays, community gatherings, and corporate summits. If an API key is not configured, the app seamlessly runs in preview mode with full persistence.',
    },
    {
      q: 'Are my event details and guest notes private?',
      a: 'Yes. All events are isolated to your workspace in the database. Secrets and API keys are strictly kept server-side and never exposed to client browsers.',
    },
  ];

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* ── Top Navigation ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Eventwise AI home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/30">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-1.5">
              eventwise
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-brand-100 text-brand-700">
                AI
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden sm:block text-sm font-semibold text-zinc-700 hover:text-foreground px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover shadow-sm transition-all"
            >
              Get Started Free
            </Link>
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-zinc-700 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-zinc-700 hover:text-foreground"
            >
              Sign In
            </Link>
          </nav>
        )}
      </header>

      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border bg-gradient-to-b from-[#faf9f6] via-white to-[#faf9f6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Autonomous Multi-Agent Event Planning</span>
          </div>

          {/* Hero H1 — 42px mobile → 60px desktop */}
          <h1 className="text-[2.625rem] sm:text-[3.75rem] font-extrabold text-foreground tracking-tight leading-[1.08]">
            Your entire event. <br />
            <span className="ai-gradient-text">Planned by AI.</span> Perfected by you.
          </h1>

          <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            From the first idea to the final guest, Eventwise AI turns event planning into a clear, collaborative
            plan—with smart budgets, timelines, vendors, and personalized recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/app/events/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-white hover:bg-primary-hover shadow-md hover:shadow-lg transition-all"
            >
              <span>Plan My Event</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/sign-up"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-50 transition-all shadow-xs"
            >
              <span>Create Free Account</span>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <span>INR Currency &amp; Regional Formatting</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <span>Deterministic Financial Math</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <span>Full Persistent Database</span>
            </div>
          </div>
        </div>

        {/* Hero App Mockup */}
        <div className="max-w-6xl mx-auto px-4 mt-12" aria-hidden="true">
          <div className="rounded-2xl border border-border bg-white p-3 shadow-2xl overflow-hidden ring-1 ring-zinc-900/5">
            <div className="rounded-xl border border-border bg-zinc-50 p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-zinc-500 ml-2">Ananya &amp; Rohan&apos;s Modern Garden Wedding · Udaipur</span>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                  AI Co-Pilot Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="p-4 rounded-xl bg-white border border-border shadow-xs">
                  <span className="text-muted-foreground block text-xs">Budget Ceiling</span>
                  <span className="text-2xl font-extrabold text-foreground mt-1 block">₹15,00,000</span>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">₹12,50,000 liquidity remaining</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-border shadow-xs">
                  <span className="text-muted-foreground block text-xs">Confirmed Attendees</span>
                  <span className="text-2xl font-extrabold text-foreground mt-1 block">180 Guests</span>
                  <span className="text-xs text-muted-foreground mt-1 block">₹8,333 planned per guest</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-border shadow-xs">
                  <span className="text-muted-foreground block text-xs">Milestones &amp; Vendors</span>
                  <span className="text-2xl font-extrabold text-foreground mt-1 block">5 Tasks · 4 Vendors</span>
                  <span className="text-xs text-brand-600 font-semibold mt-1 block">Venue &amp; Caterer confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Event Types Section ─────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Built for Every Milestone</span>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Tailored Domain Workflows</h2>
          <p className="text-base text-zinc-600 leading-relaxed">
            From multi-day Indian weddings to high-energy developer hackathons, each event type gets domain-tuned
            allocations and lead times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventTypes.map((et) => {
            const Icon = et.icon;
            return (
              <div
                key={et.title}
                className="rounded-2xl border border-border bg-white p-6 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{et.title}</h3>
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{et.desc}</p>
                </div>
                <Link
                  href={et.href}
                  className="mt-4 pt-3 border-t border-border text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>Plan this type</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Core Features ───────────────────────────────────── */}
      <section id="features" className="py-20 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Architected for Reliability</span>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Why Organizers Rely on Eventwise
            </h2>
            <p className="text-base text-zinc-600 leading-relaxed">
              No hallucinated arithmetic, no generic markdown lists. A real database, real calculations, and
              orchestrated AI specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-border bg-[#faf9f6]/60 shadow-xs">
                  <div className="h-11 w-11 rounded-xl bg-white border border-border flex items-center justify-center text-primary shrink-0 shadow-xs">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{f.title}</h3>
                    <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 border-t border-border bg-[#faf9f6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Simple to Start</span>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Plan Your Event in 3 Steps</h2>
            <p className="text-base text-zinc-600 leading-relaxed">
              No spreadsheets. No guesswork. Just a structured workspace ready in minutes.
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8" role="list">
            {[
              {
                step: '01',
                title: 'Describe Your Event',
                desc: 'Tell us the event type, date, location, guest count, and budget ceiling. Takes under 2 minutes.',
              },
              {
                step: '02',
                title: 'AI Generates Your Plan',
                desc: '7 specialist agents produce a budget breakdown, milestone timeline, vendor checklist, and creative ideas.',
              },
              {
                step: '03',
                title: 'Review, Adjust & Execute',
                desc: 'Approve AI recommendations selectively, then manage everything from your persistent event workspace.',
              },
            ].map((s) => (
              <li key={s.step} className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-3">
                <span className="text-3xl font-extrabold text-brand-200">{s.step}</span>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>

          <div className="text-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-bold text-white hover:bg-primary-hover shadow-md transition-all"
            >
              <span>Start Planning for Free</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────── */}
      <section id="pricing" className="py-20 border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Transparent Plans</span>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Proposed Pricing Tiers</h2>
            <p className="text-base text-muted-foreground">
              Currently free during this release. All features are fully unlocked for your workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-5">
              <div>
                <span className="text-xs font-bold uppercase text-muted-foreground">Starter</span>
                <h3 className="text-2xl font-extrabold text-foreground mt-1">Free Forever</h3>
                <p className="text-sm text-zinc-600 mt-1">For individuals planning personal milestones.</p>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600" role="list">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Up to 2 active events</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Deterministic budgeting &amp; roadmap</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Vendor checklist &amp; quote tracking</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center rounded-xl border border-border bg-white py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="rounded-2xl border-2 border-brand-500 bg-white p-6 shadow-md space-y-5 relative">
              <span className="absolute -top-3 right-6 rounded-full bg-brand-500 px-3 py-0.5 text-xs font-extrabold uppercase text-white tracking-wider">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-bold uppercase text-brand-700">Pro Planner</span>
                <h3 className="text-2xl font-extrabold text-foreground mt-1">
                  ₹1,499 <span className="text-sm font-normal text-muted-foreground">/ event</span>
                </h3>
                <p className="text-sm text-zinc-600 mt-1">Full AI multi-agent orchestration for families &amp; couples.</p>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600" role="list">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Unlimited event scale &amp; guests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>7 Coordinated AI Specialist Agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Printable reports &amp; CSV data exports</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-hover shadow-xs transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Agency */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-5">
              <div>
                <span className="text-xs font-bold uppercase text-muted-foreground">Agency &amp; Studio</span>
                <h3 className="text-2xl font-extrabold text-foreground mt-1">
                  ₹4,999 <span className="text-sm font-normal text-muted-foreground">/ month</span>
                </h3>
                <p className="text-sm text-zinc-600 mt-1">For professional event managers and wedding planners.</p>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600" role="list">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Unlimited client workspaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Custom branding on PDF/print reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Multi-seat collaboration with RBAC</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center rounded-xl border border-border bg-white py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Contact for Agency Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" className="py-20 border-t border-border bg-[#faf9f6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Frequently Asked Questions</h2>
            <p className="text-base text-zinc-600">Everything you need to know about Eventwise AI</p>
          </div>

          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-6 rounded-2xl border border-border bg-white shadow-xs">
                <dt className="font-bold text-foreground text-base">{faq.q}</dt>
                <dd className="text-sm text-zinc-600 mt-2 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-border bg-[#fbfbfa] py-12 text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="font-extrabold text-foreground">eventwise AI</span>
              <p className="text-xs text-muted-foreground">Every event, effortlessly extraordinary.</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm" aria-label="Footer navigation">
            <Link href="/features/wedding-planner" className="hover:text-foreground hover:underline">
              Wedding Planner
            </Link>
            <Link href="/features/birthday-planner" className="hover:text-foreground hover:underline">
              Birthday Planner
            </Link>
            <Link href="/sign-in" className="hover:text-foreground hover:underline">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-foreground hover:underline">
              Register
            </Link>
            <Link href="/privacy" className="hover:text-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground hover:underline">
              Terms
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            &copy; {new Date().getFullYear()} Eventwise AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
