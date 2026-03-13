import { Bell, MessageSquare, Search } from "lucide-react";

export function TopNavbar() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 shrink-0">
      <div className="text-lg font-semibold text-foreground">EduTrack</div>

      <div className="flex-1 max-w-lg mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students, subjects, assignments..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-secondary text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <button className="p-2 rounded-md hover:bg-secondary text-muted-foreground">
          <MessageSquare className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            JS
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground leading-tight">John Smith</p>
            <p className="text-xs text-muted-foreground">Computer Science</p>
          </div>
        </div>
      </div>
    </header>
  );
}
