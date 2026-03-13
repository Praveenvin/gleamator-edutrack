import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useState } from "react";

const conversations = [
  { id: 1, name: "Arun Kumar", subject: "Assignment doubt", preview: "Sir, I have a doubt regarding the linked list assignment...", time: "10:30 AM", unread: true },
  { id: 2, name: "Dean's Office", subject: "Faculty Meeting", preview: "Reminder: Faculty meeting scheduled for Friday at 3 PM...", time: "9:15 AM", unread: true },
  { id: 3, name: "Priya Sharma", subject: "Leave request", preview: "Ma'am, I need to take leave for medical reasons...", time: "Yesterday", unread: false },
  { id: 4, name: "Dr. Rao", subject: "Lab schedule", preview: "Can we swap the lab slots for next week?", time: "Yesterday", unread: false },
];

const FacultyMessages = () => {
  const [selected, setSelected] = useState(conversations[0]);

  return (
    <FacultyDashboardLayout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Messages</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: 400 }}>
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-3 border-b border-border"><input className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm" placeholder="Search messages..." /></div>
          <div className="divide-y divide-border">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setSelected(c)} className={`w-full text-left px-4 py-3 transition-colors ${selected.id === c.id ? "bg-primary/5" : "hover:bg-secondary"}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${c.unread ? "font-semibold text-foreground" : "text-foreground"}`}>{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.subject}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6 flex flex-col">
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="font-semibold text-foreground">{selected.name}</h3>
            <p className="text-sm text-muted-foreground">{selected.subject}</p>
          </div>
          <div className="flex-1">
            <div className="bg-secondary/50 rounded-lg p-4 max-w-[80%]">
              <p className="text-sm text-foreground">{selected.preview}</p>
              <p className="text-xs text-muted-foreground mt-1">{selected.time}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <input className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm" placeholder="Type a reply..." />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Send</button>
          </div>
        </div>
      </div>
    </FacultyDashboardLayout>
  );
};

export default FacultyMessages;
