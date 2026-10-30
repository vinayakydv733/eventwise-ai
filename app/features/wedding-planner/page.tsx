import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Heart,
  Wallet,
  Clock3,
  Store,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Wedding Planner — Budget, Timeline & Vendor Checklist',
  description:
    'Plan your wedding with AI-powered budget breakdowns, backwards-planned timelines, and a complete vendor checklist. Works for Indian weddings, destination ceremonies, and intimate celebrations.',
  alternates: { canonical: '/features/wedding-planner' },
  openGraph: {
    title: 'AI Wedding Planner | Eventwise AI',
    description:
      'Plan your perfect wedding with an AI that handles budgets, timelines, vendor sourcing, and creative ideas simultaneously.',
  },
};

const weddingBudgetTemplate = [
  { category: 'Venue & Decor', percentage: 30, example: '₹4,50,000 on a 150-person hall' },
  { category: 'Catering & Food', percentage: 25, example: '₹3,75,000 for multi-course banquet' },
  { category: 'Photography & Video', percentage: 12, example: '₹1,80,000 for dual-camera team' },
  { category: 'Attire & Jewellery', percentage: 10, example: '₹1,50,000 bride + groom' },
  { category: 'Music & Entertainment', percentage: 8, example: '₹1,20,000 DJ + sangeet' },
  { category: 'Invitations & Gifts', percentage: 5, example: '₹75,000 printed cards + favours' },
  { category: 'Transportation', percentage: 4, example: '₹60,000 logistics + entry car' },
  { category: 'Contingency Reserve', percentage: 6, example: '₹90,000 buffer for overruns' },
];

const weddingTimeline = [
  { timeframe: '12–18 months before', task: 'Set budget ceiling and book the primary venue' },
  { timeframe: '9–12 months before', task: 'Book photographer, videographer, and caterer' },
  { timeframe: '6–9 months before', task: 'Order attire, send save-the-dates, book hotel blocks' },
  { timeframe: '3–6 months before', task: 'Confirm vendor contracts, plan décor themes, send invitations' },
  { timeframe: '1–3 months before', task: 'Finalize guest list, confirm RSVPs, arrange transportation' },
  { timeframe: '2 weeks before', task: 'Final vendor briefings, rehearsal dinner, coordinate timings' },
  { timeframe: 'Week of wedding', task: 'Confirm all vendors, prepare final payments, relax and celebrate' },
];

const vendorChecklist = [
  'Venue (hall or outdoor space)',
  'Wedding decorator and florist',
  'Caterer with menu tastings',
  'Photographer and videographer',
  'DJ or live music band',
  'Bridal and groom attire',
  'Mehendi artist and makeup artist',
  'Priest or officiant',
  'Invitation designer and printer',
  'Transportation for bride and guests',
];

