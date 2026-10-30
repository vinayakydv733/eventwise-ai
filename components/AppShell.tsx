'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  CalendarDays,
  WandSparkles,
  Wallet,
  Clock3,
  ClipboardList,
  Store,
  UsersRound,
  Lightbulb,
  FileBarChart2,
  Settings,
  Menu,
  X,
  ChevronDown,
  Bell,
  LogOut,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<{ name: string; currency: string } | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean>(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [currentEventTitle, setCurrentEventTitle] = useState<string>('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Close notification dropdown on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && notificationsOpen) setNotificationsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [notificationsOpen]);

  // Detect eventId from pathname if route is /app/events/[eventId]/*
  useEffect(() => {
    const parts = pathname.split('/');
    if (parts[1] === 'app' && parts[2] === 'events' && parts[3] && parts[3] !== 'new') {
      setCurrentEventId(parts[3]);
    } else {
      setCurrentEventId(null);
    }
  }, [pathname]);

  // Fetch session & health
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
          setActiveWorkspace(data.activeWorkspace);
        } else {
          // Default fallback demo user
          setUser({ name: 'Vikram Sharma', email: 'demo@eventwise.ai' });
          setActiveWorkspace({ name: 'Sharma Celebrations', currency: 'INR' });
        }
      })
      .catch(() => {
        setUser({ name: 'Vikram Sharma', email: 'demo@eventwise.ai' });
        setActiveWorkspace({ name: 'Sharma Celebrations', currency: 'INR' });
      });

    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.aiConfigured !== undefined) {
          setAiConfigured(data.aiConfigured);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch event title if on an event page
  useEffect(() => {
    if (currentEventId) {
      fetch(`/api/events/${currentEventId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.event?.title) {
            setCurrentEventTitle(data.event.title);
          }
        })
        .catch(() => {});
    }
  }, [currentEventId]);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/sign-in');
    } catch {
      router.push('/sign-in');
    }
  }

  // Base navigation
  const generalNav = [
    { label: 'Overview', href: '/app', icon: LayoutDashboard },
    { label: 'My Events', href: '/app/events', icon: CalendarDays },
    { label: 'AI Planner', href: '/app/ai-planner', icon: WandSparkles, highlight: true },
  ];

  // Event-specific navigation when focused on a single event
  const eventNav = currentEventId
    ? [
        { label: 'Dashboard', href: `/app/events/${currentEventId}`, icon: LayoutDashboard },
        { label: 'Budget Planner', href: `/app/events/${currentEventId}/budget`, icon: Wallet },
        { label: 'Timeline', href: `/app/events/${currentEventId}/timeline`, icon: Clock3 },
        { label: 'Tasks & Checklist', href: `/app/events/${currentEventId}/tasks`, icon: ClipboardList },
        { label: 'Vendors & Quotes', href: `/app/events/${currentEventId}/vendors`, icon: Store },
        { label: 'Guests & RSVP', href: `/app/events/${currentEventId}/guests`, icon: UsersRound },
        { label: 'Inspiration Studio', href: `/app/events/${currentEventId}/inspiration`, icon: Lightbulb },
        { label: 'Reports & Export', href: `/app/events/${currentEventId}/reports`, icon: FileBarChart2 },
      ]
    : [];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-[#fcfbfa] px-4 py-5 transition-transform duration-200 lg:static lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pb-4">
          <Link href="/app" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/30 group-hover:bg-primary-hover transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
                eventwise
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-brand-100 text-brand-700">
                  AI
                </span>
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-zinc-100 lg:hidden"
            aria-label="Close Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace Selector */}
        <div className="my-2 rounded-xl border border-border bg-white p-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                {activeWorkspace?.name?.charAt(0) || 'E'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {activeWorkspace?.name || 'My Workspace'}
                </p>
                <p className="text-[11px] text-muted-foreground">Standard Workspace</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </div>

        {/* New Event Button */}
        <div className="my-2">
          <Link
            href="/app/events/new"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto space-y-6 pt-2">
          {/* General Navigation */}
          <div>
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Workspace
            </p>
            <nav className="space-y-1">
              {generalNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-foreground'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4', isActive ? 'text-brand-600' : 'text-zinc-400')} />
                    <span>{item.label}</span>
                    {item.highlight && (
                      <span className="ml-auto text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded font-bold">
                        Specialist
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Active Event Context Navigation */}
          {currentEventId && (
            <div>
              <div className="px-2 mb-2 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Active Event
                </p>
                <span className="text-[10px] text-brand-600 font-semibold truncate max-w-[120px]">
                  {currentEventTitle || 'Event'}
                </span>
              </div>
              <nav className="space-y-1">
                {eventNav.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-foreground'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4', isActive ? 'text-brand-600' : 'text-zinc-400')} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Quick Help Card */}
          <div className="rounded-xl border border-brand-100 bg-brand-50/70 p-3 text-xs">
            <div className="flex items-center gap-1.5 text-brand-700 font-semibold mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Multi-Agent System</span>
            </div>
            <p className="text-zinc-600 text-[11px] leading-relaxed">
              7 specialized planning agents coordinate budget, timeline, vendors, and ideas seamlessly.
            </p>
          </div>
        </div>

        {/* User Profile & Logout Bottom */}
        <div className="border-t border-border pt-4 mt-auto">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{user?.name || 'Vikram Sharma'}</p>
                <p className="truncate text-[11px] text-muted-foreground">{user?.email || 'demo@eventwise.ai'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-[#fcfbfa]/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 lg:hidden"
              aria-label="Open Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/app" className="hover:text-foreground">
                Workspace
              </Link>
              <span>/</span>
              {currentEventTitle ? (
                <>
                  <Link href={`/app/events/${currentEventId}`} className="font-medium text-foreground truncate max-w-[200px]">
                    {currentEventTitle}
                  </Link>
                </>
              ) : (
                <span className="font-medium text-foreground">Dashboard</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Status Pill */}
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border',
                aiConfigured
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-brand-200 bg-brand-50 text-brand-700'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  aiConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-brand-500'
                )}
              />
              <span>{aiConfigured ? 'AI Connected (Live)' : 'AI Ready (Preview)'}</span>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-600" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-white p-3 shadow-lg z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
                    <p className="text-xs font-bold text-foreground">Notifications</p>
                    <span className="text-[10px] text-brand-600 font-semibold">1 new</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-zinc-50 p-2 text-xs">
                      <p className="font-semibold text-zinc-800">Welcome to Eventwise AI</p>
                      <p className="text-zinc-500 text-[11px] mt-0.5">
                        Your workspace is initialized with Udaipur Wedding, Superhero Birthday, and Community Summit.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Link to Public Site */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500 hover:text-foreground font-medium px-2 py-1 rounded-md hover:bg-zinc-100"
            >
              <span>Website</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
