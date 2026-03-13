import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";

const conversations = [
  { id: 1, name: "Prof. Anderson", subject: "RE: Assignment Extension", preview: "Sure, I can extend the deadline by 2 days...", time: "10:30 AM", unread: true },
  { id: 2, name: "Dr. Williams", subject: "Lab Schedule Change", preview: "Please note that the lab session has been moved to...", time: "Yesterday", unread: false },
  { id: 3, name: "Admin Office", subject: "Fee Payment Reminder", preview: "This is a reminder that your semester fee is due...", time: "Mar 8", unread: true },
  { id: 4, name: "Prof. Martinez", subject: "Project Guidelines", preview: "Attached are the guidelines for your final project...", time: "Mar 7", unread: false },
  { id: 5, name: "Library", subject: "Book Return Notice", preview: "Please return the following books by March 15...", time: "Mar 6", unread: false },
];

const Messaging = () => {
  const [selected, setSelected] = useState(conversations[0]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-medium text-foreground mb-6">Messaging</h1>
      <div className="bg-card rounded-lg border border-border overflow-hidden flex" style={{ height: "500px" }}>
        {/* Inbox */}
        <div className="w-80 border-r border-border overflow-auto shrink-0">
          {conversations.map((c) => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-secondary/30 transition-colors ${selected.id === c.id ? "bg-secondary" : ""}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${c.unread ? "font-semibold text-foreground" : "text-foreground"}`}>{c.name}</p>
                <span className="text-xs text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-sm text-foreground mt-0.5">{c.subject}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.preview}</p>
            </button>
          ))}
        </div>

        {/* Message View */}
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-4 pb-4 border-b border-border">
            <h3 className="text-base font-medium text-foreground">{selected.subject}</h3>
            <p className="text-sm text-muted-foreground">From: {selected.name} · {selected.time}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground leading-relaxed">{selected.preview}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-2">
              <input type="text" placeholder="Type your reply..." className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Send</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messaging;
