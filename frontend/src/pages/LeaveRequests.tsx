import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";

const pastRequests = [
  { id: 1, from: "2026-03-05", to: "2026-03-07", reason: "Family event", status: "Approved" },
  { id: 2, from: "2026-02-20", to: "2026-02-21", reason: "Medical appointment", status: "Rejected" },
  { id: 3, from: "2026-03-12", to: "2026-03-13", reason: "Personal work", status: "Pending" },
];

const statusStyle: Record<string, string> = {
  Approved: "text-success bg-success/10",
  Pending: "text-warning bg-warning/10",
  Rejected: "text-destructive bg-destructive/10",
};

const LeaveRequests = () => {
  const [form, setForm] = useState({ from: "", to: "", reason: "" });

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-medium text-foreground mb-6">Leave Requests</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Apply for Leave</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">From Date</label>
              <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">To Date</label>
              <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Reason</label>
              <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                rows={3} className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <button className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Submit Request
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-base font-medium text-foreground mb-4">Previous Requests</h2>
          <div className="space-y-3">
            {pastRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-foreground">{r.reason}</p>
                  <p className="text-xs font-mono-data text-muted-foreground">{r.from} → {r.to}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaveRequests;
