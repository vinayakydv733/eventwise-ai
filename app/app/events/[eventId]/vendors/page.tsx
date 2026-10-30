'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Store,
  Plus,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function VendorsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [vendors, setVendors] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Catering',
    contactName: '',
    phone: '',
    email: '',
    website: '',
    quotedAmount: '',
    bookingStatus: 'TO_RESEARCH',
    paymentStatus: 'NOT_DUE',
    notes: '',
  });

  const loadVendors = () => {
    fetch(`/api/events/${eventId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          setEventData(d.event);
          setVendors(d.event.vendors || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadVendors();
  }, [eventId]);

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${eventId}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          quotedAmount: form.quotedAmount ? Number(form.quotedAmount) : null,
        }),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setForm({
          name: '',
          category: 'Catering',
          contactName: '',
          phone: '',
          email: '',
          website: '',
          quotedAmount: '',
          bookingStatus: 'TO_RESEARCH',
          paymentStatus: 'NOT_DUE',
          notes: '',
        });
        loadVendors();
      }
    } catch {
      alert('Failed to add vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (vendorId: string, bookingStatus: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/vendors`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, bookingStatus }),
      });
      if (res.ok) loadVendors();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleUpdatePayment = async (vendorId: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/vendors`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, paymentStatus }),
      });
      if (res.ok) loadVendors();
    } catch {
      alert('Failed to update payment status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  let filtered = [...vendors];
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.contactName?.toLowerCase().includes(q)
    );
  }
  if (statusFilter !== 'ALL') {
    filtered = filtered.filter((v) => v.bookingStatus === statusFilter);
  }

  const bookedCount = vendors.filter((v) => v.bookingStatus === 'BOOKED').length;

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
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Vendor & Logistics Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track quotations, outreach notes, contract milestones, and payment disbursements.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Filter and Metrics Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className="w-full rounded-lg border border-border pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-brand-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground bg-zinc-50"
          >
            <option value="ALL">All Status</option>
            <option value="TO_RESEARCH">To Research</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUOTE_RECEIVED">Quote Received</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="BOOKED">Booked</option>
          </select>
        </div>

        <div className="text-xs text-muted-foreground">
          <strong className="text-foreground">{bookedCount} of {vendors.length} vendors booked</strong>
        </div>
      </div>

      {/* Vendors Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center text-xs text-muted-foreground">
          No vendors found. Click &quot;Add Vendor&quot; above to log service providers.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((vendor) => {
            const isBooked = vendor.bookingStatus === 'BOOKED';
            return (
              <div
                key={vendor.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-xs hover:border-brand-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                      {vendor.category}
                    </span>
                    <select
                      value={vendor.bookingStatus}
                      onChange={(e) => handleUpdateStatus(vendor.id, e.target.value)}
                      className="rounded border border-border text-[10px] font-semibold px-2 py-0.5 bg-white text-zinc-700"
                    >
                      <option value="TO_RESEARCH">To Research</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="QUOTE_RECEIVED">Quote Received</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="BOOKED">Booked</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{vendor.name}</h3>
                  {vendor.contactName && (
                    <p className="text-xs text-muted-foreground mt-0.5">Contact: {vendor.contactName}</p>
                  )}

                  {/* Quoted Amount */}
                  <div className="mt-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Quoted Amount:</span>
                    <span className="font-bold text-foreground">
                      {vendor.quotedAmount
                        ? formatCurrency(vendor.quotedAmount, eventData?.currency)
                        : 'Awaiting Quote'}
                    </span>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Disbursement:</span>
                    <select
                      value={vendor.paymentStatus}
                      onChange={(e) => handleUpdatePayment(vendor.id, e.target.value)}
                      className="rounded border border-border text-[10px] font-semibold px-2 py-0.5 bg-white text-zinc-700"
                    >
                      <option value="NOT_DUE">Not Due</option>
                      <option value="DEPOSIT_DUE">Deposit Due</option>
                      <option value="PARTIALLY_PAID">Partially Paid</option>
                      <option value="PAID">Paid in Full</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
                    {vendor.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-zinc-400" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-zinc-400" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {vendor.notes && (
                  <p className="mt-3 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 line-clamp-2">
                    {vendor.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Vendor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground">Add Vendor Profile</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddVendor} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Business / Vendor Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Royal Mewar Gourmet Catering"
                  className="w-full rounded-lg border border-border px-3 py-2 text-foreground focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Service Category</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    placeholder="Venue, Catering, Florals..."
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Quoted Price ({eventData?.currency})</label>
                  <input
                    type="number"
                    value={form.quotedAmount}
                    onChange={(e) => setForm((p) => ({ ...p, quotedAmount: e.target.value }))}
                    placeholder="150000"
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                    placeholder="Manager Name"
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-lg border border-border px-3 py-2 text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Negotiation / Service Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  placeholder="Terms agreed, cutoff hours, tasting notes..."
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
                  {submitting ? 'Saving…' : 'Add to Directory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