export default function WeddingPlannerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Eventwise AI home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              eventwise <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-brand-100 text-brand-700">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-semibold text-zinc-700 hover:text-foreground px-3 py-2">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover shadow-sm transition-all"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-16 sm:py-24 border-b border-border bg-gradient-to-b from-rose-50 via-white to-[#faf9f6]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700">
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Wedding Planning</span>
            </div>

            <h1 className="text-[2.5rem] sm:text-[3.5rem] font-extrabold text-foreground tracking-tight leading-[1.1]">
              AI Wedding Planner with Smart Budget, Timeline &amp; Vendor Checklist
            </h1>

            <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Eventwise AI plans your entire wedding from start to finish — including a realistic INR budget breakdown,
              a backwards-planned timeline, and a complete vendor sourcing checklist — all in one workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/app/events/new"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-white hover:bg-primary-hover shadow-md transition-all"
              >
                <span>Plan My Wedding</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/sign-up"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>

        {/* Budget Template */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Realistic Wedding Budget Breakdown
            </h2>
            <p className="text-base text-zinc-600 leading-relaxed max-w-2xl">
              The following allocation is a practical starting template for a mid-range Indian wedding with 100–200
              guests. Eventwise AI adjusts these percentages automatically based on your actual budget, guest count,
              and event type.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] gap-0">
              <div className="px-5 py-3 bg-zinc-50 border-b border-border font-semibold text-sm text-zinc-700">Category</div>
              <div className="px-5 py-3 bg-zinc-50 border-b border-border font-semibold text-sm text-zinc-700 text-right">Allocation</div>
              <div className="px-5 py-3 bg-zinc-50 border-b border-border font-semibold text-sm text-zinc-700 text-right hidden sm:block">Example (₹15L budget)</div>
              {weddingBudgetTemplate.map((row, i) => (
                <>
                  <div key={`cat-${i}`} className="px-5 py-3 border-b border-border text-sm font-medium text-foreground">{row.category}</div>
                  <div key={`pct-${i}`} className="px-5 py-3 border-b border-border text-sm text-right font-bold text-brand-600">{row.percentage}%</div>
                  <div key={`ex-${i}`} className="px-5 py-3 border-b border-border text-sm text-right text-muted-foreground hidden sm:block">{row.example}</div>
                </>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground italic">
            These percentages are illustrative guidelines. Your AI plan will be specific to your budget, location, and preferences.
            Do not treat them as pricing guarantees from any vendor.
          </p>
        </section>

        {/* Timeline */}
        <section className="py-16 border-t border-border bg-[#faf9f6]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Wedding Planning Timeline: 18 Months to Wedding Day
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed max-w-2xl">
                Eventwise AI calculates your milestone dates backwards from the wedding date. If you book later,
                the system flags lead-time conflicts before they become problems.
              </p>
            </div>

            <ol className="space-y-4" role="list">
              {weddingTimeline.map((item, i) => (
                <li key={i} className="flex gap-4 p-5 rounded-2xl border border-border bg-white shadow-xs">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">{item.timeframe}</span>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{item.task}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Vendor Checklist */}
        <section className="py-16 border-t border-border bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Wedding Vendor Checklist
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed max-w-2xl">
                Eventwise AI creates a vendor sourcing board for your event. Here is the essential checklist for a
                standard Indian wedding. Every vendor gets a quote tracker and booking status field.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              {vendorChecklist.map((item) => (
                <li key={item} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-zinc-50 text-sm font-medium text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features callout */}
        <section className="py-16 border-t border-border bg-[#faf9f6]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight text-center">
              What Eventwise AI Does for Your Wedding
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Wallet, title: 'Budget Guardrails', desc: 'Set a budget ceiling; the AI allocates every rupee across categories with a built-in contingency reserve. Amounts are verified to sum exactly — no floating-point errors.' },
                { icon: Clock3, title: 'Backwards-Planned Timeline', desc: 'Enter your wedding date and the system calculates when to book each vendor, send invites, and complete payments — counting backwards from Day 1.' },
                { icon: Store, title: 'Vendor Sourcing Board', desc: 'Track each vendor\'s quote, booking status, payment schedule, and contract checklist questions in one place before you commit.' },
                { icon: Users, title: 'Guest & RSVP Management', desc: 'Import guests, track RSVPs, manage dietary requirements, and assign seating groups — all in the same workspace as your budget.' },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-border bg-white shadow-xs">
                    <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
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

        {/* CTA */}
        <section className="py-16 border-t border-border bg-primary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Ready to Plan Your Wedding Smarter?
            </h2>
            <p className="text-base text-brand-100 leading-relaxed">
              Create your free account, describe your wedding, and let 7 AI specialists build your complete planning workspace in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-base font-bold text-primary hover:bg-brand-50 shadow-md transition-all"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/features/event-budget-planner" className="text-sm font-semibold text-brand-100 hover:text-white hover:underline">
                See Budget Planner →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-[#fbfbfa] py-8 text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-bold text-foreground hover:underline">← Back to Eventwise AI</Link>
          <nav className="flex items-center gap-6" aria-label="Footer links">
            <Link href="/features/birthday-planner" className="hover:text-foreground hover:underline">Birthday Planner</Link>
            <Link href="/features/event-budget-planner" className="hover:text-foreground hover:underline">Budget Planner</Link>
            <Link href="/privacy" className="hover:text-foreground hover:underline">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

