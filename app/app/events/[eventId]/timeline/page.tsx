'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Clock,
  Check,
  CalendarDays,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TimelinePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    fetch(`/api/events/${eventId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) setEventData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleToggleTask = async (task: any) => {
    const nextStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      const res = await fetch(`/api/events/${eventId}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) loadData();
    } catch {
      alert('Failed to update milestone');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const { event } = eventData;
  const tasks = event.tasks || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/app/events/${eventId}`}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{event.title}</span>
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Interactive Event Roadmap</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Backwards-planned milestones working backward from {formatDate(event.startDate)}.
          </p>
        </div>

        <Link
          href={`/app/events/${eventId}/tasks`}
          className="rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs"
        >
          Checklist View
        </Link>
      </div>

      {/* Visual Roadmap Rail */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No milestones in your timeline yet. Use the AI Planner to construct an automated timeline.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200">
            {tasks.map((task: any, index: number) => {
              const isCompleted = task.status === 'COMPLETED';
              const isOverdue =
                task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

              return (
                <div key={task.id} className="relative group">
                  {/* Node Circle */}
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`absolute -left-6 sm:-left-8 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all shadow-xs ${
                      isCompleted
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : isOverdue
                        ? 'border-rose-500 bg-rose-50 text-rose-600'
                        : 'border-brand-500 bg-white text-brand-600 hover:scale-105'
                    }`}
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-[11px] font-bold">{index + 1}</span>
                    )}
                  </button>

                  {/* Task Card */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'border-zinc-200 bg-zinc-50/60 opacity-80'
                        : 'border-border bg-white shadow-xs hover:border-brand-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isCompleted ? 'line-through text-zinc-400' : 'text-foreground'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                          {task.category || 'Planning'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.priority === 'HIGH' || task.priority === 'URGENT'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-2">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                        <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
                          {task.dueDate ? formatDate(task.dueDate) : 'No due date set'}
                          {isOverdue && ' (Milestone Overdue)'}
                        </span>
                      </div>
                      {task.status === 'COMPLETED' && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
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
