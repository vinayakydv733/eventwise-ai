'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Plus,
  Check,
  Clock,
  ArrowLeft,
  X,
  Trash2,
  CalendarDays,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List as ListIcon,
  Loader2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TasksPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [tasks, setTasks] = useState<any[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modal
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Logistics',
    priority: 'MEDIUM',
    dueDate: '',
  });

  const loadTasks = () => {
    fetch(`/api/events/${eventId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setTasks(data.event.tasks || []);
          setEventTitle(data.event.title);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, [eventId]);

  const handleToggleComplete = async (task: any) => {
    const nextStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      const res = await fetch(`/api/events/${eventId}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) loadTasks();
    } catch {
      alert('Failed to update task');
    }
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) loadTasks();
    } catch {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/events/${eventId}/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) loadTasks();
    } catch {
      alert('Failed to delete task');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${eventId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm),
      });

      if (res.ok) {
        setIsAddTaskOpen(false);
        setTaskForm({ title: '', category: 'Logistics', priority: 'MEDIUM', dueDate: '' });
        loadTasks();
      }
    } catch {
      alert('Failed to create task');
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

  let filteredTasks = [...tasks];
  if (search.trim()) {
    const q = search.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q)
    );
  }
  if (priorityFilter !== 'ALL') {
    filteredTasks = filteredTasks.filter((t) => t.priority === priorityFilter);
  }

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/app/events/${eventId}`}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{eventTitle || 'Event'}</span>
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Task & Logistics Checklist</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prioritized milestones with backwards-planned lead times and assignment tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-border bg-white p-1 shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-zinc-100 text-foreground font-bold' : 'text-zinc-400 hover:text-foreground'
              }`}
              title="List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-zinc-100 text-foreground font-bold' : 'text-zinc-400 hover:text-foreground'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Progress & Filters Bar */}
      <div className="rounded-2xl border border-border bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="rounded-lg border border-border pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-brand-500 w-48 sm:w-64"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground bg-zinc-50"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-foreground">
              {completedCount} of {tasks.length} completed ({progressPercent}%)
            </span>
            <div className="w-28 h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main View: List or Kanban */}
      {viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No tasks found. Click &quot;Add Task&quot; above to schedule a milestone.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'COMPLETED';
                const isOverdue =
                  task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

                return (
                  <div
                    key={task.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-zinc-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                          isCompleted
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-zinc-300 bg-white hover:border-zinc-400'
                        }`}
                      >
                        {isCompleted && <Check className="h-3.5 w-3.5" />}
                      </button>

                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            isCompleted ? 'line-through text-zinc-400' : 'text-foreground'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                          <span>{task.category || 'General'}</span>
                          {task.dueDate && (
                            <span
                              className={`flex items-center gap-1 ${
                                isOverdue ? 'text-rose-600 font-bold' : ''
                              }`}
                            >
                              <CalendarDays className="h-3 w-3" />
                              <span>{formatDate(task.dueDate)}</span>
                              {isOverdue && ' (Overdue)'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                        className="rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-zinc-700 bg-white"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="BLOCKED">Blocked</option>
                        <option value="COMPLETED">Completed</option>
                      </select>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'HIGH' || task.priority === 'URGENT'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {task.priority}
                      </span>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1"
                        title="Delete Task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { id: 'TODO', label: 'To Do', color: 'border-zinc-200 bg-zinc-50/50' },
            { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-200 bg-blue-50/30' },
            { id: 'BLOCKED', label: 'Blocked', color: 'border-rose-200 bg-rose-50/30' },
            { id: 'COMPLETED', label: 'Completed', color: 'border-emerald-200 bg-emerald-50/30' },
          ].map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className={`rounded-2xl border p-4 ${col.color} min-h-[350px]`}>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                  <span className="text-xs font-bold text-foreground">{col.label}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-zinc-600 shadow-2xs">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-border bg-white p-3 shadow-xs text-xs space-y-2"
                    >
                      <p className="font-semibold text-foreground">{t.title}</p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-zinc-100">
                        <span>{t.category}</span>
                        <span className="font-bold text-zinc-700">{t.priority}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                          className="text-[10px] rounded border border-border p-1 bg-zinc-50"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="text-zinc-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground">Add New Task</h3>
              <button onClick={() => setIsAddTaskOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Confirm floral centerpiece designs"
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={taskForm.category}
                    onChange={(e) => setTaskForm((p) => ({ ...p, category: e.target.value }))}
                    placeholder="Venue, Catering, Media..."
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover"
                >
                  {submitting ? 'Adding…' : 'Schedule Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
