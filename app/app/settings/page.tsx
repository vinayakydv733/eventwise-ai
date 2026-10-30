'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings,
  Sparkles,
  ShieldCheck,
  Users,
  Wallet,
  Globe,
  CheckCircle2,
  AlertCircle,
  Database,
  Loader2,
} from 'lucide-react';

export default function SettingsPage() {
  const [health, setHealth] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/health').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null)),
    ]).then(([healthData, meData]) => {
      if (healthData) setHealth(healthData);
      if (meData?.authenticated) {
        setUser(meData.user);
        setWorkspace(meData.activeWorkspace);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Workspace & Account Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage workspace profile, default currencies, AI provider credentials, and access control.
        </p>
      </div>

      {/* AI Provider Status Card */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">AI Provider Configuration</h2>
              <p className="text-xs text-muted-foreground">Server-side multi-agent model provider</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              health?.aiConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-brand-50 text-brand-700 border-brand-200'
            }`}
          >
            {health?.aiConfigured ? 'OpenAI Connected' : 'Deterministic Mode Active'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-muted-foreground">Active Model</span>
            <span className="font-bold text-foreground">{health?.aiModel || 'gpt-4o-mini'}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-muted-foreground">Fallback Architecture</span>
            <span className="font-semibold text-emerald-600">Deterministic Fallback Enabled</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
            To enable live OpenAI generation, set <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono">OPENAI_API_KEY</code> in your server <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono">.env</code> file. The key is kept strictly server-side.
          </p>
        </div>
      </div>

      {/* Workspace Preferences */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Workspace Profile & Regional Standards</h2>
            <p className="text-xs text-muted-foreground">Localization and monetary formatting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 block">Workspace Name</label>
            <input
              type="text"
              readOnly
              value={workspace?.name || 'Sharma Celebrations'}
              className="w-full rounded-xl border border-border bg-zinc-50 px-3.5 py-2 text-foreground font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 block">Default Currency</label>
            <input
              type="text"
              readOnly
              value={`${workspace?.currency || 'INR'} (Indian Rupee)`}
              className="w-full rounded-xl border border-border bg-zinc-50 px-3.5 py-2 text-foreground font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 block">Locale & Number Formatting</label>
            <input
              type="text"
              readOnly
              value="en-IN (Lakhs & Crores formatting)"
              className="w-full rounded-xl border border-border bg-zinc-50 px-3.5 py-2 text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 block">Default Timezone</label>
            <input
              type="text"
              readOnly
              value="Asia/Kolkata (IST +05:30)"
              className="w-full rounded-xl border border-border bg-zinc-50 px-3.5 py-2 text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Team & Members */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Workspace Members & RBAC</h2>
              <p className="text-xs text-muted-foreground">Collaboration permissions</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">1 Active Member</span>
        </div>

        <div className="divide-y divide-border text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                {user?.name?.charAt(0) || 'V'}
              </div>
              <div>
                <p className="font-bold text-foreground">{user?.name || 'Vikram Sharma'}</p>
                <p className="text-[11px] text-muted-foreground">{user?.email || 'demo@eventwise.ai'}</p>
              </div>
            </div>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
              WORKSPACE OWNER
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
