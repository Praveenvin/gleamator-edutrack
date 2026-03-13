import { DashboardLayout } from "@/components/DashboardLayout";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM"];

const schedule: Record<string, Record<string, string>> = {
  Monday: { "9:00 AM": "Mathematics", "10:00 AM": "Physics", "11:00 AM": "Chemistry", "2:00 PM": "CS Lab" },
  Tuesday: { "9:00 AM": "English", "10:00 AM": "Computer Science", "11:00 AM": "Electronics", "3:00 PM": "Physics Lab" },
  Wednesday: { "9:00 AM": "Mathematics", "11:00 AM": "Physics", "2:00 PM": "Chemistry", "3:00 PM": "CS Tutorial" },
  Thursday: { "9:00 AM": "Electronics", "10:00 AM": "English", "11:00 AM": "Computer Science", "2:00 PM": "Math Tutorial" },
  Friday: { "9:00 AM": "Chemistry", "10:00 AM": "Mathematics", "2:00 PM": "Electronics Lab" },
};

const Timetable = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-medium text-foreground mb-6">Timetable</h1>
    <div className="bg-card rounded-lg border border-border overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
            {days.map((d) => (
              <th key={d} className="px-4 py-3 text-left font-medium text-muted-foreground">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((t) => (
            <tr key={t} className="border-b border-border last:border-0">
              <td className="px-4 py-4 font-mono-data text-muted-foreground whitespace-nowrap">{t}</td>
              {days.map((d) => (
                <td key={d} className="px-4 py-4">
                  {schedule[d]?.[t] ? (
                    <span className="text-sm text-foreground bg-primary/5 px-2 py-1 rounded">{schedule[d][t]}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default Timetable;
